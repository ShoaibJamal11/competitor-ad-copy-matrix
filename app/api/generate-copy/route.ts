import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

function cleanAndParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }
    throw new Error("Could not parse valid JSON from AI response.");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { myBrand, targetAudience, competitors, rawAdCopies } = body;

    const systemPrompt = `You are a Principal Direct-Response Creative Strategist and Competitive Intelligence Director.
Analyze the competitors' ad copy, positioning, and psychological hooks. Return ONLY a raw JSON object strictly adhering to this schema:
{
  "marketAnalysis": {
    "dominantMarketAngle": "Primary angle saturated by competitors",
    "untappedOpportunity": "Specific gap competitors are failing to address",
    "threatLevel": "High" | "Medium" | "Low"
  },
  "competitorBreakdowns": [
    {
      "competitorName": "Name of competitor",
      "hookFramework": "Fear / Social Proof / Discount / Aspiration",
      "corePromise": "Main claim made in copy",
      "identifiedVulnerability": "Flaw or weakness in their messaging",
      "counterPositionAngle": "How user's brand can decisively beat this angle"
    }
  ],
  "counterAttackAds": [
    {
      "angleName": "Name of positioning angle (e.g. Radical Transparency / Us vs Them)",
      "hookHeadline": "Punchy scroll-stopping headline",
      "bodyCopy": "60-70 word direct-response body copy exploiting competitor flaws",
      "recommendedCTA": "Call to action text"
    }
  ]
}`;

    const userPrompt = `Our Brand: ${myBrand || "Our Brand"}
Target Audience: ${targetAudience || "Target Buyers"}
Competitors & Ad Copy Data:
${rawAdCopies || JSON.stringify(competitors, null, 2)}

Conduct competitive ad copy teardown and generate high-converting counter-attack ad angles. Return strictly raw JSON.`;

    // Fetch dynamic models to avoid deprecated or restricted models
    const modelListRes = await groq.models.list();
    const candidateIds = modelListRes.data
      .map((m: any) => m.id)
      .filter((id: string) => {
        const lower = id.toLowerCase();
        return (
          !lower.includes("whisper") &&
          !lower.includes("guard") &&
          !lower.includes("vision") &&
          !lower.includes("safeguard") &&
          !lower.includes("canopy") &&
          !lower.includes("orpheus") &&
          !lower.includes("tts") &&
          !lower.includes("audio")
        );
      });

    const priorityList = [
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "llama-3.2-3b-preview",
      ...candidateIds,
    ];

    const availableToTry = Array.from(
      new Set(priorityList.filter((p) => candidateIds.includes(p)))
    );

    let completion = null;
    let lastError: any = null;

    for (const model of availableToTry) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          model: model,
          temperature: 0.4,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        });

        if (completion?.choices[0]?.message?.content) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Groq model ${model} failed, trying next...`);
      }
    }

    const responseContent = completion?.choices[0]?.message?.content || "";
    if (!responseContent) {
      throw lastError || new Error("No response from Groq models");
    }

    const parsedData = cleanAndParseJSON(responseContent);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Competitor Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze competitors" },
      { status: 500 }
    );
  }
}