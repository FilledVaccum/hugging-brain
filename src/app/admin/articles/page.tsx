"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Article } from "@/lib/supabase";

const statusColors: Record<string, string> = {
  draft: "bg-sand-100 text-sand-700",
  review: "bg-clay-100 text-clay-700",
  published: "bg-olive-100 text-olive-700",
  archived: "bg-stone-100 text-stone-500",
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [filter]);

  async function loadArticles() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    params.set("limit", "100");

    const res = await fetch(`/api/articles?${params}`);
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadArticles();
  }

  async function deleteArticle(id: string) {
    if (!confirm("Delete this article permanently?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    loadArticles();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Articles</h1>
          <p className="font-body text-stone-500 mt-1">
            {articles.length} articles
          </p>
        </div>
        <Link
          href="/admin/dump"
          className="px-5 py-2.5 bg-olive-500 text-warm-50 rounded-xl font-body text-sm hover:bg-olive-600 transition-colors"
        >
          + New from Dump
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "draft", "review", "published", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-body border capitalize transition-all ${
              filter === s
                ? "bg-stone-800 text-warm-50 border-stone-800"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Articles list */}
      {loading ? (
        <div className="py-12 text-center font-body text-stone-400 animate-pulse">
          Loading articles...
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-body text-stone-400 mb-4">No articles yet.</p>
          <Link href="/admin/dump" className="text-olive-600 hover:text-olive-700 font-body text-sm">
            Create your first article from a content dump
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-stone-200/60 rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-warm transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-body ${statusColors[article.status]}`}>
                    {article.status}
                  </span>
                  <span className="text-[11px] text-stone-400 font-body">{article.category}</span>
                  <span className="text-[11px] text-stone-400 font-body">{article.difficulty}</span>
                </div>
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="font-display text-base font-semibold text-stone-800 hover:text-olive-700 transition-colors truncate block"
                >
                  {article.title}
                </Link>
                <p className="font-body text-xs text-stone-400 mt-1 truncate">
                  {article.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {article.status === "draft" && (
                  <button
                    onClick={() => updateStatus(article.id, "published")}
                    className="px-3 py-1.5 bg-olive-100 text-olive-700 rounded-lg text-xs font-body hover:bg-olive-200 transition-colors"
                  >
                    Publish
                  </button>
                )}
                {article.status === "published" && (
                  <button
                    onClick={() => updateStatus(article.id, "archived")}
                    className="px-3 py-1.5 bg-stone-100 text-stone-500 rounded-lg text-xs font-body hover:bg-stone-200 transition-colors"
                  >
                    Archive
                  </button>
                )}
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-body hover:bg-stone-200 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="px-3 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-body transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
