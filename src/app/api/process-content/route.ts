import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateContent } from "@/lib/ai-provider";
import { SYSTEM_PROMPT, buildProcessingPrompt } from "@/lib/prompts";
import { isAuthenticatedFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rawContent, sourceType, sourceUrl, dumpId } = await request.json();

    if (!rawContent) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Update dump status to processing
    if (dumpId) {
      await supabaseAdmin
        .from("content_dumps")
        .update({ processing_status: "processing" })
        .eq("id", dumpId);
    }

    // Generate content with AI
    const prompt = buildProcessingPrompt(rawContent, sourceType || "other", sourceUrl);
    const result = await generateContent(prompt, SYSTEM_PROMPT);

    // Parse the AI response
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // If parsing fails, update dump and return error
      if (dumpId) {
        await supabaseAdmin
          .from("content_dumps")
          .update({
            processing_status: "failed",
            error_message: "Failed to parse AI response",
          })
          .eq("id", dumpId);
      }
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: result.text },
        { status: 422 }
      );
    }

    // Create article in draft status
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
        category: parsed.category,
        difficulty: parsed.difficulty || "intermediate",
        source_type: sourceType || "other",
        source_url: sourceUrl || null,
        source_name: parsed.source_name || null,
        read_time: parsed.read_time || 5,
        tags: parsed.tags || [],
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      if (dumpId) {
        await supabaseAdmin
          .from("content_dumps")
          .update({
            processing_status: "failed",
            error_message: insertError.message,
          })
          .eq("id", dumpId);
      }
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // Update dump with success
    if (dumpId) {
      await supabaseAdmin
        .from("content_dumps")
        .update({
          processing_status: "completed",
          processed_article_id: article.id,
          processed_at: new Date().toISOString(),
        })
        .eq("id", dumpId);
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Process content error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Processing failed: ${message}` },
      { status: 500 }
    );
  }
}
