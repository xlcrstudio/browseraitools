import { useState, useRef, useCallback, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, X, Copy, Check, RotateCcw,
  ChevronDown, ChevronUp, Send, Loader2, Clock,
  BookOpen, Lightbulb, Quote, MessageSquare, AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Parse "## Section Title\ncontent\n\n## Next..." into array of {title, content}
function parseSections(text: string): { title: string; content: string }[] {
  const result: { title: string; content: string }[] = [];
  const parts = text.split(/\n(?=##\s)/);
  for (const part of parts) {
    const match = part.match(/^##\s+(.+?)\n([\s\S]*)$/);
    if (match) {
      result.push({ title: match[1].trim(), content: match[2].trim() });
    }
  }
  return result;
}

// Strip bold markdown **text** → text, and leading numbers like "1. "
function cleanLine(line: string) {
  return line.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const SUMMARY_TYPES = [
  { id: "short", label: "Short Summary", desc: "2-3 paragraph overview", icon: FileText },
  { id: "insights", label: "Key Insights", desc: "Main takeaways & findings", icon: Lightbulb },
  { id: "bullets", label: "Bullet Points", desc: "Quick scannable list", icon: BookOpen },
  { id: "executive", label: "Executive Summary", desc: "High-level for decision makers", icon: MessageSquare },
];

const LENGTHS = [
  { id: "brief", label: "Brief", words: "~150 words" },
  { id: "medium", label: "Medium", words: "~300 words" },
  { id: "detailed", label: "Detailed", words: "~500 words" },
];

// Qwen2.5-1.5B (default) has a 4096-token context window.
// System prompt (~150 tokens) + prompt instructions (~300 tokens) + PDF text must leave room for output.
// 5000 chars ≈ 1250 tokens → total input ~1700 tokens → ~2300 tokens free for output.
const MAX_CONTEXT_CHARS = 5000;

interface DocInfo {
  name: string;
  pages: number;
  sizeKB: number;
  words: number;
  readMinutes: number;
  fullText: string;
  pageTexts: string[];
}

interface QAItem {
  question: string;
  answer: string;
}

const SYSTEM_PROMPT = `You are an expert document analyst specializing in PDF summarization, academic papers, and professional reports. You create accurate, well-structured summaries that preserve critical information, identify main arguments, extract key data, and maintain factual accuracy. Never invent data not in the document.`;

function buildSummaryPrompt(doc: DocInfo, summaryType: string, length: string, includeQuotes: boolean): string {
  const textSnippet = doc.fullText.slice(0, MAX_CONTEXT_CHARS);
  const truncated = doc.fullText.length > MAX_CONTEXT_CHARS ? " [truncated for length]" : "";

  const formatInstructions: Record<string, string> = {
    short: "Write 2-3 clear paragraphs covering the main topic, key arguments, and conclusions.",
    insights: "Extract the 5 most important insights as numbered points. Each should include a page reference like [Page X] where possible.",
    bullets: "Create a scannable bullet-point list of the main points. Use sub-bullets for supporting details. Include page references.",
    executive: "Write a crisp executive summary: one sentence on the topic, key findings, and a brief recommendation/conclusion.",
  };

  const lengthGuide: Record<string, string> = {
    brief: "Keep to ~150 words.",
    medium: "Aim for ~300 words.",
    detailed: "Aim for ~500 words with supporting detail.",
  };

  return `Analyze this PDF document and produce a structured summary.

DOCUMENT: ${doc.name}
PAGES: ${doc.pages} | WORDS: ~${doc.words.toLocaleString()}${truncated}

DOCUMENT TEXT:
${textSnippet}

TASK:
1. SUMMARY (${SUMMARY_TYPES.find(t => t.id === summaryType)?.label}):
${formatInstructions[summaryType] || formatInstructions.short}
${lengthGuide[length]}

2. KEY INSIGHTS (always include):
List the 5 most important points from this document. Include page references where visible.

3. KEY QUOTES (${includeQuotes ? "include 2-3 impactful direct quotes with page references" : "skip this section"}):
${includeQuotes ? 'Format: "Quote text..." [Page X]' : ""}

Format your response with clear section headers: ## Summary, ## Key Insights, ## Key Quotes
Be factual, concise, and accurate to the document.`;
}

function buildQAPrompt(doc: DocInfo, question: string): string {
  const textSnippet = doc.fullText.slice(0, MAX_CONTEXT_CHARS);
  return `Using the following PDF document, answer the user's question accurately.

DOCUMENT: ${doc.name} (${doc.pages} pages)

DOCUMENT TEXT:
${textSnippet}

QUESTION: ${question}

Provide a direct, clear answer based only on information in the document. Cite page numbers where relevant (e.g. [Page X]). If the document doesn't contain enough information to answer, say so clearly.`;
}

export function PDFSummarizerGenerator() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { toast } = useToast();

  const [docInfo, setDocInfo] = useState<DocInfo | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [summaryType, setSummaryType] = useState("short");
  const [length, setLength] = useState("medium");
  const [includeQuotes, setIncludeQuotes] = useState(true);
  const [summaryOutput, setSummaryOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [qaInput, setQaInput] = useState("");
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qaInputRef = useRef<HTMLInputElement>(null);
  // Refs for streaming — tokens land here instantly, state polls at 30fps
  const summaryStreamRef = useRef("");
  const answerStreamRef = useRef("");

  // Poll summary stream into state at ~30fps while generating
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => {
      setSummaryOutput(summaryStreamRef.current);
    }, 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  // Poll answer stream into state at ~30fps while answering
  useEffect(() => {
    if (!isAnswering) return;
    const id = setInterval(() => {
      setStreamingAnswer(answerStreamRef.current);
    }, 33);
    return () => clearInterval(id);
  }, [isAnswering]);

  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  const extractPDF = useCallback(async (file: File) => {
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 50 MB.", variant: "destructive" });
      return;
    }

    setExtracting(true);
    setExtractProgress(0);
    setSummaryOutput("");
    setQaItems([]);
    setShowQA(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const numPages = pdf.numPages;

      let fullText = "";
      const pageTexts: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ").replace(/\s+/g, " ").trim();
        pageTexts.push(pageText);
        fullText += `\n[Page ${i}]\n${pageText}\n`;
        setExtractProgress(Math.round((i / numPages) * 100));
      }

      const words = fullText.trim().split(/\s+/).filter(Boolean).length;
      const readMinutes = Math.ceil(words / 250);

      setDocInfo({
        name: file.name,
        pages: numPages,
        sizeKB: Math.round(file.size / 1024),
        words,
        readMinutes,
        fullText,
        pageTexts,
      });
    } catch (err: any) {
      toast({ title: "PDF extraction failed", description: err.message || "Could not read this PDF.", variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) extractPDF(file);
  }, [extractPDF]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractPDF(file);
  }, [extractPDF]);

  const handleGenerate = useCallback(async () => {
    if (!docInfo || !isReady) return;
    summaryStreamRef.current = "";
    setSummaryOutput("");
    setIsGenerating(true);

    const userPrompt = buildSummaryPrompt(docInfo, summaryType, length, includeQuotes);
    const maxTokens = length === "detailed" ? 1500 : length === "medium" ? 1000 : 700;

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      maxTokens,
      onChunk: (text) => { summaryStreamRef.current = text; },
    });

    // Final sync — ensure last tokens are shown
    const final = result ?? summaryStreamRef.current;
    setSummaryOutput(final);
    setIsGenerating(false);
    if (final) setShowQA(true);
  }, [docInfo, isReady, summaryType, length, includeQuotes, generateRaw]);

  const handleAskQuestion = useCallback(async () => {
    if (!docInfo || !qaInput.trim() || !isReady || isAnswering) return;
    const question = qaInput.trim();
    setIsAnswering(true);
    setStreamingAnswer("");
    setQaInput("");

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildQAPrompt(docInfo, question) },
      ],
      temperature: 0.2,
      maxTokens: 1000,
      onChunk: (text) => { answerStreamRef.current = text; },
    });

    const finalAnswer = (result ?? answerStreamRef.current) || "Unable to answer based on the document.";
    answerStreamRef.current = "";
    setStreamingAnswer("");
    setQaItems(prev => [{ question, answer: finalAnswer }, ...prev]);
    setIsAnswering(false);
  }, [docInfo, qaInput, isReady, isAnswering, generateRaw]);

  const handleCopy = useCallback(() => {
    if (!summaryOutput) return;
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summaryOutput]);

  const copySection = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  }, []);

  const suggestedQuestions = [
    "What are the main conclusions?",
    "What data supports the key argument?",
    "What are the study limitations?",
    "What solutions are proposed?",
    "Who is the target audience?",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Upload Zone */}
      {!docInfo && !extracting && (
        <div
          data-testid="upload-zone"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
            dragOver
              ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 scale-[1.01]"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Upload className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Drag & Drop PDF Here</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">or click to choose file</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">PDF only</span>
              <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">Max 50 MB</span>
              <span className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">Files never uploaded</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
            data-testid="input-file-upload"
          />
        </div>
      )}

      {/* Extraction Progress */}
      {extracting && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Extracting PDF text…</h3>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${extractProgress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{extractProgress}% complete — processing pages locally in your browser</p>
        </div>
      )}

      {/* Doc Info + Settings */}
      {docInfo && !extracting && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
          {/* Doc Info Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate" data-testid="text-doc-name">{docInfo.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span data-testid="text-doc-pages">{docInfo.pages} pages</span>
                    <span>{(docInfo.sizeKB / 1024).toFixed(1)} MB</span>
                    <span>{docInfo.words.toLocaleString()} words</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {docInfo.readMinutes} min read → save ~{docInfo.readMinutes - 2} min
                    </span>
                  </div>
                </div>
              </div>
              <button
                data-testid="button-remove-pdf"
                onClick={() => { setDocInfo(null); setSummaryOutput(""); setQaItems([]); setShowQA(false); }}
                className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Remove PDF"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Summary Settings</h3>

            {/* Summary Type */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Summary Type</label>
              <div className="grid grid-cols-2 gap-2">
                {SUMMARY_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      data-testid={`button-summary-type-${type.id}`}
                      onClick={() => setSummaryType(type.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        summaryType === type.id
                          ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500"
                          : "border-slate-200 dark:border-slate-600 hover:border-purple-200 dark:hover:border-purple-700"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${summaryType === type.id ? "text-purple-500" : "text-slate-400"}`} />
                      <div>
                        <p className={`text-sm font-medium ${summaryType === type.id ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-200"}`}>{type.label}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{type.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Length</label>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <button
                    key={l.id}
                    data-testid={`button-length-${l.id}`}
                    onClick={() => setLength(l.id)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      length === l.id
                        ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 dark:border-purple-500"
                        : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-purple-200"
                    }`}
                  >
                    <span className="block">{l.label}</span>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 font-normal">{l.words}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <button
                data-testid="toggle-include-quotes"
                onClick={() => setIncludeQuotes(v => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${includeQuotes ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"}`}
                aria-label="Toggle key quotes"
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${includeQuotes ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">Include key quotes</span>
            </div>

            {/* Model Loading Warning */}
            {isModelLoading && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">AI model loading…</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{progress.text}</p>
                </div>
              </div>
            )}

            {llmError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {llmError}
              </div>
            )}

            {/* Generate Button */}
            <button
              data-testid="button-generate-summary"
              onClick={handleGenerate}
              disabled={!isReady || isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200/40 dark:shadow-purple-900/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating summary…
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Summarize PDF
                </>
              )}
            </button>
          </div>

          {/* Streaming view — raw text while generating */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100">
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                  Writing summary…
                </div>
                <div className="p-5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm min-h-[80px]">
                  {summaryOutput
                    ? <>{summaryOutput}<span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 align-middle animate-pulse" /></>
                    : <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic">
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                        Reading your document — first words will appear shortly…
                      </span>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final parsed sections — shown after generation completes */}
          <AnimatePresence>
            {!isGenerating && summaryOutput && (() => {
              const sections = parseSections(summaryOutput);
              // Fallback: no parseable sections → show raw text in one card
              if (sections.length === 0) {
                return (
                  <motion.div key="raw" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                        <FileText className="w-4 h-4 text-purple-500" /> PDF Summary
                      </div>
                      <div className="flex gap-2">
                        <button data-testid="button-regenerate" onClick={handleGenerate} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors" aria-label="Regenerate"><RotateCcw className="w-4 h-4" /></button>
                        <button data-testid="button-copy-summary" onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div data-testid="text-summary-output" className="p-5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{summaryOutput}</div>
                  </motion.div>
                );
              }

              const sectionMeta: Record<string, { icon: typeof FileText; accent: string; bg: string; border: string }> = {
                "Summary": { icon: FileText, accent: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-700/40" },
                "Key Insights": { icon: Lightbulb, accent: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-700/40" },
                "Key Quotes": { icon: Quote, accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-700/40" },
              };
              const defaultMeta = { icon: FileText, accent: "text-slate-600 dark:text-slate-300", bg: "bg-slate-50 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" };

              return (
                <motion.div key="sections" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                  {/* Copy All + Regenerate row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{sections.length} section{sections.length !== 1 ? "s" : ""} generated</span>
                    <div className="flex gap-2">
                      <button data-testid="button-regenerate" onClick={handleGenerate}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-medium transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                      <button data-testid="button-copy-summary" onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-medium transition-colors">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy All"}
                      </button>
                    </div>
                  </div>

                  {sections.map((section, si) => {
                    const meta = sectionMeta[section.title] || defaultMeta;
                    const Icon = meta.icon;
                    const lines = section.content.split("\n").filter(l => l.trim());
                    const isInsights = section.title === "Key Insights";
                    const isQuotes = section.title === "Key Quotes";

                    return (
                      <motion.div key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: si * 0.08 }}
                        className={`rounded-2xl border ${meta.border} overflow-hidden`}>
                        {/* Section header */}
                        <div className={`flex items-center justify-between px-5 py-3.5 ${meta.bg} border-b ${meta.border}`}>
                          <div className={`flex items-center gap-2 font-semibold text-sm ${meta.accent}`}>
                            <Icon className="w-4 h-4" />
                            {section.title}
                          </div>
                          <button
                            data-testid={`button-copy-section-${si}`}
                            onClick={() => copySection(section.title, section.content)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                          >
                            {copiedSection === section.title ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedSection === section.title ? "Copied" : "Copy"}
                          </button>
                        </div>

                        {/* Section body */}
                        <div className="p-5 bg-white dark:bg-slate-800">
                          {isInsights ? (
                            // Numbered insight cards
                            <ol className="space-y-3" data-testid="text-key-insights">
                              {lines.map((line, li) => {
                                const clean = cleanLine(line.replace(/^\d+\.\s*/, ""));
                                const colonIdx = clean.indexOf(":");
                                const label = colonIdx > 0 ? clean.slice(0, colonIdx).trim() : null;
                                const body = colonIdx > 0 ? clean.slice(colonIdx + 1).trim() : clean;
                                return (
                                  <li key={li} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">{li + 1}</span>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                      {label && <strong className="font-semibold text-slate-800 dark:text-slate-100">{label}: </strong>}{body}
                                    </span>
                                  </li>
                                );
                              })}
                            </ol>
                          ) : isQuotes ? (
                            // Quote blocks
                            <div className="space-y-3" data-testid="text-key-quotes">
                              {lines.map((line, li) => {
                                const clean = line.replace(/^\d+\.\s*/, "").trim();
                                // Extract [Page X] citation if present
                                const pageMatch = clean.match(/\[Page\s*\d+\]/i);
                                const citation = pageMatch ? pageMatch[0] : null;
                                const quoteText = clean.replace(/\[Page\s*\d+\]/gi, "").replace(/^[""]|[""]$/g, "").trim();
                                return (
                                  <div key={li} className="flex gap-3">
                                    <span className="text-emerald-300 dark:text-emerald-600 text-xl font-serif leading-none mt-1 shrink-0">"</span>
                                    <div>
                                      <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{quoteText}</p>
                                      {citation && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{citation}</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            // Summary prose
                            <div data-testid="text-summary-output" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {section.content}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Q&A Section */}
          <AnimatePresence>
            {showQA && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    Ask Questions About This PDF
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Question input */}
                  <div className="flex gap-2">
                    <input
                      ref={qaInputRef}
                      data-testid="input-qa-question"
                      type="text"
                      value={qaInput}
                      onChange={e => setQaInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAskQuestion()}
                      placeholder="Ask a question about this PDF…"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                    <button
                      data-testid="button-ask-question"
                      onClick={handleAskQuestion}
                      disabled={!qaInput.trim() || !isReady || isAnswering}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                      aria-label="Ask question"
                    >
                      {isAnswering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Suggested questions */}
                  {qaItems.length === 0 && (
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map(q => (
                        <button
                          key={q}
                          data-testid={`button-suggested-q-${q.slice(0, 10)}`}
                          onClick={() => setQaInput(q)}
                          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Streaming answer */}
                  {isAnswering && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">A</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                          {streamingAnswer || <span className="italic text-slate-300 dark:text-slate-600 text-xs">Searching document…</span>}
                          {streamingAnswer && <span className="inline-block w-0.5 h-3.5 bg-purple-500 ml-0.5 align-middle animate-pulse" />}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {qaItems.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Q</span>
                          </div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.question}</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">A</span>
                          </div>
                          <p data-testid={`text-qa-answer-${i}`} className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{item.answer}</p>
                        </div>
                        {i < qaItems.length - 1 && <div className="border-b border-slate-100 dark:border-slate-700 mt-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
