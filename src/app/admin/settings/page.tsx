"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {});
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const provider = (settings.ai_provider as string) || "bedrock";

  if (loading) {
    return <div className="py-12 text-center font-body text-stone-400 animate-pulse">Loading settings...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Settings</h1>
          <p className="font-body text-stone-500 mt-1">Configure AI provider and site settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-olive-500 text-warm-50 rounded-xl font-body text-sm hover:bg-olive-600 transition-colors"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* AI Provider Toggle */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">AI Provider</h2>
          <p className="font-body text-sm text-stone-500 mb-4">
            Choose which AI provider to use for content generation.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({ ...settings, ai_provider: "bedrock" })}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                provider === "bedrock"
                  ? "border-olive-500 bg-olive-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="font-display font-semibold text-stone-800 mb-1">AWS Bedrock</div>
              <p className="font-body text-xs text-stone-500">
                Uses IAM credentials. Best for AWS-native deployments.
              </p>
              {provider === "bedrock" && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-olive-500 text-warm-50 rounded text-[10px] font-body">
                  ACTIVE
                </span>
              )}
            </button>

            <button
              onClick={() => setSettings({ ...settings, ai_provider: "anthropic" })}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                provider === "anthropic"
                  ? "border-olive-500 bg-olive-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="font-display font-semibold text-stone-800 mb-1">Anthropic API</div>
              <p className="font-body text-xs text-stone-500">
                Direct API key. Simpler setup, works anywhere.
              </p>
              {provider === "anthropic" && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-olive-500 text-warm-50 rounded text-[10px] font-body">
                  ACTIVE
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Model Configuration</h2>

          {provider === "bedrock" ? (
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm font-medium text-stone-700 mb-2">
                  Bedrock Model ID
                </label>
                <input
                  value={(settings.bedrock_model_id as string) || ""}
                  onChange={(e) => setSettings({ ...settings, bedrock_model_id: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:border-olive-400"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-stone-700 mb-2">
                  AWS Region
                </label>
                <input
                  value={(settings.bedrock_region as string) || ""}
                  onChange={(e) => setSettings({ ...settings, bedrock_region: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:border-olive-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-body text-sm font-medium text-stone-700 mb-2">
                Anthropic Model ID
              </label>
              <input
                value={(settings.anthropic_model_id as string) || ""}
                onChange={(e) => setSettings({ ...settings, anthropic_model_id: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:border-olive-400"
              />
              <p className="mt-2 text-xs text-stone-400 font-body">
                Set ANTHROPIC_API_KEY in environment variables.
              </p>
            </div>
          )}
        </div>

        {/* Weekly Digest */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Weekly Digest</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-stone-700">Send day</p>
              <p className="font-body text-xs text-stone-400">Day of week for the weekly newsletter</p>
            </div>
            <select
              value={(settings.weekly_digest_day as string) || "monday"}
              onChange={(e) => setSettings({ ...settings, weekly_digest_day: e.target.value })}
              className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl font-body text-sm capitalize"
            >
              {["monday", "tuesday", "wednesday", "thursday", "friday"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button
            onClick={async () => {
              if (!confirm("Send weekly digest to all subscribers now?")) return;
              const res = await fetch("/api/send-digest", { method: "POST" });
              const data = await res.json();
              alert(data.message || data.error || `Sent to ${data.recipientCount} subscribers`);
            }}
            className="mt-4 px-5 py-2 bg-stone-100 text-stone-700 rounded-xl font-body text-sm hover:bg-stone-200 transition-colors"
          >
            Send Digest Now (Manual)
          </button>
        </div>
      </div>
    </div>
  );
}
