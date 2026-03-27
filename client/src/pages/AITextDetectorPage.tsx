import AITextDetector from "@/components/AITextDetector";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import RelatedTools from "@/components/RelatedTools";
import ToolSchema from "@/components/ToolSchema";
import { ShieldCheck } from "lucide-react";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "How does the AI text detector work?",
    answer:
      "It uses four statistical metrics: perplexity (word predictability), burstiness (sentence variation), AI phrase pattern matching, and style consistency analysis. These are combined into a weighted probability score.",
  },
  {
    question: "Is my text sent to any server?",
    answer:
      "No. All analysis runs entirely in your browser using JavaScript. Your text is never uploaded to any server.",
  },
  {
    question: "How accurate is it?",
    answer:
      "Accuracy improves with text length — 200+ words gives medium confidence, 500+ gives high confidence. Like all statistical detectors, it provides probability estimates, not guarantees. Well-polished human writing can sometimes score higher, and heavily edited AI text can score lower.",
  },
  {
    question: "What is burstiness?",
    answer:
      "Burstiness measures variation in sentence length and complexity. Human writers naturally mix short punchy sentences with longer complex ones. AI models tend to produce more uniformly structured text with less variation.",
  },
  {
    question: "What is perplexity?",
    answer:
      "Perplexity measures how predictable the word choices are. AI models favor statistically common word sequences (low perplexity). Human writers tend to make more unexpected, varied choices (higher perplexity).",
  },
  {
    question: "Can it detect ChatGPT, Claude, or Gemini content?",
    answer:
      "Yes — the statistical patterns (high consistency, low burstiness, predictable phrasing) are common across all major AI writing models. The detector is model-agnostic; it looks for characteristics of AI writing rather than model-specific signatures.",
  },
  {
    question: "Why does it say my human writing is AI-generated?",
    answer:
      "Very formal, well-edited, or template-driven human writing can share statistical features with AI text. Academic writing, corporate reports, and legal documents often score higher because they follow rigid conventions. The tool works best on conversational or creative writing.",
  },
  {
    question: "What is the minimum text length?",
    answer:
      "At least 50 characters are required to run analysis. For reliable results, we recommend at least 200 words.",
  },
];

export default function AITextDetectorPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <head>
        <title>Free AI Text Detector (No Login) — Detect AI-Generated Content | BrowserAITools</title>
        <meta
          name="description"
          content="Instantly detect AI-generated text with our free, private, browser-based detector. No login required. Analyzes perplexity, burstiness, AI phrases, and style consistency."
        />
        <meta property="og:title" content="Free AI Text Detector — Detect AI Content Instantly" />
        <meta
          property="og:description"
          content="100% private, no login, runs in your browser. Detect AI-generated content with multi-metric analysis."
        />
      </head>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <ToolPageHeader toolName="AI Text Detector" icon={ShieldCheck} />

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "100% Free Forever",
            "No Registration Required",
            "Your Text Stays Private",
            "Multi-Metric Analysis",
          ].map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-full font-medium"
            >
              {t}
            </span>
          ))}
        </div>

        <AITextDetector />

        {/* How it works */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">How Detection Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Perplexity Analysis",
                body: "We measure how predictable your word choices are. AI models favor statistically common sequences — lower perplexity signals AI-like writing.",
              },
              {
                title: "Burstiness Detection",
                body: "Humans mix short, punchy sentences with long complex ones. AI tends toward uniform sentence structure. We measure that variation.",
              },
              {
                title: "Pattern Recognition",
                body: 'We scan for 30+ phrases statistically overused in AI writing: "It\'s important to note", "moreover", "delve into", and more.',
              },
              {
                title: "Style Consistency",
                body: "AI writing is often unnaturally consistent in structure throughout an entire piece. We measure how varied your sentence patterns are.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-1.5"
              >
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">What is AI-Generated Text?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            AI-generated text is content created by large language models (LLMs) like ChatGPT, Claude, Gemini, and
            others. While often fluent and coherent, AI writing tends to exhibit statistical patterns that differ from
            human writing: highly predictable word sequences, uniform sentence structure, and an over-reliance on
            certain transitional phrases.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our free AI text detector analyzes these patterns across four dimensions and returns a probability score —
            helping you make informed judgments about the origin of any text.
          </p>
        </section>

        <ToolSchema
          toolName="AI Text Detector"
          toolDescription="Free browser-based AI text detector. Paste any text to detect AI-generated content using perplexity, burstiness, pattern recognition, and style consistency analysis — no login required, 100% private."
          faqs={FAQS}
        />

        <RelatedTools currentToolName="AI Text Detector" currentCategory="Unique & Viral Tools" />

        <ShareResultButtons toolName="AI Text Detector" />
      </div>
    </div>
  );
}
