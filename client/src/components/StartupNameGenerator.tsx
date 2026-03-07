import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Heart, Search, Filter, Lightbulb
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useStartupNameStorage,
  estimateDomainAvailability,
  estimateSyllables,
  type GeneratedName,
} from "@/hooks/use-startup-name-storage";

const INDUSTRIES = [
  "Technology/Software",
  "E-commerce/Retail",
  "Health & Wellness",
  "Education/EdTech",
  "Finance/FinTech",
  "Food & Beverage",
  "Marketing/Advertising",
  "AI/Machine Learning",
  "Consumer Apps",
  "B2B SaaS",
  "Sustainability/GreenTech",
  "Entertainment/Media",
  "Fashion/Beauty",
  "Travel/Hospitality",
  "Real Estate/PropTech",
  "Other",
];

const NAMING_STYLES = [
  { id: "compound", label: "Compound Words", example: "Dropbox, YouTube" },
  { id: "invented", label: "Invented", example: "Spotify, Kodak" },
  { id: "descriptive", label: "Descriptive", example: "Shopify, Salesforce" },
  { id: "portmanteau", label: "Portmanteau", example: "Instagram, Pinterest" },
  { id: "single-word", label: "Single Word", example: "Stripe, Uber" },
  { id: "metaphorical", label: "Metaphorical", example: "Amazon, Apple" },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Short", desc: "4-6 letters" },
  { value: "medium", label: "Medium", desc: "7-10 letters" },
  { value: "longer", label: "Longer", desc: "11+ letters" },
  { value: "any", label: "Any length", desc: "Mix of all" },
];

const VIBES = ["Modern", "Professional", "Playful", "Innovative", "Bold", "Friendly", "Minimalist"];

const CATEGORY_COLORS: Record<string, string> = {
  compound: "bg-blue-100 text-blue-700 border-blue-200",
  invented: "bg-purple-100 text-purple-700 border-purple-200",
  descriptive: "bg-emerald-100 text-emerald-700 border-emerald-200",
  portmanteau: "bg-amber-100 text-amber-700 border-amber-200",
  "single-word": "bg-rose-100 text-rose-700 border-rose-200",
  metaphorical: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const DOMAIN_CONFIG: Record<string, { label: string; color: string }> = {
  "likely-available": { label: ".com Likely Available", color: "text-emerald-600" },
  "possibly-available": { label: ".com Possibly Available", color: "text-amber-600" },
  "likely-taken": { label: ".com Likely Taken", color: "text-slate-400" },
};

const SYSTEM_PROMPT = `You are a world-class brand strategist and naming expert who has named 100+ successful startups, including several unicorns.

Your expertise includes:
- Creating brandable, memorable startup names
- Understanding naming psychology and memorability
- Domain availability strategy
- International pronunciation and cultural sensitivity
- Industry-specific naming trends
- Naming for fundability and investor appeal

You create names that are:
- Unique and brandable (not generic)
- Memorable and pronounceable
- Appropriate for the industry
- Scalable (work as company grows)
- Domain-friendly (likely to have .com available)
- Culturally sensitive globally
- Free of negative connotations`;

export function StartupNameGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveGeneration, toggleFavorite } = useStartupNameStorage();

  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [keywordsInclude, setKeywordsInclude] = useState("");
  const [keywordsAvoid, setKeywordsAvoid] = useState("");

  const [selectedStyles, setSelectedStyles] = useState<string[]>(["compound", "invented", "descriptive"]);
  const [lengthPref, setLengthPref] = useState("medium");
  const [selectedVibes, setSelectedVibes] = useState<string[]>(["Modern", "Professional"]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const currentRecord = history.find((r) => r.id === currentRecordId);
  const favorites = currentRecord?.favorites || [];

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleVibe = (v: string) => {
    setSelectedVibes((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (prev.length >= 2) return [prev[1], v];
      return [...prev, v];
    });
  };

  const buildPrompt = () => {
    const styleNames = selectedStyles.map((s) => NAMING_STYLES.find((ns) => ns.id === s)?.label || s).join(", ");
    const lengthGuide: Record<string, string> = {
      short: "Keep names short: 4-6 letters, 1-2 syllables.",
      medium: "Aim for medium length: 7-10 letters, 2-3 syllables.",
      longer: "Names can be longer: 11+ letters, 3-4 syllables.",
      any: "Generate a mix of short, medium, and longer names.",
    };

    return `Generate 30 creative, brandable startup names.

STARTUP DETAILS:
What it does: ${description}
Industry: ${industry}
${keywordsInclude ? `Keywords to include/inspire: ${keywordsInclude}` : ""}
${keywordsAvoid ? `Keywords to avoid: ${keywordsAvoid}` : ""}

NAMING PREFERENCES:
Styles: ${styleNames}
${lengthGuide[lengthPref]}
Tone/Vibe: ${selectedVibes.join(", ")}

NAME QUALITY CRITERIA:
- Brandable (unique, ownable, memorable)
- Pronounceable (say it out loud)
- Spellable (hear it once, can you spell it?)
- Domain-friendly (invented/unique words more likely to have .com available)
- Positive connotations only
- Scalable (works if company pivots/grows)
- Professional enough for investors

OUTPUT FORMAT (follow EXACTLY):
For each name, output exactly this format:

1. [Name]
Category: [Compound/Invented/Descriptive/Portmanteau/Single-Word/Metaphorical]
Meaning: [One sentence explaining what it means or represents]
Why: [strength 1] | [strength 2] | [strength 3]

Example:
1. Lumivox
Category: Invented
Meaning: Combines "lumi" (light/clarity) with "vox" (voice), suggesting clear communication
Why: Unique and brandable | Easy to pronounce globally | Strong .com availability

Generate 30 names following this EXACT format. Be creative, think like a brand strategist. No extra text before or after.`;
  };

  const parseNames = (text: string): GeneratedName[] => {
    const names: GeneratedName[] = [];
    const blocks = text.split(/\n\d+\.\s+/).filter((b) => b.trim());

    for (const block of blocks) {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;

      const name = lines[0].replace(/^\*+|\*+$/g, "").trim();
      if (!name || name.length < 2 || name.length > 30) continue;

      let category: GeneratedName["category"] = "invented";
      let meaning = "";
      let whyItWorks: string[] = [];

      for (const line of lines.slice(1)) {
        if (line.toLowerCase().startsWith("category:")) {
          const cat = line.replace(/^category:\s*/i, "").trim().toLowerCase();
          if (cat.includes("compound")) category = "compound";
          else if (cat.includes("invented") || cat.includes("made")) category = "invented";
          else if (cat.includes("descriptive")) category = "descriptive";
          else if (cat.includes("portmanteau") || cat.includes("blend")) category = "portmanteau";
          else if (cat.includes("single")) category = "single-word";
          else if (cat.includes("metaphor")) category = "metaphorical";
        } else if (line.toLowerCase().startsWith("meaning:")) {
          meaning = line.replace(/^meaning:\s*/i, "").trim();
        } else if (line.toLowerCase().startsWith("why:")) {
          whyItWorks = line
            .replace(/^why:\s*/i, "")
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      names.push({
        id: generateId(),
        name,
        category,
        meaning: meaning || "A creative name for your startup",
        whyItWorks: whyItWorks.length ? whyItWorks : ["Brandable and memorable", "Easy to pronounce"],
        letterCount: name.length,
        syllableCount: estimateSyllables(name),
        domainLikelihood: estimateDomainAvailability(name),
      });
    }

    if (names.length === 0) {
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const match = line.match(/^\d+[\.\)]\s*\**([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)?)\**\s*[-:]?\s*(.*)?/);
        if (match) {
          const fallbackName = match[1].trim();
          if (fallbackName.length >= 3 && fallbackName.length <= 25) {
            names.push({
              id: generateId(),
              name: fallbackName,
              category: "invented",
              meaning: match[2]?.trim() || "A creative name for your startup",
              whyItWorks: ["Brandable and memorable", "Easy to pronounce"],
              letterCount: fallbackName.length,
              syllableCount: estimateSyllables(fallbackName),
              domainLikelihood: estimateDomainAvailability(fallbackName),
            });
          }
        }
      }
    }

    return names;
  };

  const handleGenerate = async () => {
    if (!description.trim() || !industry) return;

    setStreamedContent("");
    setIsDone(false);
    setGeneratedNames([]);
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("default");

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.9,
      maxTokens: 2000,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      setIsDone(true);
      const parsed = parseNames(finalContent);
      setGeneratedNames(parsed);

      const recordId = generateId();
      setCurrentRecordId(recordId);
      saveGeneration({
        id: recordId,
        description,
        industry,
        names: parsed,
        favorites: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleToggleFavorite = (nameId: string) => {
    if (currentRecordId) {
      toggleFavorite(currentRecordId, nameId);
    }
  };

  const handleExportFavorites = () => {
    const favNames = generatedNames.filter((n) => favorites.includes(n.id));
    if (!favNames.length) return;
    const text = favNames
      .map((n, i) => `${i + 1}. ${n.name}\n   Category: ${n.category}\n   Meaning: ${n.meaning}\n   Domain: ${DOMAIN_CONFIG[n.domainLikelihood].label}\n`)
      .join("\n");
    const blob = new Blob([`Startup Name Favorites\nIndustry: ${industry}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "startup-name-favorites.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...generatedNames];

    if (activeFilter === "favorites") {
      result = result.filter((n) => favorites.includes(n.id));
    } else if (activeFilter !== "all") {
      result = result.filter((n) => n.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.name.toLowerCase().includes(q) || n.meaning.toLowerCase().includes(q)
      );
    }

    if (sortBy === "alpha") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "shortest") result.sort((a, b) => a.letterCount - b.letterCount);
    else if (sortBy === "domain") {
      const order = { "likely-available": 0, "possibly-available": 1, "likely-taken": 2 };
      result.sort((a, b) => order[a.domainLikelihood] - order[b.domainLikelihood]);
    }

    return result;
  }, [generatedNames, activeFilter, searchQuery, sortBy, favorites]);

  const streamedNames = streamedContent
    .split(/\n\d+\.\s+/)
    .filter((b) => b.trim())
    .map((b) => b.split("\n")[0].replace(/^\*+|\*+$/g, "").trim())
    .filter((n) => n.length >= 2 && n.length <= 30);

  const categoryFilterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: generatedNames.length, favorites: favorites.length };
    for (const n of generatedNames) {
      counts[n.category] = (counts[n.category] || 0) + 1;
    }
    return counts;
  }, [generatedNames, favorites]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">What does your startup do? *</label>
            <div className="relative">
              <textarea
                data-testid="input-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your startup in 1-2 sentences. What problem do you solve? Who are your customers?"
                maxLength={500}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">{description.length}/500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Industry *</label>
              <div className="relative">
                <select
                  data-testid="select-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Keywords to Include (Optional)</label>
              <input
                data-testid="input-keywords-include"
                type="text"
                value={keywordsInclude}
                onChange={(e) => setKeywordsInclude(e.target.value)}
                placeholder="e.g., fast, smart, cloud, connect"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Keywords to Avoid (Optional)</label>
            <input
              data-testid="input-keywords-avoid"
              type="text"
              value={keywordsAvoid}
              onChange={(e) => setKeywordsAvoid(e.target.value)}
              placeholder="e.g., lite, pro, app, tech"
              maxLength={100}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          data-testid="button-toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mt-6 mb-4 transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
          {showAdvanced ? "Hide" : "Show"} Advanced Options
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
              <div className="space-y-6 pt-2 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Naming Styles</label>
                  <div className="flex flex-wrap gap-2">
                    {NAMING_STYLES.map((style) => (
                      <button
                        key={style.id}
                        data-testid={`button-style-${style.id}`}
                        onClick={() => toggleStyle(style.id)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm font-medium border transition-all text-left",
                          selectedStyles.includes(style.id)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <span className="block">{style.label}</span>
                        <span className="block text-[10px] opacity-60">{style.example}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Name Length</label>
                  <div className="flex flex-wrap gap-2">
                    {LENGTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        data-testid={`button-length-${opt.value}`}
                        onClick={() => setLengthPref(opt.value)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                          lengthPref === opt.value
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {opt.label} <span className="text-[10px] opacity-60">({opt.desc})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Tone / Vibe (pick up to 2)</label>
                  <div className="flex flex-wrap gap-2">
                    {VIBES.map((v) => (
                      <button
                        key={v}
                        data-testid={`button-vibe-${v.toLowerCase()}`}
                        onClick={() => toggleVibe(v)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          selectedVibes.includes(v)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex-1 w-full text-sm font-medium">
            {state === "checking-gpu" && (
              <span className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying hardware...
              </span>
            )}
            {state === "downloading" && (
              <div className="space-y-1.5 w-full max-w-xs">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading AI Engine (First time only)
                  </span>
                  <span className="text-purple-700 font-bold">{progress.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}
            {state === "error" && (
              <span className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
            {state === "ready" && !error && (
              <span className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI ready to generate
              </span>
            )}
          </div>

          <button
            data-testid="button-generate-names"
            onClick={handleGenerate}
            disabled={!description.trim() || state === "generating" || state === "downloading" || state === "checking-gpu"}
            className={cn(
              "w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
              !description.trim() || ["generating", "downloading", "checking-gpu"].includes(state)
                ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
            )}
          >
            {state === "generating" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating Names...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" /> Generate Startup Names
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(streamedContent || isDone) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
              <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-500" /> Your Startup Name Ideas
                {isDone && generatedNames.length > 0 && (
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    ({filteredAndSorted.length} of {generatedNames.length})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {state === "generating" && (
                  <span className="text-xs font-semibold text-purple-600 animate-pulse">Thinking...</span>
                )}
                {isDone && favorites.length > 0 && (
                  <button
                    data-testid="button-export-favorites"
                    onClick={handleExportFavorites}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Favorites
                  </button>
                )}
              </div>
            </div>

            {isDone && generatedNames.length > 0 && (
              <div className="space-y-3 px-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  {["all", "favorites", ...NAMING_STYLES.map((s) => s.id)].map((cat) => {
                    const count = categoryFilterCounts[cat] || 0;
                    if (cat !== "all" && cat !== "favorites" && count === 0) return null;
                    if (cat === "favorites" && count === 0) return null;
                    const style = NAMING_STYLES.find((s) => s.id === cat);
                    return (
                      <button
                        key={cat}
                        data-testid={`filter-${cat}`}
                        onClick={() => setActiveFilter(cat)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                          activeFilter === cat
                            ? cat === "all"
                              ? "bg-slate-800 text-white border-slate-800"
                              : cat === "favorites"
                                ? "bg-pink-100 text-pink-700 border-pink-300"
                                : (CATEGORY_COLORS[cat] || "bg-slate-100 text-slate-700 border-slate-200") + " border-current"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {cat === "all" ? "All" : cat === "favorites" ? "Favorites" : style?.label || cat} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      data-testid="input-search-names"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search names..."
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <select
                      data-testid="select-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-purple-400 transition-colors pr-8"
                    >
                      <option value="default">Sort: Relevance</option>
                      <option value="alpha">Sort: A-Z</option>
                      <option value="shortest">Sort: Shortest</option>
                      <option value="domain">Sort: Domain Available</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {isDone ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSorted.map((name) => (
                  <NameCard
                    key={name.id}
                    name={name}
                    isFavorite={favorites.includes(name.id)}
                    onToggleFavorite={() => handleToggleFavorite(name.id)}
                  />
                ))}
                {filteredAndSorted.length === 0 && (
                  <div className="col-span-full text-center py-8 text-slate-400 text-sm">
                    No names match your filters.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {streamedNames.map((name, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                  >
                    <p className="text-lg font-bold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400 mt-1">Generating details...</p>
                  </motion.div>
                ))}
              </div>
            )}

            {isDone && (
              <div className="flex justify-center pt-6">
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" /> Generate More Names
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NameCard({
  name,
  isFavorite,
  onToggleFavorite,
}: {
  name: GeneratedName;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const catColor = CATEGORY_COLORS[name.category] || "bg-slate-100 text-slate-700 border-slate-200";
  const domainInfo = DOMAIN_CONFIG[name.domainLikelihood];

  const handleCopy = () => {
    navigator.clipboard.writeText(name.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group relative",
        isFavorite ? "border-purple-300 ring-1 ring-purple-100" : "border-slate-100"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h4
            data-testid={`text-name-${name.id}`}
            className="text-xl font-bold text-slate-900 leading-tight"
          >
            {name.name}
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", catColor)}>
              {name.category.replace("-", " ")}
            </span>
            <span className="text-[11px] text-slate-400">
              {name.letterCount} letters &middot; {name.syllableCount} syl
            </span>
          </div>
        </div>
        <button
          data-testid={`button-favorite-${name.id}`}
          onClick={onToggleFavorite}
          className={cn(
            "p-2 rounded-xl border transition-all shrink-0",
            isFavorite
              ? "bg-pink-50 border-pink-200 text-pink-500"
              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-pink-500 hover:border-pink-200"
          )}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{name.meaning}</p>

      <div className="flex items-center gap-1.5 mb-3">
        <div
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            name.domainLikelihood === "likely-available" ? "bg-emerald-500" :
            name.domainLikelihood === "possibly-available" ? "bg-amber-500" : "bg-slate-300"
          )}
        />
        <span className={cn("text-[11px] font-medium", domainInfo.color)}>
          {domainInfo.label}
        </span>
      </div>

      {name.whyItWorks.length > 0 && (
        <ul className="space-y-1 mb-4">
          {name.whyItWorks.slice(0, 3).map((point, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        data-testid={`button-copy-${name.id}`}
        onClick={handleCopy}
        className={cn(
          "w-full py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5",
          copied
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
        )}
      >
        {copied ? (
          <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
        ) : (
          <><Copy className="w-3.5 h-3.5" /> Copy Name</>
        )}
      </button>
    </motion.div>
  );
}
