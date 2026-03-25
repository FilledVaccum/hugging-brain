import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "./supabase";

type Provider = "bedrock" | "anthropic";

interface AIResponse {
  text: string;
}

async function getAISettings(): Promise<{
  provider: Provider;
  bedrockModelId: string;
  bedrockRegion: string;
  anthropicModelId: string;
}> {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("key, value")
    .in("key", [
      "ai_provider",
      "bedrock_model_id",
      "bedrock_region",
      "anthropic_model_id",
    ]);

  const settings: Record<string, string> = {};
  data?.forEach((s) => {
    settings[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value);
  });

  return {
    provider: (settings.ai_provider as Provider) || "bedrock",
    bedrockModelId:
      settings.bedrock_model_id ||
      process.env.BEDROCK_MODEL_ID ||
      "anthropic.claude-haiku-4-5-20251001-v1:0",
    bedrockRegion: settings.bedrock_region || process.env.AWS_REGION || "us-east-1",
    anthropicModelId:
      settings.anthropic_model_id || "claude-haiku-4-5-20251001",
  };
}

/**
 * Call Bedrock using short-term API key (Bearer token) via direct REST API.
 * Uses the Converse API: POST /model/{modelId}/converse
 * Auth: Authorization: Bearer {BEDROCK_API_KEY}
 * Docs: https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html
 */
async function callBedrock(
  prompt: string,
  system: string,
  modelId: string,
  region: string
): Promise<AIResponse> {
  const apiKey = process.env.BEDROCK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "BEDROCK_API_KEY environment variable is not set. " +
      "Generate a short-term or long-term API key from the Amazon Bedrock console."
    );
  }

  const url = `https://bedrock-runtime.${region}.amazonaws.com/model/${modelId}/converse`;

  const body = {
    messages: [
      {
        role: "user",
        content: [{ text: prompt }],
      },
    ],
    system: [{ text: system }],
    inferenceConfig: {
      maxTokens: 8192,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Bedrock API error (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();

  // Converse API response format:
  // { output: { message: { role: "assistant", content: [{ text: "..." }] } } }
  const text =
    result.output?.message?.content?.[0]?.text || "";

  return { text };
}

async function callAnthropic(
  prompt: string,
  system: string,
  modelId: string
): Promise<AIResponse> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await client.messages.create({
    model: modelId,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return { text: textBlock?.text || "" };
}

export async function generateContent(
  prompt: string,
  system: string
): Promise<AIResponse> {
  const settings = await getAISettings();

  if (settings.provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return callAnthropic(prompt, system, settings.anthropicModelId);
  }

  return callBedrock(
    prompt,
    system,
    settings.bedrockModelId,
    settings.bedrockRegion
  );
}

export { type Provider, type AIResponse };
