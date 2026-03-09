import { useState } from "react";
import {
  Wand2, Skull, Rocket, Heart, Search, Compass,
  Moon, Smile, Swords, HeartHandshake, AlertTriangle, Sun,
  BookOpen, Loader2, Copy, Check, RefreshCw, RotateCcw,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useStoryStorage, type StoryResult } from "@/hooks/use-story-storage";

const GENRES = [
  { value: "Fantasy", icon: Wand2, desc: "Magic & wonder" },
  { value: "Horror", icon: Skull, desc: "Dark & terrifying" },
  { value: "Sci-Fi", icon: Rocket, desc: "Future & technology" },
  { value: "Romance", icon: Heart, desc: "Love & passion" },
  { value: "Mystery", icon: Search, desc: "Clues & suspense" },
  { value: "Adventure", icon: Compass, desc: "Thrills & exploration" },
] as const;

const TONES = [
  { value: "Dark & Mysterious", icon: Moon },
  { value: "Humorous & Witty", icon: Smile },
  { value: "Epic & Heroic", icon: Swords },
  { value: "Romantic & Emotional", icon: HeartHandshake },
  { value: "Suspenseful", icon: AlertTriangle },
  { value: "Light & Whimsical", icon: Sun },
] as const;

const SYSTEM_PROMPT =
  "You are a master creative storyteller and award-winning author who specializes in powerful opening lines. You create imaginative, intriguing, genre-appropriate story hooks that immediately pull readers in. Your openings feel cinematic, emotional, and full of possibility while perfectly matching the requested genre and tone.";

const CARD_COLORS = [
  "bg-indigo-50 dark:bg-indigo-950/30",
  "bg-purple-50 dark:bg-purple-950/30",
  "bg-violet-50 dark:bg-violet-950/30",
  "bg-blue-50 dark:bg-blue-950/30",
  "bg-slate-50 dark:bg-slate-950/30",
];

function parseStarters(raw: string): string[] {
  const markerMatch = raw.match(
    /STARTER\s*#?\s*1[:\s]*([\s\S]*?)STARTER\s*#?\s*2[:\s]*([\s\S]*?)STARTER\s*#?\s*3[:\s]*([\s\S]*?)STARTER\s*#?\s*4[:\s]*([\s\S]*?)STARTER\s*#?\s*5[:\s]*([\s\S]*)/i
  );
  if (markerMatch) {
    return [
      markerMatch[1].trim(),
      markerMatch[2].trim(),
      markerMatch[3].trim(),
      markerMatch[4].trim(),
      markerMatch[5].trim(),
    ].filter(Boolean);
  }

  const hashMatch = raw.match(
    /#\s*1[:\s]*([\s\S]*?)#\s*2[:\s]*([\s\S]*?)#\s*3[:\s]*([\s\S]*?)#\s*4[:\s]*([\s\S]*?)#\s*5[:\s]*([\s\S]*)/i
  );
  if (hashMatch) {
    return [
      hashMatch[1].trim(),
      hashMatch[2].trim(),
      hashMatch[3].trim(),
      hashMatch[4].trim(),
      hashMatch[5].trim(),
    ].filter(Boolean);
  }

  const numberedMatch = raw.match(
    /(?:^|\n)\s*1[\.\):\s]+([\s\S]*?)(?:\n\s*2[\.\):\s]+)([\s\S]*?)(?:\n\s*3[\.\):\s]+)([\s\S]*?)(?:\n\s*4[\.\):\s]+)([\s\S]*?)(?:\n\s*5[\.\):\s]+)([\s\S]*)/m
  );
  if (numberedMatch) {
    return [
      numberedMatch[1].trim(),
      numberedMatch[2].trim(),
      numberedMatch[3].trim(),
      numberedMatch[4].trim(),
      numberedMatch[5].trim(),
    ].filter(Boolean);
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 5) return lines.slice(0, 5);
  if (lines.length > 0) return lines;

  return [raw.trim()];
}

export function StoryGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveStory } = useStoryStorage();

  const [genre, setGenre] = useState("Fantasy");
  const [tone, setTone] = useState("Dark & Mysterious");
  const [character, setCharacter] = useState("");
  const [extraFlavor, setExtraFlavor] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [starters, setStarters] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setGenre("Fantasy");
    setTone("Dark & Mysterious");
    setCharacter("");
    setExtraFlavor("");
    setStreamingText("");
    setStarters([]);
    setCopiedIdx(null);
    setCopiedAll(false);
  };

  const copyToClipboard = async (text: string, idx?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (idx !== undefined) {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
      }
    } catch {}
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(starters.join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setStarters([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const charTrimmed = character.trim();
    const flavorTrimmed = extraFlavor.trim();

    const userPrompt = `Generate 5 powerful story opening lines for the following story.
GENRE: ${genre}
TONE: ${tone}${charTrimmed ? `\nMAIN CHARACTER: ${charTrimmed}` : ""}${flavorTrimmed ? `\nIMPORTANT DETAILS that MUST appear in every starter: ${flavorTrimmed}. Do NOT write generic openings that ignore these details.` : ""}

Rules:
- Each starter must be 1 strong opening line or short paragraph (max 2 sentences)
- Highly imaginative and intriguing
- Perfectly matches the genre and tone
- Creates immediate curiosity
- Feels like the first line of a published novel${charTrimmed ? "\n- Every starter MUST feature or reference the main character" : ""}${flavorTrimmed ? "\n- Every starter MUST incorporate the extra details provided" : ""}

FORMAT YOUR RESPONSE EXACTLY:
STARTER #1: [text]
STARTER #2: [text]
STARTER #3: [text]
STARTER #4: [text]
STARTER #5: [text]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 600,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseStarters(result);
        setStarters(parsed);

        const record: StoryResult = {
          id: generateId(),
          genre,
          tone,
          character: charTrimmed,
          extraFlavor: flavorTrimmed,
          starters: parsed.join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveStory(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-story-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Genre *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" data-testid="container-genre">
              {GENRES.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.value}
                    data-testid={`toggle-genre-${g.value.toLowerCase().replace(/[\s\-]+/g, "-")}`}
                    onClick={() => setGenre(g.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      genre === g.value
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600 ring-1 ring-indigo-200 dark:ring-indigo-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{g.value}</span>
                      <span className="text-[10px] opacity-70">{g.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Tone *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" data-testid="container-tone">
              {TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    data-testid={`toggle-tone-${t.value.toLowerCase().replace(/[\s&]+/g, "-")}`}
                    onClick={() => setTone(t.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      tone === t.value
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{t.value}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="story-character" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Main Character <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="story-character"
              type="text"
              data-testid="input-character"
              value={character}
              onChange={(e) => setCharacter(e.target.value.slice(0, 100))}
              placeholder="e.g., Elena, a young archaeologist or a rogue AI"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-character-char-count" className="text-xs text-slate-400">{character.length}/100</span>
            </div>
          </div>

          <div>
            <label htmlFor="story-extra-flavor" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Extra Flavor <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="story-extra-flavor"
              data-testid="input-extra-flavor"
              value={extraFlavor}
              onChange={(e) => setExtraFlavor(e.target.value.slice(0, 300))}
              placeholder="e.g., Set in a rainy cyberpunk city, Include a mysterious artifact"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-extra-flavor-char-count" className="text-xs text-slate-400">{extraFlavor.length}/300</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Generate 5 Story Starters
                </>
              )}
            </button>
            {(starters.length > 0 || streamingText) && (
              <button
                data-testid="button-reset"
                onClick={handleReset}
                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {isGenerating && streamingText && !starters.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating story starters...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {starters.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="space-y-4">
              {starters.map((starter, idx) => (
                <div
                  key={idx}
                  data-testid={`card-starter-${idx}`}
                  className={cn(
                    "relative p-5 rounded-2xl border border-slate-200 dark:border-slate-700",
                    CARD_COLORS[idx % CARD_COLORS.length]
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400" data-testid={`text-starter-label-${idx}`}>
                      Story Starter #{idx + 1}
                    </span>
                  </div>
                  <p
                    className="text-slate-800 dark:text-slate-100 text-base leading-relaxed italic"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid={`text-starter-${idx}`}
                  >
                    {starter}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      data-testid={`button-copy-starter-${idx}`}
                      onClick={() => copyToClipboard(starter, idx)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                data-testid="button-generate-more"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Generate 5 New Starters
              </button>
              <button
                data-testid="button-copy-all"
                onClick={copyAll}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied All
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </>
                )}
              </button>
              <button
                data-testid="button-reset-bottom"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EngineStatus({
  state,
  progress,
  error,
}: {
  state: string;
  progress: { text: string; percent: number };
  error: string | null;
}) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" data-testid="container-engine-error">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">AI Engine Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
