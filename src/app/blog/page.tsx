"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Article } from "@/lib/supabase";

const categories = ["All", "LLM", "VLM", "GenAI", "Agentic AI", "Research", "Open Source"];
const difficulties = ["All Levels", "beginner", "intermediate", "advanced"];

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const categoryColors: Record<string, string> = {
  LLM: "bg-olive-100 text-olive-700",
  VLM: "bg-clay-100 text-clay-700",
  GenAI: "bg-sand-100 text-sand-700",
  "Agentic AI": "bg-sage-100 text-sage-700",
  Research: "bg-stone-100 text-stone-600",
  "Open Source": "bg-olive-50 text-olive-600",
};

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    params.set("limit", "50");

    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((r) => r.json())
        .then((data) => setSearchResults(data.articles));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const displayArticles = searchResults !== null ? searchResults : articles;
  const filtered = difficulty === "All Levels"
    ? displayArticles
    : displayArticles.filter((a) => a.difficulty === difficulty);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-3">
              Blog
            </h1>
            <p className="font-body text-stone-500 text-lg">
              Deep dives, analysis, and insights across the AI landscape.
            </p>
          </motion.div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setSearchQuery(""); setSearchResults(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-body border transition-all ${
                    category === c
                      ? "bg-stone-800 text-warm-50 border-stone-800"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body border capitalize transition-all ${
                    difficulty === d
                      ? "bg-olive-500 text-warm-50 border-olive-500"
                      : "bg-white text-stone-400 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {d === "All Levels" ? d : difficultyLabel[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="py-16 text-center font-body text-stone-400 animate-pulse">Loading articles...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-body text-stone-400 text-lg">No articles found.</p>
              <p className="font-body text-stone-300 text-sm mt-2">Check back soon or try a different filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white/60 border border-stone-200/50 rounded-2xl p-6 card-hover"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 text-[11px] font-body tracking-wider rounded-full ${categoryColors[article.category] || "bg-stone-100 text-stone-600"}`}>
                      {article.category}
                    </span>
                    <span className="text-[11px] text-stone-400 font-body capitalize">
                      {difficultyLabel[article.difficulty] || article.difficulty}
                    </span>
                    <span className="text-[11px] text-stone-400 font-body">{article.read_time} min</span>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <h2 className="font-display text-lg font-semibold text-stone-800 mb-3 leading-snug group-hover:text-olive-700 transition-colors">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="font-body text-sm text-stone-500 leading-relaxed mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-body">{article.source_name}</span>
                    {article.published_at && (
                      <span className="text-xs text-stone-400 font-body">
                        {new Date(article.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
