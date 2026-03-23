import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronDown, ChevronUp, History, Trash2, Shuffle,
  Lock, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PromptCard {
  platform: string;
  badge: string;
  color: string;
  prompt: string;
}

interface HistoryEntry {
  id: string;
  description: string;
  style: string;
  aspectRatio: string;
  cards: PromptCard[];
  createdAt: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STYLES = [
  "None", "Photorealistic", "Cyberpunk", "Studio Ghibli", "Oil Painting",
  "Anime / Manga", "Watercolor", "Cinematic", "Dark Fantasy", "Neon Noir",
  "Minimalist", "Sketch / Pencil", "Baroque", "Lo-fi Aesthetic", "Surrealism",
];

const ASPECT_RATIOS = [
  { label: "1:1", desc: "Square", mj: "--ar 1:1" },
  { label: "16:9", desc: "Landscape", mj: "--ar 16:9" },
  { label: "9:16", desc: "Portrait", mj: "--ar 9:16" },
  { label: "3:2", desc: "Photo", mj: "--ar 3:2" },
  { label: "4:5", desc: "Instagram", mj: "--ar 4:5" },
  { label: "2:1", desc: "Cinematic", mj: "--ar 2:1" },
];

const PLATFORMS: PromptCard[] = [
  { platform: "Midjourney v6", badge: "MJ", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", prompt: "" },
  { platform: "DALL-E 3", badge: "DE", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", prompt: "" },
  { platform: "Flux 1.1 Pro", badge: "FL", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", prompt: "" },
  { platform: "Stable Diffusion 3", badge: "SD", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", prompt: "" },
  { platform: "Leonardo AI", badge: "LN", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", prompt: "" },
  { platform: "Midjourney Cinematic", badge: "MC", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", prompt: "" },
  { platform: "Adobe Firefly", badge: "FF", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", prompt: "" },
  { platform: "Universal", badge: "✦", color: "bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300", prompt: "" },
];

const HISTORY_KEY = "image-prompt-history-v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parsePrompts(raw: string): PromptCard[] {
  const results: PromptCard[] = [];
  const parts = raw.split(/PROMPT\s*\d+\s*[|\-–:]/i);
  const blocks = parts.slice(1, 9);

  for (let i = 0; i < PLATFORMS.length; i++) {
    const platform = PLATFORMS[i];
    let text = (blocks[i] ?? "").trim();
    // Remove leading platform name line if echoed
    text = text.replace(/^[^\n]+\n/, "").trim();
    // Clean up excessive blank lines
    text = text.replace(/\n{3,}/g, "\n\n").trim();
    results.push({ ...platform, prompt: text || "" });
  }
  return results;
}

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch { return []; }
}

function saveHistory(entry: HistoryEntry) {
  const prev = loadHistory().filter(h => h.id !== entry.id).slice(0, 19);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...prev]));
}

function buildSystemPrompt() {
  return `You are an expert AI image prompt engineer with deep knowledge of Midjourney v6, DALL-E 3, Flux 1.1 Pro, Stable Diffusion 3, Leonardo AI, and Adobe Firefly. You craft highly detailed, platform-optimized prompts that consistently produce stunning, cinematic, professional-quality images.

Rules:
- Each prompt must be rich with visual detail: lighting, composition, camera settings, mood, texture, color palette.
- Include platform-specific parameters where applicable (Midjourney: --ar, --v 6, --stylize, --q).
- Stable Diffusion prompts should end with a short negative prompt section.
- Make each variation feel genuinely different in mood, composition, or artistic approach — not just slight rewording.
- Output ONLY the 8 prompts in the exact format specified. No preamble or commentary.`;
}

function buildUserPrompt(description: string, style: string, aspectRatio: string) {
  const ar = ASPECT_RATIOS.find(a => a.label === aspectRatio);
  return `Generate 8 optimized image prompts for the concept below. Use the specified style and aspect ratio across all prompts.

Concept: ${description}
Style / Aesthetic: ${style === "None" ? "not specified — choose whatever fits best" : style}
Aspect Ratio: ${aspectRatio}${ar ? ` (${ar.desc})` : ""}

Output EXACTLY 8 prompts using this format (follow it precisely):

PROMPT 1 | Midjourney v6:
[Ultra-detailed Midjourney prompt with cinematic quality] ${ar?.mj ?? "--ar 1:1"} --v 6 --stylize 750 --q 2

PROMPT 2 | DALL-E 3:
[Detailed natural-language DALL-E 3 prompt — descriptive and photorealistic or artistic as appropriate]

PROMPT 3 | Flux 1.1 Pro:
[Hyper-detailed Flux prompt emphasizing textures, lighting, and photographic quality]

PROMPT 4 | Stable Diffusion 3:
[SD3 prompt with detailed subject, environment, lighting]
Negative prompt: [common SD negatives like blurry, deformed, low quality, watermark]

PROMPT 5 | Leonardo AI:
[Leonardo prompt focusing on composition, dynamic pose, and atmosphere]

PROMPT 6 | Midjourney Cinematic:
[Cinematic film-still variation with lens, focal length, director/cinematographer reference] ${ar?.mj ?? "--ar 1:1"} --v 6 --stylize 1000 --q 2 --cref

PROMPT 7 | Adobe Firefly:
[Clean, commercial-safe Firefly prompt with content type and effects modifiers]

PROMPT 8 | Universal:
[Platform-agnostic ultra-detailed prompt that works well on any AI image generator]`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PromptCardView({ card, index, aspectRatio }: { card: PromptCard; index: number; aspectRatio: string }) {
  const [copied, setCopied] = useState(false);
  const [copiedMJ, setCopiedMJ] = useState(false);

  const isMJ = card.platform.toLowerCase().includes("midjourney");

  const handleCopy = () => {
    navigator.clipboard.writeText(card.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMJ = () => {
    const ar = ASPECT_RATIOS.find(a => a.label === aspectRatio);
    let mjPrompt = card.prompt;
    if (!mjPrompt.includes("--v")) mjPrompt += ` ${ar?.mj ?? "--ar 1:1"} --v 6 --stylize 750 --q 2`;
    navigator.clipboard.writeText(mjPrompt);
    setCopiedMJ(true);
    setTimeout(() => setCopiedMJ(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass-panel rounded-2xl p-4 flex flex-col gap-3"
      data-testid={`card-prompt-${index}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", card.color)}>
            {card.badge}
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{card.platform}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isMJ && (
            <button
              type="button"
              data-testid={`button-copy-mj-${index}`}
              onClick={handleCopyMJ}
              className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg border transition-all",
                copiedMJ
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 border-purple-300"
                  : "border-purple-200 dark:border-purple-700 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              )}
            >
              {copiedMJ ? "Copied!" : "Copy for MJ"}
            </button>
          )}
          <button
            type="button"
            data-testid={`button-copy-${index}`}
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
              copied
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200 dark:border-emerald-700"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:text-purple-600"
            )}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
        {card.prompt}
      </p>
    </motion.div>
  );
}

function HistoryPanel({ history, onSelect, onClear }: {
  history: HistoryEntry[];
  onSelect: (h: HistoryEntry) => void;
  onClear: () => void;
}) {
  if (history.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Prompt History</span>
        </div>
        <button
          type="button"
          data-testid="button-clear-history"
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.map(h => (
          <button
            key={h.id}
            type="button"
            data-testid={`button-history-${h.id}`}
            onClick={() => onSelect(h)}
            className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
          >
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300">{h.description}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{h.style} · {h.aspectRatio} · {new Date(h.createdAt).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImagePromptGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("None");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cards, setCards] = useState<PromptCard[]>([]);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleGenerate = useCallback(async () => {
    const trimmed = description.trim();
    if (trimmed.length < 5) { setInputError("Please describe your image idea (at least a few words)."); return; }
    setInputError("");
    setCards([]);
    setStreaming("");
    setIsDone(false);

    const result = await generateRaw({
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(trimmed, style, aspectRatio) },
      ],
      temperature: 0.75,
      maxTokens: 3000,
      onChunk: (chunk) => setStreaming(chunk),
    });

    if (result) {
      const parsed = parsePrompts(result);
      setCards(parsed);
      setStreaming("");
      setIsDone(true);
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        description: trimmed,
        style,
        aspectRatio,
        cards: parsed,
        createdAt: Date.now(),
      };
      saveHistory(entry);
      setHistory(loadHistory());
    }
  }, [description, style, aspectRatio, generateRaw]);

  const handleRemix = useCallback((card: PromptCard) => {
    setDescription(prev => `Remix of: ${card.prompt.split("--")[0].trim().slice(0, 120)}`);
    setCards([]);
    setIsDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReset = () => {
    setDescription(""); setStyle("None"); setAspectRatio("16:9");
    setCards([]); setStreaming(""); setIsDone(false); setInputError("");
  };

  const handleSelectHistory = (h: HistoryEntry) => {
    setDescription(h.description);
    setStyle(h.style);
    setAspectRatio(h.aspectRatio);
    setCards(h.cards);
    setIsDone(true);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* Input card */}
      <div className="glass-panel rounded-2xl p-5 space-y-5">

        {/* Describe idea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Describe Your Image Idea *
          </label>
          <textarea
            data-testid="input-description"
            value={description}
            onChange={e => { setDescription(e.target.value); setInputError(""); }}
            placeholder={"e.g. cyberpunk samurai girl standing on a rainy Tokyo rooftop at night, neon signs, flying cars in the background"}
            maxLength={1000}
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
          />
          {inputError && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />{inputError}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/1000</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Style / Aesthetic
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button
                key={s}
                type="button"
                data-testid={`button-style-${s.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => setStyle(s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all",
                  style === s
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map(ar => (
              <button
                key={ar.label}
                type="button"
                data-testid={`button-ar-${ar.label.replace(":", "x")}`}
                onClick={() => setAspectRatio(ar.label)}
                className={cn(
                  "flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all",
                  aspectRatio === ar.label
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
                )}
              >
                <span className={cn("text-xs font-bold", aspectRatio === ar.label ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{ar.label}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{ar.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced toggle */}
        <div>
          <button
            type="button"
            data-testid="button-toggle-advanced"
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Advanced options
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 leading-relaxed">
                    The AI automatically includes <strong>--ar</strong>, <strong>--v 6</strong>, <strong>--stylize</strong>, and <strong>--q 2</strong> parameters for Midjourney prompts. Negative prompts are auto-generated for Stable Diffusion. Specifying a style above gives you the most control over the output aesthetic.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={isGenerating || isLoading || description.trim().length < 5}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm",
              isGenerating || isLoading || description.trim().length < 5
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-purple-500/20"
            )}
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating 8 Prompts…</>
            ) : (
              <><ImageIcon className="w-4 h-4" /> Generate 8 Prompts</>
            )}
          </button>
          {(description || isDone) && (
            <button
              type="button"
              data-testid="button-reset"
              onClick={handleReset}
              className="px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300 hover:text-red-500 font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {history.length > 0 && (
            <button
              type="button"
              data-testid="button-toggle-history"
              onClick={() => setShowHistory(v => !v)}
              className="px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-500 font-semibold text-sm transition-all"
              title="Prompt history"
            >
              <History className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Lock className="w-3 h-3" />
          <span>100% private — runs entirely in your browser, nothing is uploaded</span>
        </div>
      </div>

      {/* History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model loading bar */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
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

      {/* Streaming preview */}
      {isGenerating && streaming && (
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Generating…</span>
          </div>
          <pre className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed font-mono overflow-hidden max-h-48">
            {streaming}
            <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      )}

      {/* Output cards */}
      {isDone && cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              8 Prompts Generated
              <span className="ml-2 text-xs font-normal text-slate-400">
                for "{description.slice(0, 60)}{description.length > 60 ? "…" : ""}"
              </span>
            </p>
            <button
              type="button"
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors disabled:opacity-40"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Regenerate
            </button>
          </div>

          {cards.map((card, i) => (
            <div key={i} className="group relative">
              <PromptCardView card={card} index={i} aspectRatio={aspectRatio} />
              <button
                type="button"
                data-testid={`button-remix-${i}`}
                onClick={() => handleRemix(card)}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-purple-600 transition-all"
              >
                <Shuffle className="w-3 h-3" /> Remix
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
