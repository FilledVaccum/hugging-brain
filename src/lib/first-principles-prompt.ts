export const FIRST_PRINCIPLES_SYSTEM = `You are Hugging Brain's First Principles educator. You break down complex AI/ML concepts to their absolute fundamentals — the way Feynman would explain physics.

Your approach:
1. Start from the most basic building block — what is the simplest truth we know?
2. Build up layer by layer — each step logically follows from the previous
3. Use analogies from everyday life to make abstract concepts tangible
4. Show WHY things work, not just WHAT they do
5. Include visual mental models — describe diagrams the reader should imagine
6. Challenge common misconceptions explicitly
7. End with the "aha moment" — connect back to the complex concept with new clarity

Write for engineers who are smart but may not have deep ML backgrounds. Be rigorous but never boring. Use markdown formatting.`;

export function buildFirstPrinciplesBlogPrompt(
  topic: string,
  targetAudience: string,
  depth: string,
  additionalContext: string
): string {
  return `Create a First Principles blog post about: "${topic}"

Target audience: ${targetAudience}
Depth level: ${depth}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Generate a JSON response with EXACTLY this structure (no markdown code fences around the JSON):
{
  "title": "A compelling title that signals 'first principles thinking' — e.g., 'Attention Is All You Need... But Why? Building Transformers from Scratch'",
  "slug": "url-friendly-slug",
  "summary": "2-3 sentence hook that makes someone want to understand this from the ground up",
  "content": "Full blog post in markdown. Structure it as:\\n\\n## The Question\\n(What are we trying to understand? Frame the problem)\\n\\n## Starting From Zero\\n(The most fundamental building block — explain like the reader knows nothing about this specific topic)\\n\\n## Building Block 1: [Name]\\n(First principle, with analogy)\\n\\n## Building Block 2: [Name]\\n(Second principle, building on the first)\\n\\n## Building Block 3: [Name]\\n(Continue building up)\\n\\n## Putting It All Together\\n(How the blocks combine into the full concept)\\n\\n## The Aha Moment\\n(The insight that makes everything click)\\n\\n## Common Misconceptions\\n(What people get wrong and why)\\n\\n## Where To Go From Here\\n(Next steps for deeper understanding)\\n\\nAim for 1500-2500 words. Use code snippets where they clarify (Python preferred). Include mathematical intuition but avoid unnecessary formalism.",
  "cheat_sheet": "A visual-style cheat sheet: the concept broken into its first principles as a numbered list, with one-line explanations for each. Include a 'mental model' section. Max 400 words.",
  "twitter_thread": "A 7-10 tweet thread that walks through the first principles breakdown. Start with a hook. Each tweet builds on the last. Technical but accessible. Prefix each with number (1/, 2/, etc).",
  "linkedin_post": "Professional LinkedIn post about this first principles breakdown. 200-300 words. Position it as 'I spent time understanding X from scratch, here's what I learned.' Format with line breaks.",
  "tldr": "2-3 sentences: what the concept is, what the key first principle is, and why understanding it this way matters.",
  "category": "One of: LLM, VLM, GenAI, Agentic AI, Research, Open Source",
  "difficulty": "One of: beginner, intermediate, advanced",
  "tags": ["first-principles", "plus", "other", "relevant", "tags"],
  "read_time": 12,
  "building_blocks": ["Array of the core first principles/building blocks identified, as short phrases"]
}

IMPORTANT: Return ONLY valid JSON. No markdown fences, no explanation outside the JSON.`;
}

export const SUGGESTED_TOPICS = [
  {
    category: "LLM",
    topics: [
      "How do Transformers actually work? (Attention from scratch)",
      "Why do LLMs hallucinate? (The probabilistic nature of generation)",
      "Tokenization: Why AI doesn't see words the way we do",
      "What is fine-tuning really doing to a neural network?",
      "Context windows: Why can't LLMs remember everything?",
      "Temperature, top-k, top-p: The math of controlled randomness",
      "RLHF: How human preferences shape AI behavior",
      "Mixture of Experts: How to run a huge model cheaply",
      "KV Cache: Why inference speed depends on memory tricks",
      "Quantization: Trading precision for speed",
    ],
  },
  {
    category: "VLM",
    topics: [
      "How do Vision-Language Models see images? (CLIP from first principles)",
      "Why is visual grounding so hard for AI?",
      "From pixels to understanding: The visual encoding pipeline",
      "Multimodal alignment: Teaching AI to connect what it sees and reads",
    ],
  },
  {
    category: "GenAI",
    topics: [
      "Diffusion models: Why adding noise helps create images",
      "Latent spaces: The hidden universe inside generative models",
      "How does Stable Diffusion turn text into images?",
      "VAEs vs GANs vs Diffusion: Three philosophies of generation",
      "CFG (Classifier-Free Guidance): Steering generation with math",
    ],
  },
  {
    category: "Agentic AI",
    topics: [
      "What makes an AI 'agentic'? (Beyond simple prompt-response)",
      "Tool use: How AI learns to call functions",
      "Planning in AI agents: From ReAct to tree search",
      "Memory systems for agents: Short-term, long-term, and working memory",
      "Multi-agent systems: When AIs need to cooperate",
      "The agent loop: Observe, think, act, reflect",
    ],
  },
  {
    category: "Research",
    topics: [
      "Backpropagation: The algorithm that makes learning possible",
      "Why do neural networks generalize? (The mystery of deep learning)",
      "Scaling laws: Why bigger models are predictably better",
      "Emergent abilities: When quantity becomes quality",
      "The bitter lesson: Why compute beats clever algorithms",
    ],
  },
];
