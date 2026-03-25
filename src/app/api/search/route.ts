import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ articles: [] });
  }

  // Full-text search using the fts column
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, summary, category, difficulty, read_time, published_at, tags")
    .eq("status", "published")
    .textSearch("fts", query, { type: "websearch" })
    .limit(20);

  if (error) {
    // Fallback to ILIKE search if FTS fails
    const { data: fallback } = await supabase
      .from("articles")
      .select("id, slug, title, summary, category, difficulty, read_time, published_at, tags")
      .eq("status", "published")
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .limit(20);

    return NextResponse.json({ articles: fallback || [] });
  }

  return NextResponse.json({ articles: data });
}
