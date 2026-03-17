import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, ListOrdered, ThumbsUp, FileText, Check,
  ArrowRight, Circle, Star
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useBulletStorage } from "@/hooks/use-bullet-storage";

const BULLET_STYLES = [
  { id: "keypoints", label: "Key Points", desc: "Main takeaways", icon: FileText },
  { id: "steps", label: "Step-by-Step", desc: "Sequential process", icon: ListOrdered },
  { id: "proscons", label: "Pros & Cons", desc: "Balanced comparison", icon: ThumbsUp },
  { id: "summary", label: "Summary", desc: "Comprehensive overview", icon: List },
];

const ICON_STYLES = [
  { id: "dots", label: "Dots", char: "\u2022" },
  { id: "checks", label: "Checks", char: "\u2713" },
  { id: "arrows", label: "Arrows", char: "\u2192" },
  { id: "stars", label: "Stars", char: "\u2605" },
  { id: "numbers", label: "Numbers", char: "1." },
];

const ICON_DISPLAY: Record<string, typeof List> = {
  dots: Circle,
  checks: Check,
  arrows: ArrowRight,
  stars: Star,
  numbers: ListOrdered,
};

const EXAMPLE_TEXT = "Remote work offers flexibility and reduces commuting time. Employees can work from anywhere, improving work-life balance and increasing productivity. However, it also presents challenges like potential isolation, communication barriers, and difficulty separating work from personal life. Companies need to invest in collaboration tools and establish clear guidelines to make remote work successful for both employees and organizations.";

const SYSTEM_PROMPT = `You are an expert content organizer specializing in information architecture and scannable formatting. You convert text into clear, well-structured bullet point lists that are easy to scan and understand.`;

const STYLE_PROMPTS: Record<string, string> = {
  keypoints: "Extract the main ideas and key takeaways. Present 5-8 bullets in order of importance, most important first.",
  steps: "Convert into sequential, action-oriented steps. Use numbered format with clear progression from start to finish.",
  proscons: "Split into balanced PROS and CONS sections. List equal numbers on each side. Be objective and thorough. Use headers PROS: and CONS: to separate them.",
  summary: "Create a comprehensive overview covering all key information. Organize logically by topic. Include every important detail.",
};

interface ParsedBulletResult {
  id: string;
  title: string;
  bullets: string;
  markdown: string;
  html: string;
}

function parseBullets(raw: string, iconChar: string): ParsedBulletResult {
  let title = "";
  let content = raw.trim();

  const lines = content.split("\n");
  const firstLine = lines[0]?.trim() || "";
  if (firstLine && !firstLine.startsWith("-") && !firstLine.startsWith("*") && !firstLine.startsWith("1") && !firstLine.match(/^[•✓→★☐✅❌►]/) && firstLine.length < 100) {
    const stripped = firstLine.replace(/^#+\s*/, "").replace(/^\*{2}(.*)\*{2}$/, "$1").trim();
    if (stripped.length > 2 && stripped.length < 80) {
      title = stripped;
      content = lines.slice(1).join("\n").trim();
    }
  }

  const formatted = content
    .replace(/^(\s*)[-*]\s+/gm, (_, indent) => `${indent}${iconChar} `)
    .replace(/^(\s*)(\d+)\.\s+/gm, (_, indent, num) => `${indent}${num}. `);

  const mdContent = content
    .replace(/^(\s*)[-*]\s+/gm, "$1- ")
    .replace(/^(\s*)(\d+)\.\s+/gm, "$1$2. ");

  const BULLET_RE = /^[-*\u2022\u2713\u2192\u2605\u25BA\u2610\u2611\u2612\u2714\u2716\u2794>\u2023]\s+/;
  const NUM_RE = /^\d+[.)]\s+/;
  const MARKER_RE = /^(\u2705|\u274C|PROS:|CONS:)\s*/i;
  function stripBullet(s: string): string {
    return s.replace(BULLET_RE, "").replace(NUM_RE, "").replace(MARKER_RE, "").trim();
  }
  function isBulletLine(s: string): boolean {
    return BULLET_RE.test(s) || NUM_RE.test(s) || MARKER_RE.test(s);
  }

  const htmlLines: string[] = [];
  let inList = false;
  let inSubList = false;
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const isIndented = line.startsWith("  ") || line.startsWith("\t");
    const bullet = isBulletLine(trimmed);
    const bulletText = stripBullet(trimmed);

    if (bullet && isIndented) {
      if (!inSubList) { htmlLines.push("<ul>"); inSubList = true; }
      htmlLines.push(`  <li>${bulletText}</li>`);
    } else if (bullet) {
      if (inSubList) { htmlLines.push("</ul></li>"); inSubList = false; }
      else if (inList) { htmlLines.push("</li>"); }
      if (!inList) { htmlLines.push("<ul>"); inList = true; }
      htmlLines.push(`  <li>${bulletText}`);
    } else {
      if (inSubList) { htmlLines.push("</ul></li>"); inSubList = false; }
      if (inList) { htmlLines.push("</li></ul>"); inList = false; }
      htmlLines.push(`<p>${trimmed}</p>`);
    }
  }
  if (inSubList) htmlLines.push("</ul></li>");
  if (inList) htmlLines.push("</li></ul>");

  return {
    id: generateId(),
    title,
    bullets: (title ? `${title}\n\n` : "") + formatted,
    markdown: (title ? `# ${title}\n\n` : "") + mdContent,
    html: (title ? `<h3>${title}</h3>\n` : "") + htmlLines.join("\n"),
  };
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function BulletPointsGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useBulletStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [bulletStyle, setBulletStyle] = useState("summary");
  const [iconStyle, setIconStyle] = useState("dots");
  const [includeSubPoints, setIncludeSubPoints] = useState(true);

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<ParsedBulletResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = sourceText.trim().length >= 20;

  const srcWordCount = wordCount(sourceText);
  const selectedIcon = ICON_STYLES.find(i => i.id === iconStyle) || ICON_STYLES[0];

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");

    const stylePrompt = STYLE_PROMPTS[bulletStyle] || STYLE_PROMPTS.summary;
    const styleName = BULLET_STYLES.find(s => s.id === bulletStyle)?.label || "Summary";
    const iconName = selectedIcon.char;

    const prompt = `Convert the following text into bullet points.

TEXT TO CONVERT:
${sourceText}

BULLET STYLE: ${styleName}
${stylePrompt}

ICON/MARKER: Use "${iconName}" for main bullet points.
${includeSubPoints ? "INCLUDE NESTED SUB-POINTS: Yes. Add 2-3 indented sub-points under each main bullet for additional detail. Use indentation to show hierarchy." : "INCLUDE NESTED SUB-POINTS: No. Only main-level bullets, no nesting."}

${bulletStyle === "proscons" ? "Format with PROS: and CONS: headers, listing balanced points under each." : ""}

Start with a short descriptive title on the first line, then the bullet list below.
Make each bullet clear, concise, and scannable. Use parallel grammatical structure.`;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      maxTokens: 2048,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw bullet points output:", finalContent);
      const parsed = parseBullets(finalContent, selectedIcon.char);
      if (parsed.bullets.trim().length < 10) {
        setEmptyError("Could not generate bullet points. Please try again.");
      } else {
        setResult(parsed);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setSourceText(""); setBulletStyle("summary"); setIconStyle("dots");
    setIncludeSubPoints(true); setStreamedContent(""); setResult(null);
    setIsDone(false); setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const blob = new Blob([result.bullets], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bullet-points.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bullet-points.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    const content = JSON.stringify(result);
    saveDraft({
      label: sourceText.slice(0, 60),
      content,
      formData: { sourceText, bulletStyle, iconStyle, includeSubPoints },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setSourceText(fd.sourceText || "");
    setBulletStyle(fd.bulletStyle); setIconStyle(fd.iconStyle);
    setIncludeSubPoints(fd.includeSubPoints);
    try {
      const restored: ParsedBulletResult = JSON.parse(draft.content);
      if (restored && restored.bullets) {
        setResult(restored);
      }
    } catch {
      const parsed = parseBullets(draft.content, ICON_STYLES.find(i => i.id === fd.iconStyle)?.char || "\u2022");
      if (parsed.bullets.trim().length > 10) setResult(parsed);
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="bp-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="bp-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Bullet Lists</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved lists" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved list" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
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
              <label htmlFor="bp-source" className="text-sm font-semibold text-slate-700 ml-1">Text to Convert *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setSourceText(EXAMPLE_TEXT)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="bp-source" data-testid="input-source" value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={"Paste your text here to convert into bullet points...\n\nExample:\nRemote work offers flexibility and reduces commuting time. Employees can work from anywhere, improving work-life balance..."} maxLength={2000} rows={6} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{srcWordCount} words</span>
                <span>{sourceText.length}/2,000</span>
              </div>
            </div>
            {sourceText.length > 0 && sourceText.trim().length < 20 && (
              <p className="text-xs text-amber-600 ml-1 mt-1" data-testid="text-min-length-hint">Minimum 20 characters required ({20 - sourceText.trim().length} more needed)</p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Bullet Style *</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BULLET_STYLES.map((style) => {
                const StyleIcon = style.icon;
                const isActive = bulletStyle === style.id;
                return (
                  <button key={style.id} data-testid={`button-style-${style.id}`} type="button" onClick={() => setBulletStyle(style.id)} aria-pressed={isActive} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <StyleIcon className={cn("w-4 h-4", isActive ? "text-purple-600" : "text-slate-400")} />
                    <span className={cn("font-semibold text-xs", isActive ? "text-purple-800" : "text-slate-700")}>{style.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{style.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Icon Style</legend>
            <div className="flex flex-wrap gap-2">
              {ICON_STYLES.map((icon) => {
                const isActive = iconStyle === icon.id;
                const IconComp = ICON_DISPLAY[icon.id] || Circle;
                return (
                  <button key={icon.id} data-testid={`button-icon-${icon.id}`} type="button" onClick={() => setIconStyle(icon.id)} aria-pressed={isActive} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", isActive ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-300")}>
                    <IconComp className="w-3.5 h-3.5" />
                    {icon.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-700">Include Sub-Points</p>
              <p className="text-xs text-slate-400 mt-0.5">Add nested detail under each main point</p>
            </div>
            <button data-testid="button-toggle-subpoints" type="button" onClick={() => setIncludeSubPoints(!includeSubPoints)} role="switch" aria-checked={includeSubPoints} aria-label="Include sub-points" className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", includeSubPoints ? "bg-purple-500" : "bg-slate-300")}>
              <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform", includeSubPoints ? "translate-x-[22px]" : "translate-x-[2px]")} />
            </button>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Converting...</>) : (<><List className="w-5 h-5" /> Generate Bullet Points</>)}
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
            <span className="text-sm font-semibold text-purple-600">Converting to bullet points...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                {result.title || "Bullet Points"}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-plain" onClick={() => handleCopy(result.bullets, "plain")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "plain" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "plain" ? "Copied!" : "Copy"}
                </button>
                <button data-testid="button-copy-md" onClick={() => handleCopy(result.markdown, "md")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "md" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "md" ? "Copied!" : "Markdown"}
                </button>
                <button data-testid="button-copy-html" onClick={() => handleCopy(result.html, "html")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "html" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "html" ? "Copied!" : "HTML"}
                </button>
                <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download-txt" onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button data-testid="button-download-md" onClick={handleDownloadMd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> MD
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans" data-testid="text-bullet-output">{result.bullets}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
