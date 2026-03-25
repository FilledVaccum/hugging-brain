import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
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

async function callBedrock(
  prompt: string,
  system: string,
  modelId: string,
  region: string
): Promise<AIResponse> {
  const client = new BedrockRuntimeClient({
    region,
    ...(process.env.AWS_ACCESS_KEY_ID && {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        ...(process.env.AWS_SESSION_TOKEN && {
          sessionToken: process.env.AWS_SESSION_TOKEN,
        }),
      },
    }),
  });

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return { text: result.content[0].text };
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
