"use client";

import { motion } from "framer-motion";

const domains = [
  {
    name: "Large Language Models",
    abbr: "LLM",
    description:
      "Foundation models, fine-tuning techniques, prompting strategies, and inference optimization.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 12h16M8 16h12M8 20h14M8 8h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "from-olive-200/60 to-olive-100/30",
    borderColor: "border-olive-200/60",
  },
  {
    name: "Vision-Language Models",
    abbr: "VLM",
    description:
      "Multimodal understanding, image-text alignment, visual reasoning, and document AI.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.4" />
        <path
          d="M16 6v2M16 24v2M6 16h2M24 16h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "from-clay-200/60 to-clay-100/30",
    borderColor: "border-clay-200/60",
  },
  {
    name: "Generative AI",
    abbr: "GenAI",
    description:
      "Image, video, audio, and 3D generation. Diffusion models, GANs, and creative AI tools.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M12 8l4 8-4 8M20 8l-4 8 4 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-sand-200/60 to-sand-100/30",
    borderColor: "border-sand-200/60",
  },
  {
    name: "Agentic AI",
    abbr: "Agents",
    description:
      "Autonomous agents, tool use, multi-agent systems, planning, and real-world task execution.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="10"
          y="10"
          width="12"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 6v4M16 22v4M6 16h4M22 16h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "from-sage-200/60 to-sage-100/30",
    borderColor: "border-sage-200/60",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 organic-line" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 border border-stone-200/30 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.2em] uppercase text-olive-500 mb-3 block">
            Domains We Cover
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Four pillars of modern AI
          </h2>
          <p className="font-body text-stone-500 max-w-xl mx-auto">
            Deep, curated coverage across the domains that matter most to AI
            engineers building production systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {domains.map((domain, i) => (
            <motion.div
              key={domain.abbr}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`group relative p-8 md:p-10 rounded-[2rem] border ${domain.borderColor} bg-gradient-to-br ${domain.color} card-hover overflow-hidden`}
            >
              <div className="absolute top-6 right-6 font-display text-6xl font-bold text-stone-800/[0.04]">
                {domain.abbr}
              </div>

              <div className="text-stone-600 mb-5 group-hover:text-stone-800 transition-colors">
                {domain.icon}
              </div>

              <h3 className="font-display text-xl font-semibold text-stone-800 mb-3">
                {domain.name}
              </h3>

              <p className="font-body text-stone-500 leading-relaxed text-sm">
                {domain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
