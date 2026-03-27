import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Copy, Heart, Star, MessageCircle, Hash, Type, RotateCcw
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useTikTokCaptionStorage,
  type GeneratedCaption,
  type FirstComment,
  type TikTokCaptionRecord,
} from "@/hooks/use-tiktok-caption-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const NICHES = [
  "Fitness & Health", "Food & Cooking", "Beauty & Skincare",
  "Fashion & Style", "Travel & Adventure", "Comedy & Entertainment",
  "Education & Learning", "Business & Entrepreneurship",
  "Lifestyle & Vlogs", "Dance & Music", "Pets & Animals",
  "Technology & Gadgets", "Art & Creativity", "Sports & Athletics",
  "Parenting & Family", "Home & DIY", "Gaming",
  "Finance & Money Tips", "Motivation & Self-Improvement",
  "Sustainability & Environment", "Books & Reading",
  "Photography", "Mental Health & Wellness", "Relationship Advice",
  "Other",
];

const AUDIENCES = [
  { value: "gen-z", label: "Gen Z", desc: "13-24 years" },
  { value: "millennials", label: "Millennials", desc: "25-40 years" },
  { value: "broad", label: "Broad/All Ages", desc: "Universal" },
];

const ACCOUNT_TYPES = [
  { value: "creator", label: "Creator", desc: "Personal brand" },
  { value: "brand", label: "Brand", desc: "Business account" },
  { value: "educational", label: "Educational", desc: "Teaching/tutorials" },
  { value: "entertainment", label: "Entertainment", desc: "Comedy/fun" },
];

const CONTENT_TYPES = [
  { value: "educational", label: "Educational/Tutorial" },
  { value: "entertainment", label: "Entertainment/Comedy" },
  { value: "lifestyle", label: "Lifestyle/Vlog" },
  { value: "product", label: "Product/Review" },
  { value: "motivational", label: "Motivational/Inspirational" },
  { value: "trend", label: "Trend/Challenge" },
];

const GOALS = [
  "Get on FYP", "Drive Engagement", "Grow Followers",
  "Generate Sales", "Build Community",
];

const TONES = [
  "Casual", "Funny", "Inspiring", "Educational",
  "Relatable", "Hype/Energetic", "Mysterious", "Storytelling",
];

const CAPTION_LENGTHS = [
  { value: "short", label: "Short", desc: "50-100 chars" },
  { value: "medium", label: "Medium", desc: "100-200 chars" },
  { value: "long", label: "Long", desc: "200-300 chars" },
];

const ENGAGEMENT_STARS: Record<number, string> = {
  5: "text-amber-500",
  4: "text-amber-400",
  3: "text-amber-300",
  2: "text-slate-400",
  1: "text-slate-300",
};

const SYSTEM_PROMPT = `You are a viral TikTok content strategist who understands what makes videos go viral and how to write captions that maximize engagement.

Your expertise includes:
- TikTok algorithm and FYP (For You Page) optimization
- Viral caption formulas and hooks
- Hashtag strategy for TikTok growth
- Call-to-action techniques for engagement
- Trending format integration
- Gen Z communication style

You write TikTok captions that:
- Hook viewers in first 3 words
- Are optimized for the FYP algorithm
- Include strategic hashtags (5-8 max)
- Have clear calls-to-action
- Use emojis effectively (not excessively)
- Match trending formats when relevant
- Encourage comments and engagement
- Are authentic and relatable`;

export function TikTokCaptionGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveGeneration, toggleFavorite } = useTikTokCaptionStorage();

  const [videoContent, setVideoContent] = useState("");
  const [videoHook, setVideoHook] = useState("");
  const [trendingSound, setTrendingSound] = useState("");
  const [niche, setNiche] = useState(NICHES[0]);
  const [audience, setAudience] = useState("gen-z");
  const [accountType, setAccountType] = useState("creator");
  const [contentType, setContentType] = useState("educational");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Get on FYP", "Drive Engagement"]);
  const [selectedTones, setSelectedTones] = useState<string[]>(["Casual"]);
  const [captionLength, setCaptionLength] = useState("medium");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [numHashtags, setNumHashtags] = useState(5);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [numCaptions, setNumCaptions] = useState(5);
  const [useTrendingFormats, setUseTrendingFormats] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<TikTokCaptionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? (prev.length > 1 ? prev.filter(g => g !== goal) : prev) : [...prev, goal]
    );
  };

  const toggleTone = (tone: string) => {
    setSelectedTones(prev => {
      if (prev.includes(tone)) return prev.length > 1 ? prev.filter(t => t !== tone) : prev;
      if (prev.length >= 2) return [prev[1], tone];
      return [...prev, tone];
    });
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {}
  };

  const handleGenerate = async () => {
    if (!videoContent.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const lengthDesc = CAPTION_LENGTHS.find(l => l.value === captionLength)?.desc || "100-200 chars";

    const userPrompt = `Write ${numCaptions} different TikTok captions for this video:

Video: ${videoContent.trim()}
${videoHook ? `Hook: ${videoHook.trim()}` : ""}
${trendingSound ? `Sound: ${trendingSound.trim()}` : ""}
Niche: ${niche}
Audience: ${AUDIENCES.find(a => a.value === audience)?.label}
Account: ${ACCOUNT_TYPES.find(a => a.value === accountType)?.label}
Type: ${CONTENT_TYPES.find(c => c.value === contentType)?.label}
Goals: ${selectedGoals.join(", ")}
Tone: ${selectedTones.join(", ")}
Length: ${captionLength} (${lengthDesc})
${includeHashtags ? `Add ${numHashtags} hashtags at the end of each caption.` : "Do not include hashtags."}
${includeEmojis ? "Use 2-5 emojis in each caption." : "Do not use emojis."}
${useTrendingFormats ? "Use trending TikTok formats like POV:, Nobody talks about..., This is your sign to..., etc." : ""}

Here is an example of the exact format I need. Write REAL captions, not placeholders:

OPTION 1: Curiosity Hook
TONE: Casual

POV: You finally found a morning routine that actually works

No 5am wake-ups, no cold showers, just coffee and vibes

Comment "morning" if you need this rn

#morningroutine #coffeetok #realistic #productivity #fyp

WHY IT WORKS:
- POV format is trending and relatable
- Pain point hook grabs attention
- Clear comment CTA drives engagement

---

Now write ${numCaptions} COMPLETELY DIFFERENT real captions about "${videoContent.trim()}" using these angles: 1) Curiosity Hook 2) Relatable/Funny 3) Educational Value 4) Question/Engagement 5) Bold Statement. Each must be a unique, complete caption ready to post on TikTok. Do NOT write placeholder text like "Continue same format" -- write the actual caption.

Use this exact format for each:

OPTION N: Angle Name
TONE: tone

actual caption text here

WHY IT WORKS:
- reason

---

After all ${numCaptions} captions, add:

FIRST COMMENTS:
A: a real first comment suggestion
B: a real first comment suggestion
C: a real first comment suggestion`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
        maxTokens: 3000,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        let { captions, firstComments } = parseTikTokOutput(result);
        if (captions.length === 0) {
          captions = [{
            id: generateId(),
            caption: result.trim(),
            angle: "Generated Caption",
            tone: selectedTones.join(", "),
            charCount: result.trim().length,
            hashtagCount: (result.match(/#[a-zA-Z0-9_]+/g) || []).length,
            emojiCount: 0,
            engagementRating: 4,
            whyItWorks: [],
            hashtags: [...new Set(result.match(/#[a-zA-Z0-9_]+/g) || [])],
          }];
        }
        const record: TikTokCaptionRecord = {
          id: generateId(),
          videoContent: videoContent.trim(),
          niche,
          captions,
          firstComments,
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentRecord(record);
        saveGeneration(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && videoContent.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-tiktok-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="video-content" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What's Your Video About? *
            </label>
            <textarea
              id="video-content"
              data-testid="input-video-content"
              value={videoContent}
              onChange={(e) => setVideoContent(e.target.value.slice(0, 300))}
              placeholder="Describe your TikTok video content. Be specific! e.g., 'Morning coffee routine at my favorite downtown cafe' or '10-minute full body workout you can do at home'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">The more details, the better the caption</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{videoContent.length}/300</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="video-hook" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Video Hook/Opening
              </label>
              <input
                id="video-hook"
                data-testid="input-video-hook"
                type="text"
                value={videoHook}
                onChange={(e) => setVideoHook(e.target.value.slice(0, 100))}
                placeholder="e.g., Wait for the reveal, This changed everything..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="trending-sound" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Trending Sound Used?
              </label>
              <input
                id="trending-sound"
                data-testid="input-trending-sound"
                type="text"
                value={trendingSound}
                onChange={(e) => setTrendingSound(e.target.value.slice(0, 100))}
                placeholder="e.g., Original audio, Song name, Trending sound..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="niche" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Content Niche *
              </label>
              <select
                id="niche"
                data-testid="select-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Target Audience *
              </label>
              <div className="flex gap-2" data-testid="container-audience">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.value}
                    data-testid={`toggle-audience-${a.value}`}
                    onClick={() => setAudience(a.value)}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                      audience === a.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="font-semibold">{a.label}</div>
                    <div className="text-xs opacity-60">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-2" data-testid="container-account-type">
                {ACCOUNT_TYPES.map((a) => (
                  <button
                    key={a.value}
                    data-testid={`toggle-account-${a.value}`}
                    onClick={() => setAccountType(a.value)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                      accountType === a.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="font-semibold">{a.label}</div>
                    <div className="text-xs opacity-60">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Content Type *
              </label>
              <div className="grid grid-cols-2 gap-2" data-testid="container-content-type">
                {CONTENT_TYPES.map((c) => (
                  <button
                    key={c.value}
                    data-testid={`toggle-content-${c.value}`}
                    onClick={() => setContentType(c.value)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-medium border transition-all text-center",
                      contentType === c.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Primary Goal *
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-goals">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  data-testid={`toggle-goal-${goal.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => toggleGoal(goal)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    selectedGoals.includes(goal)
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-slate-500 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tone/Vibe * <span className="text-xs font-normal text-slate-400">(select 1-2)</span>
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-tones">
              {TONES.map((tone) => (
                <button
                  key={tone}
                  data-testid={`toggle-tone-${tone.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => toggleTone(tone)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    selectedTones.includes(tone)
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-slate-500 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Caption Length
            </label>
            <div className="flex gap-2" data-testid="container-caption-length">
              {CAPTION_LENGTHS.map((l) => (
                <button
                  key={l.value}
                  data-testid={`toggle-length-${l.value}`}
                  onClick={() => setCaptionLength(l.value)}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    captionLength === l.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-xs opacity-60">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
              Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <ToggleOption
                      testId="toggle-include-hashtags"
                      label="Include hashtags"
                      value={includeHashtags}
                      onChange={() => setIncludeHashtags(!includeHashtags)}
                    />
                    {includeHashtags && (
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Number of hashtags</span>
                          <span className="text-sm font-bold text-purple-600" data-testid="text-num-hashtags">{numHashtags}</span>
                        </div>
                        <input
                          data-testid="input-num-hashtags"
                          type="range"
                          min={3}
                          max={8}
                          step={1}
                          value={numHashtags}
                          onChange={(e) => setNumHashtags(parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>3</span>
                          <span>8</span>
                        </div>
                      </div>
                    )}
                    <ToggleOption
                      testId="toggle-include-emojis"
                      label="Include emojis"
                      value={includeEmojis}
                      onChange={() => setIncludeEmojis(!includeEmojis)}
                    />
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Number of caption variations</span>
                        <span className="text-sm font-bold text-purple-600" data-testid="text-num-captions">{numCaptions}</span>
                      </div>
                      <input
                        data-testid="input-num-captions"
                        type="range"
                        min={3}
                        max={7}
                        step={1}
                        value={numCaptions}
                        onChange={(e) => setNumCaptions(parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>3</span>
                        <span>7</span>
                      </div>
                    </div>
                    <ToggleOption
                      testId="toggle-trending-formats"
                      label="Use trending formats (POV:, Nobody talks about...)"
                      value={useTrendingFormats}
                      onChange={() => setUseTrendingFormats(!useTrendingFormats)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating viral captions...
                </>
              ) : (
                <>
                  <Music2 className="w-5 h-5" />
                  Generate TikTok Captions
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={() => {
                setVideoContent("");
                setVideoHook("");
                setTrendingSound("");
                setNiche(NICHES[0]);
                setAudience("gen-z");
                setAccountType("creator");
                setContentType("educational");
                setSelectedGoals(["Get on FYP", "Drive Engagement"]);
                setSelectedTones(["Casual"]);
                setCaptionLength("medium");
                setShowAdvanced(false);
                setIncludeHashtags(true);
                setNumHashtags(5);
                setIncludeEmojis(true);
                setNumCaptions(5);
                setUseTrendingFormats(true);
                setStreamingText("");
                setCurrentRecord(null);
                setCopiedId(null);
              }}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8"
          data-testid="container-streaming"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Crafting hooks... Adding CTAs... Optimizing hashtags...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentRecord && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
              Your TikTok Caption Options ({currentRecord.captions.length} Generated)
            </h3>
            <button
              data-testid="button-copy-all"
              onClick={() => {
                const allText = currentRecord.captions.map((c, i) => `OPTION ${i + 1}:\n${c.caption}`).join("\n\n---\n\n");
                copyToClipboard(allText, "all");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                copiedId === "all"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
              )}
            >
              {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === "all" ? "Copied!" : "Copy All"}
            </button>
            <InlineShareButtons />
          </div>

          <div className="space-y-4">
            {currentRecord.captions.map((caption, i) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
                index={i}
                isFavorite={currentRecord.favorites.includes(caption.id)}
                onToggleFavorite={() => {
                  toggleFavorite(currentRecord.id, caption.id);
                  setCurrentRecord(prev => {
                    if (!prev) return prev;
                    const isFav = prev.favorites.includes(caption.id);
                    return {
                      ...prev,
                      favorites: isFav
                        ? prev.favorites.filter(id => id !== caption.id)
                        : [...prev.favorites, caption.id],
                    };
                  });
                }}
                onCopy={(text) => copyToClipboard(text, caption.id)}
                copied={copiedId === caption.id}
              />
            ))}
          </div>

          {currentRecord.firstComments.length > 0 && (
            <FirstCommentsSection
              comments={currentRecord.firstComments}
              onCopy={(text, id) => copyToClipboard(text, id)}
              copiedId={copiedId}
            />
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleOption({ testId, label, value, onChange }: { testId: string; label: string; value: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        data-testid={testId}
        onClick={onChange}
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative",
          value ? "bg-purple-500" : "bg-slate-300"
        )}
      >
        <div className={cn(
          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
          value ? "left-5" : "left-1"
        )} />
      </button>
    </label>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

function CaptionCard({
  caption,
  index,
  isFavorite,
  onToggleFavorite,
  onCopy,
  copied,
}: {
  caption: GeneratedCaption;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      data-testid={`card-caption-${caption.id}`}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Option {index + 1}
            </span>
            {caption.angle && (
              <span className="text-xs text-slate-400 ml-2">{caption.angle}</span>
            )}
          </div>
          {caption.tone && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {caption.tone}
            </span>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line" data-testid={`text-caption-${caption.id}`}>
            {caption.caption}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1" data-testid={`stat-chars-${caption.id}`}>
            <Type className="w-3.5 h-3.5" />
            {caption.charCount} chars
          </div>
          <div className="flex items-center gap-1" data-testid={`stat-hashtags-${caption.id}`}>
            <Hash className="w-3.5 h-3.5" />
            {caption.hashtagCount} hashtags
          </div>
          <div className="flex items-center gap-1" data-testid={`stat-engagement-${caption.id}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < caption.engagementRating
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200"
                )}
              />
            ))}
          </div>
        </div>

        <button
          data-testid={`button-analysis-${caption.id}`}
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 mb-3"
        >
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAnalysis && "rotate-180")} />
          Why it works
        </button>

        <AnimatePresence>
          {showAnalysis && caption.whyItWorks.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="space-y-1.5 mb-4 pl-1">
                {caption.whyItWorks.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            data-testid={`button-copy-${caption.id}`}
            onClick={() => onCopy(caption.caption)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            )}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Caption"}
          </button>
          <button
            data-testid={`button-fav-${caption.id}`}
            onClick={onToggleFavorite}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "text-red-500 fill-red-500" : "")} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FirstCommentsSection({
  comments,
  onCopy,
  copiedId,
}: {
  comments: FirstComment[];
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-first-comments">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-slate-800">First Comment Suggestions</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">Pin one of these as your first comment to boost engagement:</p>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
            data-testid={`first-comment-${comment.id}`}
          >
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase">{comment.label}</span>
              <p className="text-sm text-slate-700 mt-1">{comment.text}</p>
            </div>
            <button
              data-testid={`button-copy-comment-${comment.id}`}
              onClick={() => onCopy(comment.text, `comment-${comment.id}`)}
              className="shrink-0"
            >
              {copiedId === `comment-${comment.id}` ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseTikTokOutput(raw: string): { captions: GeneratedCaption[]; firstComments: FirstComment[] } {
  const captions: GeneratedCaption[] = [];
  const firstComments: FirstComment[] = [];

  const firstCommentSection = raw.match(/FIRST COMMENTS?:?\s*\n([\s\S]*?)(?:$|POSTING|ALTERNATIVE|HASHTAG BREAKDOWN)/i);
  if (firstCommentSection) {
    const commentLines = firstCommentSection[1].split("\n");
    let currentLabel = "";
    let currentText = "";

    for (const line of commentLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const labelMatch = trimmed.match(/^(?:Option\s+)?([A-D])[:.]\s*(.*)/i);
      if (labelMatch) {
        if (currentLabel && currentText) {
          firstComments.push({ id: generateId(), label: currentLabel, text: currentText.trim() });
        }
        currentLabel = `Option ${labelMatch[1].toUpperCase()}`;
        currentText = labelMatch[2] || "";
      } else if (currentLabel) {
        currentText += " " + trimmed;
      }
    }
    if (currentLabel && currentText) {
      firstComments.push({ id: generateId(), label: currentLabel, text: currentText.trim() });
    }
  }

  const optionRegex = /OPTION\s+(\d+)[:\s]*(?:\(([^)]*)\)|([^\n]*))/gi;
  const optionMatches = [...raw.matchAll(optionRegex)];

  if (optionMatches.length > 0) {
    for (let i = 0; i < optionMatches.length; i++) {
      const match = optionMatches[i];
      const startIdx = match.index! + match[0].length;
      const endIdx = i < optionMatches.length - 1
        ? optionMatches[i + 1].index!
        : (firstCommentSection?.index ?? raw.length);

      const sectionText = raw.slice(startIdx, endIdx).trim();
      const angle = (match[2] || match[3] || "").trim();

      const toneMatch = sectionText.match(/^TONE:\s*(.+)/im);
      const tone = toneMatch ? toneMatch[1].trim() : "";

      const whyItWorksMatch = sectionText.match(/WHY IT WORKS:?\s*\n([\s\S]*?)(?:\n\n|Character count|Engagement|---|\n[A-Z]{3,}|$)/i);
      const whyItWorks: string[] = [];
      if (whyItWorksMatch) {
        const lines = whyItWorksMatch[1].split("\n");
        for (const line of lines) {
          const cleaned = line.trim().replace(/^[-*•]\s*/, "");
          if (cleaned.length > 5) whyItWorks.push(cleaned);
        }
      }

      const engagementMatch = sectionText.match(/Engagement\s*(?:potential|rating)?:\s*([^\n]*)/i);
      let engagementRating = 4;
      if (engagementMatch) {
        const stars = (engagementMatch[1].match(/\u2B50|star/gi) || []).length;
        if (stars > 0) engagementRating = Math.min(5, stars);
      }

      let captionText = sectionText;
      captionText = captionText.replace(/^TONE:\s*.+\n?/im, "");
      captionText = captionText.replace(/WHY IT WORKS:?[\s\S]*$/i, "");
      captionText = captionText.replace(/Character count:.*$/im, "");
      captionText = captionText.replace(/Engagement\s*(?:potential|rating)?:.*$/im, "");
      captionText = captionText.replace(/^---+\s*$/gm, "");
      captionText = captionText.trim();

      if (!captionText) continue;

      const hashtags = captionText.match(/#[a-zA-Z0-9_]+/g) || [];
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]/gu;
      const emojis = captionText.match(emojiRegex) || [];

      captions.push({
        id: generateId(),
        caption: captionText,
        angle,
        tone,
        charCount: captionText.length,
        hashtagCount: hashtags.length,
        emojiCount: emojis.length,
        engagementRating,
        whyItWorks,
        hashtags: [...new Set(hashtags)],
      });
    }
  }

  if (captions.length === 0) {
    const sections = raw.split(/\n---+\n/);
    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.length < 20) continue;
      if (/^FIRST COMMENT/i.test(trimmed) || /^POSTING/i.test(trimmed)) continue;

      let captionText = trimmed;
      captionText = captionText.replace(/WHY IT WORKS:?[\s\S]*$/i, "");
      captionText = captionText.replace(/Character count:.*$/im, "");
      captionText = captionText.replace(/Engagement\s*(?:potential|rating)?:.*$/im, "");
      captionText = captionText.trim();

      if (captionText.length < 20) continue;

      const hashtags = captionText.match(/#[a-zA-Z0-9_]+/g) || [];
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]/gu;
      const emojis = captionText.match(emojiRegex) || [];

      captions.push({
        id: generateId(),
        caption: captionText,
        angle: "",
        tone: "",
        charCount: captionText.length,
        hashtagCount: hashtags.length,
        emojiCount: emojis.length,
        engagementRating: 4,
        whyItWorks: [],
        hashtags: [...new Set(hashtags)],
      });
    }
  }

  return { captions, firstComments };
}
