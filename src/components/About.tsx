"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 organic-line" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: decorative visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Layered organic shapes */}
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-olive-200/50 to-sage-200/30 blob-shape"
              />
              <motion.div
                animate={{ rotate: [0, -3, 0] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute inset-6 bg-gradient-to-tr from-clay-100/60 to-sand-100/40 blob-shape-2"
              />
              <div className="absolute inset-12 bg-warm-50 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="font-display text-5xl font-bold text-stone-800 mb-2">
                    HB
                  </div>
                  <div className="font-body text-sm text-stone-500 leading-relaxed">
                    Curating the signal
                    <br />
                    from the noise
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-body text-xs tracking-[0.2em] uppercase text-olive-500 mb-3 block">
              About Hugging Brain
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              Built by engineers,
              <br />
              for engineers
            </h2>

            <div className="space-y-5 font-body text-stone-500 leading-relaxed">
              <p>
                The AI landscape moves at breakneck speed. New models drop
                weekly, research papers pile up, and frameworks evolve overnight.
                Hugging Brain exists to cut through the noise.
              </p>
              <p>
                We curate the most impactful developments across LLMs,
                Vision-Language Models, Generative AI, and Agentic AI —
                distilling complex research into actionable insights for
                engineers building production systems.
              </p>
              <p>
                Whether you&apos;re fine-tuning foundation models, building
                multi-agent systems, or deploying vision pipelines, Hugging
                Brain keeps you informed on what actually matters.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">
                {["#8b9a4e", "#e27338", "#587d58", "#9b9479"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-warm-50"
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
              <span className="font-body text-sm text-stone-400">
                Join 12,000+ engineers staying ahead
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
