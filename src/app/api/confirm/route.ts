import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=invalid_token", request.url)
    );
  }

  const { data: subscriber } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, confirmed")
    .eq("confirm_token", token)
    .single();

  if (!subscriber) {
    return NextResponse.redirect(
      new URL("/?error=invalid_token", request.url)
    );
  }

  if (!subscriber.confirmed) {
    await supabaseAdmin
      .from("subscribers")
      .update({
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        confirm_token: null,
      })
      .eq("id", subscriber.id);

    // Send welcome email
    await sendWelcomeEmail(subscriber.email);
  }

  return NextResponse.redirect(
    new URL("/?subscribed=true", request.url)
  );
}
