import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `You are an elite Direct Response Copywriter and Performance Marketing Creative Strategist who has managed over $10M+ in Meta and TikTok ad spend.

Your mission:
Analyze the user's product, competitor angles, and target audience, then generate high-converting ad variations across 4 distinct psychological angles:
1. AIDA (Attention, Interest, Desire, Action)
2. PAS (Problem, Agitate, Solution)
3. Hook-Story-Offer (UGC video style)
4. Objection Crusher (Directly targets skepticism, high price, or previous bad experiences)

For each angle, provide:
- A thumb-stopping headline (under 60 chars)
- A high-converting primary text (formatted with natural line breaks, no buzzwords)
- A clear Call To Action (CTA)
- A detailed visual creative brief for video editors and graphic designers (including visual hook and on-screen text overlays).

You MUST return strictly valid JSON matching this schema:
{
  "angles": [
    {
      "framework": "AIDA" | "PAS" | "Hook-Story-Offer" | "Objection Crusher",
      "targetPainPoint": "Core psychological trigger being addressed",
      "headline": "Punchy click-generating headline",
      "primaryText": "Full compelling primary body copy",
      "callToAction": "Shop Now / Claim Free Audit / Learn More",
      "creativeBrief": {
        "format": "UGC Video (9:16)" | "Static Problem-Solution Carousel" | "Short Form Split Screen",
        "visualHook": "Exact 0-3 second visual action description",
        "onScreenText": "Short text overlay on video/image"
      }
    }
  ]
}`;

export async function POST(req: Request) {
  try {
    const { brandName, niche, productDescription, competitorAngle, targetAudience } = await req.json();

    const prompt = `Brand Name: ${brandName}
Industry / Niche: ${niche}
Product Value Proposition: ${productDescription}
Competitor Weakness / Angles: ${competitorAngle || "Generic high pricing and poor customer support"}
Target Demographic: ${targetAudience || "Busy professionals and high-intent buyers"}

Generate 4 battle-tested, high-converting ad angle variants ready for immediate testing on Meta and TikTok.`;

    const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
          systemInstruction,
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);
        return NextResponse.json(parsedData);
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} hit limit, trying next candidate...`);
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("Ad copy matrix error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate ad copy variations" },
      { status: 500 }
    );
  }
}