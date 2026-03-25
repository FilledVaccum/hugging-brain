"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Article } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  LLM: "bg-olive-100 text-olive-700",
  VLM: "bg-clay-100 text-clay-700",
  GenAI: "bg-sand-100 text-sand-700",
  "Agentic AI": "bg-sage-100 text-sage-700",
  Research: "bg-stone-100 text-stone-600",
  "Open Source": "bg-olive-50 text-olive-600",
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

export default function FirstPrinciplesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=100")
      .then((r) => r.json())
      .then((data) => {
        const fpArticles = (data.articles || []).filter(
          (a: Article) => a.tags?.includes("first-principles")
        );
        setArticles(fpArticles);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 max-w-3xl"
          >
            <span className="font-body text-xs tracking-[0.2em] uppercase text-olive-500 mb-3 block">
              Deep Understanding
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-stone-800 mb-5 leading-tight">
              First Principles
            </h1>
            <p className="font-body text-lg text-stone-500 leading-relaxed">
              Complex AI concepts broken down to their fundamental building blocks.
              No hand-waving, no jargon soup — just clear thinking from the ground up.
              The way Feynman would explain it.
            </p>
            <div className="organic-line w-24 mt-8" />
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {[
              {
                step: "01",
                title: "Identify the building blocks",
                desc: "Every complex concept is built from simpler ones. We find the atomic units of understanding.",
              },
              {
                step: "02",
                title: "Build up layer by layer",
                desc: "Each idea connects to the next. No leaps of faith — every step follows logically from the previous.",
              },
              {
                step: "03",
                title: "Arrive at the aha moment",
                desc: "When you understand the fundamentals, the complex concept becomes obvious. That's the goal.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-6 bg-white/60 border border-stone-200/50 rounded-2xl"
              >
                <span className="font-display text-4xl font-bold text-stone-800/[0.06] absolute top-4 right-5">
                  {item.step}
                </span>
                <h3 className="font-display text-base font-semibold text-stone-800 mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Articles */}
          {loading ? (
            <div className="py-16 text-center font-body text-stone-400 animate-pulse">
              Loading first principles articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-olive-100/60 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6d7a3b" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="font-display text-2xl font-semibold text-stone-800 mb-2">
                Coming soon
              </p>
              <p className="font-body text-stone-400 max-w-md mx-auto">
                First principles articles are being crafted. Subscribe to get notified when they launch.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white/60 border border-stone-200/50 rounded-2xl p-8 card-hover"
                >
                  <div className="grid md:grid-cols-[1fr,200px] gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2.5 py-0.5 text-[11px] font-body tracking-wider rounded-full ${categoryColors[article.category]}`}>
                          {article.category}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[11px] font-body tracking-wider rounded-full capitalize ${difficultyColors[article.difficulty]}`}>
                          {article.difficulty}
                        </span>
                        <span className="text-[11px] text-stone-400 font-body">{article.read_time} min read</span>
                      </div>

                      <Link href={`/blog/${article.slug}`}>
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-stone-800 mb-3 leading-snug group-hover:text-olive-700 transition-colors">
                          {article.title}
                        </h2>
                      </Link>

                      <p className="font-body text-stone-500 leading-relaxed mb-4">
                        {article.summary}
                      </p>

                      {article.tags && article.tags.length > 1 && (
                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.filter(t => t !== "first-principles").map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[10px] font-body">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hidden md:flex flex-col items-end justify-between">
                      {article.published_at && (
                        <span className="font-body text-xs text-stone-400">
                          {new Date(article.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <Link
                        href={`/blog/${article.slug}`}
                        className="px-5 py-2 bg-stone-100 text-stone-600 rounded-lg text-sm font-body hover:bg-olive-100 hover:text-olive-700 transition-colors"
                      >
                        Read &rarr;
                      </Link>
                    </div>
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
