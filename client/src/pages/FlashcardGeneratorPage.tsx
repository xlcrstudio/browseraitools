import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { FlashcardGenerator } from "@/components/FlashcardGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What subjects does the flashcard generator work with?",
    answer: "Every subject — Biology, Chemistry, Physics, History, Law, Economics, Computer Science, Medicine, Psychology, Languages, Literature, Mathematics, and more. Paste notes in any language and the tool auto-detects the subject and adjusts the difficulty level accordingly.",
  },
  {
    question: "How do I export my flashcards to Anki?",
    answer: "Click 'Export for Anki (.txt)' after generating your cards. This downloads a tab-separated text file where each line is 'Front[tab]Back'. In Anki, go to File → Import, select the file, set the field separator to Tab, and import. All cards load directly into your deck.",
  },
  {
    question: "What are the three output modes?",
    answer: "Flashcards + Study Guide generates both a full interactive card set and a comprehensive study guide with summary, key terms, and practice questions. Flashcards Only generates just the Q&A cards quickly. Study Guide Only produces the summary, key terms, and practice questions without individual cards.",
  },
  {
    question: "Can I generate more cards from the same notes?",
    answer: "Yes. After generating your first set, click 'Generate More Cards' at the bottom. The AI automatically knows which cards already exist and generates additional non-overlapping cards covering other aspects of your notes.",
  },
  {
    question: "What is the 'Mark as Known' feature?",
    answer: "As you study through your flashcards, click 'Mark as Known' on any card you've mastered. The tool tracks your progress locally, shows a count of known cards, and highlights them in the card list. This mimics spaced repetition — focus on what you don't know yet.",
  },
  {
    question: "Is my study material kept private?",
    answer: "Yes — completely. The AI model runs in your browser using WebLLM. Your notes never leave your device, are never sent to any server, and are never stored or logged anywhere. Safe for confidential study material, proprietary research, or exam prep.",
  },
  {
    question: "How many flashcards can I generate at once?",
    answer: "Up to 50 flashcards per generation. For larger amounts, generate 50 first, then click 'Generate More Cards' to add additional non-overlapping cards. You can repeat this as many times as you need.",
  },
  {
    question: "What browsers support this tool?",
    answer: "Any browser with WebGPU: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop or laptop for best performance.",
  },
];

export default function FlashcardGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Flashcard Generator — Notes to Anki Cards & Study Guide | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI flashcard generator — paste any notes and get instant flashcards with a study guide. Export to Anki. Supports all subjects. 100% private, runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Flashcard Generator — Notes to Anki Cards & Study Guide Instantly",
      "og:description": "Turn lecture notes or textbook text into flashcards, key terms, and practice questions. Export to Anki. Any subject. Private and unlimited.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-flashcard-generator",
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
            "name": "AI Flashcard & Study Guide Generator",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI flashcard and study guide generator. Paste any notes and get instant flashcards, key terms, summary, and practice questions. Export to Anki. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Flashcard & Study Guide Generator" icon={BookOpen} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Flashcard{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste lecture notes, textbook pages, or any study material — get instant flashcards, key terms, a summary, and practice questions. Export directly to Anki. Works for any subject.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Up to 50 Cards",
            "Anki Export (.txt)",
            "Study Guide Included",
            "Any Subject",
            "Progress Tracker",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="flashcard-generator-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <FlashcardGenerator />
      </div>

      <AdBlock slot="flashcard-generator-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The AI Flashcard Generator That Actually Understands Your Notes</h2>
        <p>
          Most flashcard generators produce surface-level question-answer pairs. This tool uses spaced-repetition principles to generate cards that test atomic concepts — one idea per card, answers short enough to actually memorize. Paste a wall of lecture notes and get a study set that covers what matters, not just what appeared first in the text.
        </p>
        <p>
          Your notes never leave your browser. The AI model runs locally on your GPU using WebLLM, which means no account, no upload limit, and no risk of your study material being stored on someone's server.
        </p>

        <h2>Three Output Modes</h2>
        <ul>
          <li><strong>Flashcards + Study Guide</strong> — the complete package. Interactive flip cards plus a full study guide with a subject summary, key terms with definitions, and 10 practice questions.</li>
          <li><strong>Flashcards Only</strong> — faster output with just the Q&A cards. Good when you already have notes and just need the card set.</li>
          <li><strong>Study Guide Only</strong> — no cards, just the summary, key terms, and practice questions. Useful for a quick overview before diving into cards.</li>
        </ul>

        <h2>How to Export to Anki</h2>
        <p>
          After generating, click <strong>Export for Anki (.txt)</strong>. This downloads a tab-separated file where each line contains the front and back of one card, separated by a tab character. In Anki:
        </p>
        <ol>
          <li>Open Anki and go to <strong>File → Import</strong></li>
          <li>Select the downloaded .txt file</li>
          <li>Set the field separator to <strong>Tab</strong></li>
          <li>Choose which deck to import into</li>
          <li>Click Import — all cards load immediately</li>
        </ol>

        <h2>Built for Spaced Repetition</h2>
        <p>
          Each flashcard is designed with Anki's spaced repetition algorithm in mind: questions target a single concept, answers are concise enough to recall from memory, and the card set progresses from foundational definitions to applied understanding. Use the built-in progress tracker to mark what you know so you can focus review time on what you don't.
        </p>

        <h2>Generate More Cards</h2>
        <p>
          After your first generation, click <strong>Generate More Cards</strong> to get additional cards that don't overlap with the ones you already have. The AI tracks which questions were already generated and produces fresh ones covering other angles of the same material. Repeat as many times as you need.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="flashcard-generator-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Flashcard & Study Guide Generator"
        toolDescription="Free AI flashcard and study guide generator. Paste any notes and get instant flashcards, key terms, summary, and practice questions. Export to Anki. Any subject. 100% private."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="AI Flashcard & Study Guide Generator" />
    </>
  );
}
