import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateContent } from "@/lib/ai-provider";
import {
  FIRST_PRINCIPLES_SYSTEM,
  buildFirstPrinciplesBlogPrompt,
} from "@/lib/first-principles-prompt";
import { isAuthenticatedFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topic, targetAudience, depth, additionalContext } =
      await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = buildFirstPrinciplesBlogPrompt(
      topic,
      targetAudience || "AI engineers with general CS background",
      depth || "intermediate",
      additionalContext || ""
    );

    const result = await generateContent(prompt, FIRST_PRINCIPLES_SYSTEM);

    let parsed;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: result.text },
        { status: 422 }
      );
    }

    // Create article with first-principles tag
    const tags = parsed.tags || [];
    if (!tags.includes("first-principles")) {
      tags.unshift("first-principles");
    }

    const { data: article, error: insertError } = await supabaseAdmin
      .from("articles")
      .insert({
        slug: parsed.slug || parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        title: parsed.title,
        summary: parsed.summary,
        content: parsed.content,
        cheat_sheet: parsed.cheat_sheet,
        twitter_thread: parsed.twitter_thread,
        linkedin_post: parsed.linkedin_post,
        tldr: parsed.tldr,
        category: parsed.category || "Research",
        difficulty: parsed.difficulty || "intermediate",
        source_type: "other",
        source_name: "Hugging Brain First Principles",
        read_time: parsed.read_time || 12,
        tags,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      article,
      buildingBlocks: parsed.building_blocks || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 }
    );
  }
}
