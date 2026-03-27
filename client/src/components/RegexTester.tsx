import { useState, useMemo, useRef } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Regex execution ──────────────────────────────────────────────────────────

interface MatchResult { value: string; index: number; groups?: Record<string, string> }

function runRegex(pattern: string, flags: string, text: string): { matches: MatchResult[]; error: string | null } {
  if (!pattern) return { matches: [], error: null };
  try {
    const re = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];
    if (flags.includes("g")) {
      let m: RegExpExecArray | null;
      const safeRe = new RegExp(pattern, flags);
      while ((m = safeRe.exec(text)) !== null) {
        matches.push({ value: m[0], index: m.index, groups: m.groups as Record<string, string> | undefined });
        if (m[0].length === 0) { safeRe.lastIndex++; }
        if (matches.length > 10_000) break; // safety cap
      }
    } else {
      const m = re.exec(text);
      if (m) matches.push({ value: m[0], index: m.index, groups: m.groups as Record<string, string> | undefined });
    }
    return { matches, error: null };
  } catch (e) {
    return { matches: [], error: (e as Error).message };
  }
}

// ─── Highlighted text ─────────────────────────────────────────────────────────

function HighlightedText({ text, matches }: { text: string; matches: MatchResult[] }) {
  if (!text) return <span className="text-slate-300 dark:text-slate-600 italic">Enter test text above…</span>;
  if (matches.length === 0) return <span className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">{text}</span>;

  const segs: { value: string; isMatch: boolean; idx: number }[] = [];
  let last = 0;
  for (const m of matches) {
    if (m.index > last) segs.push({ value: text.slice(last, m.index), isMatch: false, idx: last });
    segs.push({ value: m.value, isMatch: true, idx: m.index });
    last = m.index + m.value.length;
  }
  if (last < text.length) segs.push({ value: text.slice(last), isMatch: false, idx: last });

  return (
    <span className="whitespace-pre-wrap break-words">
      {segs.map((s, i) =>
        s.isMatch ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-400/30 text-yellow-900 dark:text-yellow-100 rounded-sm px-[1px]">{s.value}</mark>
        ) : (
          <span key={i} className="text-slate-700 dark:text-slate-300">{s.value}</span>
        )
      )}
    </span>
  );
}

// ─── Pattern breakdown ────────────────────────────────────────────────────────

interface Token { raw: string; desc: string; color: string }

function tokenizeRegex(pattern: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (raw: string, desc: string, color: string) => tokens.push({ raw, desc, color });

  while (i < pattern.length) {
    const ch = pattern[i];

    // Anchors
    if (ch === "^" && i === 0) { push("^", "Start of string", "text-blue-600 dark:text-blue-400"); i++; continue; }
    if (ch === "$" && i === pattern.length - 1) { push("$", "End of string", "text-blue-600 dark:text-blue-400"); i++; continue; }

    // Escaped sequences
    if (ch === "\\") {
      const next = pattern[i + 1];
      const esc: Record<string, string> = {
        d: "Any digit [0-9]", D: "Any non-digit", w: "Word character [A-Za-z0-9_]",
        W: "Non-word character", s: "Whitespace", S: "Non-whitespace",
        b: "Word boundary", B: "Non-word boundary", n: "Newline",
        t: "Tab", r: "Carriage return",
      };
      if (next && esc[next]) { push(`\\${next}`, esc[next], "text-purple-600 dark:text-purple-400"); i += 2; continue; }
      push(`\\${next ?? ""}`, `Escaped '${next}'`, "text-slate-500"); i += 2; continue;
    }

    // Lookarounds & non-capturing groups
    if (ch === "(" && pattern[i + 1] === "?") {
      if (pattern.slice(i, i + 4) === "(?<=") { push("(?<=", "Positive lookbehind — preceded by…", "text-amber-600 dark:text-amber-400"); i += 4; continue; }
      if (pattern.slice(i, i + 4) === "(?<!") { push("(?<!", "Negative lookbehind — not preceded by…", "text-amber-600 dark:text-amber-400"); i += 4; continue; }
      if (pattern.slice(i, i + 3) === "(?=") { push("(?=", "Positive lookahead — followed by…", "text-amber-600 dark:text-amber-400"); i += 3; continue; }
      if (pattern.slice(i, i + 3) === "(?!") { push("(?!", "Negative lookahead — not followed by…", "text-amber-600 dark:text-amber-400"); i += 3; continue; }
      if (pattern.slice(i, i + 3) === "(?:") { push("(?:", "Non-capturing group — groups without capturing", "text-slate-500"); i += 3; continue; }
      // Named group (?<name>
      const named = pattern.slice(i).match(/^\(\?<([^>]+)>/);
      if (named) { push(named[0], `Named capturing group '${named[1]}'`, "text-emerald-600 dark:text-emerald-400"); i += named[0].length; continue; }
    }

    // Groups
    if (ch === "(") { push("(", "Start capturing group", "text-emerald-600 dark:text-emerald-400"); i++; continue; }
    if (ch === ")") { push(")", "End group", "text-emerald-600 dark:text-emerald-400"); i++; continue; }

    // Character classes
    if (ch === "[") {
      let j = i + 1;
      if (pattern[j] === "^") j++;
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++;
        j++;
      }
      const cls = pattern.slice(i, j + 1);
      const negated = cls[1] === "^";
      push(cls, `Character class — match ${negated ? "none" : "any"} of: ${cls.slice(negated ? 2 : 1, -1)}`, "text-rose-600 dark:text-rose-400");
      i = j + 1;
      continue;
    }

    // Quantifiers
    if ("*+?".includes(ch) && tokens.length) {
      const isLazy = pattern[i + 1] === "?";
      const map: Record<string, string> = { "*": "0 or more", "+": "1 or more", "?": "0 or 1 (optional)" };
      push(isLazy ? ch + "?" : ch, `${map[ch]}${isLazy ? " (lazy)" : " (greedy)"}`, "text-orange-500 dark:text-orange-400");
      i += isLazy ? 2 : 1;
      continue;
    }

    // {n,m} quantifiers
    if (ch === "{") {
      const m = pattern.slice(i).match(/^\{(\d+)(,(\d*))?}/);
      if (m) {
        let desc = "";
        if (!m[2]) desc = `Exactly ${m[1]} times`;
        else if (!m[3]) desc = `${m[1]} or more times`;
        else desc = `Between ${m[1]} and ${m[3]} times`;
        push(m[0], desc, "text-orange-500 dark:text-orange-400");
        i += m[0].length;
        continue;
      }
    }

    // Dot
    if (ch === ".") { push(".", "Any character except newline", "text-slate-500"); i++; continue; }
    // Pipe
    if (ch === "|") { push("|", "OR — either the left or the right side", "text-blue-600 dark:text-blue-400"); i++; continue; }
    // Literal
    push(ch, `Literal '${ch}'`, "text-slate-600 dark:text-slate-300");
    i++;
  }
  return tokens;
}

// ─── Common patterns library ──────────────────────────────────────────────────

const PATTERNS = [
  { name: "Email", pattern: `[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}`, flags: "g", example: "Send to hello@example.com or admin@site.co.uk" },
  { name: "URL", pattern: `https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*`, flags: "g", example: "Visit https://example.com/path?q=1 or http://www.site.org" },
  { name: "US Phone", pattern: `\\+?1?\\s*\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})`, flags: "g", example: "Call (555) 123-4567 or 555.123.4567 or +1 555 123 4567" },
  { name: "IPv4", pattern: `\\b((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\b`, flags: "g", example: "Server at 192.168.1.1 or 10.0.0.255 — not 999.0.0.1" },
  { name: "Hex Color", pattern: `#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})`, flags: "g", example: "Colors: #FF5733, #F57, #000000, #abc" },
  { name: "Date MM/DD/YYYY", pattern: `(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}`, flags: "g", example: "Event on 12/31/2024 and 01/01/2025" },
  { name: "Credit Card", pattern: `\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b`, flags: "g", example: "Card: 1234 5678 9012 3456 or 1234-5678-9012-3456" },
  { name: "Username (3–16)", pattern: `^[a-zA-Z0-9_]{3,16}$`, flags: "", example: "user123\nJohn_Doe\nab\nthis_username_is_way_too_long_here" },
  { name: "Strong Password", pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`, flags: "", example: "MyP@ssw0rd\nweakpass\nStrong1!" },
  { name: "ZIP Code (US)", pattern: `\\b\\d{5}(-\\d{4})?\\b`, flags: "g", example: "Zip: 90210 or 90210-1234, not 1234" },
  { name: "Hashtag", pattern: `#[a-zA-Z0-9_]+`, flags: "g", example: "Trending: #JavaScript #web_dev #coding2024" },
  { name: "HTML Tag", pattern: `<\\/?(\\w+)([^>]*)>`, flags: "g", example: "<h1 class=\"title\">Hello</h1> <br/>" },
];

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={cn("flex items-center gap-1 text-xs font-semibold transition-colors", copied ? "text-green-500" : "text-slate-400 hover:text-purple-600")}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const FLAG_INFO: Record<string, string> = {
  g: "Global — find all matches, not just the first",
  i: "Case-insensitive — A matches a",
  m: "Multiline — ^ and $ match line boundaries",
  s: "Dot-all — . matches newlines too",
};

export function RegexTester() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(["g"]));
  const [testText, setTestText] = useState(
`Contact details:
  Email: alice@example.com, bob.smith+tag@company.co.uk
  Phone: (555) 123-4567 or 800-555-0199 or +1 415 222 3333
  Website: https://www.example.com/path?q=test or http://site.org
  Server: 192.168.1.1 (also 10.0.0.255, not 999.0.0.1)

Schedule:
  Meeting on 03/15/2025 and follow-up 12/31/2025

Design tokens:
  Primary: #6366F1, Accent: #F59E0B, Neutral: #64748b, Short: #FFF

Payment:
  Card: 4111 1111 1111 1111 or 4111-1111-1111-1111
  ZIP: 90210 or 10001-1234

Social:
  Trending: #JavaScript #web_dev #regex2025

HTML:
  <h1 class="title">Hello</h1> <br/> <a href="#">Link</a>`
  );
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");

  const { state: llmState, progress, error: llmError, generateRaw } = useWebLLM();

  const flags = Array.from(activeFlags).join("");

  const toggleFlag = (f: string) => setActiveFlags(prev => {
    const next = new Set(prev);
    next.has(f) ? next.delete(f) : next.add(f);
    return next;
  });

  const { matches, error } = useMemo(() => runRegex(pattern, flags, testText), [pattern, flags, testText]);

  const tokens = useMemo(() => pattern ? tokenizeRegex(pattern) : [], [pattern]);

  const coverage = testText.length ? Math.round(matches.reduce((s, m) => s + m.value.length, 0) / testText.length * 100) : 0;

  const loadPattern = (p: (typeof PATTERNS)[number]) => {
    setPattern(p.pattern);
    setActiveFlags(new Set(p.flags.split("").filter(Boolean)));
    setTestText(p.example);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || llmState === "generating" || llmState === "downloading") return;
    setAiResult("");
    let out = "";
    await generateRaw({
      messages: [{
        role: "user",
        content: `You are a regex expert. The user wants a JavaScript regular expression. Respond with EXACTLY two sections and nothing else:
PATTERN: <the regex pattern only, no slashes, no flags>
EXPLANATION: <one bullet per token, each starting with •>

User request: "${aiPrompt}"`,
      }],
      temperature: 0.1,
      maxTokens: 300,
      onChunk: chunk => { out = chunk; setAiResult(chunk); },
    });
    // Auto-load the generated pattern
    const m = out.match(/PATTERN:\s*(.+)/);
    if (m) {
      setPattern(m[1].trim().replace(/^\/|\/[gimsuy]*$/g, ""));
      setActiveFlags(new Set(["g"]));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">

      {/* Pattern input */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regex Pattern</p>
          <div className="flex items-center gap-3">
            <CopyBtn text={`/${pattern}/${flags}`} />
            <button type="button" onClick={() => { setPattern(""); setTestText(""); }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
        <div className="relative flex items-center">
          <span className="pl-4 text-slate-400 font-mono text-lg select-none">/</span>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
            data-testid="input-pattern"
            spellCheck={false}
            placeholder="Enter regex pattern…"
            className="flex-1 bg-transparent font-mono text-sm text-slate-800 dark:text-slate-100 px-2 py-4 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600" />
          <span className="pr-1 text-slate-400 font-mono text-lg select-none">/{flags}</span>
          <div className="pr-4" />
        </div>
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-800/30">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-xs text-red-600 dark:text-red-400 font-mono">{error}</span>
          </div>
        )}
      </div>

      {/* Flags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flags:</span>
        {["g", "i", "m", "s"].map(f => (
          <button key={f} type="button" title={FLAG_INFO[f]}
            onClick={() => toggleFlag(f)}
            data-testid={`flag-${f}`}
            className={cn(
              "px-3 py-1.5 rounded-xl border font-mono text-xs font-black transition-all",
              activeFlags.has(f)
                ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/20"
                : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-purple-300"
            )}>{f}</button>
        ))}
        {Object.entries(FLAG_INFO).filter(([f]) => activeFlags.has(f)).map(([f, desc]) => (
          <span key={f} className="text-[10px] text-purple-500 font-semibold">{desc}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Matches", value: matches.length.toString(), color: matches.length > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400" },
          { label: "Characters matched", value: matches.reduce((s, m) => s + m.value.length, 0).toString(), color: "text-slate-700 dark:text-slate-200" },
          { label: "Coverage", value: `${coverage}%`, color: coverage > 50 ? "text-amber-500" : coverage > 0 ? "text-emerald-500" : "text-slate-400" },
          { label: "Status", value: error ? "Error" : pattern && !matches.length && testText ? "No match" : pattern ? "Valid" : "Empty", color: error ? "text-red-500" : !matches.length && testText && pattern ? "text-amber-500" : "text-emerald-500" },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-3 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={cn("text-xl font-black mt-0.5 tabular-nums truncate", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Test text */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Text</p>
          <span className="text-[10px] text-slate-400 tabular-nums">{testText.length} chars</span>
        </div>
        <textarea value={testText} onChange={e => setTestText(e.target.value)}
          data-testid="input-test-text"
          rows={5} spellCheck={false}
          placeholder="Enter test text to match against…"
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm font-mono outline-none resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed" />
      </div>

      {/* Highlighted results */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match Preview</p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold"><InlineShareButtons />
            <mark className="bg-yellow-200 dark:bg-yellow-400/30 text-yellow-900 dark:text-yellow-100 rounded-sm px-1 font-mono not-italic">highlighted</mark>
            = matched text
          </div>
        </div>
        <div className="px-4 py-4 text-sm font-mono leading-loose min-h-[80px]">
          <HighlightedText text={testText} matches={matches} />
        </div>
        {matches.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 max-h-48 overflow-y-auto space-y-1">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-[10px] font-black text-slate-400 w-6 text-right shrink-0">#{i + 1}</span>
                <code className="flex-1 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-0.5 rounded font-mono text-yellow-800 dark:text-yellow-200 truncate">{JSON.stringify(m.value)}</code>
                <span className="text-slate-400 shrink-0">at {m.index}–{m.index + m.value.length}</span>
                {m.groups && Object.keys(m.groups).length > 0 && (
                  <span className="text-purple-400 shrink-0 text-[10px]">
                    {Object.entries(m.groups).map(([k, v]) => `${k}="${v}"`).join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pattern breakdown (collapsible) */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <button type="button" onClick={() => setShowBreakdown(b => !b)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pattern Breakdown</p>
          {showBreakdown ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showBreakdown && (
          <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/50">
            {tokens.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400 italic">Enter a pattern above to see breakdown.</p>
            ) : tokens.map((tok, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-2.5">
                <code className={cn("font-mono text-sm font-black w-24 shrink-0 text-right", tok.color)}>{tok.raw}</code>
                <span className="text-sm text-slate-600 dark:text-slate-300">{tok.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Library (collapsible) */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <button type="button" onClick={() => setShowLibrary(b => !b)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Common Patterns Library</p>
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">{PATTERNS.length} patterns</span>
          </div>
          {showLibrary ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showLibrary && (
          <div className="border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
            {PATTERNS.map(p => (
              <div key={p.name} className="bg-white dark:bg-slate-900 px-4 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{p.name}</p>
                  <code className="text-[10px] font-mono text-slate-400 truncate block">{p.pattern.length > 40 ? p.pattern.slice(0, 40) + "…" : p.pattern}</code>
                </div>
                <button type="button" onClick={() => loadPattern(p)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-black hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors">
                  Load
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Generate */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Pattern Generator</p>
          <span className="text-[10px] text-slate-400 italic">(runs locally in your browser)</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              data-testid="input-ai-prompt"
              onKeyDown={e => e.key === "Enter" && handleAiGenerate()}
              placeholder="Describe what you want to match — e.g. 'valid email address' or 'UK postcode'"
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
            <button type="button" onClick={handleAiGenerate}
              disabled={!aiPrompt.trim() || llmState === "generating" || llmState === "downloading" || llmState === "checking-gpu"}
              data-testid="button-ai-generate"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black disabled:opacity-50 transition-colors whitespace-nowrap">
              {llmState === "checking-gpu" ? "Checking GPU…" : llmState === "downloading" ? `Loading… ${(progress?.percent ?? 0).toFixed(0)}%` : llmState === "generating" ? "Generating…" : "Generate"}
            </button>
          </div>
          {llmState === "downloading" && (
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${progress?.percent ?? 0}%` }} />
            </div>
          )}
          {llmError && <p className="text-xs text-red-500">{llmError}</p>}
          {aiResult && (
            <pre className="text-xs font-mono bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-4 whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 overflow-x-auto">{aiResult}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
