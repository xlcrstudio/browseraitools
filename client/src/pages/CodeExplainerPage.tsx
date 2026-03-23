import { useEffect } from "react";
import { Code2 } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { CodeExplainer } from "@/components/CodeExplainer";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What programming languages does the AI code explainer support?",
    answer: "It works with any programming language — JavaScript, TypeScript, Python, React (JSX/TSX), SQL, Go, Rust, Java, C, C++, PHP, Ruby, Swift, Kotlin, Bash, CSS, HTML, and more. The AI detects the language automatically from the code you paste.",
  },
  {
    question: "What are the three explanation levels?",
    answer: "ELI5 (Explain Like I'm 5) uses plain English, everyday analogies, and no jargon — perfect for beginners or non-developers trying to understand code. Standard gives clear explanations with correct technical terms for working developers. Senior Dev is terse and technical, assumes deep expertise, and skips any hand-holding.",
  },
  {
    question: "What does the 'Fix Bugs' button do?",
    answer: "It instructs the AI to analyze the code specifically for bugs and errors, explain what was wrong, and produce a corrected version. It's different from Explain, which describes what the code does without necessarily fixing issues.",
  },
  {
    question: "What does the 'Improve' button do?",
    answer: "It refactors the code for production quality — improving performance, readability, error handling, and following best practices for the detected language. Every improvement is explained and a complete improved version is shown.",
  },
  {
    question: "Is my code private and secure?",
    answer: "Yes — completely. The AI runs in your browser using WebLLM. Your code never leaves your device, is never sent to any server, and is never stored anywhere. This makes it safe for proprietary, confidential, or work code that you can't share with online tools.",
  },
  {
    question: "Can I use the improved code the tool generates?",
    answer: "Yes. Click 'Use this code ↑' below the improved code block to load it back into the input area. You can then run Explain or Improve again on the new version, building iteratively toward production-ready code.",
  },
  {
    question: "What are the sample codes for?",
    answer: "Click 'Try a sample' to load a pre-written code example — Fibonacci (JavaScript), a SQL query, or a React useDebounce hook — so you can immediately see what the tool produces without needing to paste your own code first.",
  },
  {
    question: "What browsers support this tool?",
    answer: "WebGPU is required: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop or laptop. The model runs locally, so a decent GPU helps with speed.",
  },
];

export default function CodeExplainerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Code Explainer — Understand Any Code in Plain English | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI code explainer — paste any code and get a line-by-line breakdown, bug detection, and an improved version. JavaScript, Python, SQL, React, and more. 100% private, runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Code Explainer — Line-by-Line Breakdown, Bug Fix & Improve | Browser AI Tools",
      "og:description": "Paste any code and instantly get a plain-English explanation, line-by-line breakdown, bug detection, and an improved version. Private, unlimited, no login.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-code-explainer",
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
            "name": "AI Code Explainer",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI code explainer with line-by-line breakdown, bug detection, and code improvement. Supports JavaScript, Python, SQL, React, and any language. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Code Explainer" icon={Code2} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Code Explainer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any code — get a line-by-line plain-English explanation, automatic bug detection, and an improved version. Supports every language. Runs entirely in your browser — your code stays on your device.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Any Language",
            "Line-by-Line Breakdown",
            "Bug Detection & Fix",
            "Code Improvement",
            "ELI5 to Senior Dev",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="code-explainer-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <CodeExplainer />
      </div>

      <AdBlock slot="code-explainer-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The Code Explainer That Actually Understands Your Code</h2>
        <p>
          Reading unfamiliar code is one of the hardest skills in software development. Whether you're onboarding to a new codebase, reviewing a pull request in an unfamiliar language, debugging someone else's logic, or learning from open-source code — understanding what code does and why takes time. This tool compresses that time to seconds.
        </p>
        <p>
          Paste any snippet. Choose how deep you want the explanation. Get a structured breakdown: what the code does overall, a line-by-line walkthrough, potential issues, and a cleaner improved version. Everything runs in your browser — your code never leaves your device.
        </p>

        <h2>Three Explanation Levels for Every Skill Level</h2>
        <ul>
          <li>
            <strong>ELI5 (Explain Like I'm 5)</strong> — Plain English with everyday analogies. No jargon whatsoever. Ideal for non-developers reviewing code, beginners learning to program, or anyone who just needs to understand what a function does without the technical layer.
          </li>
          <li>
            <strong>Standard</strong> — The developer's default. Correct technical terminology, clearly explained at a working developer's level. Good for understanding code in a language you know but haven't mastered, or for quickly getting up to speed on a pattern you haven't seen before.
          </li>
          <li>
            <strong>Senior Dev</strong> — Terse, technical, no hand-holding. Explains algorithmic complexity, design patterns, potential edge cases, and production concerns in the same way a senior engineer would. Best when you want peer-level analysis without the exposition.
          </li>
        </ul>

        <h2>Fix Bugs and Improve in One Click</h2>
        <p>
          Beyond explaining, the tool has two action modes. <strong>Fix Bugs</strong> analyzes the code specifically for errors, explains what's wrong with each issue, and produces a corrected version. <strong>Improve</strong> refactors the code for production quality — better performance, cleaner structure, proper error handling, and language-specific best practices. Click "Use this code" to load the result back into the editor and continue iterating.
        </p>

        <h2>Safe for Proprietary and Work Code</h2>
        <p>
          Most AI coding tools send your code to remote servers. That's a problem for proprietary code, client projects, internal tools, or anything covered by an NDA or employment agreement. This tool runs the AI model entirely in your browser using WebLLM. Your code is processed locally on your GPU and never transmitted, stored, or logged anywhere.
        </p>

        <h2>Works with Every Language</h2>
        <p>
          JavaScript, TypeScript, Python, React (JSX/TSX), Vue, Svelte, SQL, Go, Rust, Java, Kotlin, Swift, C, C++, PHP, Ruby, Bash, PowerShell, CSS, HTML, and any other language the AI has seen — which is essentially all of them. The language is detected automatically from the code you paste.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="code-explainer-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Code Explainer"
        toolDescription="Free AI code explainer — paste any code and get a line-by-line breakdown, bug detection, and improved version. JavaScript, Python, SQL, React, and any language. 100% private, runs in your browser."
        faqs={FAQS}
      />
    </>
  );
}
