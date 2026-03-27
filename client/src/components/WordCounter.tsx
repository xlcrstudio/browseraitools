import { useState, useMemo } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Text analysis ────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","up","about",
  "as","is","was","are","were","be","been","being","have","has","had","do","does","did","will",
  "would","could","should","may","might","shall","can","need","dare","ought","used","it","its",
  "this","that","these","those","i","me","my","we","our","you","your","he","his","she","her",
  "they","them","their","what","which","who","whom","if","then","than","so","yet","both","each",
  "few","more","most","other","some","such","no","not","only","same","own","just","very","how",
]);

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

interface TextStats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  syllables: number;
  readingTimeSec: number;
  speakingTimeSec: number;
  fleschScore: number | null;
  readabilityLabel: string;
  topKeywords: Array<{ word: string; count: number; pct: number }>;
}

function analyze(text: string): TextStats {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  const wordList = text.trim() === "" ? [] : text.trim().split(/\s+/).filter(w => w.replace(/[^a-zA-Z0-9]/g, "").length > 0);
  const words = wordList.length;

  const sentenceList = text.trim() === "" ? [] : text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentences = sentenceList.length;

  const paraList = text.trim() === "" ? [] : text.split(/\n{2,}/).filter(p => p.trim().length > 0);
  const paragraphs = Math.max(1, paraList.length);

  const uniqueWords = new Set(wordList.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;

  const totalWordChars = wordList.reduce((s, w) => s + w.replace(/[^a-zA-Z0-9]/g, "").length, 0);
  const avgWordLength = words > 0 ? totalWordChars / words : 0;
  const avgSentenceLength = sentences > 0 ? words / sentences : 0;

  const syllables = wordList.reduce((s, w) => s + countSyllables(w), 0);

  const readingTimeSec = words > 0 ? (words / 238) * 60 : 0;
  const speakingTimeSec = words > 0 ? (words / 150) * 60 : 0;

  let fleschScore: number | null = null;
  let readabilityLabel = "—";
  if (words >= 10 && sentences > 0) {
    const fre = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    fleschScore = Math.round(Math.max(0, Math.min(100, fre)));
    if (fleschScore >= 90) readabilityLabel = "Very Easy";
    else if (fleschScore >= 80) readabilityLabel = "Easy";
    else if (fleschScore >= 70) readabilityLabel = "Fairly Easy";
    else if (fleschScore >= 60) readabilityLabel = "Standard";
    else if (fleschScore >= 50) readabilityLabel = "Fairly Difficult";
    else if (fleschScore >= 30) readabilityLabel = "Difficult";
    else readabilityLabel = "Very Confusing";
  }

  // Top keywords (filter stop words)
  const freq: Record<string, number> = {};
  for (const w of wordList) {
    const key = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (key.length >= 3 && !STOP_WORDS.has(key)) freq[key] = (freq[key] ?? 0) + 1;
  }
  const topKeywords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count, pct: words > 0 ? (count / words) * 100 : 0 }));

  return { chars, charsNoSpaces, words, sentences, paragraphs, uniqueWords, avgWordLength, avgSentenceLength, syllables, readingTimeSec, speakingTimeSec, fleschScore, readabilityLabel, topKeywords };
}

function fmtTime(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

// ─── Platform limits ──────────────────────────────────────────────────────────

const PLATFORMS = [
  { name: "X (Twitter)",       limit: 280,   basis: "chars" as const },
  { name: "SMS",               limit: 160,   basis: "chars" as const },
  { name: "Meta description",  limit: 160,   basis: "chars" as const },
  { name: "Email subject",     limit: 60,    basis: "chars" as const },
  { name: "YouTube title",     limit: 100,   basis: "chars" as const },
  { name: "Instagram caption", limit: 2200,  basis: "chars" as const },
  { name: "LinkedIn post",     limit: 3000,  basis: "chars" as const },
  { name: "Reddit title",      limit: 300,   basis: "chars" as const },
];

function PlatformBar({ name, limit, value }: { name: string; limit: number; value: number }) {
  const pct = Math.min(100, (value / limit) * 100);
  const over = value > limit;
  const near = pct >= 80;
  const barColor = over ? "bg-red-500" : near ? "bg-amber-500" : "bg-emerald-500";
  const textColor = over ? "text-red-600 dark:text-red-400" : near ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{name}</span>
        <span className={cn("font-bold tabular-nums", textColor)}>
          {value.toLocaleString()}<span className="font-normal text-slate-400">/{limit.toLocaleString()}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div className={cn("h-1.5 rounded-full transition-all duration-300", barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <p className="text-2xl font-black text-slate-900 dark:text-slate-50 tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Flesch score color ───────────────────────────────────────────────────────

function fleschColor(score: number) {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyze(text), [text]);
  const isEmpty = text.trim() === "";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Textarea */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Text</p>
          <div className="flex items-center gap-3">
            {text && <><InlineShareButtons /><CopyBtn text={text} /></>}
            {text && (
              <button type="button" onClick={() => setText("")}
                data-testid="button-clear"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          data-testid="input-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here — stats update instantly as you type…"
          rows={10}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
          autoFocus
        />

        {/* Live counter strip */}
        <div className="flex items-center divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
          {[
            { val: stats.words,   label: "Words" },
            { val: stats.chars,   label: "Characters" },
            { val: stats.charsNoSpaces, label: "No Spaces" },
            { val: stats.sentences, label: "Sentences" },
          ].map(({ val, label }) => (
            <div key={label} className="flex-1 text-center py-3 px-2">
              <p className="text-lg font-black text-slate-900 dark:text-slate-50 tabular-nums">{val.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard value={stats.paragraphs}           label="Paragraphs" />
        <StatCard value={stats.uniqueWords}           label="Unique Words" />
        <StatCard value={fmtTime(stats.readingTimeSec)} label="Reading Time" sub="@ 238 wpm" />
        <StatCard value={fmtTime(stats.speakingTimeSec)} label="Speaking Time" sub="@ 150 wpm" />
        <StatCard value={stats.avgWordLength > 0 ? stats.avgWordLength.toFixed(1) : "—"} label="Avg Word Length" sub="characters" />
        <StatCard value={stats.avgSentenceLength > 0 ? stats.avgSentenceLength.toFixed(1) : "—"} label="Avg Sentence" sub="words/sentence" />
      </div>

      {/* Readability */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Readability — Flesch Reading Ease</p>
        {isEmpty || stats.fleschScore === null ? (
          <p className="text-sm text-slate-400">Enter at least 10 words to get a readability score.</p>
        ) : (
          <div className="flex items-center gap-4">
            <p className={cn("text-5xl font-black tabular-nums", fleschColor(stats.fleschScore))}>
              {stats.fleschScore}
            </p>
            <div>
              <p className={cn("text-sm font-black", fleschColor(stats.fleschScore))}>{stats.readabilityLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                {stats.fleschScore >= 70
                  ? "Easy to read — suitable for a general audience."
                  : stats.fleschScore >= 50
                  ? "Some sections may be challenging — consider simplifying."
                  : "Difficult to read — consider shorter sentences and simpler words."}
              </p>
            </div>
            <div className="flex-1 hidden sm:block">
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className={cn("h-2.5 rounded-full transition-all duration-500",
                    stats.fleschScore >= 70 ? "bg-emerald-500" : stats.fleschScore >= 50 ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: `${stats.fleschScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
                <span>Very Confusing</span><span>Standard</span><span>Very Easy</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform limits */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Platform Character Limits</p>
        <div className="space-y-3">
          {PLATFORMS.map(p => (
            <PlatformBar key={p.name} name={p.name} limit={p.limit} value={stats.chars} />
          ))}
        </div>
      </div>

      {/* Keyword density */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Top Keywords</p>
        {isEmpty || stats.topKeywords.length === 0 ? (
          <p className="text-sm text-slate-400">Start typing to see keyword frequency.</p>
        ) : (
          <div className="space-y-2">
            {stats.topKeywords.map((kw, i) => (
              <div key={kw.word} className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 w-28 shrink-0 truncate">{kw.word}</span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (kw.pct / (stats.topKeywords[0]?.pct ?? 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums w-14 text-right shrink-0">
                  {kw.count}× · {kw.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
