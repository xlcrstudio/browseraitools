import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Heart, Search, Filter,
  TrendingUp, Users, Tag, Flame, Award, Zap
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useHashtagStorage,
  type GeneratedHashtag,
  type HashtagSet,
  type HashtagGenerationRecord,
  type HashtagVolume,
} from "@/hooks/use-hashtag-storage";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", count: "30 hashtags" },
  { id: "tiktok", label: "TikTok", count: "5-8 hashtags" },
  { id: "linkedin", label: "LinkedIn", count: "3-5 hashtags" },
  { id: "twitter", label: "Twitter/X", count: "1-2 hashtags" },
];

const NICHES = [
  "Fitness & Health", "Food & Cooking", "Travel & Adventure",
  "Fashion & Beauty", "Business & Entrepreneurship", "Technology & Gadgets",
  "Photography & Art", "Lifestyle & Wellness", "Parenting & Family",
  "Education & Learning", "Gaming & Esports", "Music & Entertainment",
  "Real Estate", "Finance & Investing", "Pets & Animals",
  "DIY & Crafts", "Automotive", "Sports", "Marketing & Advertising",
  "Sustainability & Environment", "Home & Interior Design",
  "Motivation & Self-Improvement", "Comedy & Humor", "Science & Nature",
  "Books & Literature", "Other",
];

const ACCOUNT_SIZES = [
  { value: "small", label: "Small", desc: "<10k followers" },
  { value: "medium", label: "Medium", desc: "10k-100k" },
  { value: "large", label: "Large", desc: "100k+" },
];

const GOALS = [
  "Maximize Reach", "Drive Engagement", "Build Community",
  "Grow Followers", "Generate Sales",
];

const VOLUME_CONFIG: Record<HashtagVolume, { label: string; icon: typeof Flame; color: string; bgColor: string }> = {
  high: { label: "High-Volume", icon: Flame, color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  medium: { label: "Medium-Volume", icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  low: { label: "Niche/Targeted", icon: Award, color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
  trending: { label: "Trending", icon: Zap, color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
  community: { label: "Community", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  branded: { label: "Branded", icon: Tag, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-200" },
};

const SYSTEM_PROMPT = `You are a social media growth expert specializing in hashtag strategy across Instagram, TikTok, LinkedIn, and Twitter.

Your expertise includes:
- Hashtag research and trend analysis
- Platform-specific hashtag strategies
- Reach vs. engagement optimization
- Niche and branded hashtag discovery
- Hashtag competition analysis

You create hashtag strategies that:
- Maximize reach and engagement
- Mix high-volume and niche hashtags
- Are relevant to content and audience
- Follow platform best practices
- Include trending and evergreen tags
- Avoid banned or spam hashtags
- Build community connection

You understand:
- Instagram algorithm (30 hashtag limit, mix of sizes)
- TikTok hashtag trends and FYP algorithm
- LinkedIn professional hashtag usage (3-5 max)
- Twitter hashtag etiquette (1-2 max)
- The balance between reach and relevance
- How to avoid shadowbans`;

export function HashtagGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveGeneration, toggleFavorite } = useHashtagStorage();

  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [accountSize, setAccountSize] = useState("small");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Maximize Reach"]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeTrending, setIncludeTrending] = useState(true);
  const [includeBranded, setIncludeBranded] = useState(true);
  const [numHashtags, setNumHashtags] = useState(30);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<HashtagGenerationRecord | null>(null);

  const [filterVolume, setFilterVolume] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const allPlatformIds = PLATFORMS.map(p => p.id);
  const allSelected = allPlatformIds.every(id => selectedPlatforms.includes(id));

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.length > 1 ? prev.filter(p => p !== platformId) : prev
        : [...prev, platformId]
    );
  };

  const toggleAllPlatforms = () => {
    if (allSelected) {
      setSelectedPlatforms(["instagram"]);
    } else {
      setSelectedPlatforms([...allPlatformIds]);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleGenerate = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const platformInstructions = selectedPlatforms.map(p => {
      switch (p) {
        case "instagram": return "INSTAGRAM (30 hashtags): 3-5 High-Volume (500k-5M posts), 8-12 Medium-Volume (50k-500k posts), 10-15 Niche/Low-Volume (1k-50k posts), 2-3 Community, 1-2 Branded";
        case "tiktok": return "TIKTOK (5-8 hashtags): 1-2 Trending, 2-3 Niche, 1-2 Broad discovery (#fyp), 1 Specific descriptive";
        case "linkedin": return "LINKEDIN (3-5 hashtags): 2-3 Industry-specific, 1-2 Skill/topic (professional only)";
        case "twitter": return "TWITTER (1-2 hashtags): Trending (if relevant), Community/campaign";
        default: return "";
      }
    }).join("\n\n");

    const userPrompt = `Generate optimized hashtags for social media growth.

CONTENT: ${content.trim()}
PLATFORMS: ${selectedPlatforms.join(", ")}
NICHE: ${niche}
ACCOUNT SIZE: ${accountSize} (${ACCOUNT_SIZES.find(s => s.value === accountSize)?.desc})
GOALS: ${selectedGoals.join(", ")}
TARGET HASHTAG COUNT: ${numHashtags} hashtags total (adjust per platform limits)
${includeTrending ? "Include trending hashtags." : "Skip trending hashtags."}
${includeBranded ? "Include branded hashtag suggestions." : "Skip branded hashtags."}

PLATFORM-SPECIFIC REQUIREMENTS:
${platformInstructions}

OUTPUT FORMAT (follow exactly):

For each platform, output a section like this:

PLATFORM: [platform name]

HIGH-VOLUME:
#hashtag (500k posts)
#hashtag (1.2M posts)

MEDIUM-VOLUME:
#hashtag (120k posts)
#hashtag (85k posts)

NICHE:
#hashtag (15k posts)
#hashtag (8k posts)

TRENDING:
#hashtag (trending)

COMMUNITY:
#hashtag (45k posts)

BRANDED:
#yourbrand

STRATEGY:
- [strategy note 1]
- [strategy note 2]

---

AVOID:
#bannedtag - Reason
#spamtag - Reason

Generate relevant, specific hashtags. No generic filler. Every hashtag must relate to the content described.`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.75,
        maxTokens: 1500,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseHashtagOutput(result, selectedPlatforms);
        const record: HashtagGenerationRecord = {
          id: generateId(),
          content: content.trim(),
          platforms: selectedPlatforms,
          niche,
          sets: parsed,
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

  const filteredHashtags = useMemo(() => {
    if (!currentRecord) return [];
    let allTags: (GeneratedHashtag & { platform: string; setId: string })[] = [];
    for (const set of currentRecord.sets) {
      for (const tag of set.hashtags) {
        allTags.push({ ...tag, platform: set.platform, setId: set.id });
      }
    }
    if (filterVolume !== "all") {
      allTags = allTags.filter(t => t.volume === filterVolume);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      allTags = allTags.filter(t => t.tag.toLowerCase().includes(q));
    }
    return allTags;
  }, [currentRecord, filterVolume, searchQuery]);

  const allTagsString = useMemo(() => {
    if (!currentRecord) return "";
    return currentRecord.sets
      .flatMap(s => s.hashtags.map(h => h.tag))
      .join(" ");
  }, [currentRecord]);

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {}
  };

  const exportCSV = () => {
    if (!currentRecord) return;
    const rows = [["Hashtag", "Volume", "Post Count", "Platform"]];
    for (const set of currentRecord.sets) {
      for (const tag of set.hashtags) {
        rows.push([tag.tag, tag.volume, tag.postCount, set.platform]);
      }
    }
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hashtags-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate = state === "ready" && content.trim().length > 0 && selectedPlatforms.length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-hashtag-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Content Description *
            </label>
            <textarea
              id="content"
              data-testid="input-content"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 300))}
              placeholder="Describe your post/content (e.g., 'Morning coffee photo at downtown cafe', 'Fitness motivation video', 'Marketing tips for small business')"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-char-count" className="text-xs text-slate-400">{content.length}/300</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Platform *
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-platforms">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  data-testid={`toggle-platform-${p.id}`}
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    selectedPlatforms.includes(p.id)
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <span>{p.label}</span>
                  <span className="text-xs ml-1 opacity-60">({p.count})</span>
                </button>
              ))}
              <button
                data-testid="toggle-platform-all"
                onClick={toggleAllPlatforms}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                  allSelected
                    ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                )}
              >
                All Platforms
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="niche" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Niche/Category *
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
                Account Size
              </label>
              <div className="flex gap-2" data-testid="container-account-size">
                {ACCOUNT_SIZES.map((s) => (
                  <button
                    key={s.value}
                    data-testid={`toggle-size-${s.value}`}
                    onClick={() => setAccountSize(s.value)}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                      accountSize === s.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-xs opacity-60">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Goals
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-goals">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  data-testid={`toggle-goal-${goal.toLowerCase().replace(/\s+/g, "-")}`}
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
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Number of hashtags</span>
                        <span className="text-sm font-bold text-purple-600" data-testid="text-num-hashtags">{numHashtags}</span>
                      </div>
                      <input
                        data-testid="input-num-hashtags"
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={numHashtags}
                        onChange={(e) => setNumHashtags(parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>5</span>
                        <span>30</span>
                      </div>
                    </div>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                      <span className="text-sm font-medium text-slate-700">Include trending hashtags</span>
                      <button
                        data-testid="toggle-include-trending"
                        onClick={() => setIncludeTrending(!includeTrending)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          includeTrending ? "bg-purple-500" : "bg-slate-300"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          includeTrending ? "left-5" : "left-1"
                        )} />
                      </button>
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                      <span className="text-sm font-medium text-slate-700">Include branded hashtag suggestions</span>
                      <button
                        data-testid="toggle-include-branded"
                        onClick={() => setIncludeBranded(!includeBranded)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          includeBranded ? "bg-purple-500" : "bg-slate-300"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          includeBranded ? "left-5" : "left-1"
                        )} />
                      </button>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
              canGenerate
                ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-300 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finding perfect hashtags...
              </>
            ) : (
              <>
                <Hash className="w-5 h-5" />
                Generate Hashtags
              </>
            )}
          </button>
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
            <span className="text-sm font-medium text-purple-600">Generating hashtags...</span>
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
          <SummaryBar record={currentRecord} />

          <CopyPasteSection
            allTags={allTagsString}
            copied={copiedAll}
            onCopy={() => copyToClipboard(allTagsString)}
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-lg font-bold text-slate-800" data-testid="text-category-heading">
                Hashtags by Category
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    data-testid="input-search-hashtags"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
                <button
                  data-testid="button-export-csv"
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { value: "all", label: "All" },
                { value: "high", label: "High-Volume" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Niche" },
                { value: "trending", label: "Trending" },
                { value: "community", label: "Community" },
                { value: "branded", label: "Branded" },
              ].map((f) => (
                <button
                  key={f.value}
                  data-testid={`filter-volume-${f.value}`}
                  onClick={() => setFilterVolume(f.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    filterVolume === f.value
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-slate-500 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {currentRecord.sets.map((set) => (
              <HashtagSetSection
                key={set.id}
                set={set}
                filteredHashtags={filteredHashtags.filter(h => h.setId === set.id)}
                recordId={currentRecord.id}
                favorites={currentRecord.favorites}
                onToggleFavorite={(tagId) => {
                  toggleFavorite(currentRecord.id, tagId);
                  setCurrentRecord(prev => {
                    if (!prev) return prev;
                    const isFav = prev.favorites.includes(tagId);
                    return {
                      ...prev,
                      favorites: isFav
                        ? prev.favorites.filter(id => id !== tagId)
                        : [...prev.favorites, tagId],
                    };
                  });
                }}
                onCopy={(text, id) => copyToClipboard(text, id)}
                copiedId={copiedId}
              />
            ))}
          </div>

          {currentRecord.sets.some(s => s.strategyNotes.length > 0) && (
            <StrategyNotes sets={currentRecord.sets} />
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

function SummaryBar({ record }: { record: HashtagGenerationRecord }) {
  const totalTags = record.sets.reduce((sum, s) => sum + s.hashtags.length, 0);
  const platforms = record.sets.map(s => s.platform).join(", ");
  const volumeCounts = record.sets.reduce((acc, s) => {
    for (const h of s.hashtags) {
      acc[h.volume] = (acc[h.volume] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="container-summary">
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
        <div className="text-2xl font-bold text-purple-600" data-testid="text-total-hashtags">{totalTags}</div>
        <div className="text-xs text-slate-500">Total Hashtags</div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
        <div className="text-2xl font-bold text-blue-600" data-testid="text-platforms-count">{record.sets.length}</div>
        <div className="text-xs text-slate-500">Platforms</div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
        <div className="text-2xl font-bold text-emerald-600" data-testid="text-niche-count">{volumeCounts.low || 0}</div>
        <div className="text-xs text-slate-500">Niche Tags</div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
        <div className="text-2xl font-bold text-amber-600" data-testid="text-trending-count">{volumeCounts.trending || 0}</div>
        <div className="text-xs text-slate-500">Trending Tags</div>
      </div>
    </div>
  );
}

function CopyPasteSection({ allTags, copied, onCopy }: { allTags: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-copy-paste">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Copy-Paste Ready Set</h3>
        <button
          data-testid="button-copy-all"
          onClick={onCopy}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
            copied
              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
              : "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
          )}
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-sm text-slate-700 leading-relaxed break-words" data-testid="text-all-hashtags">
          {allTags}
        </p>
      </div>
    </div>
  );
}

function HashtagSetSection({
  set,
  filteredHashtags,
  recordId,
  favorites,
  onToggleFavorite,
  onCopy,
  copiedId,
}: {
  set: HashtagSet;
  filteredHashtags: (GeneratedHashtag & { platform: string; setId: string })[];
  recordId: string;
  favorites: string[];
  onToggleFavorite: (tagId: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const [expanded, setExpanded] = useState(true);

  const groupedByVolume = useMemo(() => {
    const groups: Record<string, typeof filteredHashtags> = {};
    for (const tag of filteredHashtags) {
      if (!groups[tag.volume]) groups[tag.volume] = [];
      groups[tag.volume].push(tag);
    }
    return groups;
  }, [filteredHashtags]);

  const volumeOrder: HashtagVolume[] = ['high', 'medium', 'low', 'trending', 'community', 'branded'];

  if (filteredHashtags.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0" data-testid={`container-set-${set.platform}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left mb-3"
        data-testid={`button-toggle-set-${set.platform}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800 capitalize">{set.platform}</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredHashtags.length} hashtags
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expanded && "rotate-180")} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {volumeOrder.map((vol) => {
                const group = groupedByVolume[vol];
                if (!group || group.length === 0) return null;
                const config = VOLUME_CONFIG[vol];
                const Icon = config.icon;

                return (
                  <div key={vol} className={cn("rounded-xl border p-4", config.bgColor)} data-testid={`group-${set.platform}-${vol}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={cn("w-4 h-4", config.color)} />
                      <span className={cn("text-sm font-bold", config.color)}>{config.label}</span>
                      <span className="text-xs text-slate-400">({group.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.map((tag) => (
                        <div
                          key={tag.id}
                          data-testid={`hashtag-${tag.id}`}
                          className="group flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 border border-slate-200/60 shadow-sm"
                        >
                          <span className="text-sm font-medium text-slate-700">{tag.tag}</span>
                          {tag.postCount && (
                            <span className="text-xs text-slate-400">({tag.postCount})</span>
                          )}
                          <button
                            data-testid={`button-copy-${tag.id}`}
                            onClick={() => onCopy(tag.tag, tag.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                          >
                            {copiedId === tag.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-purple-500" />
                            )}
                          </button>
                          <button
                            data-testid={`button-fav-${tag.id}`}
                            onClick={() => onToggleFavorite(tag.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart
                              className={cn(
                                "w-3.5 h-3.5",
                                favorites.includes(tag.id)
                                  ? "text-red-500 fill-red-500"
                                  : "text-slate-400 hover:text-red-400"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StrategyNotes({ sets }: { sets: HashtagSet[] }) {
  const allNotes = sets.flatMap(s => s.strategyNotes).filter(Boolean);
  if (allNotes.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-strategy-notes">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Strategy Notes</h3>
      <ul className="space-y-2">
        {allNotes.map((note, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function parseHashtagOutput(raw: string, platforms: string[]): HashtagSet[] {
  const sets: HashtagSet[] = [];

  const platformSections = splitByPlatform(raw, platforms);

  for (const [platform, sectionText] of Object.entries(platformSections)) {
    const hashtags: GeneratedHashtag[] = [];
    const strategyNotes: string[] = [];

    const lines = sectionText.split("\n");
    let currentVolume: HashtagVolume = "medium";
    let inStrategy = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (/^(HIGH[- ]VOLUME|HIGH VOLUME)/i.test(trimmed)) {
        currentVolume = "high";
        inStrategy = false;
        continue;
      }
      if (/^(MEDIUM[- ]VOLUME|MEDIUM VOLUME|SWEET SPOT)/i.test(trimmed)) {
        currentVolume = "medium";
        inStrategy = false;
        continue;
      }
      if (/^(NICHE|LOW[- ]VOLUME|LOW VOLUME|TARGETED)/i.test(trimmed)) {
        currentVolume = "low";
        inStrategy = false;
        continue;
      }
      if (/^TRENDING/i.test(trimmed)) {
        currentVolume = "trending";
        inStrategy = false;
        continue;
      }
      if (/^COMMUNITY/i.test(trimmed)) {
        currentVolume = "community";
        inStrategy = false;
        continue;
      }
      if (/^BRANDED/i.test(trimmed)) {
        currentVolume = "branded";
        inStrategy = false;
        continue;
      }
      if (/^STRATEGY/i.test(trimmed) || /^NOTES/i.test(trimmed) || /^WHY THESE/i.test(trimmed)) {
        inStrategy = true;
        continue;
      }
      if (/^AVOID/i.test(trimmed) || /^---/i.test(trimmed) || /^ALTERNATIVE/i.test(trimmed) || /^PLATFORM:/i.test(trimmed)) {
        inStrategy = false;
        continue;
      }

      if (inStrategy) {
        const noteText = trimmed.replace(/^[-*]\s*/, "");
        if (noteText.length > 5) {
          strategyNotes.push(noteText);
        }
        continue;
      }

      const hashtagMatches = trimmed.match(/#[a-zA-Z0-9_]+/g);
      if (hashtagMatches) {
        for (const tag of hashtagMatches) {
          if (hashtags.some(h => h.tag.toLowerCase() === tag.toLowerCase())) continue;

          const postCountMatch = trimmed.match(/\(([^)]*(?:posts|trending|k|M|m)[^)]*)\)/i)
            || trimmed.match(/\((\d[\d,.]*[kKmM]?\+?\s*(?:posts)?)\)/i)
            || trimmed.match(/-\s*(\d[\d,.]*[kKmM]?\+?\s*(?:posts)?)/i);

          hashtags.push({
            id: generateId(),
            tag,
            volume: currentVolume,
            postCount: postCountMatch ? postCountMatch[1].trim() : "",
          });
        }
      }
    }

    if (hashtags.length === 0) {
      const allHashtags = raw.match(/#[a-zA-Z0-9_]+/g);
      if (allHashtags && sets.length === 0) {
        const unique = [...new Set(allHashtags.map(t => t.toLowerCase()))];
        const total = unique.length;
        unique.forEach((tag, i) => {
          let volume: HashtagVolume;
          if (i < total * 0.15) volume = "high";
          else if (i < total * 0.5) volume = "medium";
          else if (i < total * 0.8) volume = "low";
          else volume = "community";

          hashtags.push({
            id: generateId(),
            tag,
            volume,
            postCount: "",
          });
        });
      }
    }

    if (hashtags.length > 0) {
      const allTags = hashtags.map(h => h.tag).join(" ");
      sets.push({
        id: generateId(),
        platform,
        hashtags,
        allTags,
        strategyNotes: strategyNotes.slice(0, 5),
      });
    }
  }

  if (sets.length === 0) {
    const allHashtags = raw.match(/#[a-zA-Z0-9_]+/g);
    if (allHashtags) {
      const unique = [...new Set(allHashtags.map(t => t.toLowerCase()))];
      const hashtags: GeneratedHashtag[] = unique.map((tag, i) => {
        let volume: HashtagVolume;
        const total = unique.length;
        if (i < total * 0.15) volume = "high";
        else if (i < total * 0.5) volume = "medium";
        else if (i < total * 0.8) volume = "low";
        else volume = "community";

        return { id: generateId(), tag, volume, postCount: "" };
      });

      sets.push({
        id: generateId(),
        platform: platforms[0] || "instagram",
        hashtags,
        allTags: hashtags.map(h => h.tag).join(" "),
        strategyNotes: [],
      });
    }
  }

  return sets;
}

function splitByPlatform(raw: string, platforms: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  const platformPatterns = platforms.map(p => ({
    name: p,
    regex: new RegExp(`(?:^|\\n)\\s*(?:PLATFORM:\\s*)?${p}[:\\s]`, "im"),
  }));

  const indices: { name: string; idx: number }[] = [];
  for (const pp of platformPatterns) {
    const m = raw.match(pp.regex);
    if (m && m.index !== undefined) {
      indices.push({ name: pp.name, idx: m.index });
    }
  }

  if (indices.length === 0) {
    result[platforms[0] || "instagram"] = raw;
    return result;
  }

  indices.sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].idx;
    const end = i < indices.length - 1 ? indices[i + 1].idx : raw.length;
    result[indices[i].name] = raw.slice(start, end);
  }

  return result;
}
