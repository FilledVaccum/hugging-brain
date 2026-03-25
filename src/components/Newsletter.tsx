"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="newsletter" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-stone-800 to-stone-900 rounded-[2.5rem] p-10 md:p-16 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-olive-500/10 blob-shape" />
            <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-clay-500/5 blob-shape-2" />
            <svg
              className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
              viewBox="0 0 800 400"
            >
              <path
                d="M0 200 Q200 100 400 200 Q600 300 800 200"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M0 250 Q200 150 400 250 Q600 350 800 250"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-body tracking-[0.2em] uppercase text-olive-300 bg-olive-500/10 rounded-full border border-olive-500/20">
              Weekly Digest
            </span>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-warm-100 mb-5 leading-tight">
              Never miss a
              <br />
              breakthrough
            </h2>

            <p className="font-body text-stone-400 mb-10 text-lg leading-relaxed">
              Get the most important AI developments delivered to your inbox
              every Monday morning. Curated by engineers, for engineers.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-olive-500/20 border border-olive-500/30 rounded-2xl p-6"
              >
                <p className="font-display text-xl text-olive-300 mb-2">
                  Welcome aboard!
                </p>
                <p className="font-body text-stone-400 text-sm">
                  Check your inbox for a confirmation email.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-warm-100 placeholder:text-stone-500 font-body text-sm focus:outline-none focus:border-olive-500/50 focus:ring-1 focus:ring-olive-500/30 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-olive-500 text-warm-50 rounded-full font-body text-sm tracking-wide hover:bg-olive-400 transition-all duration-300 hover:shadow-lg hover:shadow-olive-500/20 whitespace-nowrap"
                >
                  Subscribe free
                </button>
              </form>
            )}

            <p className="mt-6 text-xs text-stone-500 font-body">
              No spam. Unsubscribe anytime. Read by 12,000+ engineers weekly.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
