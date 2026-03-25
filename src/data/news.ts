export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: "LLM" | "VLM" | "GenAI" | "Agentic AI" | "Research" | "Open Source";
  source: string;
  date: string;
  readTime: string;
  url: string;
  featured?: boolean;
}

export const categories = [
  "All",
  "LLM",
  "VLM",
  "GenAI",
  "Agentic AI",
  "Research",
  "Open Source",
] as const;

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Claude 4.5 Sonnet Sets New Benchmarks in Reasoning and Code Generation",
    summary:
      "Anthropic releases Claude 4.5 Sonnet with significant improvements in complex reasoning, mathematical problem-solving, and multi-file code generation. The model shows 40% improvement on SWE-bench.",
    category: "LLM",
    source: "Anthropic Blog",
    date: "2026-03-24",
    readTime: "4 min",
    url: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Google DeepMind Unveils Gemini Ultra 2.0 with Native Multimodal Understanding",
    summary:
      "The latest Gemini model processes video, audio, and text simultaneously with unprecedented coherence. Early benchmarks show state-of-the-art performance on multimodal reasoning tasks.",
    category: "VLM",
    source: "Google AI Blog",
    date: "2026-03-23",
    readTime: "6 min",
    url: "#",
    featured: true,
  },
  {
    id: "3",
    title: "OpenAI Introduces Operator Framework for Multi-Agent Orchestration",
    summary:
      "A new open-source framework from OpenAI enables developers to build, deploy, and manage systems of AI agents that collaborate on complex tasks with built-in safety guardrails.",
    category: "Agentic AI",
    source: "OpenAI Research",
    date: "2026-03-22",
    readTime: "5 min",
    url: "#",
    featured: true,
  },
  {
    id: "4",
    title: "Meta Releases Llama 4 Scout and Maverick: Open Weights Models with 10M Context",
    summary:
      "Meta's latest open-weight models push the boundaries of context length to 10 million tokens while maintaining competitive performance on standard benchmarks.",
    category: "Open Source",
    source: "Meta AI",
    date: "2026-03-21",
    readTime: "5 min",
    url: "#",
  },
  {
    id: "5",
    title: "Diffusion Transformers Achieve Real-Time 4K Video Generation",
    summary:
      "A breakthrough in diffusion transformer architectures enables generating photorealistic 4K video at interactive frame rates, opening new possibilities for content creation.",
    category: "GenAI",
    source: "arXiv",
    date: "2026-03-20",
    readTime: "7 min",
    url: "#",
  },
  {
    id: "6",
    title: "Anthropic Publishes Constitutional AI v2 Safety Research",
    summary:
      "New research from Anthropic demonstrates how constitutional AI principles can be extended to agentic systems, ensuring safe tool use and decision-making in autonomous agents.",
    category: "Research",
    source: "Anthropic Research",
    date: "2026-03-19",
    readTime: "8 min",
    url: "#",
  },
  {
    id: "7",
    title: "Microsoft Copilot Workspace Integrates Multi-Agent Planning",
    summary:
      "Microsoft launches an updated Copilot Workspace that uses multiple specialized AI agents to plan, implement, and review code changes across entire repositories.",
    category: "Agentic AI",
    source: "Microsoft Dev Blog",
    date: "2026-03-18",
    readTime: "4 min",
    url: "#",
  },
  {
    id: "8",
    title: "Hugging Face Launches SmolVLM-2: Efficient Vision-Language Models for Edge",
    summary:
      "A new family of compact vision-language models that run efficiently on mobile devices while maintaining strong performance on visual question answering and image understanding.",
    category: "VLM",
    source: "Hugging Face Blog",
    date: "2026-03-17",
    readTime: "5 min",
    url: "#",
  },
  {
    id: "9",
    title: "DeepSeek-R2 Pushes Open Source Reasoning to New Heights",
    summary:
      "DeepSeek releases R2 with chain-of-thought reasoning capabilities that rival proprietary models, sparking renewed interest in open-source AI development.",
    category: "Open Source",
    source: "DeepSeek",
    date: "2026-03-16",
    readTime: "6 min",
    url: "#",
  },
  {
    id: "10",
    title: "New Benchmark Suite Measures AI Agent Reliability in Production",
    summary:
      "Researchers introduce AgentBench-Pro, a comprehensive benchmark for evaluating AI agents on real-world tasks including error recovery, tool reliability, and multi-step planning accuracy.",
    category: "Research",
    source: "arXiv",
    date: "2026-03-15",
    readTime: "9 min",
    url: "#",
  },
  {
    id: "11",
    title: "Stability AI Releases Stable Diffusion 4 with Native Video Support",
    summary:
      "The latest Stable Diffusion model unifies image and video generation in a single architecture, with community-driven fine-tuning support from day one.",
    category: "GenAI",
    source: "Stability AI",
    date: "2026-03-14",
    readTime: "4 min",
    url: "#",
  },
  {
    id: "12",
    title: "Mixture of Experts Architecture Reduces LLM Inference Costs by 70%",
    summary:
      "A new sparse MoE technique allows running 400B parameter models at the cost of 70B, making frontier capabilities accessible to smaller teams and organizations.",
    category: "LLM",
    source: "arXiv",
    date: "2026-03-13",
    readTime: "7 min",
    url: "#",
  },
];
