import { useState, useMemo } from "react";
import { RotateCcw, ArrowLeftRight, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Diff types ───────────────────────────────────────────────────────────────

type DiffOp = "equal" | "insert" | "delete";
interface DiffChunk { type: DiffOp; value: string }

// ─── LCS diff ────────────────────────────────────────────────────────────────

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp;
}

function diffArrays(a: string[], b: string[]): DiffChunk[] {
  // For very large inputs limit to avoid OOM
  if (a.length * b.length > 500_000) {
    return [
      ...a.map(v => ({ type: "delete" as DiffOp, value: v })),
      ...b.map(v => ({ type: "insert" as DiffOp, value: v })),
    ];
  }
  const dp = lcs(a, b);
  const result: DiffChunk[] = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: "equal", value: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "insert", value: b[j - 1] });
      j--;
    } else {
      result.unshift({ type: "delete", value: a[i - 1] });
      i--;
    }
  }
  return result;
}

// ─── Tokenisers ───────────────────────────────────────────────────────────────

function tokenizeWords(text: string): string[] {
  // Keep whitespace as tokens so we can reassemble
  return text.split(/(\s+)/).filter(s => s.length > 0);
}
function tokenizeLines(text: string): string[] {
  return text.split("\n");
}
function tokenizeChars(text: string): string[] {
  return text.split("");
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function calcStats(chunks: DiffChunk[], mode: Mode) {
  let added = 0, removed = 0, unchanged = 0;
  for (const c of chunks) {
    const n = mode === "line" ? 1 : c.value.trim() ? c.value.trim().split(/\s+/).length : 0;
    if (c.type === "insert") added += n;
    else if (c.type === "delete") removed += n;
    else unchanged += n;
  }
  const total = added + removed + unchanged;
  const similarity = total === 0 ? 100 : Math.round((unchanged / (total - removed / 2 - added / 2 + unchanged)) * 100);
  return { added, removed, unchanged, similarity: Math.min(100, Math.max(0, similarity)) };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "word" | "line" | "char";
type View = "split" | "unified";

// ─── Inline word diff renderer ────────────────────────────────────────────────

function InlineWordDiff({ original, modified }: { original: string; modified: string }) {
  const chunks = useMemo(() => diffArrays(tokenizeWords(original), tokenizeWords(modified)), [original, modified]);
  return (
    <span className="font-mono text-sm leading-relaxed break-all">
      {chunks.map((c, i) => (
        <span key={i} className={cn(
          c.type === "insert" && "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200",
          c.type === "delete" && "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 line-through",
          c.type === "equal" && "text-slate-700 dark:text-slate-300",
        )}>{c.value}</span>
      ))}
    </span>
  );
}

// ─── Unified line view ────────────────────────────────────────────────────────

interface LineDiff {
  type: DiffOp;
  a?: string;
  b?: string;
  lineA?: number;
  lineB?: number;
}

function buildLineDiffs(a: string, b: string, wordHighlight: boolean): LineDiff[] {
  const aLines = tokenizeLines(a);
  const bLines = tokenizeLines(b);
  const chunks = diffArrays(aLines, bLines);

  let ai = 1, bi = 1;
  const result: LineDiff[] = [];

  for (const c of chunks) {
    if (c.type === "equal") {
      result.push({ type: "equal", a: c.value, b: c.value, lineA: ai++, lineB: bi++ });
    } else if (c.type === "delete") {
      result.push({ type: "delete", a: c.value, lineA: ai++ });
    } else {
      result.push({ type: "insert", b: c.value, lineB: bi++ });
    }
  }
  return result;
}

function UnifiedView({ a, b }: { a: string; b: string }) {
  const lines = useMemo(() => buildLineDiffs(a, b, true), [a, b]);

  // Group consecutive deletes followed by inserts for word-level highlighting
  const grouped: Array<{ delete?: string; insert?: string; equal?: string; lineA?: number; lineB?: number }[]> = [];
  let i = 0;
  const out: JSX.Element[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (line.type === "equal") {
      out.push(
        <div key={i} className="flex text-xs font-mono">
          <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{line.lineA}</span>
          <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{line.lineB}</span>
          <span className="px-2 text-slate-300 select-none shrink-0"> </span>
          <span className="text-slate-600 dark:text-slate-300 flex-1 break-all whitespace-pre-wrap">{line.a}</span>
        </div>
      );
      i++;
    } else if (line.type === "delete") {
      // Look ahead for matching insert
      const nextInsert = lines[i + 1];
      if (nextInsert && nextInsert.type === "insert") {
        // Show both with word-level diff
        out.push(
          <div key={`d${i}`} className="flex text-xs font-mono bg-red-50 dark:bg-red-900/10">
            <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{line.lineA}</span>
            <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0"> </span>
            <span className="px-2 text-red-400 select-none shrink-0">−</span>
            <span className="flex-1 break-all whitespace-pre-wrap">
              <InlineWordDiff original={line.a ?? ""} modified={nextInsert.b ?? ""} />
            </span>
          </div>
        );
        out.push(
          <div key={`i${i}`} className="flex text-xs font-mono bg-emerald-50 dark:bg-emerald-900/10">
            <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0"> </span>
            <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{nextInsert.lineB}</span>
            <span className="px-2 text-emerald-500 select-none shrink-0">+</span>
            <span className="flex-1 break-all whitespace-pre-wrap">
              <InlineWordDiff original={line.a ?? ""} modified={nextInsert.b ?? ""} />
            </span>
          </div>
        );
        i += 2;
      } else {
        out.push(
          <div key={i} className="flex text-xs font-mono bg-red-50 dark:bg-red-900/10">
            <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{line.lineA}</span>
            <span className="w-10 pr-2 select-none shrink-0"> </span>
            <span className="px-2 text-red-400 select-none shrink-0">−</span>
            <span className="text-red-600 dark:text-red-300 flex-1 break-all whitespace-pre-wrap line-through">{line.a}</span>
          </div>
        );
        i++;
      }
    } else {
      // standalone insert
      out.push(
        <div key={i} className="flex text-xs font-mono bg-emerald-50 dark:bg-emerald-900/10">
          <span className="w-10 pr-2 select-none shrink-0"> </span>
          <span className="w-10 text-right text-slate-400 pr-2 select-none shrink-0">{line.lineB}</span>
          <span className="px-2 text-emerald-500 select-none shrink-0">+</span>
          <span className="text-emerald-700 dark:text-emerald-300 flex-1 break-all whitespace-pre-wrap">{line.b}</span>
        </div>
      );
      i++;
    }
  }

  return <div className="divide-y divide-slate-50 dark:divide-slate-800/30 min-h-[300px]">{out}</div>;
}

// ─── Split view ───────────────────────────────────────────────────────────────

function SplitView({ a, b }: { a: string; b: string }) {
  const lines = useMemo(() => buildLineDiffs(a, b, false), [a, b]);

  // Build aligned pairs: [leftLine, rightLine]
  type Pair = { left?: LineDiff; right?: LineDiff };
  const pairs: Pair[] = [];

  let i = 0;
  while (i < lines.length) {
    const cur = lines[i];
    if (cur.type === "equal") {
      pairs.push({ left: cur, right: cur });
      i++;
    } else if (cur.type === "delete") {
      const next = lines[i + 1];
      if (next && next.type === "insert") {
        pairs.push({ left: cur, right: next });
        i += 2;
      } else {
        pairs.push({ left: cur });
        i++;
      }
    } else {
      pairs.push({ right: cur });
      i++;
    }
  }

  const SideCell = ({ line, side }: { line?: LineDiff; side: "left" | "right" }) => {
    if (!line) return <div className="flex-1 bg-slate-50 dark:bg-slate-800/20 px-3 py-0.5 min-h-[1.5rem]" />;
    const isDelete = line.type === "delete";
    const isInsert = line.type === "insert";
    const lineNum = side === "left" ? line.lineA : line.lineB;
    const text = side === "left" ? line.a : line.b;
    return (
      <div className={cn(
        "flex-1 flex items-start gap-2 px-3 py-0.5 text-xs font-mono min-h-[1.5rem]",
        isDelete && "bg-red-50 dark:bg-red-900/10",
        isInsert && "bg-emerald-50 dark:bg-emerald-900/10",
      )}>
        <span className="text-slate-400 select-none w-6 text-right shrink-0">{lineNum ?? ""}</span>
        <span className={cn(
          "flex-1 break-all whitespace-pre-wrap leading-relaxed",
          isDelete && "text-red-700 dark:text-red-300 line-through",
          isInsert && "text-emerald-700 dark:text-emerald-300",
          !isDelete && !isInsert && "text-slate-700 dark:text-slate-300",
        )}>
          {/* If both sides exist and they're a modify pair, show word diff */}
          {isDelete && pairs.find(p => p.left === line && p.right) ? (
            <InlineWordDiff original={text ?? ""} modified={pairs.find(p => p.left === line)?.right?.b ?? ""} />
          ) : isInsert && pairs.find(p => p.right === line && p.left) ? (
            <InlineWordDiff original={pairs.find(p => p.right === line)?.left?.a ?? ""} modified={text ?? ""} />
          ) : text}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[300px]">
      {/* Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <div className="flex-1 px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-red-50/50 dark:bg-red-900/5 border-r border-slate-200 dark:border-slate-700">
          Original (A)
        </div>
        <div className="flex-1 px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-emerald-50/50 dark:bg-emerald-900/5">
          Modified (B)
        </div>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800/30">
        {pairs.map((p, idx) => (
          <div key={idx} className="flex divide-x divide-slate-100 dark:divide-slate-800">
            <SideCell line={p.left} side="left" />
            <SideCell line={p.right} side="right" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Word/char inline diff view ───────────────────────────────────────────────

function InlineDiffView({ a, b, mode }: { a: string; b: string; mode: "word" | "char" }) {
  const tokenize = mode === "word" ? tokenizeWords : tokenizeChars;
  const chunks = useMemo(() => diffArrays(tokenize(a), tokenize(b)), [a, b, mode]);
  return (
    <div className="px-4 py-4 text-sm font-mono leading-loose break-all whitespace-pre-wrap min-h-[200px]">
      {chunks.map((c, i) => (
        <span key={i} className={cn(
          c.type === "insert" && "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded-sm",
          c.type === "delete" && "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 line-through rounded-sm",
          c.type === "equal" && "text-slate-700 dark:text-slate-300",
        )}>{c.value}</span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const SAMPLE_A = `The quick brown fox jumps over the lazy dog.
The dog was sleeping peacefully under the oak tree.
It was a beautiful sunny day.`;

const SAMPLE_B = `The quick brown fox leaps over the sleepy dog.
The dog was resting comfortably under the oak tree.
It was a beautiful sunny afternoon.
The birds were singing nearby.`;

export function DiffChecker() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [mode, setMode] = useState<Mode>("line");
  const [view, setView] = useState<View>("split");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const processText = (t: string) => {
    let s = t;
    if (ignoreCase) s = s.toLowerCase();
    if (ignoreWhitespace) s = s.replace(/\s+/g, " ").trim();
    return s;
  };

  const procA = processText(a || SAMPLE_A);
  const procB = processText(b || SAMPLE_B);
  const isEmpty = !a && !b;

  const flatChunks = useMemo(() => {
    const tok = mode === "line" ? tokenizeLines : mode === "word" ? tokenizeWords : tokenizeChars;
    return diffArrays(tok(procA), tok(procB));
  }, [procA, procB, mode]);

  const stats = useMemo(() => calcStats(flatChunks, mode), [flatChunks, mode]);

  const statLabel = mode === "line" ? "lines" : mode === "word" ? "words" : "chars";

  const similar = procA === procB;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { label: "Original (A)", val: a, set: setA, placeholder: SAMPLE_A, testId: "input-original" },
          { label: "Modified (B)", val: b, set: setB, placeholder: SAMPLE_B, testId: "input-modified" },
        ].map(({ label, val, set, placeholder, testId }) => (
          <div key={label} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
              <div className="flex items-center gap-3">
                {val && (
                  <button type="button" onClick={() => set("")}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
                {!val && (
                  <button type="button"
                    onClick={() => { setA(SAMPLE_A); setB(SAMPLE_B); }}
                    className="text-xs text-purple-500 hover:text-purple-700 font-semibold transition-colors">
                    Load sample
                  </button>
                )}
              </div>
            </div>
            <textarea
              data-testid={testId}
              value={val}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
              rows={8}
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm font-mono outline-none resize-none leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
            <div className="px-4 py-2 border-t border-slate-50 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-400 tabular-nums">
                {val.split("\n").length} lines · {val.trim() ? val.trim().split(/\s+/).length : 0} words · {val.length} chars
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Mode */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(["line", "word", "char"] as Mode[]).map(m => (
            <button key={m} type="button" data-testid={`mode-${m}`}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                mode === m ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}>
              {m === "char" ? "Char" : m === "word" ? "Word" : "Line"}
            </button>
          ))}
        </div>

        {/* View (only for line mode) */}
        {mode === "line" && (
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {([
              { id: "split" as View, icon: ArrowLeftRight },
              { id: "unified" as View, icon: AlignLeft },
            ]).map(({ id, icon: Icon }) => (
              <button key={id} type="button" data-testid={`view-${id}`}
                onClick={() => setView(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                  view === id ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}>
                <Icon className="w-3.5 h-3.5" />
                {id === "split" ? "Split" : "Unified"}
              </button>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="flex gap-2 ml-auto">
          {[
            { label: "Ignore case", val: ignoreCase, set: setIgnoreCase },
            { label: "Ignore whitespace", val: ignoreWhitespace, set: setIgnoreWhitespace },
          ].map(({ label, val, set }) => (
            <button key={label} type="button" onClick={() => set(!val)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
                val ? "bg-purple-600 border-purple-600 text-white" : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-300"
              )}>{label}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: `Added ${statLabel}`, value: `+${stats.added}`, color: "text-emerald-600 dark:text-emerald-400" },
          { label: `Removed ${statLabel}`, value: `-${stats.removed}`, color: "text-red-500 dark:text-red-400" },
          { label: `Unchanged ${statLabel}`, value: stats.unchanged.toString(), color: "text-slate-700 dark:text-slate-200" },
          { label: "Similarity", value: `${stats.similarity}%`, color: stats.similarity > 80 ? "text-emerald-600 dark:text-emerald-400" : stats.similarity > 50 ? "text-amber-500" : "text-red-500" },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-3 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={cn("text-xl font-black mt-0.5 tabular-nums", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Diff output */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Diff Output</p>
          {isEmpty && <span className="text-[10px] text-slate-400 italic">Showing sample — paste your own text above</span>}
          {similar && !isEmpty && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Texts are identical
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400 font-semibold"><InlineShareButtons />
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-900/40 inline-block" />removed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/40 inline-block" />added</span>
          </div>
        </div>
        <div className="overflow-auto max-h-[600px]">
          {mode === "line" && view === "split" && <SplitView a={procA} b={procB} />}
          {mode === "line" && view === "unified" && <UnifiedView a={procA} b={procB} />}
          {(mode === "word" || mode === "char") && <InlineDiffView a={procA} b={procB} mode={mode} />}
        </div>
      </div>
    </div>
  );
}
