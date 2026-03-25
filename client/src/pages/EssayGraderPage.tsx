import { useEffect } from "react";
import { ClipboardCheck } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { EssayGrader } from "@/components/EssayGrader";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What categories does the AI grade my essay on?",
    answer: "Five categories: Thesis & Argument (clarity and strength of your central claim), Structure & Organization (introduction, body, conclusion, and transitions), Evidence & Support (use of examples, data, quotes, and citations), Clarity & Style (writing quality, word choice, sentence variety), and Grammar & Mechanics (sentence structure, punctuation, and spelling). Each gets a score out of 100 with 2–3 sentences of specific feedback referencing your actual text.",
  },
  {
    question: "What grade levels does this support?",
    answer: "Four levels: Middle School (Grades 6–8), High School (Grades 9–12), Undergraduate/College, and Graduate School (Masters/PhD). The AI adjusts its standards and feedback accordingly — a high school essay is graded differently from a graduate thesis. Always select the correct level for accurate results.",
  },
  {
    question: "Can I provide the assignment prompt for more accurate grading?",
    answer: "Yes, and it significantly improves accuracy. When you provide the original assignment prompt (e.g., 'Analyze the role of technology in modern education'), the AI grades the essay on how well it addresses that specific prompt, not just on general writing quality. You can also add the subject or course name for additional context.",
  },
  {
    question: "How is the overall letter grade calculated?",
    answer: "The AI assigns an overall score (0–100) and letter grade based on a holistic assessment of all five dimensions. It does not simply average the five dimension scores — it weights thesis strength and argument quality more heavily, as these are considered the core of an essay, while grammar and mechanics can bring the grade down if there are significant errors.",
  },
  {
    question: "What does a good essay score look like in each category?",
    answer: "90–100 is Excellent, 80–89 is Good, 70–79 is Satisfactory, 60–69 is Needs Work, and below 60 is Poor. For a B+ essay, expect scores mostly in the 82–90 range with one or two weaker categories. An A essay typically scores 88+ in thesis and structure, with no category below 80.",
  },
  {
    question: "What are the 'Fix this' links for?",
    answer: "After grading, two tool links appear at the bottom. The Readability Analyzer lets you paste your essay and instantly see its grade level, passive voice count, and long sentences — useful if you scored low on Clarity. The Paraphrasing Tool lets you rephrase weak paragraphs in Fluency or Formal mode — useful for Grammar and Style issues.",
  },
  {
    question: "Is my essay private?",
    answer: "Yes — completely. The AI model runs entirely in your browser. Your essay text is never uploaded to a server, never logged, and never stored anywhere. This is especially important for academic work where plagiarism detection and data privacy are concerns. Nothing is sent anywhere.",
  },
  {
    question: "What is the minimum essay length?",
    answer: "At least 50 words, though the AI provides much more useful feedback for essays of 200 words or more. For best results, paste your complete essay including the introduction, all body paragraphs, and the conclusion. Short paragraphs or outlines will receive less specific feedback.",
  },
];

export default function EssayGraderPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Essay Grader — Instant Feedback, Letter Grade & Score | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI essay grader. Get an instant letter grade, scores for thesis, structure, evidence, clarity, and grammar, plus specific feedback. Private — runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Essay Grader — Letter Grade, 5 Dimension Scores & Specific Feedback",
      "og:description": "Paste any essay and get an instant letter grade, scores across 5 dimensions, strengths, priority improvements, and specific actionable feedback. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-essay-grader",
    };

    for (const [name, content] of Object.entries(metaUpdates)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogUpdates)) {
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
            "name": "AI Essay Grader",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI essay grader. Instant letter grade, scores for thesis, structure, evidence, clarity, and grammar, plus specific feedback. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Essay Grader" icon={ClipboardCheck} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Essay{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Grader
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste your essay and get an instant letter grade, scores across five dimensions, and specific feedback that references your actual writing — not generic advice.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Letter Grade",
            "5 Dimension Scores",
            "Thesis & Argument",
            "Structure",
            "Evidence",
            "Clarity",
            "Grammar",
            "Middle School → Graduate",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="essay-grader-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <EssayGrader />
      </div>

      <AdBlock slot="essay-grader-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>AI Essay Grader That References Your Actual Writing</h2>
        <p>
          Generic feedback like "improve your thesis" or "add more evidence" is useless. This tool is prompted to reference specific paragraphs, sentences, and claims from your actual essay — so the feedback is about your work, not a template. The AI reads the full essay before assigning any score.
        </p>
        <p>
          The model runs entirely in your browser using WebLLM and WebGPU. Your essay is never sent to a server, never stored, and never used as training data. This makes it appropriate for academic work where privacy matters.
        </p>

        <h2>Five Grading Dimensions</h2>
        <ul>
          <li><strong>Thesis & Argument</strong> — Does the essay have a clear, arguable thesis? Is the argument developed logically throughout? Does each body paragraph relate back to it?</li>
          <li><strong>Structure & Organization</strong> — Is there a clear introduction, developed body, and meaningful conclusion? Are transitions smooth? Do paragraphs have clear topic sentences?</li>
          <li><strong>Evidence & Support</strong> — Are claims supported with specific examples, data, or quotations? Is the evidence relevant and well-integrated? Are sources credited appropriately?</li>
          <li><strong>Clarity & Style</strong> — Is the writing clear and engaging? Is word choice appropriate for the academic level? Is there sentence variety?</li>
          <li><strong>Grammar & Mechanics</strong> — Are there grammatical errors, run-on sentences, or punctuation issues? Is verb tense consistent? Is spelling correct?</li>
        </ul>

        <h2>How to Get the Most Accurate Grade</h2>
        <p>
          Provide the original assignment prompt when you have it — this dramatically improves accuracy because the AI can check whether your essay actually answers the question. Set the correct grade level so standards match what's expected at your stage. Paste your complete essay including introduction and conclusion, not just body paragraphs.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="essay-grader-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Essay Grader"
        toolDescription="Free AI essay grader with instant letter grade, scores for thesis, structure, evidence, clarity, and grammar, plus specific feedback. Middle school through graduate level. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
