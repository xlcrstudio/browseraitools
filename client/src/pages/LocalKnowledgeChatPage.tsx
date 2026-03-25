import { useEffect } from "react";
import { Library } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { LocalKnowledgeChat } from "@/components/LocalKnowledgeChat";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What file formats can I add?",
    answer: "You can paste any text directly into the tool, or upload .txt, .md (Markdown), .csv, and .json files. You can also add content from PDFs or Word documents by copying and pasting the text. There's no limit on how many documents you can add in a session.",
  },
  {
    question: "How does the AI find answers in my documents?",
    answer: "When you send a message, the tool scans all your documents for the most relevant sections using keyword matching — a technique called retrieval-augmented generation (RAG). It extracts the top relevant passages and includes them in the AI's context window. The AI then answers based only on those passages and cites which document each part of the answer came from.",
  },
  {
    question: "Does the AI only use my documents, or does it add its own knowledge?",
    answer: "By design, the AI is instructed to answer only from the documents you've provided. If the answer isn't in your documents, it will say so rather than making something up. This makes it reliable for document-specific research, note review, and fact-checking against your sources.",
  },
  {
    question: "How does the Save Session feature work?",
    answer: "Clicking Save Session stores all your documents and chat history in your browser's local storage — it stays saved even after you close the tab or browser. Click Load on the same device to restore everything. Clear All wipes both the session and saved data. Nothing is ever sent to a server.",
  },
  {
    question: "What are good use cases for this tool?",
    answer: "Research: paste multiple papers or articles and ask 'What do these sources say about X?'. Meeting notes: paste notes from several meetings and ask 'What decisions were made?'. Study: add lecture notes and ask the AI to quiz you or explain concepts. Legal or contract review: paste documents and ask specific questions. Customer support: add documentation and chat to find answers fast.",
  },
  {
    question: "Is there a limit on how much text I can add?",
    answer: "There's no hard limit on total text, but the AI uses a context window of a few thousand tokens (about 2,000–4,000 words) per response. For each question, the tool identifies the most relevant sections from your documents and includes those — so you can add much more text than fits in one context window. Very large documents will still work, but answers will be based on the most relevant passages rather than the full text.",
  },
  {
    question: "Are my documents private?",
    answer: "Yes — completely. The AI model runs entirely in your browser using your GPU. Your documents are never uploaded, never logged, and never used for training. The session storage is in your browser's local storage, which only you can access. When you close the tab without saving, everything is cleared automatically.",
  },
  {
    question: "Can I chat with multiple documents at once?",
    answer: "Yes — this is one of the main features. Add as many documents as you want and ask questions that draw across all of them. The tool shows you which documents each answer came from so you can trace the sources. You can ask comparative questions like 'How do Document A and Document B differ on this topic?'",
  },
];

export default function LocalKnowledgeChatPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Local Knowledge Chat — Chat With Your Documents Privately | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI chat with your documents — privately. Paste notes, upload files, ask questions. Source citations. No upload to server. 100% in-browser with WebLLM.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Local Knowledge Chat — Chat With Your Documents Privately",
      "og:description": "Paste or upload documents and chat with them using AI. Source citations, session save, 100% private. No account, no upload, no server.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-local-knowledge-chat",
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
            "name": "AI Local Knowledge Chat",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI chat with your documents. Paste notes, upload files, ask questions. Source citations, session save, 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Local Knowledge Chat" icon={Library} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Chat With Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Documents Privately
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste notes, reports, or upload files — then ask the AI anything about them. Get answers with source citations. Nothing leaves your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Multiple Documents",
            "Source Citations",
            "Save & Load Sessions",
            "Any Text Format",
            "100% Private",
            "No Upload",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="local-knowledge-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <LocalKnowledgeChat />
      </div>

      <AdBlock slot="local-knowledge-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The Private Alternative to ChatGPT File Upload</h2>
        <p>
          ChatGPT's file upload and Google's NotebookLM require you to send your documents to a server — where they may be logged, stored, or used. This tool works differently: the AI model runs entirely in your browser using WebLLM and WebGPU. Your documents are processed locally, citations are generated locally, and nothing is ever transmitted.
        </p>
        <p>
          This makes it suitable for sensitive documents: internal business reports, personal notes, legal documents, medical records, or any content you wouldn't want stored on a third-party server.
        </p>

        <h2>How It Works</h2>
        <p>
          Add documents by pasting text or uploading .txt, .md, .csv, or .json files. When you ask a question, the tool runs a keyword-based search across all your documents to find the most relevant passages. Those passages are included in the AI's context window, and the AI answers based only on what's in your documents — citing the source for each piece of information.
        </p>
        <p>
          This approach — called retrieval-augmented generation (RAG) — means the AI can reason across far more text than fits in its context window at once, while staying grounded in your actual documents rather than hallucinating from general knowledge.
        </p>

        <h2>Top Use Cases</h2>
        <ul>
          <li><strong>Research synthesis</strong> — Paste multiple papers or articles and ask "What consensus exists on X?" or "What contradictions are there between these sources?"</li>
          <li><strong>Meeting notes</strong> — Add notes from multiple meetings and ask "What decisions were made?" or "What are the open action items?"</li>
          <li><strong>Study assistant</strong> — Add lecture notes, textbook excerpts, and past papers. Ask the AI to quiz you or explain specific concepts.</li>
          <li><strong>Contract and policy review</strong> — Add legal documents and ask specific questions about terms, obligations, or exceptions.</li>
          <li><strong>Customer support prep</strong> — Add product documentation and get fast, cited answers to customer questions.</li>
          <li><strong>Personal knowledge base</strong> — Keep a collection of notes and reference them conversationally.</li>
        </ul>

        <h2>Save and Load Sessions</h2>
        <p>
          Sessions are saved to your browser's local storage — no account, no server. Save before closing to preserve your documents and chat history. Load them back on the same device and browser instantly. Everything is stored in your browser and only accessible to you.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="local-knowledge-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Local Knowledge Chat"
        toolDescription="Free AI chat with your documents. Paste notes, upload files, ask questions with source citations. Session save and load. 100% private, no upload to server."
        faqs={FAQS}
      />
    </>
  );
}
