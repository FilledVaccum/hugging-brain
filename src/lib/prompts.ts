export const SYSTEM_PROMPT = `You are Hugging Brain's AI content editor. You transform raw AI/ML content (arxiv papers, tweets, blog posts, newsletters, LinkedIn posts) into polished, engineer-focused articles.

Your output must be technically accurate, insightful, and actionable for AI engineers. Write with authority but remain accessible. Always focus on practical implications — what does this mean for someone building AI systems?

Use markdown formatting. Be concise but thorough.`;

export function buildProcessingPrompt(
  rawContent: string,
  sourceType: string,
  sourceUrl?: string
): string {
  return `Analyze the following ${sourceType} content and generate a complete article package.

SOURCE CONTENT:
---
${rawContent}
---
${sourceUrl ? `Source URL: ${sourceUrl}` : ""}

Generate a JSON response with EXACTLY this structure (no markdown code fences around the JSON):
{
  "title": "A compelling, specific title (not clickbait, technically accurate)",
  "slug": "url-friendly-slug-from-title",
  "summary": "2-3 sentence summary that captures the key insight for engineers",
  "content": "Full blog post in markdown. Include: ## Key Takeaways (bullet points), ## What Happened (context), ## Technical Deep Dive (the substance), ## Why It Matters (practical implications for engineers), ## What's Next (forward-looking perspective). Aim for 800-1200 words.",
  "cheat_sheet": "Condensed reference card in markdown. Use tables, bullet points, code snippets where relevant. Max 300 words. Should be printable/saveable as a quick reference.",
  "twitter_thread": "A 5-7 tweet thread. Each tweet on its own line, prefixed with tweet number (1/, 2/, etc). Include relevant hashtags on last tweet only. Technical but engaging.",
  "linkedin_post": "Professional LinkedIn post. 150-250 words. Include key insight, why it matters, and a call-to-action. Format with line breaks for readability.",
  "tldr": "Exactly 2-3 sentences. The absolute essence of why an AI engineer should care.",
  "category": "One of: LLM, VLM, GenAI, Agentic AI, Research, Open Source",
  "difficulty": "One of: beginner, intermediate, advanced",
  "tags": ["array", "of", "relevant", "tags"],
  "source_name": "Name of the original source/author/org",
  "read_time": 5
}

IMPORTANT: Return ONLY valid JSON. No markdown fences, no explanation outside the JSON.`;
}

export function buildWeeklyDigestPrompt(
  articles: Array<{ title: string; summary: string; slug: string; category: string }>
): string {
  const articleList = articles
    .map((a, i) => `${i + 1}. [${a.category}] ${a.title}\n   ${a.summary}`)
    .join("\n\n");

  return `Create a weekly digest email for AI engineers based on these articles published this week:

${articleList}

Generate a JSON response:
{
  "subject": "Engaging email subject line for this week's AI digest",
  "intro": "2-3 sentence intro paragraph setting the tone for the week in AI",
  "highlights": "3-4 bullet points highlighting the most important developments",
  "closing": "Brief closing with a forward-looking statement"
}

Return ONLY valid JSON.`;
}
