"use client";

import { motion } from "framer-motion";
import { NewsItem } from "@/data/news";

const categoryColors: Record<string, string> = {
  LLM: "bg-olive-100 text-olive-700 border-olive-200",
  VLM: "bg-clay-100 text-clay-700 border-clay-200",
  GenAI: "bg-sand-100 text-sand-700 border-sand-200",
  "Agentic AI": "bg-sage-100 text-sage-700 border-sage-200",
  Research: "bg-stone-100 text-stone-600 border-stone-200",
  "Open Source": "bg-olive-50 text-olive-600 border-olive-200",
};

interface NewsCardProps {
  item: NewsItem;
  index: number;
  featured?: boolean;
}

export default function NewsCard({
  item,
  index,
  featured = false,
}: NewsCardProps) {
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="group relative bg-warm-100/50 border border-stone-200/60 rounded-[2rem] p-8 md:p-10 card-hover overflow-hidden"
      >
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-olive-100/40 to-transparent rounded-bl-[4rem]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`px-3 py-1 text-xs font-body tracking-wider rounded-full border ${
                categoryColors[item.category] || "bg-stone-100 text-stone-600"
              }`}
            >
              {item.category}
            </span>
            <span className="text-xs text-stone-400 font-body">
              {item.readTime} read
            </span>
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-semibold text-stone-800 mb-4 leading-tight group-hover:text-olive-700 transition-colors duration-300">
            {item.title}
          </h3>

          <p className="font-body text-stone-500 leading-relaxed mb-6 text-base">
            {item.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                <span className="text-[10px] font-body text-stone-500">
                  {item.source[0]}
                </span>
              </div>
              <span className="text-sm text-stone-400 font-body">
                {item.source}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-body">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group bg-white/60 border border-stone-200/50 rounded-2xl p-6 card-hover"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-2.5 py-0.5 text-[11px] font-body tracking-wider rounded-full border ${
            categoryColors[item.category] || "bg-stone-100 text-stone-600"
          }`}
        >
          {item.category}
        </span>
        <span className="text-[11px] text-stone-400 font-body">
          {item.readTime}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-stone-800 mb-3 leading-snug group-hover:text-olive-700 transition-colors duration-300">
        {item.title}
      </h3>

      <p className="font-body text-sm text-stone-500 leading-relaxed mb-4 line-clamp-3">
        {item.summary}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400 font-body">{item.source}</span>
        <span className="text-xs text-stone-400 font-body">
          {new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </motion.article>
  );
}
