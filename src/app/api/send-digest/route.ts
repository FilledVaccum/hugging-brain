import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateContent } from "@/lib/ai-provider";
import { SYSTEM_PROMPT, buildWeeklyDigestPrompt } from "@/lib/prompts";
import { sendWeeklyDigest } from "@/lib/email";
import { isAuthenticatedFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Allow both admin and Vercel cron
  const cronSecret = request.headers.get("authorization");
  const isAdmin = isAuthenticatedFromRequest(request);
  const isCron = cronSecret === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get this week's published articles
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: articles } = await supabaseAdmin
      .from("articles")
      .select("title, summary, slug, category, tldr")
      .eq("status", "published")
      .gte("published_at", oneWeekAgo.toISOString())
      .order("published_at", { ascending: false });

    if (!articles || articles.length === 0) {
      return NextResponse.json({ message: "No articles to digest this week" });
    }

    // Generate digest with AI
    const digestPrompt = buildWeeklyDigestPrompt(articles);
    const aiResult = await generateContent(digestPrompt, SYSTEM_PROMPT);

    let digest;
    try {
      const jsonMatch = aiResult.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON");
      digest = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to generate digest" },
        { status: 500 }
      );
    }

    // Get active subscribers
    const { data: subscribers } = await supabaseAdmin
      .from("subscribers")
      .select("email, unsubscribe_token")
      .eq("active", true)
      .eq("confirmed", true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers" });
    }

    const emails = subscribers.map((s) => s.email);
    const tokens: Record<string, string> = {};
    subscribers.forEach((s) => {
      tokens[s.email] = s.unsubscribe_token;
    });

    // Send emails
    await sendWeeklyDigest(
      emails,
      digest.subject,
      {
        intro: digest.intro,
        highlights: digest.highlights,
        articles: articles.map((a) => ({
          title: a.title,
          slug: a.slug,
          category: a.category,
          tldr: a.tldr || a.summary || "",
        })),
        closing: digest.closing,
      },
      tokens
    );

    // Log the send
    await supabaseAdmin.from("newsletter_sends").insert({
      subject: digest.subject,
      content: JSON.stringify(digest),
      recipients_count: emails.length,
      status: "sent",
    });

    return NextResponse.json({
      success: true,
      recipientCount: emails.length,
      subject: digest.subject,
    });
  } catch (error) {
    console.error("Digest error:", error);
    return NextResponse.json(
      { error: "Failed to send digest" },
      { status: 500 }
    );
  }
}
