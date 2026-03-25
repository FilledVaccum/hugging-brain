"use client";

import { useState } from "react";

const sourceTypes = [
  { value: "arxiv", label: "arXiv Paper" },
  { value: "blog", label: "Blog Post" },
  { value: "tweet", label: "Tweet / X Thread" },
  { value: "newsletter", label: "Newsletter" },
  { value: "linkedin", label: "LinkedIn Post" },
  { value: "other", label: "Other" },
];

export default function ContentDump() {
  const [rawContent, setRawContent] = useState("");
  const [sourceType, setSourceType] = useState("other");
  const [sourceUrl, setSourceUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    article?: { id: string; title: string; slug: string };
    error?: string;
    raw?: string;
  } | null>(null);

  const handleProcess = async () => {
    if (!rawContent.trim()) return;

    setProcessing(true);
    setResult(null);

    try {
      // First create the dump record
      const dumpRes = await fetch("/api/admin/dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawContent, sourceType, sourceUrl }),
      });
      const dumpData = await dumpRes.json();

      // Then process it with AI
      const processRes = await fetch("/api/process-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent,
          sourceType,
          sourceUrl,
          dumpId: dumpData.dump?.id,
        }),
      });

      const processData = await processRes.json();

      if (processRes.ok) {
        setResult({
          success: true,
          article: processData.article,
        });
        setRawContent("");
        setSourceUrl("");
      } else {
        setResult({
          error: processData.error,
          raw: processData.raw,
        });
      }
    } catch (err) {
      setResult({ error: `Processing failed: ${err}` });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Content Dump</h1>
        <p className="font-body text-stone-500 mt-1">
          Paste raw content from any source — AI will transform it into a polished article package.
        </p>
      </div>

      <div className="max-w-4xl">
        {/* Source type selector */}
        <div className="mb-6">
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">
            Source Type
          </label>
          <div className="flex flex-wrap gap-2">
            {sourceTypes.map((st) => (
              <button
                key={st.value}
                onClick={() => setSourceType(st.value)}
                className={`px-4 py-2 rounded-full text-sm font-body border transition-all ${
                  sourceType === st.value
                    ? "bg-stone-800 text-warm-50 border-stone-800"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source URL */}
        <div className="mb-6">
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">
            Source URL (optional)
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://arxiv.org/abs/..."
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30"
          />
        </div>

        {/* Raw content */}
        <div className="mb-6">
          <label className="block font-body text-sm font-medium text-stone-700 mb-2">
            Raw Content
          </label>
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            placeholder="Paste the full content here — paper abstract, tweet thread, blog post, newsletter excerpt, LinkedIn post..."
            rows={16}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30 resize-y"
          />
          <p className="mt-2 text-xs text-stone-400 font-body">
            {rawContent.length} characters
          </p>
        </div>

        {/* Process button */}
        <button
          onClick={handleProcess}
          disabled={processing || !rawContent.trim()}
          className={`px-8 py-3 rounded-xl font-body text-sm transition-all ${
            processing || !rawContent.trim()
              ? "bg-stone-300 text-stone-500 cursor-not-allowed"
              : "bg-olive-500 text-warm-50 hover:bg-olive-600 hover:shadow-warm"
          }`}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing with AI...
            </span>
          ) : (
            "Process with AI"
          )}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-6 rounded-xl border ${
              result.success
                ? "bg-olive-50 border-olive-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {result.success ? (
              <div>
                <h3 className="font-display text-lg font-semibold text-olive-800 mb-2">
                  Article created!
                </h3>
                <p className="font-body text-sm text-olive-700 mb-3">
                  &ldquo;{result.article?.title}&rdquo;
                </p>
                <a
                  href={`/admin/articles/${result.article?.id}`}
                  className="inline-block px-5 py-2 bg-olive-500 text-warm-50 rounded-lg text-sm font-body hover:bg-olive-600 transition-colors"
                >
                  Review & Edit Article
                </a>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-semibold text-red-800 mb-2">
                  Processing Failed
                </h3>
                <p className="font-body text-sm text-red-700">{result.error}</p>
                {result.raw && (
                  <details className="mt-3">
                    <summary className="text-xs text-red-500 cursor-pointer">
                      Raw AI Response
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap bg-red-100 p-3 rounded-lg">
                      {result.raw}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
