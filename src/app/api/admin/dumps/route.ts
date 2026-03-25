import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticatedFromRequest } from "@/lib/auth";

// GET - list all content dumps
export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("content_dumps")
    .select("*, articles:processed_article_id(id, title, slug, status)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dumps: data });
}

// POST - create a new content dump
export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rawContent, sourceType, sourceUrl } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("content_dumps")
      .insert({
        raw_content: rawContent,
        source_type: sourceType || "other",
        source_url: sourceUrl || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dump: data });
  } catch (error) {
    console.error("Create dump error:", error);
    return NextResponse.json({ error: "Failed to create dump" }, { status: 500 });
  }
}
