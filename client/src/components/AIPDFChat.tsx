import { useState, useRef, useCallback, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, Send, Loader2, Copy, Check,
  RotateCcw, ChevronDown, ChevronUp, Download, Sparkles,
  BookOpen, Lightbulb, ListChecks, MessageSquare, Trash2,
  AlertCircle, FileSearch,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// ─── Constants ────────────────────────────────────────────────────────────────

// The model's context window is ~4096 tokens.
// System (~120t) + context (~750t) + history (~400t) + question (~100t) + output (~700t) = ~2070t — safe.
const MAX_CONTEXT_CHARS = 3000;
const MAX_HISTORY_TURNS = 4; // keep last 4 user+assistant pairs

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocInfo {
  name: string;
  pages: number;
  words: number;
  sizeKB: number;
  fullText: string;
  pageTexts: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// ─── PDF Extraction ───────────────────────────────────────────────────────────

async function extractPDF(
  file: File,
  onProgress: (p: number) => void
): Promise<DocInfo> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pageTexts.push(text);
    onProgress(Math.round((i / numPages) * 100));
  }

  const fullText = pageTexts
    .map((t, i) => `[Page ${i + 1}]\n${t}`)
    .join("\n\n");

  const words = fullText.trim().split(/\s+/).filter(Boolean).length;

  return {
    name: file.name.replace(/\.pdf$/i, ""),
    pages: numPages,
    words,
    sizeKB: Math.round(file.size / 1024),
    fullText,
    pageTexts,
  };
}

// ─── Semantic Search (keyword TF overlap) ─────────────────────────────────────

function scorePageRelevance(query: string, pageText: string): number {
  const qWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const tLower = pageText.toLowerCase();
  let hits = 0;
  qWords.forEach((w) => {
    if (tLower.includes(w)) hits++;
  });
  return qWords.length ? hits / qWords.length : 0;
}

function getRelevantContext(query: string, doc: DocInfo): string {
  const scored = doc.pageTexts.map((text, i) => ({
    pageNum: i + 1,
    text,
    score: scorePageRelevance(query, text),
  }));

  const top = scored
    .filter((p) => p.score > 0 || scored.length <= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // If nothing matched well, use first 3 pages
  const pages = top.length ? top : scored.slice(0, 3);

  const context = pages
    .map((p) => `[Page ${p.pageNum}]\n${p.text.slice(0, 1000)}`)
    .join("\n\n");

  return context.slice(0, MAX_CONTEXT_CHARS);
}

// ─── Document Type Detection ──────────────────────────────────────────────────

type DocType = "academic" | "legal" | "business" | "general";

function detectDocType(text: string): DocType {
  const lower = text.slice(0, 3000).toLowerCase();
  const academic = ["abstract", "methodology", "references", "hypothesis", "literature review", "conclusion", "figure", "table"];
  const legal = ["whereas", "hereinafter", "party", "covenant", "indemnif", "liability", "agreement", "contract", "shall"];
  const business = ["agenda", "action item", "stakeholder", "revenue", "kpi", "q1", "q2", "quarter", "executive summary"];

  const score = (words: string[]) => words.filter((w) => lower.includes(w)).length;
  const scores = {
    academic: score(academic),
    legal: score(legal),
    business: score(business),
  };
  const max = Math.max(scores.academic, scores.legal, scores.business);
  if (max === 0) return "general";
  if (max === scores.academic) return "academic";
  if (max === scores.legal) return "legal";
  return "business";
}

// ─── Suggested Prompts ────────────────────────────────────────────────────────

const PROMPTS: Record<DocType, { label: string; icon: React.ElementType; text: string }[]> = {
  academic: [
    { label: "Summarize", icon: FileText, text: "Summarize the main findings and contributions of this document." },
    { label: "Methodology", icon: BookOpen, text: "What methodology or research methods were used?" },
    { label: "Key References", icon: ListChecks, text: "List the most important references or citations mentioned." },
  ],
  legal: [
    { label: "Main Terms", icon: FileText, text: "What are the main terms and conditions in this document?" },
    { label: "Obligations", icon: ListChecks, text: "What obligations does each party have?" },
    { label: "Key Dates", icon: BookOpen, text: "List all important dates and deadlines mentioned." },
  ],
  business: [
    { label: "Action Items", icon: ListChecks, text: "What are the key action items or decisions from this document?" },
    { label: "Summary", icon: FileText, text: "Provide an executive summary of this document." },
    { label: "Key Dates", icon: BookOpen, text: "Extract all important dates and milestones." },
  ],
  general: [
    { label: "Summarize", icon: FileText, text: "Summarize this entire document in clear, concise language." },
    { label: "Key Points", icon: ListChecks, text: "What are the 5 most important points from this document?" },
    { label: "Overview", icon: BookOpen, text: "What is this document about and what are its main topics?" },
  ],
};

// ─── ModelStatus Component ────────────────────────────────────────────────────

function ModelStatus({ state, progress, error }: {
  state: string; progress: { text: string; percent: number }; error: string | null;
}) {
  if (state === "ready" || state === "generating") return null;
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-center gap-3">
      {state === "error" ? (
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      ) : (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
          {state === "error" ? "AI Engine Error" : "Loading AI Engine"}
        </p>
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400 truncate">{error}</p>
        ) : (
          <p className="text-xs text-blue-600 dark:text-blue-400 truncate">{progress.text}</p>
        )}
        {state !== "error" && progress.percent > 0 && (
          <div className="mt-1 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message, onCopy,
}: {
  message: ChatMessage; onCopy: (text: string) => void;
}) {
  const isUser = message.role === "user";
  const lines = message.content.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2 items-end", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        )}
      >
        {isUser ? "Y" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm"
        )}
      >
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return <p key={i} className="font-bold mt-2 first:mt-0">{line.slice(3)}</p>;
          }
          if (line.startsWith("- ") || line.startsWith("• ")) {
            return (
              <p key={i} className="flex gap-1.5 items-start">
                <span className="shrink-0 mt-0.5">•</span>
                <span>{line.slice(2)}</span>
              </p>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return <p key={i} className="ml-1">{line}</p>;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}

        {!isUser && message.content && (
          <button
            data-testid={`button-copy-msg-${message.id}`}
            onClick={() => onCopy(message.content)}
            className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

function UploadZone({
  onFile, dragOver, setDragOver,
}: {
  onFile: (f: File) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") onFile(file);
  };

  return (
    <div
      data-testid="dropzone-pdf"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors",
        dragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <input
        ref={inputRef}
        data-testid="input-file-pdf"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">
        Drop your PDF here or click to upload
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
        Up to 50 MB — text extraction only, file never leaves your device
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIPDFChat() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { toast } = useToast();

  const [docInfo, setDocInfo] = useState<DocInfo | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copied, setCopied] = useState(false);

  const streamRef = useRef("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const docType = docInfo ? detectDocType(docInfo.fullText) : "general";
  const suggestions = PROMPTS[docType];

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages, streamingMsg]);

  // Poll streaming text → state at ~30fps
  useEffect(() => {
    if (!isThinking) return;
    const id = setInterval(() => setStreamingMsg(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isThinking]);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setExtractError("File too large. Please use a PDF under 50 MB.");
      return;
    }
    setExtractError(null);
    setExtracting(true);
    setExtractProgress(0);
    setDocInfo(null);
    setMessages([]);
    setStreamingMsg("");
    streamRef.current = "";
    try {
      const info = await extractPDF(file, setExtractProgress);
      setDocInfo(info);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `I've loaded **${info.name}** (${info.pages} page${info.pages !== 1 ? "s" : ""}, ~${info.words.toLocaleString()} words). Ask me anything about this document!`,
          ts: Date.now(),
        },
      ]);
    } catch (e: any) {
      setExtractError("Failed to read this PDF. Make sure it contains selectable text (not a scanned image).");
    } finally {
      setExtracting(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !docInfo || isThinking || state !== "ready") return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    streamRef.current = "";
    setStreamingMsg("");

    const context = getRelevantContext(trimmed, docInfo);

    // Build history for the model: last MAX_HISTORY_TURNS turns (excluding the welcome msg)
    const history = messages
      .filter((m) => m.id !== "welcome")
      .slice(-(MAX_HISTORY_TURNS * 2))
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const systemPrompt = `You are a helpful AI assistant. The user has uploaded a PDF document titled "${docInfo.name}" (${docInfo.pages} pages).

Use the provided document context to answer questions accurately. Cite page numbers using [Page N] notation when referencing specific information. If the answer is not in the context, say so clearly. Be concise and helpful.

DOCUMENT CONTEXT:
${context}`;

    await generateRaw({
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: trimmed },
      ],
      temperature: 0.5,
      maxTokens: 600,
      onChunk: (text) => { streamRef.current = text; },
    });

    const finalText = streamRef.current;
    setIsThinking(false);
    setStreamingMsg("");

    if (finalText) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: finalText,
          ts: Date.now(),
        },
      ]);
    }
  }, [docInfo, isThinking, state, messages, generateRaw]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleExport = () => {
    const lines = messages.map((m) =>
      `[${m.role === "user" ? "You" : "AI"}] ${new Date(m.ts).toLocaleTimeString()}\n${m.content}`
    );
    const content = `Chat with: ${docInfo?.name ?? "PDF"}\nExported: ${new Date().toLocaleString()}\n\n${lines.join("\n\n---\n\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${docInfo?.name ?? "pdf"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Chat exported" });
  };

  const handleClearDoc = () => {
    setDocInfo(null);
    setMessages([]);
    setStreamingMsg("");
    streamRef.current = "";
    setExtractError(null);
    setShowSuggestions(true);
  };

  const handleCopyAll = () => {
    const text = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => `${m.role === "user" ? "Q" : "A"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Chat copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  // ── No document uploaded yet ──────────────────────────────────────────────
  if (!docInfo && !extracting) {
    return (
      <div className="space-y-5">
        <ModelStatus state={state} progress={progress} error={llmError} />

        {extractError && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{extractError}</span>
          </div>
        )}

        <UploadZone onFile={handleFile} dragOver={dragOver} setDragOver={setDragOver} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, title: "Ask Anything", desc: "Ask questions in plain language" },
            { icon: Lightbulb, title: "Smart Context", desc: "Finds the most relevant pages" },
            { icon: Download, title: "Export Chat", desc: "Save your Q&A as a text file" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <f.icon className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{f.title}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Extracting in progress ────────────────────────────────────────────────
  if (extracting) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900" />
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <FileText className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Extracting text…</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{extractProgress}% complete</p>
        </div>
        <div className="w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${extractProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">All processing stays on your device</p>
      </div>
    );
  }

  // ── Main Chat Interface ───────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <ModelStatus state={state} progress={progress} error={llmError} />

      {/* Doc header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{docInfo!.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {docInfo!.pages} pages · ~{docInfo!.words.toLocaleString()} words · {docInfo!.sizeKB} KB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="button-export-chat"
            onClick={handleExport}
            disabled={messages.filter((m) => m.id !== "welcome").length === 0}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Export chat"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            data-testid="button-copy-all"
            onClick={handleCopyAll}
            disabled={messages.filter((m) => m.id !== "welcome").length === 0}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Copy all"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            data-testid="button-clear-doc"
            onClick={handleClearDoc}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Upload a different PDF"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested prompts */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 self-center">Quick prompts:</span>
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  data-testid={`button-prompt-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => {
                    sendMessage(s.text);
                    setShowSuggestions(false);
                  }}
                  disabled={state !== "ready" || isThinking}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 disabled:opacity-40 transition-colors"
                >
                  <s.icon className="w-3 h-3" />
                  {s.label}
                </button>
              ))}
              <button
                data-testid="button-dismiss-suggestions"
                onClick={() => setShowSuggestions(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <div
        ref={chatEndRef}
        data-testid="chat-messages"
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-4 overflow-y-auto"
        style={{ minHeight: 360, maxHeight: 480 }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onCopy={handleCopy} />
        ))}

        {/* Streaming response */}
        {isThinking && (
          <div className="flex gap-2 items-end">
            <div className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
              AI
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100">
              {streamingMsg ? (
                <span>{streamingMsg}<span className="animate-pulse">▋</span></span>
              ) : (
                <span className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Thinking…
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            data-testid="input-message"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            onKeyDown={handleKeyDown}
            placeholder={state !== "ready" ? "AI engine loading…" : "Ask anything about this PDF…"}
            rows={2}
            disabled={state !== "ready" || isThinking}
            className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3 pr-12 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
          />
          <span className="absolute bottom-2 right-3 text-xs text-slate-300 dark:text-slate-600 select-none">
            {input.length}/1000
          </span>
        </div>
        <button
          type="submit"
          data-testid="button-send"
          disabled={!input.trim() || state !== "ready" || isThinking}
          className="shrink-0 w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
        >
          {isThinking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      <p className="text-xs text-center text-slate-400 dark:text-slate-600">
        Press Enter to send · Shift+Enter for new line · Responses based on document content only
      </p>
    </div>
  );
}
