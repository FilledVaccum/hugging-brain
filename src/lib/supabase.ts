import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client for public reads (uses anon key with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  cheat_sheet: string | null;
  twitter_thread: string | null;
  linkedin_post: string | null;
  tldr: string | null;
  category: "LLM" | "VLM" | "GenAI" | "Agentic AI" | "Research" | "Open Source";
  difficulty: "beginner" | "intermediate" | "advanced";
  source_type: string | null;
  source_url: string | null;
  source_name: string | null;
  cover_image: string | null;
  read_time: number;
  tags: string[];
  featured: boolean;
  status: "draft" | "review" | "published" | "archived";
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  confirmed: boolean;
  confirm_token: string | null;
  unsubscribe_token: string;
  preferences: { weekly_digest: boolean; breaking_news: boolean };
  subscribed_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  active: boolean;
}

export interface ContentDump {
  id: string;
  raw_content: string;
  source_type: string | null;
  source_url: string | null;
  processing_status: "pending" | "processing" | "completed" | "failed";
  processed_article_id: string | null;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}
