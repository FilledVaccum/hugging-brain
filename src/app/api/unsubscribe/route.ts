import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=invalid_token", request.url)
    );
  }

  const { data: subscriber } = await supabaseAdmin
    .from("subscribers")
    .select("id")
    .eq("unsubscribe_token", token)
    .single();

  if (!subscriber) {
    return NextResponse.redirect(
      new URL("/?error=invalid_token", request.url)
    );
  }

  await supabaseAdmin
    .from("subscribers")
    .update({
      active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("id", subscriber.id);

  return NextResponse.redirect(
    new URL("/?unsubscribed=true", request.url)
  );
}
