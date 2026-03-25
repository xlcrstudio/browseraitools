import { useEffect } from "react";
import { PenLine } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { WritingFeedbackCoach } from "@/components/WritingFeedbackCoach";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What does this tool actually analyze?",
    answer: "The AI scores your writing on four dimensions — Clarity (how easy it is to read), Engagement (how compelling it is), Conciseness (how free it is of filler and padding), and Structure (how logically it flows). It also identifies the tone and gives 4–6 specific, actionable suggestions with exact quotes from your text.",
  },
  {
    question: "What types of writing can I get feedback on?",
    answer: "Blog posts, emails, essays, cover letters, newsletters, reports, social media posts, speeches, and articles. Select the writing type before analyzing — it helps the AI calibrate its feedback for the platform and audience.",
  },
  {
    question: "Is my writing private?",
    answer: "Yes — completely private. The AI runs entirely in your browser using WebGPU. Your writing is never uploaded to a server, stored, or sent to any third party.",
  },
  {
    question: "How do I use the suggestions?",
    answer: "Each suggestion includes the severity (HIGH / MEDIUM / LOW), the category (Clarity, Engagement, Conciseness, Structure, Tone, or Grammar), and a quoted phrase from your text that illustrates the problem. Click 'Show suggestion' to reveal a concrete fix you can copy and apply directly.",
  },
  {
    question: "What does each score mean?",
    answer: "Scores above 85 are Excellent. 70–84 is Good. 50–69 Needs work. Below 50 is Weak. A piece with high Clarity but low Engagement might be easy to read but fails to hold attention. A high Engagement but low Conciseness score means it's interesting but padded with filler words.",
  },
  {
    question: "What is the word limit?",
    answer: "The tool analyzes up to 1,200 words. For longer documents, paste sections separately — for example, analyze your introduction, body, and conclusion individually for more targeted feedback.",
  },
];

export default function WritingFeedbackCoachPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Writing Feedback Coach — Clarity, Engagement & Tone Scores | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free AI writing feedback coach. Get Clarity, Engagement, Conciseness and Structure scores plus specific suggestions with fixes. 100% private — runs in your browser.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free AI Writing Feedback Coach — Make Your Writing More Engaging",
      "og:description": "Paste any writing and get scores for Clarity, Engagement, Conciseness and Structure — plus specific suggestions with exact quotes and fixes.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-writing-feedback-coach",
    };

    for (const [name, content] of Object.entries(metas)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogs)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Writing Feedback Coach",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI writing coach. Get Clarity, Engagement, Conciseness and Structure scores plus specific suggestions with fixes. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Writing Feedback Coach" icon={PenLine} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Writing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Feedback Coach
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any writing and get scored on Clarity, Engagement, Conciseness, and Structure — plus specific, actionable suggestions with exact quotes and fixes.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Clarity Score",
            "Engagement Score",
            "Conciseness Score",
            "Structure Score",
            "Tone Analysis",
            "Quoted Suggestions",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="writing-coach-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <WritingFeedbackCoach />
      </div>

      <AdBlock slot="writing-coach-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>What Makes Writing Truly Effective?</h2>
        <p>
          Most writing fails not because of bad ideas but because of poor execution. A powerful insight buried in passive voice loses its punch. A compelling story padded with filler words loses its momentum. Good ideas deserve clear, engaging writing — and that's exactly what this tool helps you achieve.
        </p>
        <p>
          The AI analyzes your writing across four dimensions and gives you specific, quoted suggestions — not vague advice like "be more engaging," but exact passages with concrete rewrites.
        </p>

        <h2>The Four Scoring Dimensions</h2>
        <ul>
          <li><strong>Clarity (0–100)</strong> — How easy is it to read and understand? Penalizes long sentences, jargon, passive voice, and ambiguous phrasing.</li>
          <li><strong>Engagement (0–100)</strong> — How compelling and interesting is it? Rewards hooks, vivid language, stories, and varied sentence structure.</li>
          <li><strong>Conciseness (0–100)</strong> — Is it tight with no filler? Penalizes padding, redundant phrases, and over-explanation.</li>
          <li><strong>Structure (0–100)</strong> — Does it flow logically? Rewards clear introductions, smooth transitions, and strong conclusions.</li>
        </ul>

        <h2>How to Use the Suggestions</h2>
        <p>
          Every suggestion shows you the exact phrase causing the problem, explains why it weakens your writing, and gives you a concrete fix you can copy and paste. Suggestions are sorted by severity — fix HIGH priority issues first for the biggest improvement in your scores.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="writing-coach-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Writing Feedback Coach"
        toolDescription="Free AI writing coach. Get Clarity, Engagement, Conciseness and Structure scores plus specific suggestions with exact quotes and fixes. 100% private — runs in your browser."
        faqs={FAQS}
      />
    </>
  );
}
