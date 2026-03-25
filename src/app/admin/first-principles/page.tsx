"use client";

import { useState } from "react";
import { SUGGESTED_TOPICS } from "@/lib/first-principles-prompt";

const audiences = [
  "AI engineers with general CS background",
  "Software engineers new to ML",
  "Data scientists moving into LLMs",
  "Technical leaders evaluating AI",
  "Students learning ML fundamentals",
];

const depths = [
  { value: "beginner", label: "Beginner", desc: "No prior ML knowledge assumed" },
  { value: "intermediate", label: "Intermediate", desc: "Knows basics, wants deeper understanding" },
  { value: "advanced", label: "Advanced", desc: "Experienced, wants rigorous breakdown" },
];

export default function FirstPrinciplesCreator() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState(audiences[0]);
  const [depth, setDepth] = useState("intermediate");
  const [additionalContext, setAdditionalContext] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success?: boolean;
    article?: { id: string; title: string; slug: string };
    buildingBlocks?: string[];
    error?: string;
    raw?: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/first-principles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, targetAudience: audience, depth, additionalContext }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, article: data.article, buildingBlocks: data.buildingBlocks });
        setTopic("");
        setAdditionalContext("");
      } else {
        setResult({ error: data.error, raw: data.raw });
      }
    } catch (err) {
      setResult({ error: `Failed: ${err}` });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">First Principles Creator</h1>
        <p className="font-body text-stone-500 mt-1">
          Generate deep, educational blogs that break down AI concepts from their fundamental building blocks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Creator form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic input */}
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">
              Topic / Concept
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How do Transformers actually work?"
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">
              Target Audience
            </label>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-4 py-2 rounded-full text-xs font-body border transition-all ${
                    audience === a
                      ? "bg-stone-800 text-warm-50 border-stone-800"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Depth */}
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">
              Depth Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {depths.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDepth(d.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    depth === d.value
                      ? "border-olive-500 bg-olive-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="font-body text-sm font-semibold text-stone-800">{d.label}</div>
                  <p className="font-body text-[11px] text-stone-400 mt-1">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Additional context */}
          <div>
            <label className="block font-body text-sm font-medium text-stone-700 mb-2">
              Additional Context (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any specific angle, comparison, or focus you want..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30 resize-y"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={processing || !topic.trim()}
            className={`px-8 py-3.5 rounded-xl font-body text-sm transition-all ${
              processing || !topic.trim()
                ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-gradient-to-r from-olive-500 to-sage-600 text-warm-50 hover:shadow-warm-lg"
            }`}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Building from first principles...
              </span>
            ) : (
              "Generate First Principles Blog"
            )}
          </button>

          {/* Result */}
          {result && (
            <div className={`p-6 rounded-xl border ${
              result.success ? "bg-olive-50 border-olive-200" : "bg-red-50 border-red-200"
            }`}>
              {result.success ? (
                <div>
                  <h3 className="font-display text-lg font-semibold text-olive-800 mb-2">
                    Blog created!
                  </h3>
                  <p className="font-body text-sm text-olive-700 mb-3">
                    &ldquo;{result.article?.title}&rdquo;
                  </p>
                  {result.buildingBlocks && result.buildingBlocks.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body text-xs font-medium text-olive-600 mb-2">Building Blocks Identified:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.buildingBlocks.map((block, i) => (
                          <span key={i} className="px-3 py-1 bg-olive-100 text-olive-700 rounded-full text-xs font-body">
                            {i + 1}. {block}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <a
                    href={`/admin/articles/${result.article?.id}`}
                    className="inline-block px-5 py-2 bg-olive-500 text-warm-50 rounded-lg text-sm font-body hover:bg-olive-600 transition-colors"
                  >
                    Review & Edit Blog
                  </a>
                </div>
              ) : (
                <div>
                  <h3 className="font-display text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
                  <p className="font-body text-sm text-red-700">{result.error}</p>
                  {result.raw && (
                    <details className="mt-3">
                      <summary className="text-xs text-red-500 cursor-pointer">Raw AI Response</summary>
                      <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap bg-red-100 p-3 rounded-lg">{result.raw}</pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Topic suggestions */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-stone-800">Topic Ideas</h2>
          <p className="font-body text-xs text-stone-400">Click any topic to use it</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {SUGGESTED_TOPICS.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`px-3 py-1 rounded-full text-xs font-body border transition-all ${
                  activeCategory === cat.category
                    ? "bg-stone-800 text-warm-50 border-stone-800"
                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {SUGGESTED_TOPICS
              .filter((cat) => !activeCategory || cat.category === activeCategory)
              .map((cat) =>
                cat.topics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="w-full text-left p-3 bg-white border border-stone-200/60 rounded-xl hover:border-olive-300 hover:bg-olive-50/30 transition-all group"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-body">{cat.category}</span>
                    <p className="font-body text-sm text-stone-700 group-hover:text-olive-700 mt-0.5 leading-snug">
                      {t}
                    </p>
                  </button>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
