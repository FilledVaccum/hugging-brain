"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Article } from "@/lib/supabase";

export default function ArticleEditor() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "cheatsheet" | "social">("content");

  useEffect(() => {
    fetch(`/api/articles/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = async (updates?: Partial<Article>) => {
    if (!article) return;
    setSaving(true);
    const body = updates || article;
    await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (updates) setArticle({ ...article, ...updates });
    setSaving(false);
  };

  const handlePublish = () => handleSave({ status: "published" } as Partial<Article>);

  if (loading) {
    return <div className="py-12 text-center font-body text-stone-400 animate-pulse">Loading...</div>;
  }

  if (!article) {
    return <div className="py-12 text-center font-body text-stone-400">Article not found</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push("/admin/articles")} className="text-sm text-stone-400 hover:text-stone-600 font-body mb-2 block">
            &larr; Back to articles
          </button>
          <h1 className="font-display text-2xl font-bold text-stone-800">Edit Article</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-body ${
            article.status === "published" ? "bg-olive-100 text-olive-700" : "bg-sand-100 text-sand-700"
          }`}>
            {article.status}
          </span>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 bg-stone-800 text-warm-50 rounded-xl font-body text-sm hover:bg-stone-700 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {article.status !== "published" && (
            <button
              onClick={handlePublish}
              className="px-5 py-2 bg-olive-500 text-warm-50 rounded-xl font-body text-sm hover:bg-olive-600 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Title</label>
          <input
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Slug</label>
          <input
            value={article.slug}
            onChange={(e) => setArticle({ ...article, slug: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Category</label>
          <select
            value={article.category}
            onChange={(e) => setArticle({ ...article, category: e.target.value as Article["category"] })}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400"
          >
            {["LLM", "VLM", "GenAI", "Agentic AI", "Research", "Open Source"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Difficulty</label>
          <select
            value={article.difficulty}
            onChange={(e) => setArticle({ ...article, difficulty: e.target.value as Article["difficulty"] })}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400"
          >
            {["beginner", "intermediate", "advanced"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Read Time (min)</label>
          <input
            type="number"
            value={article.read_time}
            onChange={(e) => setArticle({ ...article, read_time: parseInt(e.target.value) || 5 })}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={article.featured}
              onChange={(e) => setArticle({ ...article, featured: e.target.checked })}
              className="w-4 h-4 rounded border-stone-300 text-olive-500 focus:ring-olive-400"
            />
            <span className="font-body text-sm text-stone-700">Featured</span>
          </label>
        </div>
      </div>

      {/* Summary / TLDR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">Summary</label>
          <textarea
            value={article.summary || ""}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 resize-y"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">TL;DR</label>
          <textarea
            value={article.tldr || ""}
            onChange={(e) => setArticle({ ...article, tldr: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 resize-y"
          />
        </div>
      </div>

      {/* Tabs for content types */}
      <div className="flex gap-1 mb-4 border-b border-stone-200">
        {(["content", "cheatsheet", "social"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-body text-sm capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-olive-500 text-olive-700"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            {tab === "cheatsheet" ? "Cheat Sheet" : tab === "social" ? "Social Snippets" : "Blog Content"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "content" && (
        <textarea
          value={article.content || ""}
          onChange={(e) => setArticle({ ...article, content: e.target.value })}
          rows={24}
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:border-olive-400 resize-y"
          placeholder="Blog content in Markdown..."
        />
      )}

      {activeTab === "cheatsheet" && (
        <textarea
          value={article.cheat_sheet || ""}
          onChange={(e) => setArticle({ ...article, cheat_sheet: e.target.value })}
          rows={16}
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:border-olive-400 resize-y"
          placeholder="Cheat sheet in Markdown..."
        />
      )}

      {activeTab === "social" && (
        <div className="space-y-6">
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">Twitter Thread</label>
            <textarea
              value={article.twitter_thread || ""}
              onChange={(e) => setArticle({ ...article, twitter_thread: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 resize-y"
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">LinkedIn Post</label>
            <textarea
              value={article.linkedin_post || ""}
              onChange={(e) => setArticle({ ...article, linkedin_post: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
