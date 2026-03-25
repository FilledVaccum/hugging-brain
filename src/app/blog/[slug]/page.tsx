"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Article } from "@/lib/supabase";

function ShareButton({ platform, text, url }: { platform: "twitter" | "linkedin" | "copy"; text: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-body text-stone-600 hover:border-stone-400 hover:text-stone-800 transition-all flex items-center gap-2"
    >
      {platform === "twitter" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      )}
      {platform === "linkedin" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      )}
      {platform === "copy" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
      {platform === "twitter" ? "Share" : platform === "linkedin" ? "Share" : copied ? "Copied!" : "Copy"}
    </button>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown to HTML (headings, bold, code, links, lists)
  const html = content
    .replace(/^### (.*$)/gm, '<h3 class="font-display text-xl font-semibold text-stone-800 mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="font-display text-2xl font-semibold text-stone-800 mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="font-display text-3xl font-bold text-stone-800 mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-stone-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-stone-100 rounded text-sm font-mono text-stone-700">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-1">$2</li>')
    .replace(/\n\n/g, '</p><p class="font-body text-stone-600 leading-relaxed mb-4">');

  return (
    <div
      className="prose-custom font-body text-stone-600 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: `<p class="font-body text-stone-600 leading-relaxed mb-4">${html}</p>` }}
    />
  );
}

export default function BlogDetail() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"article" | "cheatsheet" | "social">("article");

  useEffect(() => {
    // Fetch by slug — we'll search through articles
    fetch(`/api/articles?limit=200`)
      .then((r) => r.json())
      .then((data) => {
        const found = (data.articles || []).find((a: Article) => a.slug === params.slug);
        setArticle(found || null);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse font-body text-stone-400">Loading article...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Article not found</h1>
            <a href="/blog" className="text-olive-600 font-body hover:text-olive-700">Back to blog</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <article className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className={`px-3 py-1 text-xs font-body tracking-wider rounded-full ${
                { LLM: "bg-olive-100 text-olive-700", VLM: "bg-clay-100 text-clay-700", GenAI: "bg-sand-100 text-sand-700", "Agentic AI": "bg-sage-100 text-sage-700", Research: "bg-stone-100 text-stone-600", "Open Source": "bg-olive-50 text-olive-600" }[article.category] || "bg-stone-100 text-stone-600"
              }`}>
                {article.category}
              </span>
              <span className="text-xs text-stone-400 font-body capitalize">{article.difficulty}</span>
              <span className="text-xs text-stone-400 font-body">{article.read_time} min read</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-stone-800 leading-tight mb-5">
              {article.title}
            </h1>

            {article.tldr && (
              <div className="bg-olive-50/60 border border-olive-200/50 rounded-2xl p-5 mb-6">
                <p className="font-body text-sm font-medium text-olive-700 mb-1">TL;DR</p>
                <p className="font-body text-stone-600">{article.tldr}</p>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {article.source_name && (
                  <span className="font-body text-sm text-stone-500">Source: {article.source_name}</span>
                )}
                {article.published_at && (
                  <span className="font-body text-sm text-stone-400">
                    {new Date(article.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ShareButton platform="twitter" text={`${article.title} ${articleUrl}`} url={articleUrl} />
                <ShareButton platform="linkedin" text={article.title} url={articleUrl} />
              </div>
            </div>
          </motion.div>

          <div className="organic-line mb-10" />

          {/* Content Tabs */}
          <div className="flex gap-1 mb-8 border-b border-stone-200">
            {[
              { key: "article", label: "Article" },
              { key: "cheatsheet", label: "Cheat Sheet" },
              { key: "social", label: "Social Snippets" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-5 py-3 font-body text-sm border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-olive-500 text-olive-700"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "article" && article.content && (
              <MarkdownRenderer content={article.content} />
            )}

            {activeTab === "cheatsheet" && (
              <div>
                {article.cheat_sheet ? (
                  <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-semibold text-stone-800">Quick Reference</h2>
                      <ShareButton platform="copy" text={article.cheat_sheet} url={articleUrl} />
                    </div>
                    <MarkdownRenderer content={article.cheat_sheet} />
                  </div>
                ) : (
                  <p className="font-body text-stone-400 py-8 text-center">No cheat sheet available for this article.</p>
                )}
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-8">
                {/* Twitter Thread */}
                {article.twitter_thread && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-semibold text-stone-800">Twitter Thread</h3>
                      <div className="flex gap-2">
                        <ShareButton platform="copy" text={article.twitter_thread} url={articleUrl} />
                        <ShareButton platform="twitter" text={article.twitter_thread.split("\n")[0]} url={articleUrl} />
                      </div>
                    </div>
                    <div className="bg-white border border-stone-200/60 rounded-2xl p-6">
                      {article.twitter_thread.split("\n").filter(Boolean).map((tweet, i) => (
                        <div key={i} className={`py-3 ${i > 0 ? "border-t border-stone-100" : ""}`}>
                          <p className="font-body text-sm text-stone-700">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LinkedIn Post */}
                {article.linkedin_post && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-semibold text-stone-800">LinkedIn Post</h3>
                      <div className="flex gap-2">
                        <ShareButton platform="copy" text={article.linkedin_post} url={articleUrl} />
                        <ShareButton platform="linkedin" text={article.title} url={articleUrl} />
                      </div>
                    </div>
                    <div className="bg-white border border-stone-200/60 rounded-2xl p-6">
                      <p className="font-body text-sm text-stone-700 whitespace-pre-line">{article.linkedin_post}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-body">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
