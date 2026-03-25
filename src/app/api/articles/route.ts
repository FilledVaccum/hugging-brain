import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { isAuthenticatedFromRequest } from "@/lib/auth";

// GET - list articles (public: published only, admin: all)
export async function GET(request: NextRequest) {
  const isAdmin = isAuthenticatedFromRequest(request);
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const client = isAdmin ? supabaseAdmin : supabase;

  let query = client
    .from("articles")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!isAdmin) {
    query = query.eq("status", "published");
  } else if (status) {
    query = query.eq("status", status);
  }

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data, total: count });
}

// POST - create article (admin only)
export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ article: data });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
