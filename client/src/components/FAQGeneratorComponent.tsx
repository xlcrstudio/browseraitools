import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, Code2, ChevronDown, FileText
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useFAQStorage } from "@/hooks/use-faq-storage";

const QUESTION_COUNTS = [
  { value: 5, label: "5 Questions" },
  { value: 10, label: "10 Questions" },
  { value: 20, label: "20 Questions" },
];

const ANSWER_LENGTHS = [
  { id: "brief", label: "Brief", desc: "1-2 sentences" },
  { id: "standard", label: "Standard", desc: "2-3 sentences" },
  { id: "detailed", label: "Detailed", desc: "Full paragraph" },
];

const FAQ_TYPES = [
  { id: "general", label: "General Information" },
  { id: "howto", label: "How-To / Tutorial" },
  { id: "product", label: "Product / Service" },
  { id: "support", label: "Technical Support" },
];

const EXAMPLE_TOPIC = "Artificial intelligence in healthcare: how AI is being used to improve medical diagnosis, treatment planning, drug discovery, and patient care. Machine learning algorithms analyze medical images, electronic health records, and genomic data to assist doctors in making more accurate diagnoses and personalizing treatment plans.";

const SYSTEM_PROMPT = `You are an expert FAQ creator specializing in SEO, natural language questions, and comprehensive answers. You generate professional FAQs that are optimized for search engines and ready for website use.`;

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  brief: "Keep each answer to 1-2 clear sentences. Be concise and direct.",
  standard: "Write 2-3 sentences per answer. Start with a direct answer, then add context.",
  detailed: "Write a full paragraph (4-6 sentences) for each answer. Be comprehensive and thorough.",
};

const TYPE_INSTRUCTIONS: Record<string, string> = {
  general: "Focus on informational questions that explain concepts, definitions, benefits, and comparisons.",
  howto: "Focus on process-oriented questions: how to do things, step-by-step guidance, best practices, and tips.",
  product: "Focus on product/service questions: features, pricing, comparisons, use cases, and customer concerns.",
  support: "Focus on troubleshooting questions: common issues, error fixes, setup guidance, and technical requirements.",
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQResult {
  id: string;
  title: string;
  items: FAQItem[];
}

function parseFAQs(raw: string): FAQResult {
  const lines = raw.trim().split("\n");
  let title = "";
  const items: FAQItem[] = [];

  const firstLine = lines[0]?.trim() || "";
  if (firstLine && !firstLine.match(/^(Q\d|Q:|Question|\d+[\.\)])/i)) {
    title = firstLine.replace(/^#+\s*/, "").replace(/^\*{2}(.*)\*{2}$/, "$1").replace(/^FAQs?:?\s*/i, "").trim();
    lines.shift();
  }

  let currentQ = "";
  let currentA = "";

  const flushQA = () => {
    if (currentQ && currentA) {
      items.push({
        id: generateId(),
        question: currentQ.trim(),
        answer: currentA.trim(),
      });
    }
    currentQ = "";
    currentA = "";
  };

  const STOP_PATTERNS = /^(SEO\s|Quality\s|Score|Coverage|Analysis|Note:|Tips?:|---|\*\*\*|#{2,})/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (items.length > 0 && STOP_PATTERNS.test(trimmed)) {
      flushQA();
      break;
    }

    const qMatch = trimmed.match(/^(?:Q\d*[\.:]\s*|Question\s*\d*[\.:]\s*|\d+[\.)]\s*(?:Q[\.:]\s*)?)\**(.+?)\**$/i);
    if (qMatch) {
      flushQA();
      currentQ = qMatch[1].trim();
      continue;
    }

    const boldQMatch = trimmed.match(/^\*\*(?:Q\d*[\.:])?\s*(.+?)\*\*$/);
    if (boldQMatch && !currentQ) {
      flushQA();
      currentQ = boldQMatch[1].trim();
      continue;
    }

    const aMatch = trimmed.match(/^(?:A\d*[\.:]\s*|Answer[\.:]\s*)(.*)/i);
    if (aMatch && currentQ) {
      currentA = aMatch[1].trim();
      continue;
    }

    if (currentQ && !currentA) {
      if (trimmed.length > 10 && !trimmed.match(/^(Q\d|Question|\d+[\.\)])/i)) {
        currentA = trimmed;
      }
      continue;
    }

    if (currentQ && currentA) {
      currentA += " " + trimmed;
    }
  }
  flushQA();

  return { id: generateId(), title, items };
}

function generateSchemaMarkup(items: FAQItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return JSON.stringify(schema, null, 2);
}

function generateHTML(result: FAQResult): string {
  let html = "";
  if (result.title) html += `<h2>${result.title}</h2>\n\n`;
  html += '<div class="faq-section">\n';
  for (const item of result.items) {
    html += `  <div class="faq-item">\n`;
    html += `    <h3>${item.question}</h3>\n`;
    html += `    <p>${item.answer}</p>\n`;
    html += `  </div>\n`;
  }
  html += '</div>';
  return html;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function FAQGeneratorComponent() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useFAQStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [answerLength, setAnswerLength] = useState("standard");
  const [faqType, setFaqType] = useState("general");

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<FAQResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [showSchema, setShowSchema] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<Set<string>>(new Set());

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = topic.trim().length >= 10;
  const srcWordCount = wordCount(topic);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (!result) return;
    setExpandedFAQ(new Set(result.items.map(i => i.id)));
  };

  const collapseAll = () => setExpandedFAQ(new Set());

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setShowSchema(false); setExpandedFAQ(new Set());

    const typeName = FAQ_TYPES.find(t => t.id === faqType)?.label || "General Information";
    const lengthName = ANSWER_LENGTHS.find(l => l.id === answerLength)?.label || "Standard";

    const prompt = `Generate ${questionCount} frequently asked questions (FAQs) about the following topic.

TOPIC/CONTENT:
${topic}

FAQ TYPE: ${typeName}
${TYPE_INSTRUCTIONS[faqType] || TYPE_INSTRUCTIONS.general}

ANSWER LENGTH: ${lengthName}
${LENGTH_INSTRUCTIONS[answerLength] || LENGTH_INSTRUCTIONS.standard}

REQUIREMENTS:
- Generate exactly ${questionCount} question-answer pairs
- Use natural language questions (how people actually search)
- Start with a title line summarizing the FAQ topic
- Format each as "Q1: [question]" followed by "A: [answer]" on the next line
- Include a mix of question types: What, How, Why, Can/Does, When, Who
- Cover the topic comprehensively
- Make answers clear, accurate, and SEO-friendly
- Each answer should directly address the question first

Start with a descriptive title, then list all ${questionCount} Q&A pairs.`;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: questionCount <= 5 ? 2048 : questionCount <= 10 ? 3500 : 4096,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw FAQ output:", finalContent);
      const parsed = parseFAQs(finalContent);
      if (parsed.items.length === 0) {
        setEmptyError("Could not parse FAQ output. Please try again.");
      } else {
        setResult(parsed);
        setExpandedFAQ(new Set(parsed.items.slice(0, 3).map(i => i.id)));
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setTopic(""); setQuestionCount(10); setAnswerLength("standard");
    setFaqType("general"); setStreamedContent(""); setResult(null);
    setIsDone(false); setCopiedId(null); setSaved(false);
    setEmptyError(""); setShowSchema(false); setExpandedFAQ(new Set());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = (result.title ? `${result.title}\n\n` : "") +
      result.items.map((item, i) => `Q${i + 1}: ${item.question}\nA: ${item.answer}`).join("\n\n");
    handleCopy(text, "all");
  };

  const handleDownloadHTML = () => {
    if (!result) return;
    const html = generateHTML(result);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "faqs.html"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    if (!result) return;
    const schema = generateSchemaMarkup(result.items);
    const blob = new Blob([schema], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "faq-schema.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    saveDraft({
      label: topic.slice(0, 60),
      content: JSON.stringify(result),
      formData: { topic, questionCount, answerLength, faqType },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setTopic(fd.topic || "");
    setQuestionCount(fd.questionCount); setAnswerLength(fd.answerLength);
    setFaqType(fd.faqType);
    try {
      const restored: FAQResult = JSON.parse(draft.content);
      if (restored && restored.items?.length > 0) {
        setResult(restored);
        setExpandedFAQ(new Set(restored.items.slice(0, 3).map(i => i.id)));
      }
    } catch {
      const parsed = parseFAQs(draft.content);
      if (parsed.items.length > 0) {
        setResult(parsed);
        setExpandedFAQ(new Set(parsed.items.slice(0, 3).map(i => i.id)));
      }
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="faq-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="faq-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved FAQs</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved FAQs" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved FAQ" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="faq-topic" className="text-sm font-semibold text-slate-700 ml-1">Topic or Content *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setTopic(EXAMPLE_TOPIC)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="faq-topic" data-testid="input-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={"Enter a topic or paste article content...\n\nExamples:\n- 'Artificial intelligence in healthcare'\n- 'Electric vehicle charging'\n- Or paste a full article for context"} maxLength={3000} rows={5} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{srcWordCount} words</span>
                <span>{topic.length}/3,000</span>
              </div>
            </div>
            {topic.length > 0 && topic.trim().length < 10 && (
              <p className="text-xs text-amber-600 ml-1 mt-1" data-testid="text-min-length-hint">Minimum 10 characters required ({10 - topic.trim().length} more needed)</p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Number of Questions *</legend>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNTS.map((qc) => (
                <button key={qc.value} data-testid={`button-count-${qc.value}`} type="button" onClick={() => setQuestionCount(qc.value)} aria-pressed={questionCount === qc.value} className={cn("px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", questionCount === qc.value ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-300")}>
                  {qc.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Answer Length</legend>
            <div className="grid grid-cols-3 gap-2">
              {ANSWER_LENGTHS.map((al) => (
                <button key={al.id} data-testid={`button-length-${al.id}`} type="button" onClick={() => setAnswerLength(al.id)} aria-pressed={answerLength === al.id} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all", answerLength === al.id ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                  <span className={cn("font-semibold text-sm", answerLength === al.id ? "text-purple-800" : "text-slate-700")}>{al.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{al.desc}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="faq-type" className="text-sm font-semibold text-slate-700 ml-1">FAQ Type</label>
            <select id="faq-type" data-testid="select-faq-type" value={faqType} onChange={(e) => setFaqType(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm">
              {FAQ_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {(state === "checking-gpu" || state === "downloading") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button data-testid="button-generate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className={cn("flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3", isFormValid && !isGenerating && isReady ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Generating FAQs...</>) : (<><HelpCircle className="w-5 h-5" /> Generate FAQs</>)}
          </button>
          <button data-testid="button-reset" type="button" onClick={handleReset} disabled={isGenerating} className={cn("px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2", isGenerating ? "border-slate-200 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50")}>
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {emptyError && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3" data-testid="alert-empty-result">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{emptyError}</p>
        </div>
      )}

      {isGenerating && streamedContent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Generating FAQs...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && result.items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  {result.title || "Generated FAQs"}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5" data-testid="text-faq-count">{result.items.length} questions generated</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-expand-all" onClick={expandAll} className="text-xs font-medium text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Expand All</button>
                <button data-testid="button-collapse-all" onClick={collapseAll} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">Collapse All</button>
              </div>
            </div>

            <div className="space-y-2">
              {result.items.map((item, idx) => {
                const isOpen = expandedFAQ.has(item.id);
                const panelId = `faq-panel-${item.id}`;
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" data-testid={`card-faq-${idx}`}>
                    <button type="button" onClick={() => toggleFAQ(item.id)} data-testid={`button-toggle-faq-${idx}`} aria-expanded={isOpen} aria-controls={panelId} className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">Q{idx + 1}</span>
                      <span className="flex-1 font-semibold text-slate-800 text-sm leading-snug">{item.question}</span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div id={panelId} className="px-4 pb-4 pl-14">
                            <p className="text-sm text-slate-600 leading-relaxed" data-testid={`text-answer-${idx}`}>{item.answer}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <button data-testid={`button-copy-qa-${idx}`} onClick={() => handleCopy(`Q: ${item.question}\nA: ${item.answer}`, `qa-${idx}`)} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                                {copiedId === `qa-${idx}` ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copiedId === `qa-${idx}` ? "Copied" : "Copy"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <button data-testid="button-toggle-schema" onClick={() => setShowSchema(!showSchema)} aria-expanded={showSchema} aria-controls="faq-schema-panel" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <Code2 className="w-4 h-4" /> {showSchema ? "Hide Schema" : "Schema Markup"}
              </button>
              <button data-testid="button-download-html" onClick={handleDownloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <FileText className="w-4 h-4" /> HTML
              </button>
              <button data-testid="button-download-json" onClick={handleDownloadJSON} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <Download className="w-4 h-4" /> JSON
              </button>
              <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved" : "Save"}
              </button>
              <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
            </div>

            <AnimatePresence>
              {showSchema && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div id="faq-schema-panel" className="bg-slate-900 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-purple-400" /> FAQ Schema Markup (JSON-LD)</h4>
                      <div className="flex items-center gap-2">
                        <button data-testid="button-copy-schema" onClick={() => handleCopy(generateSchemaMarkup(result.items), "schema")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                          {copiedId === "schema" ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedId === "schema" ? "Copied!" : "Copy Schema"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Copy this code and add it to your page's &lt;head&gt; section for SEO benefits:</p>
                    <pre className="text-xs text-emerald-300 bg-slate-950 rounded-xl p-4 overflow-x-auto max-h-[300px] overflow-y-auto leading-relaxed" data-testid="text-schema-output">
                      {`<script type="application/ld+json">\n${generateSchemaMarkup(result.items)}\n</script>`}
                    </pre>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {[
                        "Shows in Google results",
                        "Increases click-through",
                        "Improves SEO ranking",
                        "Rich snippets in SERPs",
                      ].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
