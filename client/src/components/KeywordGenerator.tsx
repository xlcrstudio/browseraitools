import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  RefreshCw, Download, Copy, Heart, Search,
  Layers, Table2, ToggleLeft, ToggleRight, RotateCcw
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useKeywordStorage,
  type GeneratedKeyword,
} from "@/hooks/use-keyword-storage";

const INDUSTRIES = [
  "Marketing", "Technology", "Health & Wellness", "Food & Beverage",
  "Finance", "Travel", "Education", "E-commerce", "Real Estate",
  "SaaS", "Fashion & Beauty", "Fitness & Sports", "Entertainment",
  "General",
];

const CONTENT_TYPES = [
  "Blog Post", "Product Page", "Landing Page", "Video", "Local Business",
];

const INTENT_OPTIONS = [
  { value: "Informational", label: "Informational", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "Commercial", label: "Commercial", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "Transactional", label: "Transactional", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "Navigational", label: "Navigational", color: "bg-amber-100 text-amber-700 border-amber-200" },
];

const LENGTH_OPTIONS = ["Short-tail", "Medium-tail", "Long-tail", "Mix"];

const COMPETITION_OPTIONS = ["Low", "Medium", "High", "Any"];

const INTENT_COLORS: Record<string, string> = {
  informational: "bg-blue-100 text-blue-700 border-blue-200",
  commercial: "bg-purple-100 text-purple-700 border-purple-200",
  transactional: "bg-emerald-100 text-emerald-700 border-emerald-200",
  navigational: "bg-amber-100 text-amber-700 border-amber-200",
};

const SYSTEM_PROMPT = `You are an expert SEO strategist and keyword research specialist with 10+ years of experience ranking websites in competitive niches.

Your expertise includes:
- Keyword research and analysis
- Search intent classification
- Long-tail keyword discovery
- Semantic keyword relationships
- Competitive keyword analysis
- Content optimization strategies
- Keyword difficulty assessment

You generate keyword ideas that are:
- Relevant to the topic and industry
- Varied in length (short, medium, long-tail)
- Classified by search intent accurately
- Realistic for search volume and competition
- Include questions, comparisons, and variations
- Organized into logical clusters
- Include LSI and semantic keywords`;

export function KeywordGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveGeneration, toggleFavorite } = useKeywordStorage();

  const [seedKeyword, setSeedKeyword] = useState("");
  const [industry, setIndustry] = useState("General");
  const [contentType, setContentType] = useState("Blog Post");
  const [selectedIntents, setSelectedIntents] = useState<string[]>(["Informational", "Commercial"]);
  const [lengthPref, setLengthPref] = useState("Mix");

  const [numKeywords, setNumKeywords] = useState(50);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [geoTarget, setGeoTarget] = useState("");
  const [competitionPref, setCompetitionPref] = useState("Any");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<GeneratedKeyword[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("volume");
  const [viewMode, setViewMode] = useState<"table" | "cluster">("table");

  const currentRecord = history.find((r) => r.id === currentRecordId);
  const favorites = currentRecord?.favorites || [];

  const toggleIntent = (intent: string) => {
    setSelectedIntents((prev) =>
      prev.includes(intent) ? prev.filter((x) => x !== intent) : [...prev, intent]
    );
  };

  const buildPrompt = () => {
    return `Generate comprehensive keyword research for SEO content creation.

TOPIC DETAILS:
Seed Keyword: ${seedKeyword}
Industry: ${industry}
Content Type: ${contentType}
${geoTarget ? `Geographic Target: ${geoTarget}` : ""}

KEYWORD PREFERENCES:
Intent Types: ${selectedIntents.join(", ") || "All"}
Length Preference: ${lengthPref}
Include Questions: ${includeQuestions ? "Yes" : "No"}
Number of Keywords: ${numKeywords}
Competition Preference: ${competitionPref}

REQUIREMENTS:
Generate ${numKeywords} keyword ideas organized into 4-6 logical clusters.

For each keyword provide this EXACT format:
[keyword phrase] | Intent: [Informational/Commercial/Transactional/Navigational] | Vol: [number]/mo | Diff: [number]/100 | CPC: $[number]

SEARCH VOLUME GUIDELINES:
- Short-tail: 5,000-50,000+ per month
- Medium-tail: 1,000-10,000 per month
- Long-tail: 100-2,000 per month
- Be realistic with estimates for the industry

DIFFICULTY GUIDELINES:
- Low (0-33): Newer sites can rank
- Medium (34-66): Established sites needed
- High (67-100): Authority sites, very competitive

Group keywords into clusters:

CLUSTER 1: [Cluster Name]
1. [keyword] | Intent: [intent] | Vol: [volume]/mo | Diff: [difficulty]/100 | CPC: $[amount]
2. [keyword] | Intent: [intent] | Vol: [volume]/mo | Diff: [difficulty]/100 | CPC: $[amount]
...

CLUSTER 2: [Cluster Name]
1. [keyword] | Intent: [intent] | Vol: [volume]/mo | Diff: [difficulty]/100 | CPC: $[amount]
...

Include a mix of:
- Primary keywords (most relevant to seed)
- Long-tail variations (5+ words, lower competition)
${includeQuestions ? "- Question keywords (how, what, why, when, can, does)" : ""}
- Commercial keywords (best, top, review, vs, alternative)
- Related/LSI keywords (semantically connected terms)

Make keywords diverse, realistic, and SEO-valuable. No extra text outside the cluster format.`;
  };

  const parseKeywordLine = (line: string, clusterName: string): GeneratedKeyword | null => {
    const cleaned = line.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*]\s*/, "").trim();
    if (!cleaned || cleaned.length < 3) return null;

    const parts = cleaned.split("|").map((p) => p.trim());
    if (parts.length < 2) return null;

    const keyword = parts[0].replace(/^\[|\]$/g, "").replace(/^\*+|\*+$/g, "").trim();
    if (!keyword || keyword.length < 2 || keyword.length > 80) return null;
    if (/^(cluster|include|generate|make|primary|long-tail|commercial|related)/i.test(keyword)) return null;

    let intent: GeneratedKeyword["intent"] = "Informational";
    let volume = "1,000/mo";
    let difficulty = 50;
    let difficultyLabel: GeneratedKeyword["difficultyLabel"] = "Medium";
    let cpcEstimate = "$1.00";

    for (const part of parts.slice(1)) {
      if (/intent/i.test(part)) {
        const val = part.replace(/^intent:\s*/i, "").trim().toLowerCase();
        if (val.includes("commercial")) intent = "Commercial";
        else if (val.includes("transactional")) intent = "Transactional";
        else if (val.includes("navigational")) intent = "Navigational";
        else intent = "Informational";
      } else if (/vol/i.test(part)) {
        const raw = part.replace(/^(vol|volume|est\.?\s*volume):\s*/i, "").trim();
        const kMatch = raw.match(/([\d.]+)\s*k/i);
        if (kMatch) {
          volume = `${Math.round(parseFloat(kMatch[1]) * 1000).toLocaleString()}/mo`;
        } else {
          volume = raw;
        }
      } else if (/diff/i.test(part)) {
        const dMatch = part.match(/(\d+)/);
        if (dMatch) difficulty = Math.min(100, Math.max(0, parseInt(dMatch[1])));
      } else if (/cpc|\$/i.test(part)) {
        cpcEstimate = part.replace(/^(cpc|cpc\s*est\.?):\s*/i, "").trim();
        if (!cpcEstimate.startsWith("$")) cpcEstimate = "$" + cpcEstimate;
      }
    }

    if (difficulty <= 33) difficultyLabel = "Low";
    else if (difficulty <= 66) difficultyLabel = "Medium";
    else difficultyLabel = "High";

    return {
      id: generateId(),
      keyword,
      intent,
      volume,
      difficulty,
      difficultyLabel,
      cpcEstimate,
      cluster: clusterName || "General",
    };
  };

  const parseKeywords = (text: string): GeneratedKeyword[] => {
    const keywords: GeneratedKeyword[] = [];

    const clusterBlocks = text.split(/(?:^|\n)\s*(?:\*{0,2})CLUSTER\s+\d+\s*:\s*/i).filter((b) => b.trim());

    if (clusterBlocks.length > 1 || (clusterBlocks.length === 1 && /cluster\s+\d+/i.test(text))) {
      for (const block of clusterBlocks) {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;

        const clusterName = lines[0].replace(/^\*+|\*+$/g, "").replace(/\[|\]/g, "").replace(/\s*\(.*?\)\s*$/, "").trim();

        const isClusterHeader = !lines[0].includes("|");
        const keywordLines = isClusterHeader ? lines.slice(1) : lines;

        for (const line of keywordLines) {
          const kw = parseKeywordLine(line, clusterName);
          if (kw) keywords.push(kw);
        }
      }
    }

    if (keywords.length === 0) {
      const allLines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      let currentCluster = "General";

      for (const line of allLines) {
        const clusterMatch = line.match(/^(?:\*{0,2})(?:cluster|group|topic)\s*\d*\s*:\s*(.+)/i);
        if (clusterMatch) {
          currentCluster = clusterMatch[1].replace(/^\*+|\*+$/g, "").replace(/\[|\]/g, "").trim();
          continue;
        }

        if (line.includes("|")) {
          const kw = parseKeywordLine(line, currentCluster);
          if (kw) keywords.push(kw);
        }
      }
    }

    if (keywords.length === 0) {
      const allLines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of allLines) {
        const match = line.match(/^\d+[\.\)]\s*\**(.+?)\**\s*[-:|]\s*(.*)/);
        if (match) {
          const kw = match[1].trim();
          if (kw.length >= 2 && kw.length <= 80 && !/^(cluster|include|generate)/i.test(kw)) {
            keywords.push({
              id: generateId(),
              keyword: kw,
              intent: "Informational",
              volume: "1,000/mo",
              difficulty: 50,
              difficultyLabel: "Medium",
              cpcEstimate: "$1.00",
              cluster: "General",
            });
          }
        }
      }
    }

    return keywords;
  };

  const handleGenerate = async () => {
    if (!seedKeyword.trim()) return;

    setStreamedContent("");
    setIsDone(false);
    setGeneratedKeywords([]);
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("volume");

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.7,
      maxTokens: 3000,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      setIsDone(true);
      const parsed = parseKeywords(finalContent);
      setGeneratedKeywords(parsed);

      const recordId = generateId();
      setCurrentRecordId(recordId);
      saveGeneration({
        id: recordId,
        seedKeyword,
        industry,
        keywords: parsed,
        favorites: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleToggleFavorite = (kwId: string) => {
    if (currentRecordId) toggleFavorite(currentRecordId, kwId);
  };

  const handleExportCSV = () => {
    const dataToExport = filteredAndSorted.length ? filteredAndSorted : generatedKeywords;
    if (!dataToExport.length) return;
    const header = "Keyword,Intent,Est. Volume,Difficulty,Difficulty Label,CPC Estimate,Cluster\n";
    const rows = dataToExport.map((kw) =>
      `"${kw.keyword}","${kw.intent}","${kw.volume}","${kw.difficulty}/100","${kw.difficultyLabel}","${kw.cpcEstimate}","${kw.cluster}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keywords-${seedKeyword.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...generatedKeywords];

    if (activeFilter === "favorites") {
      result = result.filter((kw) => favorites.includes(kw.id));
    } else if (activeFilter !== "all") {
      result = result.filter((kw) => kw.intent.toLowerCase() === activeFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((kw) => kw.keyword.toLowerCase().includes(q) || kw.cluster.toLowerCase().includes(q));
    }

    if (sortBy === "volume") {
      result.sort((a, b) => {
        const extractNum = (s: string) => { const m = s.replace(/,/g, "").match(/\d+/); return m ? parseInt(m[0]) : 0; };
        return extractNum(b.volume) - extractNum(a.volume);
      });
    } else if (sortBy === "difficulty") {
      result.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortBy === "cpc") {
      result.sort((a, b) => {
        const extractNum = (s: string) => { const m = s.replace(/[^0-9.]/g, "").match(/[\d.]+/); return m ? parseFloat(m[0]) : 0; };
        return extractNum(b.cpcEstimate) - extractNum(a.cpcEstimate);
      });
    }

    return result;
  }, [generatedKeywords, activeFilter, searchQuery, sortBy, favorites]);

  const clusters = useMemo(() => {
    const map = new Map<string, GeneratedKeyword[]>();
    for (const kw of filteredAndSorted) {
      const existing = map.get(kw.cluster) || [];
      existing.push(kw);
      map.set(kw.cluster, existing);
    }
    return Array.from(map.entries());
  }, [filteredAndSorted]);

  const streamedKeywordCount = streamedContent
    .split("\n")
    .filter((l) => l.includes("|") && /intent/i.test(l))
    .length;

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: generatedKeywords.length, favorites: favorites.length };
    for (const kw of generatedKeywords) {
      const key = kw.intent.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [generatedKeywords, favorites]);

  const stats = useMemo(() => {
    const low = generatedKeywords.filter((kw) => kw.difficulty <= 33).length;
    const questions = generatedKeywords.filter((kw) => /^(how|what|why|when|where|who|can|does|is|are|do|should|which|will)\s/i.test(kw.keyword)).length;
    const clusterCount = new Set(generatedKeywords.map((kw) => kw.cluster)).size;
    return { total: generatedKeywords.length, clusters: clusterCount, lowDiff: low, questions };
  }, [generatedKeywords]);

  const difficultyColor = (d: number) => {
    if (d <= 33) return "text-emerald-600";
    if (d <= 66) return "text-amber-600";
    return "text-red-600";
  };

  const difficultyBg = (d: number) => {
    if (d <= 33) return "bg-emerald-500";
    if (d <= 66) return "bg-amber-500";
    return "bg-red-500";
  };

  const isDisabled = state !== "ready" && state !== "error";
  const isGenerating = state === "generating";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          {(state === "checking-gpu" || state === "downloading") && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4" data-testid="status-loading">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-semibold text-purple-800 text-sm">
                  {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI Engine..."}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-xs text-purple-600 mt-1">{progress.text}</p>
            </div>
          )}

          {state === "error" && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3" data-testid="status-error">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-800 text-sm">AI Engine Error</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Seed Keyword / Topic *</label>
            <textarea
              data-testid="input-seed-keyword"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g., email marketing, yoga for beginners, best coffee makers"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Industry / Niche</label>
              <select
                data-testid="select-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm bg-white"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Content Type</label>
              <select
                data-testid="select-content-type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm bg-white"
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Keyword Intent</label>
            <div className="flex flex-wrap gap-2">
              {INTENT_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  data-testid={`toggle-intent-${value.toLowerCase()}`}
                  onClick={() => toggleIntent(value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    selectedIntents.includes(value) ? color : "bg-slate-50 text-slate-400 border-slate-200"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Keyword Length</label>
            <div className="flex flex-wrap gap-2">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  data-testid={`toggle-length-${opt.toLowerCase()}`}
                  onClick={() => setLengthPref(opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    lengthPref === opt
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            data-testid="button-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Number of Keywords: {numKeywords}
                    </label>
                    <input
                      data-testid="input-num-keywords"
                      type="range"
                      min={25}
                      max={100}
                      step={5}
                      value={numKeywords}
                      onChange={(e) => setNumKeywords(parseInt(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>25</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Include Question Keywords</label>
                    <button
                      data-testid="toggle-include-questions"
                      onClick={() => setIncludeQuestions(!includeQuestions)}
                      className="text-purple-600"
                    >
                      {includeQuestions ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Geographic Target</label>
                    <input
                      data-testid="input-geo-target"
                      type="text"
                      value={geoTarget}
                      onChange={(e) => setGeoTarget(e.target.value)}
                      placeholder="e.g., United States, UK, Australia"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Competition Preference</label>
                    <div className="flex flex-wrap gap-2">
                      {COMPETITION_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          data-testid={`toggle-competition-${opt.toLowerCase()}`}
                          onClick={() => setCompetitionPref(opt)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                            competitionPref === opt
                              ? "bg-purple-100 border-purple-300 text-purple-700"
                              : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={isDisabled || isGenerating || !seedKeyword.trim()}
              className={cn(
                "flex-1 sm:flex-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
                isDisabled || isGenerating || !seedKeyword.trim()
                  ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                  : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Researching Keywords...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Generate Keywords
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={() => {
                setSeedKeyword("");
                setIndustry("General");
                setContentType("Blog Post");
                setSelectedIntents(["Informational", "Commercial"]);
                setLengthPref("Mix");
                setNumKeywords(50);
                setIncludeQuestions(true);
                setGeoTarget("");
                setCompetitionPref("Any");
                setShowAdvanced(false);
                setStreamedContent("");
                setIsDone(false);
                setGeneratedKeywords([]);
                setCurrentRecordId(null);
                setActiveFilter("all");
              }}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {isGenerating && streamedContent && (
          <div className="border-t border-slate-100 p-6" data-testid="container-streaming">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-slate-700">
                Discovering keywords... ({streamedKeywordCount} found)
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                {streamedContent.slice(-1500)}
              </pre>
            </div>
          </div>
        )}

        {isDone && generatedKeywords.length > 0 && (
          <div className="border-t border-slate-100">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-sm">
                  {generatedKeywords.length} keywords discovered across {stats.clusters} clusters
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
                  <p className="text-xs text-purple-600 font-medium">Total Keywords</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{stats.clusters}</p>
                  <p className="text-xs text-blue-600 font-medium">Clusters</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{stats.lowDiff}</p>
                  <p className="text-xs text-emerald-600 font-medium">Low Difficulty</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{stats.questions}</p>
                  <p className="text-xs text-amber-600 font-medium">Questions</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "informational", label: "Info" },
                    { key: "commercial", label: "Commercial" },
                    { key: "transactional", label: "Transactional" },
                    { key: "navigational", label: "Nav" },
                    { key: "favorites", label: "Saved" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      data-testid={`filter-${key}`}
                      onClick={() => setActiveFilter(key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        activeFilter === key
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {label} {filterCounts[key] !== undefined ? `(${filterCounts[key]})` : ""}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    data-testid="button-view-table"
                    onClick={() => setViewMode("table")}
                    className={cn(
                      "p-2 rounded-lg border transition-all",
                      viewMode === "table" ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-slate-50 text-slate-400 border-slate-200"
                    )}
                    title="Table View"
                  >
                    <Table2 className="w-4 h-4" />
                  </button>
                  <button
                    data-testid="button-view-cluster"
                    onClick={() => setViewMode("cluster")}
                    className={cn(
                      "p-2 rounded-lg border transition-all",
                      viewMode === "cluster" ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-slate-50 text-slate-400 border-slate-200"
                    )}
                    title="Cluster View"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    data-testid="input-search-keywords"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                  />
                </div>
                <select
                  data-testid="select-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                >
                  <option value="volume">Sort by Volume</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="cpc">Sort by CPC</option>
                </select>
              </div>

              {viewMode === "table" ? (
                <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
                  <table className="w-full text-sm" data-testid="table-keywords">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-bold text-slate-700">Keyword</th>
                        <th className="text-left py-3 px-2 font-bold text-slate-700">Intent</th>
                        <th className="text-right py-3 px-2 font-bold text-slate-700">Volume</th>
                        <th className="text-right py-3 px-2 font-bold text-slate-700">Difficulty</th>
                        <th className="text-right py-3 px-2 font-bold text-slate-700">CPC</th>
                        <th className="text-right py-3 px-2 font-bold text-slate-700 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted.map((kw) => (
                        <tr
                          key={kw.id}
                          data-testid={`row-keyword-${kw.id}`}
                          className={cn(
                            "border-b border-slate-50 hover:bg-slate-50/50 transition-colors",
                            favorites.includes(kw.id) && "bg-purple-50/30"
                          )}
                        >
                          <td className="py-2.5 px-2">
                            <span className="font-medium text-slate-800">{kw.keyword}</span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-bold border",
                              INTENT_COLORS[kw.intent.toLowerCase()] || "bg-slate-100 text-slate-600"
                            )}>
                              {kw.intent.slice(0, 4)}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-600 font-medium">{kw.volume}</td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", difficultyBg(kw.difficulty))} style={{ width: `${kw.difficulty}%` }} />
                              </div>
                              <span className={cn("font-bold text-xs", difficultyColor(kw.difficulty))}>{kw.difficulty}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-600 font-medium">{kw.cpcEstimate}</td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                data-testid={`button-copy-${kw.id}`}
                                onClick={() => navigator.clipboard.writeText(kw.keyword)}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Copy keyword"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                data-testid={`button-favorite-${kw.id}`}
                                onClick={() => handleToggleFavorite(kw.id)}
                                className={cn(
                                  "p-1 rounded hover:bg-pink-50 transition-colors",
                                  favorites.includes(kw.id) ? "text-pink-500" : "text-slate-400 hover:text-pink-400"
                                )}
                                title="Save keyword"
                              >
                                <Heart className={cn("w-3.5 h-3.5", favorites.includes(kw.id) && "fill-current")} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4" data-testid="container-clusters">
                  {clusters.map(([clusterName, clusterKeywords]) => (
                    <ClusterSection
                      key={clusterName}
                      name={clusterName}
                      keywords={clusterKeywords}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  data-testid="button-export-csv"
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}

        {isDone && generatedKeywords.length === 0 && (
          <div className="border-t border-slate-100 p-6 text-center" data-testid="status-no-results">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No keywords could be parsed. Try a different seed keyword or adjust your settings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClusterSection({
  name,
  keywords,
  favorites,
  onToggleFavorite,
}: {
  name: string;
  keywords: GeneratedKeyword[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const previewCount = 5;
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? keywords : keywords.slice(0, previewCount);

  const difficultyColor = (d: number) => {
    if (d <= 33) return "text-emerald-600";
    if (d <= 66) return "text-amber-600";
    return "text-red-600";
  };

  const difficultyBg = (d: number) => {
    if (d <= 33) return "bg-emerald-500";
    if (d <= 66) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden" data-testid={`cluster-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        data-testid={`button-cluster-toggle-${name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          <span className="font-bold text-slate-800 text-sm">{name}</span>
          <span className="text-xs text-slate-400 font-medium">({keywords.length} keywords)</span>
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
            <div className="divide-y divide-slate-50">
              {displayed.map((kw) => (
                <div
                  key={kw.id}
                  data-testid={`cluster-row-keyword-${kw.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm",
                    favorites.includes(kw.id) && "bg-purple-50/30"
                  )}
                >
                  <span className="flex-1 font-medium text-slate-700 min-w-0 truncate" data-testid={`text-cluster-keyword-${kw.id}`}>{kw.keyword}</span>
                  <span className={cn(
                    "shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border",
                    INTENT_COLORS[kw.intent.toLowerCase()] || "bg-slate-100 text-slate-600"
                  )}>
                    {kw.intent.slice(0, 4)}
                  </span>
                  <span className="shrink-0 text-xs text-slate-500 font-medium w-20 text-right">{kw.volume}</span>
                  <div className="shrink-0 flex items-center gap-1 w-14 justify-end">
                    <div className="w-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", difficultyBg(kw.difficulty))} style={{ width: `${kw.difficulty}%` }} />
                    </div>
                    <span className={cn("font-bold text-[10px]", difficultyColor(kw.difficulty))}>{kw.difficulty}</span>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500 w-12 text-right">{kw.cpcEstimate}</span>
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      data-testid={`button-cluster-copy-${kw.id}`}
                      onClick={() => navigator.clipboard.writeText(kw.keyword)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      data-testid={`button-cluster-favorite-${kw.id}`}
                      onClick={() => onToggleFavorite(kw.id)}
                      className={cn(
                        "p-1 rounded hover:bg-pink-50 transition-colors",
                        favorites.includes(kw.id) ? "text-pink-500" : "text-slate-400 hover:text-pink-400"
                      )}
                    >
                      <Heart className={cn("w-3 h-3", favorites.includes(kw.id) && "fill-current")} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {keywords.length > previewCount && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-2 text-xs text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
                data-testid={`button-show-all-${name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                Show {keywords.length - previewCount} more keywords
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
