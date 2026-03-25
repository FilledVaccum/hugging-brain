"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/dump", label: "Content Dump", icon: "upload" },
  { href: "/admin/first-principles", label: "First Principles", icon: "layers" },
  { href: "/admin/articles", label: "Articles", icon: "file" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "users" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    ),
    upload: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
    ),
    file: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    ),
    layers: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    ),
  };
  return icons[icon] || null;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if already authenticated by making a test request
    fetch("/api/settings")
      .then((r) => {
        setAuthenticated(r.ok);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="animate-pulse font-body text-stone-400">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-olive-400 to-sage-600 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-warm-50">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 6c-2.5 0-4 1.5-4 3.5 0 1.5 1 2.5 2 3l-1 5.5h6l-1-5.5c1-.5 2-1.5 2-3C16 7.5 14.5 6 12 6z" fill="currentColor" opacity="0.9"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold text-stone-800">Admin Access</h1>
            <p className="font-body text-sm text-stone-400 mt-1">Hugging Brain Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-5 py-3 bg-white border border-stone-200 rounded-xl font-body text-sm focus:outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-400/30"
            />
            {error && <p className="text-red-500 text-sm font-body">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-stone-800 text-warm-50 rounded-xl font-body text-sm hover:bg-stone-700 transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-stone-400 hover:text-olive-600 font-body">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-800 text-stone-300 flex flex-col fixed h-full">
        <div className="p-6 border-b border-stone-700/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-olive-400 to-sage-600 flex items-center justify-center">
              <span className="text-warm-50 text-xs font-bold">HB</span>
            </div>
            <span className="font-display text-lg font-semibold text-warm-100">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors ${
                pathname === item.href
                  ? "bg-olive-500/20 text-olive-300"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-700/50"
              }`}
            >
              <NavIcon icon={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-700/50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body text-stone-400 hover:text-stone-200 hover:bg-stone-700/50 transition-colors"
          >
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body text-stone-400 hover:text-red-300 hover:bg-stone-700/50 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
