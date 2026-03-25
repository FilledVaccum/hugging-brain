import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Hugging Brain <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hugging-brain.vercel.app";

export async function sendConfirmationEmail(
  email: string,
  confirmToken: string
) {
  const confirmUrl = `${SITE_URL}/api/confirm?token=${confirmToken}`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Confirm your Hugging Brain subscription",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3b3428; background-color: #fdfbf7;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 600; color: #3b3428; margin: 0;">Hugging Brain</h1>
          <p style="color: #9b9479; font-size: 14px; margin-top: 4px;">Intelligence for the AI era</p>
        </div>

        <h2 style="font-size: 22px; color: #3b3428;">Welcome aboard!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #625c4b;">
          Thanks for subscribing to Hugging Brain. Confirm your email to start receiving curated AI insights every week.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}"
             style="display: inline-block; padding: 14px 32px; background-color: #8b9a4e; color: #fdfbf7; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 500;">
            Confirm my subscription
          </a>
        </div>

        <p style="font-size: 13px; color: #ada892; text-align: center;">
          If you didn't subscribe, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #efeee8; margin: 32px 0;" />
        <p style="font-size: 12px; color: #ada892; text-align: center;">
          Hugging Brain — Curating the signal from the noise.
        </p>
      </div>
    `,
  });
}

export async function sendWeeklyDigest(
  emails: string[],
  subject: string,
  content: {
    intro: string;
    highlights: string;
    articles: Array<{ title: string; slug: string; category: string; tldr: string }>;
    closing: string;
  },
  unsubscribeTokens: Record<string, string>
) {
  const results = [];

  for (const email of emails) {
    const unsubUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeTokens[email]}`;

    const articleHtml = content.articles
      .map(
        (a) => `
        <div style="margin-bottom: 24px; padding: 20px; background: #f8f7f4; border-radius: 16px; border-left: 3px solid #8b9a4e;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8b9a4e;">${a.category}</span>
          <h3 style="margin: 8px 0; font-size: 18px;">
            <a href="${SITE_URL}/blog/${a.slug}" style="color: #3b3428; text-decoration: none;">${a.title}</a>
          </h3>
          <p style="font-size: 14px; color: #625c4b; line-height: 1.5; margin: 0;">${a.tldr}</p>
        </div>`
      )
      .join("");

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3b3428; background-color: #fdfbf7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 600; color: #3b3428; margin: 0;">Hugging Brain</h1>
            <p style="color: #9b9479; font-size: 14px; margin-top: 4px;">Weekly AI Digest</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #625c4b;">${content.intro}</p>

          <div style="margin: 24px 0; padding: 16px; background: #eef0e1; border-radius: 12px;">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #6d7a3b;">This Week's Highlights</h3>
            <div style="font-size: 14px; color: #444c2a; line-height: 1.8;">${content.highlights}</div>
          </div>

          ${articleHtml}

          <p style="font-size: 15px; line-height: 1.6; color: #625c4b; margin-top: 32px;">${content.closing}</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${SITE_URL}" style="display: inline-block; padding: 12px 28px; background-color: #3b3428; color: #fdfbf7; text-decoration: none; border-radius: 999px; font-size: 14px;">
              Read more on Hugging Brain
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #efeee8; margin: 32px 0;" />
          <p style="font-size: 12px; color: #ada892; text-align: center;">
            <a href="${unsubUrl}" style="color: #ada892;">Unsubscribe</a> | Hugging Brain
          </p>
        </div>
      `,
    });

    results.push(result);
  }

  return results;
}

export async function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Hugging Brain!",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3b3428; background-color: #fdfbf7;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 600; color: #3b3428; margin: 0;">Hugging Brain</h1>
          <p style="color: #9b9479; font-size: 14px; margin-top: 4px;">Intelligence for the AI era</p>
        </div>

        <h2 style="font-size: 22px; color: #3b3428;">You're in!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #625c4b;">
          Your subscription is confirmed. Every Monday, you'll receive a curated digest of the most important developments in AI — LLMs, VLMs, GenAI, and Agentic AI.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #625c4b;">
          In the meantime, explore the latest articles on our site.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${SITE_URL}" style="display: inline-block; padding: 14px 32px; background-color: #8b9a4e; color: #fdfbf7; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 500;">
            Explore Hugging Brain
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #efeee8; margin: 32px 0;" />
        <p style="font-size: 12px; color: #ada892; text-align: center;">
          Hugging Brain — Curating the signal from the noise.
        </p>
      </div>
    `,
  });
}
