"use client";

import { useState, useEffect } from "react";
import type { Subscriber } from "@/lib/supabase";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setStats(data.stats || stats);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="py-12 text-center font-body text-stone-400 animate-pulse">Loading subscribers...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Subscribers</h1>
        <p className="font-body text-stone-500 mt-1">Manage your newsletter subscribers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-stone-800" },
          { label: "Active", value: stats.active, color: "text-olive-700" },
          { label: "Pending", value: stats.pending, color: "text-sand-700" },
          { label: "Unsubscribed", value: stats.unsubscribed, color: "text-stone-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200/60 p-4 text-center">
            <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="font-body text-xs text-stone-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {subscribers.length === 0 ? (
        <div className="py-12 text-center font-body text-stone-400">No subscribers yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200/60">
              <tr>
                <th className="text-left px-5 py-3 font-body text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 font-body text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-body text-xs font-medium text-stone-500 uppercase tracking-wider">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50/50">
                  <td className="px-5 py-3 font-body text-sm text-stone-800">{sub.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-body ${
                      sub.active && sub.confirmed
                        ? "bg-olive-100 text-olive-700"
                        : sub.active && !sub.confirmed
                        ? "bg-sand-100 text-sand-700"
                        : "bg-stone-100 text-stone-400"
                    }`}>
                      {sub.active && sub.confirmed ? "Active" : sub.active ? "Pending" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-body text-xs text-stone-400">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
