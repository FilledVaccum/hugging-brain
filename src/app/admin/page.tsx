"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  articles: { total: number; published: number; drafts: number };
  subscribers: { total: number; active: number; pending: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const [articlesRes, subsRes] = await Promise.all([
        fetch("/api/articles?limit=1000"),
        fetch("/api/admin/subscribers"),
      ]);

      const articlesData = await articlesRes.json();
      const subsData = await subsRes.json();

      const articles = articlesData.articles || [];
      setStats({
        articles: {
          total: articles.length,
          published: articles.filter((a: { status: string }) => a.status === "published").length,
          drafts: articles.filter((a: { status: string }) => a.status === "draft").length,
        },
        subscribers: subsData.stats || { total: 0, active: 0, pending: 0 },
      });
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Dashboard</h1>
        <p className="font-body text-stone-500 mt-1">Overview of Hugging Brain</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "Published Articles",
            value: stats?.articles.published ?? "-",
            color: "bg-olive-100 text-olive-700",
          },
          {
            label: "Draft Articles",
            value: stats?.articles.drafts ?? "-",
            color: "bg-sand-100 text-sand-700",
          },
          {
            label: "Active Subscribers",
            value: stats?.subscribers.active ?? "-",
            color: "bg-sage-100 text-sage-700",
          },
          {
            label: "Pending Confirms",
            value: stats?.subscribers.pending ?? "-",
            color: "bg-clay-100 text-clay-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-stone-200/60"
          >
            <p className="font-body text-sm text-stone-500 mb-2">{stat.label}</p>
            <p className="font-display text-3xl font-bold text-stone-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/dump"
          className="group bg-gradient-to-br from-olive-50 to-sage-50 border border-olive-200/60 rounded-2xl p-6 hover:shadow-warm transition-all"
        >
          <h3 className="font-display text-lg font-semibold text-stone-800 mb-2 group-hover:text-olive-700">
            Dump Content
          </h3>
          <p className="font-body text-sm text-stone-500">
            Paste arXiv papers, tweets, blogs, newsletters — AI will transform them into articles.
          </p>
        </Link>

        <Link
          href="/admin/articles"
          className="group bg-gradient-to-br from-sand-50 to-clay-50 border border-sand-200/60 rounded-2xl p-6 hover:shadow-warm transition-all"
        >
          <h3 className="font-display text-lg font-semibold text-stone-800 mb-2 group-hover:text-clay-700">
            Manage Articles
          </h3>
          <p className="font-body text-sm text-stone-500">
            Review, edit, and publish AI-generated articles.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="group bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200/60 rounded-2xl p-6 hover:shadow-warm transition-all"
        >
          <h3 className="font-display text-lg font-semibold text-stone-800 mb-2 group-hover:text-stone-600">
            AI Settings
          </h3>
          <p className="font-body text-sm text-stone-500">
            Toggle between Bedrock and Anthropic API, configure models.
          </p>
        </Link>
      </div>
    </div>
  );
}
