"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Article } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  LLM: "bg-olive-100 text-olive-700 border-olive-200",
  VLM: "bg-clay-100 text-clay-700 border-clay-200",
  GenAI: "bg-sand-100 text-sand-700 border-sand-200",
  "Agentic AI": "bg-sage-100 text-sage-700 border-sage-200",
  Research: "bg-stone-100 text-stone-600 border-stone-200",
  "Open Source": "bg-olive-50 text-olive-600 border-olive-200",
};

export default function CheatsheetsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setArticles(
          (data.articles || []).filter((a: Article) => a.cheat_sheet)
        );
        setLoading(false);
      });
  }, []);

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
              Cheat Sheets
            </h1>
            <p className="font-body text-stone-500 text-lg">
              Quick reference cards — save, print, or share.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-16 text-center font-body text-stone-400 animate-pulse">Loading...</div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-body text-stone-400 text-lg">No cheat sheets yet.</p>
              <p className="font-body text-stone-300 text-sm mt-2">
                Cheat sheets are auto-generated when articles are processed.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white border border-stone-200/50 rounded-2xl overflow-hidden card-hover"
                >
                  {/* Colored top bar */}
                  <div className={`h-1.5 ${
                    { LLM: "bg-olive-400", VLM: "bg-clay-400", GenAI: "bg-sand-400", "Agentic AI": "bg-sage-400", Research: "bg-stone-400", "Open Source": "bg-olive-300" }[article.category] || "bg-stone-300"
                  }`} />

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2.5 py-0.5 text-[11px] font-body rounded-full border ${categoryColors[article.category]}`}>
                        {article.category}
                      </span>
                      <span className="text-[11px] text-stone-400 font-body capitalize">{article.difficulty}</span>
                    </div>

                    <Link href={`/blog/${article.slug}?tab=cheatsheet`}>
                      <h2 className="font-display text-lg font-semibold text-stone-800 mb-3 group-hover:text-olive-700 transition-colors">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="font-body text-xs text-stone-400 line-clamp-2 mb-4">
                      {article.tldr || article.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${article.slug}?tab=cheatsheet`}
                        className="text-xs text-olive-600 hover:text-olive-700 font-body font-medium"
                      >
                        View cheat sheet &rarr;
                      </Link>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(article.cheat_sheet || "");
                        }}
                        className="text-xs text-stone-400 hover:text-stone-600 font-body"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
