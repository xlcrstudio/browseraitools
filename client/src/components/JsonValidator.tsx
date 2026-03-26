import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RotateCcw, ChevronRight, ChevronDown, Minimize2, Maximize2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length;
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

function maxDepth(val: unknown, d = 0): number {
  if (val === null || typeof val !== "object") return d;
  const children = Object.values(val as object);
  if (children.length === 0) return d;
  return Math.max(...children.map(c => maxDepth(c, d + 1)));
}

function countNodes(val: unknown): number {
  if (val === null || typeof val !== "object") return 1;
  const arr = Array.isArray(val) ? val : Object.values(val as object);
  return 1 + arr.reduce((s: number, c) => s + countNodes(c), 0);
}

// ─── Auto-fix ─────────────────────────────────────────────────────────────────

function autoFix(text: string): { result: string; fixes: string[] } {
  let s = text;
  const fixes: string[] = [];

  // Remove line comments
  if (/\/\/[^\n]*/.test(s)) {
    s = s.replace(/\/\/[^\n]*/g, "");
    fixes.push("Removed JavaScript line comments (//)");
  }
  // Remove block comments
  if (/\/\*[\s\S]*?\*\//.test(s)) {
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    fixes.push("Removed block comments (/* */)");
  }
  // Replace undefined/NaN with null
  if (/\bundefined\b/.test(s)) {
    s = s.replace(/\bundefined\b/g, "null");
    fixes.push("Replaced undefined → null");
  }
  if (/\bNaN\b/.test(s)) {
    s = s.replace(/\bNaN\b/g, "null");
    fixes.push("Replaced NaN → null");
  }
  // Quote unquoted keys (e.g. { name: "John" } → { "name": "John" })
  const unquotedKeyRe = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
  if (unquotedKeyRe.test(s)) {
    s = s.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    fixes.push("Quoted unquoted object keys");
  }
  // Remove trailing commas before ] or }
  if (/,\s*[\}\]]/.test(s)) {
    s = s.replace(/,(\s*[\}\]])/g, "$1");
    fixes.push("Removed trailing commas");
  }
  // Replace single-quoted strings with double quotes (simple heuristic)
  // Only replace 'value' when surrounded by proper JSON context
  const singleQuoteRe = /:\s*'([^'\\]*(\\.[^'\\]*)*)'/g;
  if (singleQuoteRe.test(s)) {
    s = s.replace(/:\s*'([^'\\]*(\\.[^'\\]*)*)'/g, (_, inner) => `: "${inner}"`);
    fixes.push("Replaced single-quoted values with double quotes");
  }
  const singleKeyRe = /'\s*([^'\\]*(\\.[^'\\]*)*)\s*'\s*:/g;
  if (singleKeyRe.test(s)) {
    s = s.replace(/'([^'\\]*(\\.[^'\\]*)*)'\s*:/g, (_, inner) => `"${inner}":`);
    fixes.push("Replaced single-quoted keys with double quotes");
  }

  return { result: s, fixes };
}

// ─── Error parsing ─────────────────────────────────────────────────────────────

function parseJsonError(text: string, error: unknown): { message: string; line: number; col: number; hint: string } {
  const msg = error instanceof Error ? error.message : String(error);

  // Chrome: "Unexpected token X, "...json..." is not valid JSON"
  // Firefox: "JSON.parse: unexpected character at line X column Y"
  // Safari: "Unexpected identifier 'X'"

  let line = 1, col = 1;

  // Try to extract position from error string
  const posMatch = msg.match(/position (\d+)/i);
  const lineMatch = msg.match(/line (\d+)/i);
  const colMatch = msg.match(/column (\d+)/i);

  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    const before = text.slice(0, pos);
    line = (before.match(/\n/g) || []).length + 1;
    col = pos - before.lastIndexOf("\n");
  } else if (lineMatch) {
    line = parseInt(lineMatch[1]);
    col = colMatch ? parseInt(colMatch[1]) : 1;
  }

  // Derive a friendly hint
  let hint = "";
  if (/trailing comma/i.test(msg) || /,\s*[\}\]]/.test(text)) hint = "Remove the trailing comma before } or ]";
  else if (/unexpected token/i.test(msg) && /[a-zA-Z]/.test(msg)) hint = "Keys must be in double quotes: \"key\": value";
  else if (/single quote/i.test(msg) || text.includes("'")) hint = "Use double quotes (\") instead of single quotes (')";
  else if (/unexpected end/i.test(msg)) hint = "The JSON appears to be cut off — check for missing closing brackets";
  else if (/control character/i.test(msg)) hint = "Escape special characters: use \\n for newlines, \\\\ for backslashes";
  else hint = "Check for missing commas, mismatched brackets, or unquoted keys";

  return { message: msg, line, col, hint };
}

// ─── JSON tree view ───────────────────────────────────────────────────────────

function JsonValue({ val, depth }: { val: unknown; depth: number }) {
  if (val === null) return <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">null</span>;
  if (typeof val === "boolean") return <span className="text-orange-500 dark:text-orange-400 font-mono text-xs">{val.toString()}</span>;
  if (typeof val === "number") return <span className="text-blue-500 dark:text-blue-400 font-mono text-xs">{val}</span>;
  if (typeof val === "string") {
    const display = val.length > 80 ? val.slice(0, 80) + "…" : val;
    return <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">"{display}"</span>;
  }
  if (Array.isArray(val)) return <JsonNode val={val} depth={depth} />;
  if (typeof val === "object") return <JsonNode val={val} depth={depth} />;
  return <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{String(val)}</span>;
}

function JsonNode({ val, depth }: { val: object | unknown[]; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isArr = Array.isArray(val);
  const entries: Array<[string, unknown]> = isArr
    ? (val as unknown[]).map((v, i) => [String(i), v])
    : Object.entries(val as Record<string, unknown>);

  const summary = isArr ? `[${entries.length}]` : `{${entries.length}}`;

  if (entries.length === 0) {
    return <span className="font-mono text-xs text-slate-400">{isArr ? "[]" : "{}"}</span>;
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 -ml-1 group">
        {open
          ? <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{summary}</span>
      </button>
      {open && (
        <div className="ml-4 border-l border-slate-200 dark:border-slate-700 pl-3 space-y-0.5 mt-0.5">
          {entries.map(([k, v]) => (
            <div key={k} className="flex gap-1.5 items-start min-w-0">
              <span className="text-purple-600 dark:text-purple-400 font-mono text-xs shrink-0 pt-0.5">
                {isArr ? <span className="text-slate-400">{k}</span> : `"${k}"`}:
              </span>
              <JsonValue val={v} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-30",
        copied ? "text-green-500" : "text-slate-400 hover:text-purple-600"
      )}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = "formatted" | "tree";

const SAMPLE = `{
  "name": "Alice Johnson",
  "age": 28,
  "active": true,
  "scores": [98, 87, 92],
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "tags": ["admin", "verified"],
  "metadata": null
}`;

export function JsonValidator() {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<Tab>("formatted");

  const handleLoad = useCallback(() => setInput(SAMPLE), []);

  // ── Parse ──────────────────────────────────────────────────────────────────
  const parsed = useMemo(() => {
    if (!input.trim()) return { ok: false, value: null, error: null };
    try {
      return { ok: true, value: JSON.parse(input) as unknown, error: null };
    } catch (e) {
      return { ok: false, value: null, error: e };
    }
  }, [input]);

  const formatted = useMemo(() => parsed.ok ? JSON.stringify(parsed.value, null, 2) : "", [parsed]);
  const minified  = useMemo(() => parsed.ok ? JSON.stringify(parsed.value) : "", [parsed]);
  const depth     = useMemo(() => parsed.ok ? maxDepth(parsed.value) : 0, [parsed]);
  const nodes     = useMemo(() => parsed.ok ? countNodes(parsed.value) : 0, [parsed]);

  const errorInfo = useMemo(() =>
    !parsed.ok && parsed.error && input.trim()
      ? parseJsonError(input, parsed.error)
      : null,
    [parsed, input]
  );

  // ── Auto-fix ───────────────────────────────────────────────────────────────
  const [fixResult, setFixResult] = useState<{ result: string; fixes: string[] } | null>(null);

  const handleFix = () => {
    const { result, fixes } = autoFix(input);
    setFixResult({ result, fixes });
    try {
      JSON.parse(result);
      setInput(result);
      setFixResult(null);
    } catch {
      // Fix didn't fully resolve — show diff
      setFixResult({ result, fixes });
    }
  };

  const applyFix = () => {
    if (fixResult) { setInput(fixResult.result); setFixResult(null); }
  };

  // ── Status badge ───────────────────────────────────────────────────────────
  const statusBadge = !input.trim() ? null : parsed.ok
    ? <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Valid JSON</span>
    : <span className="flex items-center gap-1.5 text-xs font-black text-red-500 dark:text-red-400"><span className="w-2 h-2 rounded-full bg-red-500" />Invalid JSON</span>;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">

      {/* Input */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">JSON Input</p>
            {statusBadge}
          </div>
          <div className="flex items-center gap-3">
            {!input && (
              <button type="button" onClick={handleLoad}
                className="text-xs text-purple-500 hover:text-purple-700 font-semibold transition-colors">
                Load sample
              </button>
            )}
            {input && (
              <button type="button" onClick={() => { setInput(""); setFixResult(null); }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          data-testid="input-json"
          value={input}
          onChange={e => { setInput(e.target.value); setFixResult(null); }}
          placeholder={'Paste your JSON here…\n\n{\n  "key": "value"\n}'}
          rows={12}
          spellCheck={false}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm font-mono outline-none resize-none leading-relaxed placeholder:text-slate-400 placeholder:font-sans"
        />
        {input && (
          <div className="px-4 py-2.5 border-t border-slate-50 dark:border-slate-800/80 flex items-center gap-4">
            <span className="text-[10px] text-slate-400 tabular-nums">{byteSize(input)} input</span>
            {parsed.ok && <span className="text-[10px] text-slate-400 tabular-nums">{byteSize(minified)} minified</span>}
          </div>
        )}
      </div>

      {/* Toolbar */}
      {input && (
        <div className="flex flex-wrap gap-2">
          {parsed.ok ? (
            <>
              <button type="button" data-testid="button-format"
                onClick={() => setInput(formatted)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-purple-400 transition-all">
                <Maximize2 className="w-3.5 h-3.5" /> Format
              </button>
              <button type="button" data-testid="button-minify"
                onClick={() => setInput(minified)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-purple-400 transition-all">
                <Minimize2 className="w-3.5 h-3.5" /> Minify
              </button>
              <CopyBtn text={formatted} label="Copy Formatted" />
              <CopyBtn text={minified} label="Copy Minified" />
            </>
          ) : (
            <button type="button" data-testid="button-autofix"
              onClick={handleFix}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all">
              <Wrench className="w-3.5 h-3.5" /> Auto-Fix
            </button>
          )}
        </div>
      )}

      {/* Error panel */}
      <AnimatePresence>
        {errorInfo && (
          <motion.div key="error"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass-panel rounded-2xl overflow-hidden border border-red-100 dark:border-red-900/30">
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
              <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Syntax Error</p>
            </div>
            <div className="px-4 py-3 space-y-2">
              {errorInfo.line > 1 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Line {errorInfo.line}, Column {errorInfo.col}
                </p>
              )}
              <p className="text-sm text-slate-700 dark:text-slate-200 font-mono">{errorInfo.message}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Hint: {errorInfo.hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-fix preview */}
      <AnimatePresence>
        {fixResult && !parsed.ok && (
          <motion.div key="fix"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass-panel rounded-2xl overflow-hidden border border-amber-100 dark:border-amber-900/30">
            <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
              <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Auto-Fix Applied</p>
              <button type="button" onClick={applyFix}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors">
                Use this
              </button>
            </div>
            <div className="px-4 py-3 space-y-2">
              {fixResult.fixes.map(f => (
                <p key={f} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span> {f}
                </p>
              ))}
              {fixResult.fixes.length === 0 && (
                <p className="text-xs text-slate-500">No automatic fixes available. Check the error hint above.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valid: stats + output */}
      <AnimatePresence>
        {parsed.ok && parsed.value !== null && (
          <motion.div key="result"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Original", value: byteSize(input) },
                { label: "Minified", value: byteSize(minified) },
                { label: "Depth", value: `${depth} level${depth !== 1 ? "s" : ""}` },
                { label: "Nodes", value: nodes.toString() },
              ].map(s => (
                <div key={s.label} className="glass-panel rounded-xl p-3 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5 tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
              {(["formatted", "tree"] as Tab[]).map(t => (
                <button key={t} type="button" data-testid={`tab-${t}`}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                    tab === t
                      ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}>{t === "formatted" ? "Formatted" : "Tree View"}</button>
              ))}
            </div>

            {/* Formatted JSON */}
            {tab === "formatted" && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2-space indent</p>
                  <CopyBtn text={formatted} />
                </div>
                <pre className="px-4 py-4 text-xs text-slate-700 dark:text-slate-200 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {formatted}
                </pre>
              </div>
            )}

            {/* Tree view */}
            {tab === "tree" && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Interactive Tree</p>
                </div>
                <div className="px-4 py-4 overflow-x-auto">
                  <JsonValue val={parsed.value} depth={0} />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
