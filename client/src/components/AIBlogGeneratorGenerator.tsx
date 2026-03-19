import { useState, useRef, useCallback, useEffect } from "react";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper, Copy, Check, RotateCcw, Loader2, AlertCircle,
  ChevronRight, BarChart2, FileText, Download, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_KEYWORD_CHARS = 100;
const MAX_TOPIC_CHARS = 200;
const MAX_SECONDARY_CHARS = 250;

// ─── SEO scoring ─────────────────────────────────────────────────────────────
function computeSEO(keyword: string, title: string, meta: string, article: string) {
  let score = 0;
  const kw = keyword.toLowerCase().trim();
  const artLower = article.toLowerCase();

  if (title.toLowerCase().includes(kw)) score += 20;
  if (meta.toLowerCase().includes(kw)) score += 15;
  if (title.length >= 40 && title.length <= 65) score += 10;
  else if (title.length > 0) score += 5;
  if (meta.length >= 130 && meta.length <= 165) score += 10;
  else if (meta.length > 0) score += 5;

  const h2Count = (article.match(/^## /gm) || []).length;
  if (h2Count >= 3) score += 15;
  else if (h2Count > 0) score += 8;

  const firstPara = article.split("\n\n")[0] || "";
  if (firstPara.toLowerCase().includes(kw)) score += 10;

  const wordCount = article.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 800) score += 10;
  else if (wordCount >= 400) score += 5;

  const hasFAQ = artLower.includes("faq") || artLower.includes("frequently asked");
  if (hasFAQ) score += 5;

  const bulletCount = (article.match(/^[-*]\s/gm) || []).length;
  if (bulletCount >= 3) score += 5;

  return {
    score: Math.min(100, score),
    wordCount,
    h2Count,
    hasFAQ,
    kwInTitle: title.toLowerCase().includes(kw),
    kwInMeta: meta.toLowerCase().includes(kw),
    kwInFirstPara: firstPara.toLowerCase().includes(kw),
    titleLen: title.length,
    metaLen: meta.length,
  };
}

function scoreColor(s: number) {
  if (s >= 85) return { ring: "ring-emerald-400", text: "text-emerald-600 dark:text-emerald-400", label: "Excellent" };
  if (s >= 70) return { ring: "ring-blue-400", text: "text-blue-600 dark:text-blue-400", label: "Good" };
  if (s >= 50) return { ring: "ring-amber-400", text: "text-amber-600 dark:text-amber-400", label: "Fair" };
  return { ring: "ring-red-400", text: "text-red-600 dark:text-red-400", label: "Needs work" };
}

// ─── Section parser (same as other tools) ────────────────────────────────────
function parseSections(text: string): { title: string; content: string }[] {
  const result: { title: string; content: string }[] = [];
  const parts = text.split(/\n(?=##\s)/);
  for (const part of parts) {
    const m = part.match(/^##\s+(.+?)\n([\s\S]*)$/);
    if (m) result.push({ title: m[1].trim(), content: m[2].trim() });
  }
  return result;
}

// ─── Markdown article renderer ────────────────────────────────────────────────
function renderInline(str: string) {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function ArticleRenderer({ text }: { text: string }) {
  const elements: JSX.Element[] = [];
  const lines = text.split("\n");
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={key++} className="space-y-1.5 my-3 pl-1">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">•</span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={key++} className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 leading-snug">{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={key++} className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-6 mb-2 pt-4 border-t border-slate-100 dark:border-slate-700 first:border-none first:pt-0">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={key++} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1.5">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(<p key={key++} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{renderInline(line)}</p>);
    }
  }
  flushList();

  return <>{elements}</>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toMarkdown(title: string, meta: string, article: string) {
  return `# ${title}\n\n**Meta description:** ${meta}\n\n---\n\n${article}`;
}

function toHTML(title: string, meta: string, article: string) {
  const body = article
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)\n(?!<li>)/g, "$1\n</ul>\n")
    .replace(/(?<!<\/li>\n)(<li>)/g, "<ul>\n$1")
    .replace(/\n\n(?!<)/g, "\n<br/>\n")
    .replace(/^(?!<[hHlLu\/b]|\s*$)(.+)$/gm, "<p>$1</p>");
  return `<!DOCTYPE html>\n<html>\n<head><title>${title}</title>\n<meta name="description" content="${meta}">\n</head>\n<body>\n${body}\n</body>\n</html>`;
}

// ─── Options ──────────────────────────────────────────────────────────────────
const AUDIENCES = ["Beginners", "Professionals", "Students", "Business owners", "General readers", "Tech enthusiasts"];

const LENGTHS: Record<string, { label: string; words: string; maxTokens: number }> = {
  quick: { label: "Quick Read", words: "500–800 words", maxTokens: 1000 },
  standard: { label: "Standard", words: "1,000–1,500 words", maxTokens: 1600 },
  comprehensive: { label: "Comprehensive", words: "1,500–2,000 words", maxTokens: 2000 },
  authority: { label: "Authority", words: "2,000+ words", maxTokens: 2000 },
};

const DEPTHS: Record<string, { label: string; desc: string }> = {
  basic: { label: "Basic Overview", desc: "Surface-level, quick read" },
  detailed: { label: "Detailed Guide", desc: "In-depth, comprehensive" },
  authority: { label: "Authority Piece", desc: "Expert-level, exhaustive" },
};

const TONES: Record<string, { label: string; desc: string }> = {
  casual: { label: "Casual / Conversational", desc: "Friendly, approachable" },
  professional: { label: "Professional", desc: "Authoritative, confident" },
  educational: { label: "Educational", desc: "Informative, structured" },
  engaging: { label: "Engaging", desc: "Entertaining, story-driven" },
};

const SYSTEM = "You are an expert SEO content writer who creates comprehensive, well-structured blog posts optimized for search engines and readers. You always include the target keyword naturally in titles, introductions, and subheadings.";

function buildPrompt(keyword: string, topic: string, audience: string, length: string, depth: string, tone: string, secondary: string) {
  const len = LENGTHS[length];
  const topicLine = topic.trim() ? `Topic/angle: ${topic.trim()}` : `Topic: Write a comprehensive guide about "${keyword}"`;
  const secLine = secondary.trim() ? `\nSecondary keywords to include: ${secondary.trim()}` : "";
  return `Write a complete SEO-optimized blog post.

Primary keyword: "${keyword}"
${topicLine}
Target audience: ${audience}
Length: ${len.words}
Depth: ${DEPTHS[depth].label}
Tone: ${TONES[tone].label}${secLine}

Output EXACTLY this format with these three section markers:

## SEO Title
[Compelling title with keyword, 40-65 characters, include a number if it fits]

## Meta Description
[150-160 characters, include keyword near the start, end with a call to action]

## Article
[Full blog post using these markdown conventions:
- # for the H1 (same as title)
- ## for each major section (3-5 sections)
- ### for subsections
- - for bullet points
- **bold** for key terms
Include: hook introduction mentioning keyword in first sentence, 3-5 main sections, practical examples, FAQ with 3 questions, short conclusion]`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AIBlogGeneratorGenerator() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { toast } = useToast();

  const [keyword, setKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General readers");
  const [length, setLength] = useState<"quick" | "standard" | "comprehensive" | "authority">("standard");
  const [depth, setDepth] = useState<"basic" | "detailed" | "authority">("detailed");
  const [tone, setTone] = useState<"casual" | "professional" | "educational" | "engaging">("casual");
  const [secondary, setSecondary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [output, setOutput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const streamRef = useRef("");
  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setStreamText(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  const handleGenerate = useCallback(async () => {
    if (!keyword.trim() || !isReady) return;
    streamRef.current = "";
    setStreamText("");
    setOutput("");
    setIsGenerating(true);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(keyword, topic, audience, length, depth, tone, secondary) },
      ],
      temperature: 0.7,
      maxTokens: LENGTHS[length].maxTokens,
      onChunk: (t) => { streamRef.current = t; },
    });

    setOutput(result ?? streamRef.current ?? "");
    setIsGenerating(false);
  }, [keyword, topic, audience, length, depth, tone, secondary, isReady, generateRaw]);

  const copyText = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const sections = output ? parseSections(output) : [];
  const titleSection = sections.find(s => s.title.toLowerCase().includes("seo title") || s.title.toLowerCase() === "title");
  const metaSection = sections.find(s => s.title.toLowerCase().includes("meta"));
  const articleSection = sections.find(s => s.title.toLowerCase().includes("article"));

  const seoTitle = titleSection?.content?.replace(/^[""]|[""]$/g, "").trim() ?? "";
  const metaDesc = metaSection?.content?.replace(/^[""]|[""]$/g, "").trim() ?? "";
  const articleText = articleSection?.content ?? "";

  const seo = (seoTitle || articleText) ? computeSEO(keyword, seoTitle, metaDesc, articleText) : null;
  const seoMeta = seo ? scoreColor(seo.score) : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Input form ── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">

            {/* Keyword */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Primary Keyword <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  data-testid="input-keyword"
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value.slice(0, MAX_KEYWORD_CHARS))}
                  placeholder="e.g. best productivity apps 2026"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">Topic / Title Idea <span className="text-slate-400 font-normal text-xs">(optional)</span></label>
              <input
                data-testid="input-topic"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value.slice(0, MAX_TOPIC_CHARS))}
                placeholder="Leave blank to auto-generate from keyword"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">Target Audience</label>
              <select
                data-testid="select-audience"
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              >
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Article Length */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Article Length</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LENGTHS) as (keyof typeof LENGTHS)[]).map(l => (
                  <button
                    key={l}
                    data-testid={`button-length-${l}`}
                    onClick={() => setLength(l as any)}
                    className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                      length === l
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-emerald-200"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${length === l ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}>{LENGTHS[l].label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{LENGTHS[l].words}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Depth */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Content Depth</label>
              <div className="space-y-2">
                {(Object.keys(DEPTHS) as (keyof typeof DEPTHS)[]).map(d => (
                  <button
                    key={d}
                    data-testid={`button-depth-${d}`}
                    onClick={() => setDepth(d as any)}
                    className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl border text-left transition-all ${
                      depth === d
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-emerald-200"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${depth === d ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-500"}`} />
                    <div>
                      <p className={`text-xs font-semibold ${depth === d ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}>{DEPTHS[d].label}</p>
                      <p className="text-xs text-slate-400">{DEPTHS[d].desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Tone / Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TONES) as (keyof typeof TONES)[]).map(t => (
                  <button
                    key={t}
                    data-testid={`button-tone-${t}`}
                    onClick={() => setTone(t as any)}
                    className={`py-2 px-3 rounded-xl border text-left transition-all ${
                      tone === t
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-emerald-200"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${tone === t ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}>{TONES[t].label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{TONES[t].desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary keywords */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">Secondary Keywords <span className="text-slate-400 font-normal text-xs">(optional)</span></label>
              <textarea
                data-testid="input-secondary-keywords"
                value={secondary}
                onChange={e => setSecondary(e.target.value.slice(0, MAX_SECONDARY_CHARS))}
                placeholder="e.g. task manager, productivity tools, workflow apps"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 resize-none transition-all"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{secondary.length}/{MAX_SECONDARY_CHARS}</p>
            </div>

            {/* Model status */}
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
                <AlertCircle className="w-4 h-4 shrink-0" />{llmError}
              </div>
            )}

            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!keyword.trim() || !isReady || isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Writing your article…</>
                : <><Newspaper className="w-4 h-4" />Generate Blog Post</>
              }
            </button>
          </div>
        </div>

        {/* ── Right: Output ── */}
        <div className="space-y-4">

          {/* Streaming card */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div key="stream" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  Writing your blog post…
                </div>
                <div className="p-5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm min-h-[120px] max-h-[500px] overflow-y-auto">
                  {streamText
                    ? <>{streamText}<span className="inline-block w-0.5 h-4 bg-emerald-500 ml-0.5 align-middle animate-pulse" /></>
                    : <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic">
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />Starting generation — article will appear shortly…
                      </span>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle placeholder */}
          <AnimatePresence>
            {!isGenerating && !output && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-slate-400 dark:text-slate-500">
                <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Your blog post will appear here</p>
                <p className="text-xs mt-1">Enter a keyword and click Generate Blog Post</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parsed output */}
          <AnimatePresence>
            {!isGenerating && output && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">

                {/* Action row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button data-testid="button-regenerate" onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 text-sm font-medium transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  {articleText && (
                    <>
                      <button data-testid="button-copy-markdown" onClick={() => copyText("md", toMarkdown(seoTitle, metaDesc, articleText))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 text-sm font-medium transition-colors">
                        {copiedKey === "md" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
                        {copiedKey === "md" ? "Copied!" : "Copy Markdown"}
                      </button>
                      <button data-testid="button-copy-html" onClick={() => copyText("html", toHTML(seoTitle, metaDesc, articleText))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 text-sm font-medium transition-colors">
                        {copiedKey === "html" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                        {copiedKey === "html" ? "Copied!" : "Copy HTML"}
                      </button>
                    </>
                  )}
                </div>

                {/* SEO Analysis card */}
                {seo && seoMeta && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <BarChart2 className="w-4 h-4 text-emerald-500" />
                      SEO Analysis
                    </div>
                    <div className="p-5 flex items-start gap-5">
                      {/* Score ring */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ring-4 ${seoMeta.ring} flex flex-col items-center justify-center bg-white dark:bg-slate-800`}>
                        <span className={`text-xl font-bold ${seoMeta.text}`}>{seo.score}</span>
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className={`text-sm font-semibold ${seoMeta.text}`}>{seoMeta.label}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {[
                            { label: "Word count", val: `${seo.wordCount.toLocaleString()} words`, ok: seo.wordCount >= 600 },
                            { label: "Sections (H2)", val: `${seo.h2Count} headings`, ok: seo.h2Count >= 3 },
                            { label: "Keyword in title", val: seo.kwInTitle ? "Yes" : "No", ok: seo.kwInTitle },
                            { label: "Keyword in intro", val: seo.kwInFirstPara ? "Yes" : "No", ok: seo.kwInFirstPara },
                            { label: "Meta description", val: metaDesc ? `${seo.metaLen} chars` : "Missing", ok: seo.metaLen >= 130 },
                            { label: "FAQ section", val: seo.hasFAQ ? "Included" : "Not found", ok: seo.hasFAQ },
                          ].map(({ label, val, ok }) => (
                            <div key={label} className="flex items-center gap-1.5">
                              <ChevronRight className={`w-3 h-3 ${ok ? "text-emerald-500" : "text-amber-400"}`} />
                              <span className="text-xs text-slate-500 dark:text-slate-400">{label}:</span>
                              <span className={`text-xs font-medium ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SEO Title card */}
                {seoTitle && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
                    className="rounded-2xl border border-emerald-100 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100 dark:border-emerald-800/40">
                      <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">SEO Title</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${seoTitle.length >= 40 && seoTitle.length <= 65 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"}`}>
                          {seoTitle.length}/65 chars
                        </span>
                        <button data-testid="button-copy-title" onClick={() => copyText("title", seoTitle)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-700/70 text-xs font-medium text-slate-500 transition-colors">
                          {copiedKey === "title" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === "title" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <p data-testid="text-seo-title" className="px-5 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{seoTitle}</p>
                  </motion.div>
                )}

                {/* Meta description card */}
                {metaDesc && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Meta Description</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${metaDesc.length >= 130 && metaDesc.length <= 165 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"}`}>
                          {metaDesc.length}/160 chars
                        </span>
                        <button data-testid="button-copy-meta" onClick={() => copyText("meta", metaDesc)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-500 transition-colors">
                          {copiedKey === "meta" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === "meta" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <p data-testid="text-meta-description" className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">{metaDesc}</p>
                  </motion.div>
                )}

                {/* Full Article card */}
                {articleText && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Article</span>
                      <button data-testid="button-copy-article" onClick={() => copyText("article", articleText)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
                        {copiedKey === "article" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === "article" ? "Copied!" : "Copy Article"}
                      </button>
                    </div>
                    <div data-testid="text-article" className="p-5 max-h-[600px] overflow-y-auto">
                      <ArticleRenderer text={articleText} />
                    </div>
                  </motion.div>
                )}

                {/* Raw fallback */}
                {sections.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Generated Content</span>
                      <button onClick={() => copyText("raw", output)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {copiedKey === "raw" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === "raw" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div data-testid="text-raw-output" className="p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">{output}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
