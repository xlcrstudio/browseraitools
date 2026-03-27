import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  Lock, Code2, Wrench, Zap, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExplainSection {
  overview: string;
  language: string;
  lineByLine: string[];
  issues: string[];
  improvements: string;
  improvedCode: string;
  changes: string[];
  code: string;
  raw: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVELS = [
  {
    id: "eli5",
    label: "ELI5",
    subLabel: "Beginner",
    desc: "Plain English, no jargon. Simple analogies anyone can understand.",
    instruction: "Explain as if to a complete beginner — use everyday analogies, avoid all technical jargon, and keep each explanation to one simple sentence.",
  },
  {
    id: "standard",
    label: "Standard",
    subLabel: "Developer",
    desc: "Clear English for a working developer. Technical terms explained where needed.",
    instruction: "Explain clearly to a working developer. Use correct technical terms but briefly explain any that aren't universally known. Balance depth and clarity.",
  },
  {
    id: "senior",
    label: "Senior Dev",
    subLabel: "Expert",
    desc: "Terse, technical, no hand-holding. Assumes expert knowledge.",
    instruction: "Explain to an experienced senior developer. Be concise and technical. Assume deep familiarity with the language and common patterns. Skip basics.",
  },
];

const SAMPLE_CODES: { label: string; code: string }[] = [
  {
    label: "Fibonacci (JS)",
    code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
  },
  {
    label: "SQL Query",
    code: `SELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at > '2024-01-01'\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;`,
  },
  {
    label: "React Hook",
    code: `function useDebounce(value, delay) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}`,
  },
];

// ─── Parsing ─────────────────────────────────────────────────────────────────

function parseExplanation(raw: string): ExplainSection {
  const get = (tag: string): string => {
    const rx = new RegExp(`${tag}[:\\s]*\\n?([\\s\\S]*?)(?=\\n[A-Z][A-Z \\-]+:|$)`, "i");
    return (raw.match(rx)?.[1] ?? "").trim();
  };

  // Extract any fenced code block
  const firstCodeBlock = (raw.match(/```[\w]*\n?([\s\S]*?)```/) ?? [])[1]?.trim() ?? "";

  const lineByLine = get("LINE[- ]BY[- ]LINE")
    .split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

  const issues = get("ISSUES?|PROBLEMS?|POTENTIAL ISSUES?")
    .split("\n").map(l => l.replace(/^[-•*\d.]+\s*/, "").trim()).filter(Boolean);

  const changes = get("CHANGES?")
    .split("\n").map(l => l.replace(/^[-•*\d.]+\s*/, "").trim()).filter(Boolean);

  return {
    overview: get("OVERVIEW|SUMMARY|WHAT THIS CODE DOES|WHAT IT DOES"),
    language: get("LANGUAGE|DETECTED LANGUAGE").split("\n")[0].trim(),
    lineByLine,
    issues,
    improvements: get("IMPROVEMENT|IMPROVEMENTS|SUGGESTED IMPROVEMENT").replace(/```[\s\S]*?```/g, "").trim(),
    improvedCode: firstCodeBlock,
    changes,
    code: firstCodeBlock,
    raw,
  };
}

function buildMessages(code: string, level: string, action: "explain" | "fix" | "improve") {
  const levelObj = LEVELS.find(l => l.id === level)!;

  if (action === "explain") {
    const systemPrompt = `You are an expert code analyst and educator. You break down code clearly, identify issues, and suggest improvements.
${levelObj.instruction}
Output format — use these exact section headers (in order):

LANGUAGE: [detected language]

OVERVIEW:
[2–4 sentence summary of what the code does overall]

LINE-BY-LINE:
[Each line or logical block explained on its own line. Format: "Line N: explanation" or "Lines N–M: explanation". Be thorough but concise.]

ISSUES:
[Each issue on its own line starting with a dash. Write "- None identified." if no issues.]

IMPROVEMENTS:
[Prose explanation of suggested improvements]

IMPROVED CODE:
\`\`\`[language]
[Complete improved version of the code]
\`\`\`

Follow this format exactly. Do not add extra headers or sections.`;

    return [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Explain this code:\n\`\`\`\n${code}\n\`\`\`` },
    ];
  }

  // Fix / Improve: output ONLY changes summary + clean code block
  const systemPrompt = `You are an expert software engineer. ${levelObj.instruction}
Output format — use these exact two sections only:

CHANGES:
[Bullet list of every change made, one per line starting with "-". Be specific and concise.]

CODE:
\`\`\`[language]
[Complete updated code — nothing else inside the code block]
\`\`\`

Do not output any other sections, headers, or commentary.`;

  const userMsg = action === "fix"
    ? `Find and fix all bugs in this code:\n\`\`\`\n${code}\n\`\`\``
    : `Refactor and optimize this code for production quality:\n\`\`\`\n${code}\n\`\`\``;

  return [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userMsg },
  ];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionBlock({ title, children, color }: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <div className="space-y-2">
      <h3 className={cn("text-xs font-bold uppercase tracking-widest", color ?? "text-slate-500 dark:text-slate-400")}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
        copied
          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200 dark:border-emerald-700"
          : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600"
      )}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CodeExplainer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [code, setCode] = useState("");
  const [level, setLevel] = useState("standard");
  const [result, setResult] = useState<ExplainSection | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [currentAction, setCurrentAction] = useState<"explain" | "fix" | "improve">("explain");
  const [showSamples, setShowSamples] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";

  const run = useCallback(async (action: "explain" | "fix" | "improve") => {
    const trimmed = code.trim();
    if (trimmed.length < 5) { setInputError("Please paste some code to analyze."); return; }
    setInputError("");
    setResult(null);
    setStreaming("");
    setIsDone(false);
    setCurrentAction(action);

    const raw = await generateRaw({
      messages: buildMessages(trimmed, level, action),
      temperature: 0.3,
      maxTokens: 2500,
      onChunk: (chunk) => {
        setStreaming(chunk);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      },
    });

    if (raw) {
      setResult(parseExplanation(raw));
      setStreaming("");
      setIsDone(true);
    }
  }, [code, level, generateRaw]);

  const handleReset = () => {
    setCode(""); setResult(null); setStreaming(""); setIsDone(false); setInputError("");
  };

  const actionLabel = {
    explain: "Explaining…",
    fix: "Fixing…",
    improve: "Improving…",
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* Level selector */}
      <div className="glass-panel rounded-2xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">Explanation Level</p>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map(l => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                data-testid={`button-level-${l.id}`}
                onClick={() => setLevel(l.id)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                  active
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn("text-sm font-black leading-none", active ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{l.label}</span>
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", active ? "bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300" : "bg-slate-100 dark:bg-slate-700 text-slate-500")}>{l.subLabel}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{l.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code input */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paste Your Code</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="button-toggle-samples"
              onClick={() => setShowSamples(v => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Try a sample <ChevronDown className={cn("w-3 h-3 transition-transform", showSamples && "rotate-180")} />
            </button>
            {code && (
              <button type="button" data-testid="button-clear-code" onClick={() => setCode("")} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                Clear
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSamples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 px-4 pb-3 flex-wrap">
                {SAMPLE_CODES.map(s => (
                  <button
                    key={s.label}
                    type="button"
                    data-testid={`button-sample-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => { setCode(s.code); setShowSamples(false); setInputError(""); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          data-testid="input-code"
          value={code}
          onChange={e => { setCode(e.target.value); setInputError(""); }}
          placeholder={"Paste any code here…\n\nJavaScript, Python, TypeScript, React, SQL, Go, Rust, C++, PHP — any language works."}
          spellCheck={false}
          className="w-full bg-slate-950 dark:bg-slate-950 text-green-400 font-mono text-xs leading-relaxed px-4 py-3 resize-none outline-none placeholder:text-slate-600"
          style={{ minHeight: 220, tabSize: 2 }}
        />

        {inputError && (
          <div className="px-4 pb-3">
            <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" />{inputError}</p>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3 h-3" />
            <span>Private — your code never leaves your browser</span>
          </div>
          <span className="text-xs text-slate-600">{code.split("\n").length} lines</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          data-testid="button-explain"
          onClick={() => run("explain")}
          disabled={isGenerating || isLoading || code.trim().length < 5}
          className={cn(
            "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm",
            isGenerating || isLoading || code.trim().length < 5
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-purple-500/20"
          )}
        >
          {isGenerating && currentAction === "explain"
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Explaining…</>
            : <><Code2 className="w-4 h-4" /> Explain Code</>
          }
        </button>

        <button
          type="button"
          data-testid="button-fix"
          onClick={() => run("fix")}
          disabled={isGenerating || isLoading || code.trim().length < 5}
          className={cn(
            "flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border-2 transition-all",
            isGenerating || isLoading || code.trim().length < 5
              ? "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              : "border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-[0.98]"
          )}
        >
          {isGenerating && currentAction === "fix"
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Fixing…</>
            : <><Wrench className="w-4 h-4" /> Fix Bugs</>
          }
        </button>

        <button
          type="button"
          data-testid="button-improve"
          onClick={() => run("improve")}
          disabled={isGenerating || isLoading || code.trim().length < 5}
          className={cn(
            "flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border-2 transition-all",
            isGenerating || isLoading || code.trim().length < 5
              ? "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              : "border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.98]"
          )}
        >
          {isGenerating && currentAction === "improve"
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Improving…</>
            : <><Zap className="w-4 h-4" /> Improve</>
          }
        </button>

        {(code || isDone) && (
          <button
            type="button"
            data-testid="button-reset"
            onClick={handleReset}
            className="px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300 hover:text-red-500 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress?.percent ?? 0)}% — {progress?.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && streaming && (
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              {actionLabel[currentAction]}
            </span>
          </div>
          <div ref={outputRef} className="max-h-64 overflow-y-auto">
            <pre className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
              {streaming}
              <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle" />
            </pre>
          </div>
        </div>
      )}

      {/* Parsed result */}
      <AnimatePresence>
        {isDone && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {currentAction === "explain" ? "Code Explanation" : currentAction === "fix" ? "Bug Fix" : "Improved Code"}
                </p>
                {result.language && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{result.language}</span>
                )}
              </div>
              <div className="flex items-center gap-2"><InlineShareButtons /><CopyButton text={currentAction === "explain" ? result.raw : result.code} /></div>
            </div>

            {/* ── EXPLAIN mode ── */}
            {currentAction === "explain" && (
              <>
                {result.overview && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <SectionBlock title="What This Code Does" color="text-purple-600 dark:text-purple-400">
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.overview}</p>
                    </SectionBlock>
                  </motion.div>
                )}

                {result.lineByLine.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <SectionBlock title="Line-by-Line Breakdown">
                      <div className="space-y-2">
                        {result.lineByLine.map((line, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <span className="text-purple-400 font-mono text-xs mt-0.5 shrink-0 w-3">{i + 1}</span>
                            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{line}</p>
                          </div>
                        ))}
                      </div>
                    </SectionBlock>
                  </motion.div>
                )}

                {result.issues.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="glass-panel rounded-2xl p-4 border-l-4 border-orange-400"
                  >
                    <SectionBlock title="Potential Issues" color="text-orange-600 dark:text-orange-400">
                      <ul className="space-y-1.5">
                        {result.issues.map((issue, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <span className="text-orange-400 shrink-0 mt-0.5">▸</span>
                            <span className="leading-relaxed">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </SectionBlock>
                  </motion.div>
                )}

                {result.improvements && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <SectionBlock title="Suggested Improvements" color="text-blue-600 dark:text-blue-400">
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{result.improvements}</p>
                    </SectionBlock>
                  </motion.div>
                )}

                {result.improvedCode && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl overflow-hidden border border-slate-700"
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Improved Code</span>
                      <div className="flex items-center gap-2">
                        <button type="button" data-testid="button-use-improved"
                          onClick={() => { setCode(result.improvedCode); setResult(null); setIsDone(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                        >Use this code ↑</button>
                        <CopyButton text={result.improvedCode} />
                      </div>
                    </div>
                    <pre data-testid="output-improved-code" className="bg-slate-950 text-green-400 font-mono text-xs leading-relaxed p-4 overflow-x-auto">
                      {result.improvedCode}
                    </pre>
                  </motion.div>
                )}
              </>
            )}

            {/* ── FIX / IMPROVE mode ── */}
            {currentAction !== "explain" && (
              <>
                {(result.changes?.length ?? 0) > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <SectionBlock
                      title={currentAction === "fix" ? "Bugs Fixed" : "Changes Made"}
                      color={currentAction === "fix" ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"}
                    >
                      <ul className="space-y-1.5">
                        {result.changes.map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <span className={cn("shrink-0 mt-0.5", currentAction === "fix" ? "text-orange-400" : "text-blue-400")}>▸</span>
                            <span className="leading-relaxed">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </SectionBlock>
                  </motion.div>
                )}

                {result.code && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl overflow-hidden border border-slate-700"
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {currentAction === "fix" ? "Fixed Code" : "Improved Code"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" data-testid="button-use-improved"
                          onClick={() => { setCode(result.code); setResult(null); setIsDone(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                        >Use this code ↑</button>
                        <CopyButton text={result.code} />
                      </div>
                    </div>
                    <pre data-testid="output-code" className="bg-slate-950 text-green-400 font-mono text-xs leading-relaxed p-4 overflow-x-auto">
                      {result.code}
                    </pre>
                  </motion.div>
                )}
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
