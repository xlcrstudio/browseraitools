import AIPDFChat from "@/components/AIPDFChat";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import RelatedTools from "@/components/RelatedTools";
import ToolSchema from "@/components/ToolSchema";
import { FileSearch } from "lucide-react";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. Your PDF never leaves your device. Text extraction runs entirely in your browser using PDF.js, and the AI model runs locally via WebGPU (WebLLM). Nothing is sent to any server.",
  },
  {
    question: "What types of PDFs work best?",
    answer:
      "PDFs with selectable text work best — documents created from Word, Google Docs, or other text editors. Scanned image PDFs (where pages are photos) won't work because there is no embedded text to extract.",
  },
  {
    question: "How large a PDF can I use?",
    answer:
      "Up to 50 MB. For best results, shorter focused documents work better because the AI's context window is limited. For very long PDFs, the tool automatically finds the most relevant pages for each question.",
  },
  {
    question: "How does it find the right answer in a large document?",
    answer:
      "When you ask a question, the tool ranks all pages by keyword relevance to your question and sends the top 3 most relevant pages to the AI as context. This means answers are grounded in the actual document content.",
  },
  {
    question: "Can it handle academic papers, legal documents, and reports?",
    answer:
      "Yes. The tool automatically detects the document type and shows relevant quick-start prompts. For academic papers it suggests summarizing findings and methodology; for legal documents it prompts about terms and obligations; for business documents it highlights action items.",
  },
  {
    question: "Can I export the conversation?",
    answer:
      "Yes. Click the download icon in the document header to export the full chat as a plain-text file. You can also copy the entire conversation to your clipboard.",
  },
  {
    question: "Does this work offline?",
    answer:
      "Once the AI model is downloaded to your browser's cache (first use), it works fully offline. Subsequent visits load instantly from the cache.",
  },
  {
    question: "Why does the first response take a while?",
    answer:
      "The AI model (Qwen 2.5 1.5B) needs to be downloaded to your browser on first use — typically 1-2 GB depending on your settings. After the first download, it is cached and loads in seconds.",
  },
];

export default function AIPDFChatPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <head>
        <title>AI PDF Chat — Chat With Any PDF Free & Private | BrowserAITools</title>
        <meta
          name="description"
          content="Chat with any PDF instantly. Free, private, no login. Text extraction and AI run entirely in your browser — your files never leave your device."
        />
        <meta property="og:title" content="AI PDF Chat — Chat With Any PDF Free & Private" />
        <meta
          property="og:description"
          content="100% private PDF chatbot. Upload any PDF and ask questions — everything runs in your browser, no uploads, no server."
        />
      </head>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <ToolPageHeader toolName="AI PDF Chat" icon={FileSearch} />

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "Files Never Leave Your Device",
            "No Login Required",
            "100% Free",
            "Works Offline After First Load",
          ].map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-full font-medium"
            >
              {t}
            </span>
          ))}
        </div>

        <AIPDFChat />

        {/* How it works */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Upload Your PDF",
                body: "Drop any PDF into the upload zone. Text is extracted page-by-page in your browser using PDF.js. Nothing is sent to a server.",
              },
              {
                step: "2",
                title: "Ask Any Question",
                body: "Type a question in plain language. The tool finds the most relevant pages and sends them as context to the local AI model.",
              },
              {
                step: "3",
                title: "Get Instant Answers",
                body: "The AI answers based on the actual document content and cites page numbers. Export the full conversation when you're done.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  {s.step}
                </div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{s.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chat With PDFs Without Uploading Them</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Most PDF chat tools require you to upload your document to a third-party server, where it may be stored,
            processed, or used for training. Our AI PDF Chat tool works differently — text extraction happens in your
            browser using PDF.js, and the AI model (WebLLM) runs locally using your device's GPU via WebGPU. Your
            files never leave your machine.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Use it for academic research papers, legal contracts, business reports, technical documentation, or any
            text-based PDF. Ask questions, get summaries, extract key information, and export your conversation.
          </p>
        </section>

        <ToolSchema
          toolName="AI PDF Chat"
          toolDescription="Chat with any PDF for free. Upload a PDF and ask questions — text extraction and AI run 100% in your browser. No login, no uploads, completely private. Powered by PDF.js and WebLLM."
          faqs={FAQS}
        />

        <RelatedTools currentToolName="AI PDF Chat" currentCategory="Productivity" />

        <ShareResultButtons toolName="AI PDF Chat" />
      </div>
    </div>
  );
}
