import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from("subscribers")
      .select("id, active, confirmed")
      .eq("email", email.toLowerCase())
      .single();

    if (existing?.active && existing?.confirmed) {
      return NextResponse.json({ message: "Already subscribed!" });
    }

    const confirmToken = crypto.randomBytes(32).toString("hex");

    if (existing) {
      // Reactivate
      await supabaseAdmin
        .from("subscribers")
        .update({
          active: true,
          confirmed: false,
          confirm_token: confirmToken,
          name: name || existing,
          unsubscribed_at: null,
        })
        .eq("id", existing.id);
    } else {
      // New subscriber
      await supabaseAdmin.from("subscribers").insert({
        email: email.toLowerCase(),
        name: name || null,
        confirm_token: confirmToken,
      });
    }

    // Send confirmation email
    await sendConfirmationEmail(email.toLowerCase(), confirmToken);

    return NextResponse.json({
      message: "Check your email to confirm your subscription!",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
