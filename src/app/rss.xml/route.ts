import { supabase } from "@/lib/supabase";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hugging-brain.vercel.app";

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, summary, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (articles || [])
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/blog/${a.slug}</link>
      <description><![CDATA[${a.summary || ""}]]></description>
      <category>${a.category}</category>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <guid>${siteUrl}/blog/${a.slug}</guid>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hugging Brain</title>
    <link>${siteUrl}</link>
    <description>Curated AI intelligence for engineers — LLMs, VLMs, GenAI, and Agentic AI</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
