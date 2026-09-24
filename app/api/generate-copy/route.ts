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
    const { myBrand, targetAudience, competitorName, competitorAdCopy } = body;

    const systemPrompt = `You are a Principal Direct-Response Creative Director and Competitive Positioning Strategist.
Analyze the competitor's ad copy and generate counter-positioning ad variations that outperform them.
Return ONLY a raw JSON object strictly adhering to this schema:
{
  "marketGapAnalysis": "2-sentence strategic teardown explaining what the competitor's ad promises and where their message falls short or sounds generic.",
  "competitorWeaknesses": [
    "Specific vulnerability in their hook or offer claim"
  ],
  "counterAngles": [
    {
      "angleTitle": "Name of positioning angle (e.g. Radical Transparency / Us vs Them / Outcome Guarantee)",
      "hookHeadline": "Punchy scroll-stopping 3-second hook headline",
      "bodyCopy": "Persuasive 60-80 word direct-response body copy directly exploiting the competitor's blind spot",
      "callToAction": "Action-oriented low friction CTA"
    }
  ]
}`;

    const userPrompt = `Our Brand: ${myBrand || "Our Brand"}
Target Audience: ${targetAudience || "Target Buyers"}
Competitor Brand: ${competitorName || "Competitor"}
Competitor's Live Ad Copy:
"${competitorAdCopy || "Buy our product today for 20% off!"}"

Diagnose their ad vulnerability and engineer 3 distinct counter-attack ad copies. Return strictly raw JSON.`;

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
      { error: error.message || "Failed to analyze competitor copy" },
      { status: 500 }
    );
  }
}