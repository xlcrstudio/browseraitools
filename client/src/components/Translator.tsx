import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Download, RotateCcw,
  ArrowLeftRight, Search, Check, Lock, ChevronDown, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

const LANGUAGES = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese (Brazilian)" },
  { code: "pt-pt", name: "Portuguese (European)" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-tw", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "el", name: "Greek" },
  { code: "tr", name: "Turkish" },
  { code: "ro", name: "Romanian" },
  { code: "cs", name: "Czech" },
  { code: "hu", name: "Hungarian" },
  { code: "uk", name: "Ukrainian" },
  { code: "sk", name: "Slovak" },
  { code: "hr", name: "Croatian" },
  { code: "bg", name: "Bulgarian" },
  { code: "sr", name: "Serbian" },
  { code: "ca", name: "Catalan" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "tl", name: "Filipino (Tagalog)" },
  { code: "he", name: "Hebrew" },
  { code: "fa", name: "Persian (Farsi)" },
  { code: "ur", name: "Urdu" },
  { code: "sw", name: "Swahili" },
  { code: "af", name: "Afrikaans" },
  { code: "am", name: "Amharic" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "et", name: "Estonian" },
  { code: "sl", name: "Slovenian" },
  { code: "sq", name: "Albanian" },
  { code: "mk", name: "Macedonian" },
  { code: "az", name: "Azerbaijani" },
  { code: "ka", name: "Georgian" },
  { code: "hy", name: "Armenian" },
  { code: "is", name: "Icelandic" },
  { code: "mt", name: "Maltese" },
  { code: "cy", name: "Welsh" },
  { code: "ga", name: "Irish" },
  { code: "eu", name: "Basque" },
  { code: "gl", name: "Galician" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "my", name: "Burmese" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
  { code: "mn", name: "Mongolian" },
  { code: "uz", name: "Uzbek" },
  { code: "kk", name: "Kazakh" },
  { code: "tg", name: "Tajik" },
  { code: "ps", name: "Pashto" },
  { code: "so", name: "Somali" },
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "zu", name: "Zulu" },
  { code: "xh", name: "Xhosa" },
];

const SOURCE_LANGS = LANGUAGES;
const TARGET_LANGS = LANGUAGES.filter(l => l.code !== "auto");

const MODES = [
  { id: "standard", label: "Standard", desc: "Natural & accurate" },
  { id: "formal", label: "Formal", desc: "Professional tone" },
  { id: "casual", label: "Casual", desc: "Conversational" },
  { id: "literal", label: "Literal", desc: "Word-for-word" },
  { id: "creative", label: "Creative", desc: "Adapt idioms" },
];

function buildMessages(
  text: string,
  sourceLang: string,
  targetLang: string,
  mode: string,
  context: string,
) {
  const sourceName = SOURCE_LANGS.find(l => l.code === sourceLang)?.name ?? sourceLang;
  const targetName = TARGET_LANGS.find(l => l.code === targetLang)?.name ?? targetLang;

  const modeMap: Record<string, string> = {
    standard: "Accurate and natural — read as if originally written in the target language.",
    formal: "Formal and professional — use formal forms of address (usted, Sie, vous, etc.) and professional vocabulary.",
    casual: "Casual and conversational — use informal language, natural colloquialisms, and informal pronouns.",
    literal: "Literal (word-for-word) — stay close to the original structure, useful for language learners.",
    creative: "Creative/Localized — adapt idioms and cultural references to equivalents the target audience will understand; preserve the spirit over exact words.",
  };

  const contextLine = context.trim() ? `\nContext: ${context.trim()}` : "";
  const sourceStr = sourceLang === "auto" ? "Auto-detect (identify and state the detected language on the first line as: Detected language: [Language Name])" : sourceName;

  // Latin-script languages don't need pronunciation
  const latinScript = ["en","es","fr","de","it","pt","pt-pt","nl","pl","sv","no","da","fi","ro","cs","hu","sk","hr","bg","sr","ca","id","ms","tl","af","lt","lv","et","sl","sq","mk","az","is","mt","cy","ga","eu","gl","lb","sq","sw","ha","yo","ig","zu","xh","so"].includes(targetLang);

  const userMsg = [
    `Source language: ${sourceStr}`,
    `Target language: ${targetName}`,
    `Translation mode: ${modeMap[mode]}`,
    contextLine,
    "",
    "Text to translate:",
    text,
    "",
    "Output format — follow EXACTLY:",
    "TRANSLATION: [the translated text here]",
    latinScript ? "" : "PRONUNCIATION: [romanized phonetic pronunciation in Latin script — how to say it out loud]",
    "",
    "Then, if auto-detecting source language, add on its own line: Detected language: [Name]",
    "Then, add a 'Translation notes:' section ONLY if there are genuinely important notes about idioms, cultural adaptations, or ambiguities. Skip if the translation is straightforward.",
    "Do NOT add any other preamble, explanation, or commentary.",
    "Preserve proper nouns, brand names, URLs, and numbers exactly.",
  ].filter(l => l !== null).join("\n");

  // Language-specific quality hints
  const langHints: Partial<Record<string, string>> = {
    ur: "You are a native-level Urdu translator. Use authentic, natural Urdu vocabulary — NOT transliterated Hindi or English words when proper Urdu equivalents exist. Write in correct Nastaliq Urdu script (right-to-left). Use correct Urdu grammar: verb-final sentence order (subject-object-verb), proper case markers (ne, ko, se, per, ka/ki/ke), and grammatically correct verb conjugations. Do NOT produce a literal word-for-word mapping — produce fluent, idiomatic Urdu as a native speaker would say it.",
    ar: "You are a native-level Arabic translator. Use Modern Standard Arabic (MSA) with correct grammar, proper verb conjugations, correct plural forms (broken plurals), and accurate case endings. Write in correct right-to-left Arabic script. Produce fluent, natural Arabic — not a word-for-word mapping.",
    fa: "You are a native-level Persian (Farsi) translator. Use natural Persian vocabulary and correct grammar. Write in correct right-to-left Nastaliq/Naskh Persian script. Use SOV sentence order and proper verb conjugations. Produce fluent, idiomatic Persian.",
    zh: "You are a native-level Simplified Chinese translator. Use natural Mandarin Chinese (Simplified characters). Prefer concise, idiomatic Chinese expressions. Ensure correct measure words (量词), proper aspect markers, and natural word order.",
    "zh-tw": "You are a native-level Traditional Chinese translator. Use natural Mandarin Chinese (Traditional characters as used in Taiwan). Prefer concise, idiomatic expressions with correct measure words and natural flow.",
    ja: "You are a native-level Japanese translator. Use natural, fluent Japanese with correct polite forms (です/ます) unless casual is requested. Ensure correct particle usage (は、が、を、に、で、へ、と、から、まで), proper verb conjugations, and natural phrasing.",
    ko: "You are a native-level Korean translator. Use natural Korean with correct honorific levels, proper particles, and correct verb endings. Produce fluent, idiomatic Korean.",
    hi: "You are a native-level Hindi translator. Use authentic, natural Hindi in Devanagari script. Use correct gender agreement, case markers, and verb conjugations. Produce idiomatic Hindi as a native speaker would say it.",
    ru: "You are a native-level Russian translator. Use natural Russian with correct grammatical case endings (six cases), proper verb aspect (perfective/imperfective), and gender agreement. Produce fluent, idiomatic Russian.",
    el: "You are a native-level Greek translator. Use natural Modern Greek with correct inflections, verb conjugations, and natural phrasing. Write in proper Greek script.",
  };

  const targetCode = targetLang.replace(/-.*/, "");
  const langHint = langHints[targetLang] ?? langHints[targetCode] ?? "";

  const systemContent = [
    "You are an expert professional translator with native-level fluency in all languages.",
    "Your goal is to produce translations that sound completely natural to a native speaker of the target language — not literal word-for-word mappings.",
    "Always use correct grammar, idiomatic expressions, proper script, and appropriate vocabulary.",
    "Never add information not present in the original. Never refuse to translate.",
    langHint,
  ].filter(Boolean).join(" ");

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userMsg },
  ];
}

// ─── Language selector dropdown ───────────────────────────────────────────────
function LangDropdown({
  value,
  options,
  onChange,
  testId,
}: {
  value: string;
  options: typeof LANGUAGES;
  onChange: (code: string) => void;
  testId: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find(l => l.code === value) ?? options[0];
  const filtered = search
    ? options.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0" data-testid={testId}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(""); }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        <span className="truncate">{selected.name}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1.5 left-0 z-50 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search languages…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">No languages found</p>
              ) : filtered.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  data-testid={`lang-option-${lang.code}`}
                  onClick={() => { onChange(lang.code); setOpen(false); setSearch(""); }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors text-left",
                    lang.code === value
                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{lang.name}</span>
                  {lang.code === value && <Check className="w-3.5 h-3.5 shrink-0 text-purple-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Styled output renderer ───────────────────────────────────────────────────
function TranslationOutput({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  if (!text) {
    return isStreaming ? (
      <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse rounded-sm" />
    ) : null;
  }

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inNotes = false;
  let noteLines: string[] = [];
  let i = 0;

  const flushNotes = () => {
    if (noteLines.length === 0) return;
    elements.push(
      <div key={`notes-${i}`} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Translation Notes</p>
        <div className="space-y-1">
          {noteLines.map((nl, ni) => (
            <p key={ni} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{nl.replace(/^-\s*/, "")}</p>
          ))}
        </div>
      </div>
    );
    noteLines = [];
    inNotes = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    i++;

    if (/^TRANSLATION:\s*/i.test(trimmed)) {
      const val = trimmed.replace(/^TRANSLATION:\s*/i, "");
      if (val) {
        elements.push(
          <div key={`tr-${i}`} className="py-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Translation</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 leading-snug">
              {val}
              {isStreaming && !text.includes("PRONUNCIATION") && (
                <span className="inline-block w-1 h-6 bg-purple-500 animate-pulse ml-1 rounded-sm align-middle" />
              )}
            </p>
          </div>
        );
      }
      continue;
    }

    if (/^PRONUNCIATION:\s*/i.test(trimmed)) {
      const val = trimmed.replace(/^PRONUNCIATION:\s*/i, "");
      if (val) {
        elements.push(
          <p key={`pr-${i}`} className="text-base text-indigo-500 dark:text-indigo-400 italic font-medium tracking-wide leading-relaxed">
            {val}
            {isStreaming && (
              <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-1 rounded-sm align-middle" />
            )}
          </p>
        );
      }
      continue;
    }

    if (/^Detected language:\s*/i.test(trimmed)) {
      const val = trimmed.replace(/^Detected language:\s*/i, "");
      elements.push(
        <p key={`dl-${i}`} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
          <Globe className="w-3 h-3" /> Detected: {val}
        </p>
      );
      continue;
    }

    if (/^Translation notes?:/i.test(trimmed)) {
      flushNotes();
      inNotes = true;
      continue;
    }

    if (trimmed === "") {
      if (!inNotes) elements.push(<div key={`sp-${i}`} className="h-1" />);
      continue;
    }

    if (inNotes) {
      noteLines.push(trimmed);
    } else {
      elements.push(
        <p key={`ln-${i}`} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{trimmed}</p>
      );
    }
  }

  flushNotes();

  if (isStreaming) {
    elements.push(
      <span key="cursor" className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 rounded-sm align-middle" />
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Translator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [mode, setMode] = useState("standard");
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);

  const [output, setOutput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputError, setInputError] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);
  const isGenerating = state === "generating";
  const charCount = text.length;

  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const prev = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(prev);
    if (output) {
      setText(output.replace(/^Detected language:.*\n/i, "").trim());
      setOutput("");
      setIsDone(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) { setInputError("Please enter some text to translate."); return; }
    if (!targetLang) { setInputError("Please select a target language."); return; }
    setInputError("");
    setOutput("");
    setIsDone(false);
    setCopied(false);

    const msgs = buildMessages(text, sourceLang, targetLang, mode, context);
    const result = await generateRaw({
      messages: msgs as any,
      temperature: 0.2,
      maxTokens: 2048,
      onChunk: (chunk) => {
        setOutput(chunk);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      },
    });

    if (result) { setOutput(result); setIsDone(true); }
  };

  const handleReset = () => {
    setText(""); setOutput(""); setIsDone(false); setCopied(false);
    setInputError(""); setContext(""); setShowContext(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const srcName = SOURCE_LANGS.find(l => l.code === sourceLang)?.name ?? sourceLang;
    const tgtName = TARGET_LANGS.find(l => l.code === targetLang)?.name ?? targetLang;
    const content = `=== ORIGINAL (${srcName}) ===\n\n${text}\n\n=== TRANSLATION (${tgtName}) ===\n\n${output}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-5">

        {/* Language selectors */}
        <div className="flex items-center gap-2">
          <LangDropdown
            value={sourceLang}
            options={SOURCE_LANGS}
            onChange={setSourceLang}
            testId="select-source-lang"
          />

          <button
            type="button"
            data-testid="button-swap-langs"
            onClick={handleSwap}
            disabled={sourceLang === "auto"}
            title={sourceLang === "auto" ? "Select a source language to swap" : "Swap languages"}
            className={cn(
              "shrink-0 p-2 rounded-xl border-2 transition-all",
              sourceLang === "auto"
                ? "border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            )}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <LangDropdown
            value={targetLang}
            options={TARGET_LANGS}
            onChange={setTargetLang}
            testId="select-target-lang"
          />
        </div>

        {/* Text input */}
        <div className="space-y-1.5">
          <div className="relative">
            <textarea
              data-testid="input-text"
              value={text}
              onChange={e => { setText(e.target.value); setInputError(""); }}
              placeholder="Type or paste text to translate…"
              maxLength={15000}
              rows={7}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y font-medium placeholder:text-slate-400 text-sm"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
              {charCount.toLocaleString()} / 15,000
            </div>
          </div>
          {inputError && (
            <p className="text-xs text-red-500 flex items-center gap-1.5 ml-1">
              <AlertTriangle className="w-3 h-3" /> {inputError}
            </p>
          )}
          <p className="text-xs text-slate-400 ml-1 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Your text never leaves your browser
          </p>
        </div>

        {/* Mode selector */}
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2.5">
            Translation Mode
          </legend>
          <div className="flex flex-wrap gap-2">
            {MODES.map(m => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  data-testid={`button-mode-${m.id}`}
                  onClick={() => setMode(m.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-start px-3.5 py-2 rounded-xl border-2 transition-all text-left",
                    active
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
                  )}
                >
                  <span className={cn("text-xs font-bold", active ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                    {m.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Optional context */}
        <div>
          <button
            type="button"
            data-testid="button-toggle-context"
            onClick={() => setShowContext(p => !p)}
            className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            {showContext ? "Hide" : "Add"} context (optional)
            <ChevronDown className={cn("w-3 h-3 transition-transform", showContext && "rotate-180")} />
          </button>
          <AnimatePresence>
            {showContext && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  data-testid="input-context"
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="e.g. business email, social media post, legal document, product description…"
                  maxLength={200}
                  className="mt-2.5 w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Model loading */}
        <AnimatePresence>
          {(state === "checking-gpu" || state === "downloading") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {state === "checking-gpu" ? "Checking GPU support…" : "Loading AI model…"}
                </span>
              </div>
              {state === "downloading" && progress && (
                <>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.round(progress.percent)}%` }} />
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress.percent)}% — {progress.text}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="button-translate"
            onClick={handleTranslate}
            disabled={isGenerating || !text.trim()}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm",
              isGenerating || !text.trim()
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Translating…</>
            ) : (
              <><Globe className="w-4 h-4" /> Translate</>
            )}
          </button>

          {(text || output) && (
            <button
              type="button"
              data-testid="button-reset"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300 hover:text-red-500 font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      <AnimatePresence>
        {(output || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none">
                    Translation
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {TARGET_LANGS.find(l => l.code === targetLang)?.name}
                    {mode !== "standard" && ` · ${MODES.find(m => m.id === mode)?.label}`}
                  </p>
                </div>
              </div>

              {isDone && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="button-copy"
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                      copied
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600"
                    )}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    data-testid="button-download"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .txt
                  </button>
                </div>
              )}
            </div>

            <div
              ref={outputRef}
              data-testid="output-translation"
              className="max-h-[500px] overflow-y-auto space-y-2"
            >
              <TranslationOutput text={output} isStreaming={isGenerating} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
