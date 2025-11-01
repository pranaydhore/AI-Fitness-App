import { NextResponse } from "next/server";
import { generateMotivationalQuote } from "@/lib/openai";

export async function GET() {
  try {
    const quote = await generateMotivationalQuote();
    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error("Error in generate-quote API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quote" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";