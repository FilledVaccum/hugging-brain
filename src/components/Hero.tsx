"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Organic blob top-right */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-32 w-96 h-96 bg-gradient-to-br from-olive-200/40 to-sage-200/30 blob-shape"
        />
        {/* Organic blob bottom-left */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-clay-100/30 to-sand-200/20 blob-shape-2"
        />
        {/* Small floating circles */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] w-4 h-4 rounded-full bg-olive-300/40"
        />
        <motion.div
          animate={{ y: [10, -15, 10] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/3 right-[20%] w-6 h-6 rounded-full bg-clay-300/30"
        />
        <motion.div
          animate={{ y: [-8, 12, -8] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-1/3 left-[60%] w-3 h-3 rounded-full bg-sage-300/50"
        />

        {/* Hand-drawn SVG decorative line */}
        <svg
          className="absolute top-[40%] left-0 w-full opacity-[0.06]"
          height="100"
          viewBox="0 0 1200 100"
          fill="none"
        >
          <path
            d="M0 50 C200 20, 400 80, 600 50 C800 20, 1000 80, 1200 50"
            stroke="#6d7a3b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="inline-block px-4 py-1.5 mb-8 text-xs font-body tracking-[0.2em] uppercase text-olive-600 bg-olive-100/60 rounded-full border border-olive-200/50">
            Intelligence for the AI era
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-stone-800 mb-8"
        >
          Stay ahead in the
          <br />
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-olive-600 via-sage-600 to-clay-500 bg-clip-text text-transparent">
              AI revolution
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="8"
              viewBox="0 0 300 8"
              fill="none"
            >
              <path
                d="M1 5.5 C50 1, 100 7, 150 4 C200 1, 250 6, 299 3"
                stroke="#8b9a4e"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-body text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Curated insights on Large Language Models, Vision-Language Models,
          Generative AI, and Agentic AI — distilled for engineers who build the
          future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.45,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#news"
            className="group relative px-8 py-4 bg-stone-800 text-warm-50 rounded-full font-body text-sm tracking-wide overflow-hidden transition-all duration-500 hover:shadow-warm-lg"
          >
            <span className="relative z-10">Explore the feed</span>
            <div className="absolute inset-0 bg-gradient-to-r from-olive-600 to-sage-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </a>
          <a
            href="#newsletter"
            className="px-8 py-4 border border-stone-300 text-stone-600 rounded-full font-body text-sm tracking-wide hover:border-olive-400 hover:text-olive-700 transition-all duration-300"
          >
            Get weekly digest
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 flex items-center justify-center gap-12 md:gap-20"
        >
          {[
            { number: "500+", label: "Articles curated" },
            { number: "12K+", label: "Engineers reading" },
            { number: "6", label: "AI domains covered" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-semibold text-stone-700">
                {stat.number}
              </div>
              <div className="font-body text-xs text-stone-400 mt-1 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
