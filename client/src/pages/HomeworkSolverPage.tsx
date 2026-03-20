import { useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { HomeworkSolver } from "@/components/HomeworkSolver";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What subjects does the AI Homework Solver support?",
    answer: "It supports Mathematics, Physics, Chemistry, Biology, History, Geography, Literature, and General subjects. The tool auto-detects the subject from your question, or you can override it manually.",
  },
  {
    question: "Can I upload a photo of my homework?",
    answer: "Yes! Switch to the Image tab, upload a photo or take one with your camera. The tool reads the text automatically using OCR, then solves it for you. Works best with clear, well-lit photos.",
  },
  {
    question: "What does 'Explain Simply' mode do?",
    answer: "It rewrites the solution using simple words, short sentences, and everyday examples — perfect if you want to understand the concept before diving into the technical details.",
  },
  {
    question: "Is my homework data private?",
    answer: "Yes. The AI model runs entirely in your browser using WebLLM. Your questions are never sent to any server. Everything is processed locally on your device.",
  },
  {
    question: "Does it just give me the answer?",
    answer: "No — the goal is to teach, not just answer. Each solution includes a clear final answer, a detailed step-by-step breakdown explaining WHY each step is done, and a key concepts section so you actually understand the material.",
  },
  {
    question: "Are my past problems saved?",
    answer: "Yes. Your last 30 solved problems are saved in your browser's local storage. Click the History button to reload any previous question.",
  },
];

export default function HomeworkSolverPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "AI Homework Solver — Step-by-Step Answers & Explanations | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI homework solver. Get step-by-step solutions for math, science, history, and more. Upload a photo or type your question. Runs privately in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "AI Homework Solver — Step-by-Step Explanations | Browser AI Tools",
      "og:description": "Solve any homework problem step-by-step. Math, science, history, and more. Upload a photo or type your question. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-homework-solver",
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
      <ToolPageHeader toolName="AI Homework Solver" icon={GraduationCap} />

      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Homework{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Solver
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Get step-by-step explanations for any homework problem — like having a private tutor in your browser. Math, science, history, and more.
        </p>
      </section>

      <AdBlock />

      <div className="mb-10">
        <HomeworkSolver />
      </div>

      <AdBlock />

      {/* About */}
      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Your Private AI Tutor — No Signup Required</h2>
        <p>
          The AI Homework Solver helps students understand their homework, not just copy answers. For every problem, it produces a final answer, a full step-by-step explanation showing the reasoning behind each step, and a key concepts section that helps you actually learn the material.
        </p>
        <p>
          Unlike online homework help sites that require accounts, subscriptions, or share your data, this tool runs entirely in your browser using WebLLM. Nothing you type or upload ever leaves your device.
        </p>

        <h2>How It Works</h2>
        <ol>
          <li><strong>Enter your question</strong> — type it out or upload a photo of your homework</li>
          <li><strong>Subject is auto-detected</strong> — or override it manually from the subject selector</li>
          <li><strong>Choose your mode</strong> — Step-by-Step for full detail, or Explain Simply for a beginner-friendly version</li>
          <li><strong>Get your solution</strong> — see the answer, all steps explained, and key concepts</li>
        </ol>

        <h2>Subjects Supported</h2>
        <ul>
          <li><strong>Mathematics</strong> — Algebra, geometry, calculus, trigonometry, statistics, and more</li>
          <li><strong>Physics</strong> — Forces, motion, energy, electricity, waves, and optics</li>
          <li><strong>Chemistry</strong> — Equations, reactions, elements, molecules, and lab concepts</li>
          <li><strong>Biology</strong> — Cells, genetics, ecosystems, evolution, and human biology</li>
          <li><strong>History</strong> — Events, causes, civilizations, and analysis</li>
          <li><strong>Geography</strong> — Countries, climate, physical features, and map skills</li>
          <li><strong>Literature</strong> — Themes, characters, analysis, and essay support</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock />

      <ToolSchema
        toolName="AI Homework Solver"
        toolDescription="Free AI homework solver with step-by-step explanations. Supports math, science, history, and more. Upload a photo or type your question. 100% private, runs in your browser."
        faqs={FAQS}
      />
    </>
  );
}
