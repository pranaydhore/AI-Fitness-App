import { NextRequest, NextResponse } from "next/server";
import { generateExerciseImage, generateMealImage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { name, type } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: "Missing name or type" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (type === "exercise") {
      imageUrl = (await generateExerciseImage(name)) ?? undefined;  // ✅ Fix applied here
    } else if (type === "meal") {
      imageUrl = (await generateMealImage(name)) ?? undefined;      // ✅ Fix applied here
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'exercise' or 'meal'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("Error in generate-image API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
