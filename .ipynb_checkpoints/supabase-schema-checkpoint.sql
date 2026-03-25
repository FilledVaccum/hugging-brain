-- ============================================
-- HUGGING BRAIN - Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ARTICLES TABLE
-- ============================================
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT, -- Full blog post markdown
  cheat_sheet TEXT, -- Condensed cheat sheet markdown
  twitter_thread TEXT, -- Pre-formatted twitter thread
  linkedin_post TEXT, -- Pre-formatted linkedin post
  tldr TEXT, -- 2-3 sentence summary
  category TEXT NOT NULL CHECK (category IN ('LLM', 'VLM', 'GenAI', 'Agentic AI', 'Research', 'Open Source')),
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  source_type TEXT CHECK (source_type IN ('arxiv', 'blog', 'tweet', 'newsletter', 'linkedin', 'other')),
  source_url TEXT,
  source_name TEXT,
  cover_image TEXT,
  read_time INTEGER DEFAULT 5, -- minutes
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = TRUE;

-- Full text search
ALTER TABLE articles ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'C')
  ) STORED;

CREATE INDEX idx_articles_fts ON articles USING GIN(fts);

-- ============================================
-- 2. SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  confirm_token TEXT,
  unsubscribe_token TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  preferences JSONB DEFAULT '{"weekly_digest": true, "breaking_news": false}'::jsonb,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_active ON subscribers(active) WHERE active = TRUE;

-- ============================================
-- 3. CONTENT DUMPS TABLE
-- ============================================
CREATE TABLE content_dumps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  raw_content TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('arxiv', 'blog', 'tweet', 'newsletter', 'linkedin', 'other')),
  source_url TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processed_article_id UUID REFERENCES articles(id),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_dumps_status ON content_dumps(processing_status);

-- ============================================
-- 4. SETTINGS TABLE (Key-Value Store)
-- ============================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('ai_provider', '"bedrock"'::jsonb),
  ('bedrock_model_id', '"anthropic.claude-haiku-4-5-20251001-v1:0"'::jsonb),
  ('bedrock_region', '"us-east-1"'::jsonb),
  ('anthropic_model_id', '"claude-haiku-4-5-20251001"'::jsonb),
  ('site_name', '"Hugging Brain"'::jsonb),
  ('admin_email', '"admin@huggingbrain.in"'::jsonb),
  ('weekly_digest_day', '"monday"'::jsonb);

-- ============================================
-- 5. NEWSLETTER SENDS TABLE
-- ============================================
CREATE TABLE newsletter_sends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sending', 'sent', 'failed'))
);

-- ============================================
-- 6. AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Articles: public can read published, admin can do everything
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role can do everything on articles"
  ON articles FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Subscribers: only service role
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Content dumps: only service role
ALTER TABLE content_dumps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage dumps"
  ON content_dumps FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Settings: public can read, service role can write
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Newsletter sends: only service role
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage newsletter_sends"
  ON newsletter_sends FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 8. VIEWS FOR CONVENIENCE
-- ============================================

-- Published articles view
CREATE OR REPLACE VIEW published_articles AS
SELECT id, slug, title, summary, content, cheat_sheet, twitter_thread, linkedin_post,
       tldr, category, difficulty, source_type, source_url, source_name,
       cover_image, read_time, tags, featured, views, published_at, created_at
FROM articles
WHERE status = 'published'
ORDER BY published_at DESC;

-- Active subscribers count
CREATE OR REPLACE VIEW subscriber_stats AS
SELECT
  COUNT(*) FILTER (WHERE active AND confirmed) AS active_count,
  COUNT(*) FILTER (WHERE active AND NOT confirmed) AS pending_count,
  COUNT(*) FILTER (WHERE NOT active) AS unsubscribed_count,
  COUNT(*) AS total_count
FROM subscribers;
