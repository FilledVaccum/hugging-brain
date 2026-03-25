import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hugging Brain — AI Intelligence for Engineers",
  description:
    "Stay ahead in the AI revolution. Curated insights on LLMs, VLMs, Generative AI, and Agentic AI — distilled for engineers who build the future.",
  keywords: [
    "AI news",
    "LLM",
    "VLM",
    "GenAI",
    "Agentic AI",
    "machine learning",
    "deep learning",
    "AI engineering",
  ],
  openGraph: {
    title: "Hugging Brain — AI Intelligence for Engineers",
    description:
      "Curated insights on LLMs, VLMs, GenAI, and Agentic AI for engineers.",
    siteName: "Hugging Brain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
