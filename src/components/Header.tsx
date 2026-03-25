"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { href: "#news", label: "News Feed" },
  { href: "#categories", label: "Categories" },
  { href: "#newsletter", label: "Newsletter" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-warm-50/80 border-b border-stone-200/50"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-olive-400 to-sage-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-warm-50"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 6c-2.5 0-4 1.5-4 3.5 0 1.5 1 2.5 2 3l-1 5.5h6l-1-5.5c1-.5 2-1.5 2-3C16 7.5 14.5 6 12 6z"
                fill="currentColor"
                opacity="0.9"
              />
              <circle cx="10" cy="9" r="0.8" fill="var(--background)" />
              <circle cx="14" cy="9" r="0.8" fill="var(--background)" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-stone-800">
            Hugging Brain
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-500 hover:text-stone-800 transition-colors duration-300 text-sm font-body tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#newsletter"
            className="bg-olive-500 text-warm-50 px-5 py-2 rounded-full text-sm font-medium hover:bg-olive-600 transition-all duration-300 hover:shadow-warm"
          >
            Subscribe
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-stone-700"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-stone-700"
          />
          <motion.span
            animate={
              mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
            }
            className="block w-6 h-0.5 bg-stone-700"
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-warm-50/95 backdrop-blur-lg border-b border-stone-200/50"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-stone-600 hover:text-stone-800 font-body text-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
