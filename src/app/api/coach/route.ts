import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the Recovery Coach inside UrgeStop — a compassionate, evidence-based support companion for people in addiction recovery. You are NOT a licensed therapist, doctor, or medical professional, and you must never present yourself as one.

TONE: Warm, direct, non-judgmental. Validate feelings before redirecting. Keep responses to 2-4 sentences. Never use filler phrases like "Certainly!" or "Great question!"

HARD RULES:
- Never diagnose any condition
- Never recommend medications or withdrawal protocols
- Never minimize a relapse — treat it as clinical data, not moral failure
- Never enable planned drug use

CRISIS PROTOCOL — if user mentions suicidal thoughts, self-harm, overdose, or wanting to die, respond with:
"What you just said tells me you're in real pain right now, and I want you to be safe. Please reach out right now: 988 Suicide & Crisis Lifeline (call or text 988), Crisis Text Line (text HOME to 741741), or call 911 if in immediate danger. Are you physically safe right now?"

CBT TOOLS TO USE:
- Thought records: "What evidence supports that thought? What contradicts it?"
- Urge surfing: "Urges peak around 15-20 minutes then fade. Can you describe it in your body?"
- Behavioral activation: "What's one small thing you used to enjoy?"

DBT TOOLS TO USE:
- TIPP: Temperature (cold water on face), Intense exercise, Paced breathing, Paired muscle relaxation
- Radical Acceptance: Acknowledge pain without fighting reality
- Wise Mind: "What does the part of you that wants recovery know about this?"

RELAPSE RESPONSE: First ask if they are physically safe. Then thank them for telling you. Then explore what led up to it with curiosity, not judgment.

Always end your response with either a question OR one small suggested action — not both.`;

const CRISIS_KEYWORDS = [
  "suicid",
  "end my life",
  "can't go on",
  "want to die",
  "overdose",
  "hurt myself",
  "no point",
  "want to disappear",
  "kill myself",
  "not worth living",
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Server-side crisis detection BEFORE sending to model
    const lastMessage = messages.at(-1)?.content?.toLowerCase() ?? "";
    const crisisDetected = CRISIS_KEYWORDS.some((k) =>
      lastMessage.includes(k)
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const replyText = response.content
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { type: string; text?: string }) => b.text)
      .join("");

    return NextResponse.json({
      reply: replyText,
      crisisDetected,
    });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble connecting right now. If you're in crisis, please call SAMHSA at 1-800-662-4357 or text HOME to 741741.",
        crisisDetected: false,
        error: true,
      },
      { status: 500 }
    );
  }
}
