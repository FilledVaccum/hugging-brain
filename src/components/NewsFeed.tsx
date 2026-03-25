"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { newsItems, categories } from "@/data/news";
import NewsCard from "./NewsCard";

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const featured = newsItems.filter((n) => n.featured);
  const filtered =
    activeCategory === "All"
      ? newsItems.filter((n) => !n.featured)
      : newsItems.filter((n) => n.category === activeCategory && !n.featured);

  return (
    <section id="news" className="relative py-24 md:py-32">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-body text-xs tracking-[0.2em] uppercase text-olive-500 mb-3 block">
            Latest Intelligence
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            What&apos;s shaping AI
          </h2>
          <div className="organic-line w-24 mt-4" />
        </motion.div>

        {/* Featured cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {featured.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} featured />
          ))}
        </div>

        {/* Category filter */}
        <div id="categories" className="mb-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-body tracking-wide transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-stone-800 text-warm-50 border-stone-800"
                  : "bg-transparent text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-stone-400 font-body py-16 text-lg"
          >
            No articles in this category yet. Check back soon.
          </motion.p>
        )}
      </div>
    </section>
  );
}
