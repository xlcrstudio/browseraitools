import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function PlaygroundArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Private AI Code Playground 2026 - Run and Fix Code in Browser
        </h2>

        <ArticleSection title="Why a Private Code Playground Matters">
          <p>Traditional cloud-based code playgrounds send every keystroke to remote servers. Your experimental code, API keys accidentally left in snippets, proprietary logic, and learning attempts are all stored on someone else's infrastructure. A private code playground changes this by running everything locally in your browser using WebLLM and WebAssembly.</p>
          <p>With a private playground, your code never leaves your device. The AI model runs entirely in your browser using WebGPU acceleration. Code execution happens in sandboxed iframes or Pyodide's WebAssembly runtime. There is no server, no upload, no telemetry.</p>
        </ArticleSection>

        <ArticleSection title="How the Generate-Run-Fix Loop Works">
          <p>The playground provides a complete development workflow in three steps:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Generate:</strong> Type a prompt describing what you want to build, or select a template. The AI streams complete, runnable code directly into the Monaco editor.</li>
            <li><strong className="text-slate-800">Run:</strong> Click the Run button. JavaScript and HTML execute instantly in a sandboxed iframe. Python code runs through Pyodide, a full CPython interpreter compiled to WebAssembly.</li>
            <li><strong className="text-slate-800">Fix:</strong> If the code produces an error, click "Fix This Error." The AI receives both your current code and the exact runtime error message, then generates a corrected version with an explanation of what went wrong.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Supported Languages and Frameworks">
          <p>The playground supports JavaScript, HTML, CSS, and Python out of the box. For JavaScript projects, you can use modern ES2024 syntax, DOM manipulation, Canvas API, and even include Tailwind CSS via CDN. For Python, Pyodide provides NumPy, Pandas, Matplotlib, and most standard library modules.</p>
          <p>The Monaco Editor provides VS Code-quality editing with syntax highlighting, auto-indentation, bracket matching, and keyboard shortcuts for every supported language.</p>
        </ArticleSection>

        <ArticleSection title="Comparison: Private Playground vs Cloud Alternatives">
          <p>Cloud playgrounds like Replit, CodeSandbox, and ChatGPT's code interpreter all require accounts, send code to servers, and often have usage limits. This private playground has zero limits on generation, execution, or storage. You can generate and run code 1,000 times a day without a subscription.</p>
          <p>The tradeoff is that the AI model is smaller (running locally) compared to cloud GPT-4 or Claude. For the vast majority of coding tasks, learning exercises, prototyping, and utility scripts, the local model performs excellently and the privacy and speed advantages are substantial.</p>
        </ArticleSection>

        <ArticleSection title="Persistent Projects and Export">
          <p>Every project is saved to your browser's IndexedDB storage. Projects persist across browser sessions and page refreshes. You can create multiple projects, switch between them with tabs, and pick up right where you left off.</p>
          <p>When you want to move beyond the playground, use the export feature to download your code as a file ready for VS Code, a local development server, or any other editor.</p>
        </ArticleSection>

        <ArticleSection title="Use Cases for Developers and Learners">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Learning to code:</strong> Generate examples, modify them, see instant results, and get explanations when things break. The fastest feedback loop for learning.</li>
            <li><strong className="text-slate-800">Prototyping:</strong> Quickly test an algorithm, UI pattern, or API concept without setting up a project. Go from idea to working code in seconds.</li>
            <li><strong className="text-slate-800">Interview prep:</strong> Practice coding challenges with AI assistance. Generate problems, attempt solutions, and use Fix Error when stuck.</li>
            <li><strong className="text-slate-800">Utility scripts:</strong> Need a quick data transformation, regex builder, or text processor? Generate it, run it, copy the result.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `pg-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="border-b border-slate-200 py-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left group" data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-expanded={open} aria-controls={panelId}>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id={panelId} className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
