import { useState, useMemo } from "react";
import { Copy, Check, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Case format types ────────────────────────────────────────────────────────

type CaseId =
  | "uppercase" | "lowercase" | "titleCase" | "sentenceCase"
  | "capitalizeFirst" | "alternating" | "inverseCase"
  | "camelCase" | "pascalCase" | "snakeCase" | "screamingSnake"
  | "kebabCase" | "screamingKebab" | "trainCase" | "dotCase";

interface CaseOption {
  id: CaseId;
  label: string;
  example: string;
  group: "text" | "code";
}

const CASES: CaseOption[] = [
  { id: "uppercase",      label: "UPPERCASE",          example: "HELLO WORLD",         group: "text" },
  { id: "lowercase",      label: "lowercase",          example: "hello world",         group: "text" },
  { id: "titleCase",      label: "Title Case",         example: "Hello World",         group: "text" },
  { id: "sentenceCase",   label: "Sentence case",      example: "Hello world. Done.",  group: "text" },
  { id: "capitalizeFirst",label: "Capitalize first",   example: "Hello world",         group: "text" },
  { id: "alternating",    label: "aLtErNaTiNg",        example: "hElLo wOrLd",         group: "text" },
  { id: "inverseCase",    label: "InVeRsE CaSe",       example: "hELLO wORLD",         group: "text" },
  { id: "camelCase",      label: "camelCase",          example: "helloWorld",          group: "code" },
  { id: "pascalCase",     label: "PascalCase",         example: "HelloWorld",          group: "code" },
  { id: "snakeCase",      label: "snake_case",         example: "hello_world",         group: "code" },
  { id: "screamingSnake", label: "SCREAMING_SNAKE",    example: "HELLO_WORLD",         group: "code" },
  { id: "kebabCase",      label: "kebab-case",         example: "hello-world",         group: "code" },
  { id: "screamingKebab", label: "SCREAMING-KEBAB",    example: "HELLO-WORLD",         group: "code" },
  { id: "trainCase",      label: "Train-Case",         example: "Hello-World",         group: "code" },
  { id: "dotCase",        label: "dot.case",           example: "hello.world",         group: "code" },
];

// ─── URL/email preservation ───────────────────────────────────────────────────

const PRESERVE_RE = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;

function withPreservation(text: string, fn: (t: string) => string): string {
  const preserved: string[] = [];
  const masked = text.replace(PRESERVE_RE, m => { preserved.push(m); return `__P${preserved.length - 1}__`; });
  const converted = fn(masked);
  return converted.replace(/__P(\d+)__/g, (_, i) => preserved[parseInt(i)]);
}

// ─── Word splitting ───────────────────────────────────────────────────────────

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function cap(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

// ─── Converters ───────────────────────────────────────────────────────────────

const TITLE_SMALL = new Set([
  "a","an","the","and","but","or","for","nor","on","at","to","by","in",
  "of","up","as","is","it","via","from","with","into","than","that",
]);

const CONVERTERS: Record<CaseId, (text: string) => string> = {
  uppercase:      t => withPreservation(t, s => s.toUpperCase()),
  lowercase:      t => withPreservation(t, s => s.toLowerCase()),
  titleCase:      t => withPreservation(t, s => {
    const words = s.trim().split(/(\s+)/);
    return words.map((token, i) => {
      if (/\s+/.test(token)) return token;
      const w = token;
      const wordIdx = words.slice(0, i).filter(x => !/^\s+$/.test(x)).length;
      const wordArr = words.filter(x => !/^\s+$/.test(x));
      const isFirst = wordIdx === 0;
      const isLast = wordIdx === wordArr.length - 1;
      if (!isFirst && !isLast && TITLE_SMALL.has(w.toLowerCase())) return w.toLowerCase();
      return cap(w);
    }).join("");
  }),
  sentenceCase:   t => withPreservation(t, s =>
    s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
  ),
  capitalizeFirst: t => withPreservation(t, s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()),
  alternating:    t => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
  inverseCase:    t => t.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(""),
  camelCase:      t => withPreservation(t, s => { const w = splitWords(s); return w.length === 0 ? "" : w[0].toLowerCase() + w.slice(1).map(cap).join(""); }),
  pascalCase:     t => withPreservation(t, s => splitWords(s).map(cap).join("")),
  snakeCase:      t => withPreservation(t, s => splitWords(s).map(w => w.toLowerCase()).join("_")),
  screamingSnake: t => withPreservation(t, s => splitWords(s).map(w => w.toUpperCase()).join("_")),
  kebabCase:      t => withPreservation(t, s => splitWords(s).map(w => w.toLowerCase()).join("-")),
  screamingKebab: t => withPreservation(t, s => splitWords(s).map(w => w.toUpperCase()).join("-")),
  trainCase:      t => withPreservation(t, s => splitWords(s).map(cap).join("-")),
  dotCase:        t => withPreservation(t, s => splitWords(s).map(w => w.toLowerCase()).join(".")),
};

function convert(text: string, id: CaseId): string {
  if (!text.trim()) return "";
  return CONVERTERS[id](text);
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-30",
        copied ? "text-green-500" : "text-slate-400 hover:text-purple-600",
        className
      )}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── All-formats grid ─────────────────────────────────────────────────────────

function AllFormatsGrid({ text }: { text: string }) {
  const textGroups = CASES.filter(c => c.group === "text");
  const codeGroups = CASES.filter(c => c.group === "code");

  const FormatCard = ({ c }: { c: CaseOption }) => {
    const result = text.trim() ? convert(text, c.id) : c.example;
    const isDim = !text.trim();
    return (
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
          <p className={cn("text-sm font-mono truncate", isDim ? "text-slate-300 dark:text-slate-600" : "text-slate-800 dark:text-slate-100")}>
            {result}
          </p>
        </div>
        <CopyBtn text={result} className="shrink-0" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Text Formats</p>
        <div className="space-y-2">
          {textGroups.map(c => <FormatCard key={c.id} c={c} />)}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Code Formats</p>
        <div className="space-y-2">
          {codeGroups.map(c => <FormatCard key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type ViewMode = "single" | "all";

export function CaseConverter() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<CaseId>("titleCase");
  const [mode, setMode] = useState<ViewMode>("single");
  const [group, setGroup] = useState<"text" | "code">("text");
  const [showAllFormats, setShowAllFormats] = useState(false);

  const output = useMemo(() => input.trim() ? convert(input, selected) : "", [input, selected]);
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  const selectedMeta = CASES.find(c => c.id === selected)!;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Input Text</p>
          <div className="flex items-center gap-3">
            {input && (
              <>
                <span className="text-xs text-slate-400 tabular-nums">{wordCount}w · {charCount}c</span>
                <button type="button" onClick={() => setInput("")} data-testid="button-clear"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </>
            )}
          </div>
        </div>
        <textarea
          data-testid="input-text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste your text here — conversions update instantly as you type…"
          rows={6}
          autoFocus
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
        />
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {[
          { id: "single" as ViewMode, label: "Single Format" },
          { id: "all" as ViewMode, label: "All 15 Formats" },
        ].map(tab => (
          <button key={tab.id} type="button" data-testid={`tab-${tab.id}`}
            onClick={() => setMode(tab.id)}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all",
              mode === tab.id
                ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Single format mode */}
      {mode === "single" && (
        <div className="space-y-4">
          {/* Group selector */}
          <div className="flex gap-2">
            {[
              { id: "text" as const, label: "Text Formats" },
              { id: "code" as const, label: "Code Formats" },
            ].map(g => (
              <button key={g.id} type="button" data-testid={`group-${g.id}`}
                onClick={() => {
                  setGroup(g.id);
                  const first = CASES.find(c => c.group === g.id);
                  if (first) setSelected(first.id);
                }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-xl text-xs font-bold border transition-all",
                  group === g.id
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-300"
                )}>
                {g.label}
              </button>
            ))}
          </div>

          {/* Format buttons */}
          <div className="flex flex-wrap gap-2">
            {CASES.filter(c => c.group === group).map(c => (
              <button key={c.id} type="button" data-testid={`format-${c.id}`}
                onClick={() => setSelected(c.id)}
                className={cn(
                  "flex flex-col items-start px-3.5 py-2.5 rounded-xl border text-left transition-all",
                  selected === c.id
                    ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/20"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700"
                )}>
                <span className="text-xs font-black">{c.label}</span>
                <span className={cn("text-[10px] font-mono mt-0.5", selected === c.id ? "text-purple-200" : "text-slate-400")}>
                  {c.example}
                </span>
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {selectedMeta.label}
              </p>
              <div className="flex items-center gap-2"><InlineShareButtons /><CopyBtn text={output} /></div>
            </div>
            <div className="relative px-4 py-4 min-h-[80px]">
              {output ? (
                <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap font-mono">
                  {output}
                </p>
              ) : (
                <p className="text-sm text-slate-300 dark:text-slate-600 font-mono">
                  {selectedMeta.example}
                </p>
              )}
            </div>
            {output && (
              <div className="px-4 py-2 border-t border-slate-50 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 tabular-nums">{output.length} characters</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All formats mode */}
      {mode === "all" && (
        <AllFormatsGrid text={input} />
      )}

      {/* Quick-convert strip (always visible in single mode) */}
      {mode === "single" && input && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button type="button" data-testid="button-toggle-all"
            onClick={() => setShowAllFormats(s => !s)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
              See all 15 formats at once
            </p>
            {showAllFormats ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {showAllFormats && (
            <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <AllFormatsGrid text={input} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
