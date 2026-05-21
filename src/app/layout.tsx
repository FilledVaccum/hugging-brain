import type { Metadata } from "next";
import Script from "next/script";
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-JHY12LM9FZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JHY12LM9FZ');
        `}
      </Script>
      <body className="antialiased">{children}</body>
    </html>
  );
}
