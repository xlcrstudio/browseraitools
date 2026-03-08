import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Loader2, AlertTriangle, Upload, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ChevronDown, Lightbulb, Quote, BarChart3,
  ListChecks, HelpCircle, BookOpen, Sparkles, X, ShieldCheck
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useDocumentAnalyzerStorage,
  type DocumentAnalysis,
} from "@/hooks/use-document-analyzer-storage";

const DOC_TYPES = [
  { value: "research", label: "Research Paper" },
  { value: "legal", label: "Legal Contract" },
  { value: "business", label: "Business Report" },
  { value: "article", label: "Article" },
  { value: "textbook", label: "Textbook Chapter" },
  { value: "other", label: "Other" },
];

const ANALYSIS_OPTIONS = [
  { value: "summary", label: "Full Summary", icon: FileText },
  { value: "insights", label: "Key Insights", icon: Lightbulb },
  { value: "simplified", label: "Simplified (ELI5)", icon: BookOpen },
  { value: "quotes", label: "Important Quotes", icon: Quote },
  { value: "stats", label: "Key Statistics", icon: BarChart3 },
  { value: "actions", label: "Action Items", icon: ListChecks },
  { value: "questions", label: "Study Questions", icon: HelpCircle },
];

const READING_LEVELS = [
  { value: "general", label: "General" },
  { value: "highschool", label: "Student (High School)" },
  { value: "college", label: "Student (College)" },
  { value: "professional", label: "Professional" },
  { value: "executive", label: "Executive" },
  { value: "eli12", label: "Explain Like I'm 12" },
];

const LENGTH_PREFS = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

const MAX_CHARS = 200000;
const TRUNCATE_FOR_LLM = 4000;

const SYSTEM_PROMPT = `You are a document analyst. Analyze text accurately. Only use information from the provided text. Never invent facts.`;

export function DocumentAnalyzerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useDocumentAnalyzerStorage();

  const [documentText, setDocumentText] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [docType, setDocType] = useState("article");
  const [fileName, setFileName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["summary", "insights"]);
  const [readingLevel, setReadingLevel] = useState("general");
  const [lengthPref, setLengthPref] = useState("balanced");
  const [focusAreas, setFocusAreas] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extractStats, setExtractStats] = useState(true);
  const [extractQuotes, setExtractQuotes] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? (prev.length > 1 ? prev.filter((o) => o !== opt) : prev) : [...prev, opt]
    );
  };

  const handleReset = () => {
    setDocumentText(""); setDocumentTitle(""); setDocType("article"); setFileName("");
    setSelectedOptions(["summary", "insights"]); setReadingLevel("general");
    setLengthPref("balanced"); setFocusAreas("");
    setShowAdvanced(false); setExtractStats(true); setExtractQuotes(true);
    setStreamingText(""); setCurrentAnalysis(null); setCopiedId(null);
    setPdfError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = async (file: File) => {
    setPdfError(null);
    setIsLoadingPdf(true);
    setFileName(file.name);

    const titleFromName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setDocumentTitle(titleFromName);

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      try {
        const text = await file.text();
        setDocumentText(text.slice(0, MAX_CHARS));
      } catch {
        setPdfError("Failed to read text file.");
      }
      setIsLoadingPdf(false);
      return;
    }

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        const workerUrl = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url);
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.href;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;

        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 50);
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n\n";
          if (fullText.length > MAX_CHARS) break;
        }

        const trimmed = fullText.slice(0, MAX_CHARS).trim();
        if (trimmed.length < 50) {
          setPdfError("Could not extract enough text from this PDF. It may be image-based or scanned. Try pasting the text manually.");
        } else {
          setDocumentText(trimmed);
          if (pdf.numPages > 10) setDocType("research");
        }
      } catch (err) {
        console.error("PDF parsing error:", err);
        setPdfError("Failed to parse PDF. The file may be corrupted or password-protected. Try pasting the text instead.");
      }
      setIsLoadingPdf(false);
      return;
    }

    setPdfError(`Unsupported file type: ${file.type || file.name.split(".").pop()}. Please use PDF or TXT files, or paste your text directly.`);
    setIsLoadingPdf(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const [generationProgress, setGenerationProgress] = useState("");

  const generateSection = async (textForLLM: string, sectionType: string, levelLabel: string, lengthLabel: string): Promise<string> => {
    const lengthHint = lengthPref === "concise" ? "Be brief, 2-4 sentences." : lengthPref === "detailed" ? "Be thorough and detailed." : "";

    const prompts: Record<string, string> = {
      summary: `Write a summary of this document in 2-3 paragraphs. ${lengthHint} Only use facts from the text.

Document text:
${textForLLM}

Summary:`,
      insights: `List the 5 most important insights from this document. Write each as a bullet point starting with "- ". ${lengthHint} Only use facts from the text.

Document text:
${textForLLM}

Key Insights:
- `,
      simplified: `Explain this document in very simple terms that a ${levelLabel === "Explain Like I'm 12" ? "12-year-old" : "non-expert"} would understand. ${lengthHint} Only use facts from the text.

Document text:
${textForLLM}

Simple Explanation:`,
      quotes: `List the 3-5 most important direct quotes from this document. Copy exact phrases from the text. Write each quote on its own line starting with ">> ".

Document text:
${textForLLM}

Important Quotes:
>> `,
      stats: `List every number, percentage, dollar amount, date, and statistic mentioned in this document. Write each as a bullet starting with "- ".

Document text:
${textForLLM}

Key Statistics:
- `,
      actions: `Based on this document, list 3-5 specific action items or next steps someone should take. Write each as a bullet starting with "- ".

Document text:
${textForLLM}

Action Items:
- `,
      questions: `Write 5 thoughtful study or discussion questions based on this document. Write each on its own line starting with "Q: ".

Document text:
${textForLLM}

Study Questions:
Q: `,
    };

    const prompt = prompts[sectionType];
    if (!prompt) return "";

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: sectionType === "summary" || sectionType === "simplified" ? 800 : 600,
      onChunk: () => {},
    });

    return result || "";
  };

  const parseBulletList = (text: string, minLength: number = 10): string[] => {
    return text.split("\n")
      .map((l) => l.trim().replace(/^[-*\u2022\d.)\]]+\s*/, "").trim())
      .filter((l) => l.length >= minLength);
  };

  const parseQuoteList = (text: string): string[] => {
    return text.split("\n")
      .map((l) => l.trim().replace(/^>>?\s*/, "").replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, "").replace(/^[-*\u2022]\s*/, "").trim())
      .filter((l) => l.length >= 15);
  };

  const parseQuestionList = (text: string): string[] => {
    return text.split("\n")
      .map((l) => l.trim().replace(/^Q\d*[.:)]\s*/i, "").replace(/^[-*\u2022\d.)\]]+\s*/, "").trim())
      .filter((l) => l.length >= 10);
  };

  const handleGenerate = async () => {
    if (!documentText.trim() || documentText.trim().length < 50) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentAnalysis(null);
    setGenerationProgress("");

    const textForLLM = documentText.slice(0, TRUNCATE_FOR_LLM);
    const levelLabel = READING_LEVELS.find((l) => l.value === readingLevel)?.label || "General";
    const lengthLabel = LENGTH_PREFS.find((l) => l.value === lengthPref)?.label || "Balanced";

    const sectionsToGenerate: string[] = [...selectedOptions];
    if (extractStats && !sectionsToGenerate.includes("stats")) sectionsToGenerate.push("stats");
    if (extractQuotes && !sectionsToGenerate.includes("quotes")) sectionsToGenerate.push("quotes");

    const sectionLabels: Record<string, string> = {
      summary: "Summary", insights: "Key Insights", simplified: "Simplified Explanation",
      quotes: "Important Quotes", stats: "Key Statistics", actions: "Action Items", questions: "Study Questions",
    };

    const results: Record<string, string> = {};
    let allRawText = "";

    try {
      for (let i = 0; i < sectionsToGenerate.length; i++) {
        const section = sectionsToGenerate[i];
        const label = sectionLabels[section] || section;
        setGenerationProgress(`Generating ${label}... (${i + 1}/${sectionsToGenerate.length})`);
        setStreamingText(allRawText + `\n\n--- Generating ${label}... ---`);

        const sectionResult = await generateSection(textForLLM, section, levelLabel, lengthLabel);
        results[section] = sectionResult;
        allRawText += `\n\n${label.toUpperCase()}:\n${sectionResult}`;
        setStreamingText(allRawText.trim());
      }

      const analysis: DocumentAnalysis = {
        id: generateId(),
        documentTitle: documentTitle || "Untitled Document",
        documentType: docType,
        charCount: documentText.length,
        analysisOptions: selectedOptions,
        readingLevel,
        lengthPref,
        rawText: allRawText.trim(),
        summary: (results.summary || "").trim(),
        keyInsights: results.insights ? parseBulletList(results.insights) : [],
        simplifiedExplanation: (results.simplified || "").trim(),
        importantQuotes: results.quotes ? parseQuoteList(results.quotes) : [],
        keyStats: results.stats ? parseBulletList(results.stats, 5) : [],
        actionItems: results.actions ? parseBulletList(results.actions, 5) : [],
        studyQuestions: results.questions ? parseQuestionList(results.questions) : [],
        createdAt: new Date().toISOString(),
      };
      setCurrentAnalysis(analysis);
      saveAnalysis(analysis);
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate = state === "ready" && documentText.trim().length >= 50 && selectedOptions.length > 0 && !isGenerating;

  const buildFullText = () => {
    if (!currentAnalysis) return "";
    const hasStructured = currentAnalysis.summary || currentAnalysis.keyInsights.length > 0;
    if (!hasStructured && currentAnalysis.rawText) return currentAnalysis.rawText;
    const parts: string[] = [];
    if (currentAnalysis.summary) { parts.push("SUMMARY:"); parts.push(currentAnalysis.summary); parts.push(""); }
    if (currentAnalysis.keyInsights.length > 0) { parts.push("KEY INSIGHTS:"); currentAnalysis.keyInsights.forEach((i) => parts.push(`- ${i}`)); parts.push(""); }
    if (currentAnalysis.simplifiedExplanation) { parts.push("SIMPLIFIED EXPLANATION:"); parts.push(currentAnalysis.simplifiedExplanation); parts.push(""); }
    if (currentAnalysis.importantQuotes.length > 0) { parts.push("IMPORTANT QUOTES:"); currentAnalysis.importantQuotes.forEach((q) => parts.push(`"${q}"`)); parts.push(""); }
    if (currentAnalysis.keyStats.length > 0) { parts.push("KEY STATISTICS:"); currentAnalysis.keyStats.forEach((s) => parts.push(`- ${s}`)); parts.push(""); }
    if (currentAnalysis.actionItems.length > 0) { parts.push("ACTION ITEMS:"); currentAnalysis.actionItems.forEach((a) => parts.push(`- ${a}`)); parts.push(""); }
    if (currentAnalysis.studyQuestions.length > 0) { parts.push("STUDY QUESTIONS:"); currentAnalysis.studyQuestions.forEach((q) => parts.push(`Q: ${q}`)); parts.push(""); }
    return parts.join("\n");
  };

  const hasAnyOutput = currentAnalysis && (
    currentAnalysis.summary || currentAnalysis.keyInsights.length > 0 ||
    currentAnalysis.simplifiedExplanation || currentAnalysis.importantQuotes.length > 0 ||
    currentAnalysis.keyStats.length > 0 || currentAnalysis.actionItems.length > 0 ||
    currentAnalysis.studyQuestions.length > 0 || currentAnalysis.rawText
  );

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-document-analyzer">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Document or Paste Text *</label>
            <div
              data-testid="dropzone-upload"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
                fileName ? "border-purple-300 bg-purple-50/30" : "border-slate-200 bg-slate-50/30 hover:border-purple-300"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="hidden"
                data-testid="input-file-upload"
              />
              {isLoadingPdf ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  <span className="text-sm text-purple-600 font-medium">Extracting text from {fileName}...</span>
                </div>
              ) : fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-purple-700 font-medium" data-testid="text-file-name">{fileName}</span>
                  <button data-testid="button-clear-file" onClick={(e) => { e.stopPropagation(); setFileName(""); setDocumentText(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="ml-2 p-1 rounded-full hover:bg-purple-100 transition-colors">
                    <X className="w-4 h-4 text-purple-500" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Drop a PDF or TXT file here, or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">Supports .pdf and .txt (max ~50 pages)</p>
                </div>
              )}
            </div>
            {pdfError && (
              <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2" data-testid="text-pdf-error">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm text-amber-700">{pdfError}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="paste-text" className="block text-sm font-semibold text-slate-700 mb-1.5">Or Paste Text Directly</label>
            <textarea
              id="paste-text"
              data-testid="input-paste-text"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste any article, research paper, contract, or report here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">{documentText.length > 0 ? `${documentText.length.toLocaleString()} characters` : "Paste or upload a document to analyze"}</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{documentText.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label htmlFor="doc-title" className="block text-sm font-semibold text-slate-700 mb-1.5">Document Title (optional)</label>
            <input
              id="doc-title"
              data-testid="input-doc-title"
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value.slice(0, 200))}
              placeholder="e.g., Q4 Financial Report, Research Paper on Climate Change"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Document Type</label>
            <div className="flex flex-wrap gap-2" data-testid="container-doc-type">
              {DOC_TYPES.map((dt) => (
                <button key={dt.value} data-testid={`toggle-doctype-${dt.value}`} onClick={() => setDocType(dt.value)}
                  className={cn("px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                    docType === dt.value ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}>{dt.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What Do You Need? (select one or more)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" data-testid="container-analysis-options">
              {ANALYSIS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.value} data-testid={`toggle-option-${opt.value}`} onClick={() => toggleOption(opt.value)}
                    className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left",
                      selectedOptions.includes(opt.value) ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reading-level" className="block text-sm font-semibold text-slate-700 mb-1.5">Reading Level</label>
              <select id="reading-level" data-testid="select-reading-level" value={readingLevel} onChange={(e) => setReadingLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all">
                {READING_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Length Preference</label>
              <div className="flex gap-2" data-testid="container-length-pref">
                {LENGTH_PREFS.map((l) => (
                  <button key={l.value} data-testid={`toggle-length-${l.value}`} onClick={() => setLengthPref(l.value)}
                    className={cn("flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                      lengthPref === l.value ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}>{l.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="focus-areas" className="block text-sm font-semibold text-slate-700 mb-1.5">Focus Areas (optional)</label>
            <input
              id="focus-areas"
              data-testid="input-focus-areas"
              type="text"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value.slice(0, 200))}
              placeholder='e.g., "Focus on financials", "Legal risks only", "Methodology section"'
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <button data-testid="button-toggle-advanced" onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} /> Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="pt-3 space-y-3">
                    <ToggleOption testId="toggle-extract-stats" label="Extract all numbers & statistics" value={extractStats} onChange={() => setExtractStats(!extractStats)} />
                    <ToggleOption testId="toggle-extract-quotes" label="Highlight important quotes" value={extractQuotes} onChange={() => setExtractQuotes(!extractQuotes)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button data-testid="button-generate" onClick={handleGenerate} disabled={!canGenerate}
              className={cn("flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-300 cursor-not-allowed"
              )}>
              {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" />Analyzing document...</>) : (<><ShieldCheck className="w-5 h-5" />Analyze Document Privately</>)}
            </button>
            <button data-testid="button-reset" onClick={handleReset} disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-streaming">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600">{generationProgress || "Analyzing document... 100% in-browser"}</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">{streamingText}</pre>
        </motion.div>
      )}

      {currentAnalysis && !isGenerating && hasAnyOutput && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6" data-testid="container-results">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Document Analysis</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentAnalysis.documentTitle} | {currentAnalysis.charCount.toLocaleString()} chars analyzed
              </p>
            </div>
            <div className="flex gap-2">
              <button data-testid="button-copy-all" onClick={() => copyToClipboard(buildFullText(), "all")}
                className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}>
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <FileText className="w-3.5 h-3.5" /> {Math.ceil(currentAnalysis.charCount / 4000)} pages (est.)
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local
            </div>
          </div>

          {currentAnalysis.summary && (
            <ResultSection title="Summary" icon={FileText} testId="container-summary"
              text={currentAnalysis.summary} copiedId={copiedId} onCopy={(text) => copyToClipboard(text, "summary")} copyId="summary" />
          )}

          {currentAnalysis.keyInsights.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-insights">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Key Insights ({currentAnalysis.keyInsights.length})</h3>
                </div>
                <CopyBtn id="insights" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.keyInsights.join("\n"), "insights")} />
              </div>
              <div className="space-y-2">
                {currentAnalysis.keyInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`insight-${i}`}>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-1" />
                    <span className="text-slate-700">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAnalysis.simplifiedExplanation && (
            <ResultSection title="Simplified Explanation" icon={BookOpen} testId="container-simplified"
              text={currentAnalysis.simplifiedExplanation} copiedId={copiedId} onCopy={(text) => copyToClipboard(text, "simplified")} copyId="simplified" />
          )}

          {currentAnalysis.importantQuotes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-quotes">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Important Quotes ({currentAnalysis.importantQuotes.length})</h3>
                </div>
                <CopyBtn id="quotes" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.importantQuotes.map((q) => `"${q}"`).join("\n"), "quotes")} />
              </div>
              <div className="space-y-3">
                {currentAnalysis.importantQuotes.map((quote, i) => (
                  <div key={i} className="p-3 rounded-xl border-l-4 border-purple-300 bg-purple-50/30 text-sm italic text-slate-700" data-testid={`quote-${i}`}>
                    "{quote}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAnalysis.keyStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-stats">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Key Statistics ({currentAnalysis.keyStats.length})</h3>
                </div>
                <CopyBtn id="stats" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.keyStats.join("\n"), "stats")} />
              </div>
              <div className="space-y-2">
                {currentAnalysis.keyStats.map((stat, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`stat-${i}`}>
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-1" />
                    <span className="text-slate-700">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAnalysis.actionItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-actions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Action Items ({currentAnalysis.actionItems.length})</h3>
                </div>
                <CopyBtn id="actions" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.actionItems.join("\n"), "actions")} />
              </div>
              <div className="space-y-2">
                {currentAnalysis.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`action-${i}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-1" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAnalysis.studyQuestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-questions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Study Questions ({currentAnalysis.studyQuestions.length})</h3>
                </div>
                <CopyBtn id="questions" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.studyQuestions.map((q) => `Q: ${q}`).join("\n"), "questions")} />
              </div>
              <div className="space-y-2">
                {currentAnalysis.studyQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`question-${i}`}>
                    <span className="text-purple-500 font-bold shrink-0">Q{i + 1}:</span>
                    <span className="text-slate-700">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!currentAnalysis.summary && currentAnalysis.keyInsights.length === 0 && currentAnalysis.rawText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-raw-analysis">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Document Analysis</h3>
              </div>
              <div className="prose prose-sm prose-slate max-w-none">
                {formatRawText(currentAnalysis.rawText)}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ResultSection({ title, icon: Icon, testId, text, copiedId, onCopy, copyId }: {
  title: string; icon: any; testId: string; text: string; copiedId: string | null;
  onCopy: (text: string) => void; copyId: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid={testId}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        <CopyBtn id={copyId} copiedId={copiedId} onClick={() => onCopy(text)} />
      </div>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

function CopyBtn({ id, copiedId, onClick }: { id: string; copiedId: string | null; onClick: () => void }) {
  return (
    <button data-testid={`button-copy-${id}`} onClick={onClick}
      className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
        copiedId === id ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
      )}>
      {copiedId === id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copiedId === id ? "Copied" : "Copy"}
    </button>
  );
}

function ToggleOption({ testId, label, value, onChange }: { testId: string; label: string; value: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button data-testid={testId} onClick={onChange}
        className={cn("w-10 h-6 rounded-full transition-colors relative shrink-0 ml-3", value ? "bg-purple-500" : "bg-slate-300")}>
        <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", value ? "left-5" : "left-1")} />
      </button>
    </label>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div><p className="text-sm font-semibold text-red-700">AI Engine Error</p><p className="text-sm text-red-600 mt-1">{error}</p></div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700">{state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}</span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}

function formatRawText(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) { elements.push(<br key={`br-${i}`} />); continue; }
    if (/^#{1,3}\s/.test(trimmed) || /^[A-Z][A-Z\s]{4,}:?\s*$/.test(trimmed) || /^━+/.test(trimmed)) {
      const heading = trimmed.replace(/^#{1,3}\s*/, "").replace(/^━+$/, "").replace(/:?\s*$/, "");
      if (heading) elements.push(<h4 key={`h-${i}`} className="font-bold text-slate-800 mt-3 mb-1">{heading}</h4>);
    } else if (/^[-*\u2022]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 text-sm text-slate-700 ml-2">
          <span className="text-purple-400 shrink-0 mt-0.5">-</span>
          <span>{trimmed.replace(/^[-*\u2022\d.)]+\s*/, "")}</span>
        </div>
      );
    } else if (/^>>/.test(trimmed) || /^"/.test(trimmed)) {
      elements.push(<div key={`q-${i}`} className="p-2 rounded-lg border-l-4 border-purple-300 bg-purple-50/30 text-sm italic text-slate-700 ml-2">{trimmed.replace(/^>>?\s*/, "")}</div>);
    } else if (/^Q\d*:/.test(trimmed)) {
      elements.push(<p key={`q-${i}`} className="text-sm font-semibold text-slate-800">{trimmed}</p>);
    } else {
      elements.push(<p key={`p-${i}`} className="text-sm text-slate-700 leading-relaxed">{trimmed}</p>);
    }
  }
  return <>{elements}</>;
}

