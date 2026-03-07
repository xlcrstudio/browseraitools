import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  RefreshCw, Download, Copy, Heart, Search, Filter, TrendingUp,
  DollarSign, Clock, Target, Zap, BarChart3, RotateCcw
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useBusinessIdeaStorage,
  type BusinessIdea,
} from "@/hooks/use-business-idea-storage";

const BUDGETS = [
  { value: "Minimal ($0-$500)", label: "Minimal ($0-$500)" },
  { value: "Low ($500-$5,000)", label: "Low ($500-$5,000)" },
  { value: "Medium ($5,000-$25,000)", label: "Medium ($5,000-$25,000)" },
  { value: "High ($25,000-$100,000)", label: "High ($25,000-$100,000)" },
  { value: "Very High ($100,000+)", label: "Very High ($100,000+)" },
  { value: "Flexible", label: "Flexible" },
];

const TIME_OPTIONS = [
  { value: "Part-time (10-20 hrs/week)", label: "Part-time", desc: "10-20 hrs/week" },
  { value: "Full-time (40+ hrs/week)", label: "Full-time", desc: "40+ hrs/week" },
  { value: "Flexible", label: "Flexible", desc: "Can adjust" },
];

const BUSINESS_MODELS = [
  "Online/Digital Business",
  "Service-Based Business",
  "Product-Based Business",
  "Local/Physical Location",
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "Subscription/Recurring Revenue",
  "Marketplace/Platform",
];

const INDUSTRIES = [
  "Technology & Software", "E-commerce & Retail", "Health & Wellness",
  "Education & Training", "Marketing & Advertising", "Food & Beverage",
  "Finance & Investing", "Sustainability/Green", "Entertainment & Media",
  "Real Estate", "Professional Services", "Home Services",
  "Fashion & Beauty", "Travel & Hospitality", "Fitness & Sports",
  "Any/Open to all",
];

const RISK_OPTIONS = [
  { value: "Low", label: "Low Risk", desc: "Proven models" },
  { value: "Medium", label: "Medium Risk", desc: "Some innovation" },
  { value: "High", label: "High Risk", desc: "Disruptive potential" },
];

const TIMELINE_OPTIONS = [
  { value: "Quick wins (1-3 months)", label: "Quick (1-3 months)" },
  { value: "Short-term (3-6 months)", label: "Short (3-6 months)" },
  { value: "Medium-term (6-12 months)", label: "Medium (6-12 months)" },
  { value: "Long-term (12+ months)", label: "Long (12+ months)" },
  { value: "Flexible", label: "Flexible" },
];

const CONSIDERATIONS = [
  "Location-independent",
  "Environmentally sustainable",
  "Social impact focused",
  "Can work solo",
  "Scalable to large business",
  "Low competition preferred",
];

const CATEGORY_COLORS: Record<string, string> = {
  service: "bg-blue-100 text-blue-700 border-blue-200",
  digital: "bg-purple-100 text-purple-700 border-purple-200",
  product: "bg-emerald-100 text-emerald-700 border-emerald-200",
  innovative: "bg-amber-100 text-amber-700 border-amber-200",
};

const SYSTEM_PROMPT = `You are an experienced entrepreneur and business consultant who has started, grown, and sold 5 businesses across different industries.

Your expertise:
- Identifying profitable business opportunities
- Market analysis and validation
- Business model design
- Startup planning and execution
- Understanding market trends
- Matching business ideas to individual skills
- Risk assessment
- Revenue model optimization

You generate business ideas that are:
- Practical and actionable
- Matched to the person's skills and resources
- Financially viable
- Have clear target markets
- Include realistic next steps
- Consider competition and barriers
- Offer genuine value to customers`;

export function BusinessIdeaGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveGeneration, toggleFavorite } = useBusinessIdeaStorage();

  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [timeCommitment, setTimeCommitment] = useState(TIME_OPTIONS[0].value);
  const [budget, setBudget] = useState(BUDGETS[1].value);

  const [selectedModels, setSelectedModels] = useState<string[]>(["Online/Digital Business", "Service-Based Business"]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState("Medium");
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[2].value);
  const [considerations, setConsiderations] = useState<string[]>([]);
  const [avoidIdeas, setAvoidIdeas] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<BusinessIdea[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("viability");

  const currentRecord = history.find((r) => r.id === currentRecordId);
  const favorites = currentRecord?.favorites || [];

  const toggleModel = (m: string) => {
    setSelectedModels((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(ind)) return prev.filter((x) => x !== ind);
      if (prev.length >= 5) return [...prev.slice(1), ind];
      return [...prev, ind];
    });
  };

  const toggleConsideration = (c: string) => {
    setConsiderations((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const buildPrompt = () => {
    return `Generate 15 personalized, viable business ideas.

PERSON'S PROFILE:
Skills & Experience: ${skills}
${interests ? `Interests/Passions: ${interests}` : ""}
Available Time: ${timeCommitment}
Startup Budget: ${budget}

PREFERENCES:
Business Models: ${selectedModels.join(", ") || "Any"}
Industries: ${selectedIndustries.join(", ") || "Any/Open to all"}
Risk Tolerance: ${riskTolerance}
Timeline to Profit: ${timeline}
${considerations.length ? `Special Considerations: ${considerations.join(", ")}` : ""}
${avoidIdeas ? `Avoid: ${avoidIdeas}` : ""}

For each business idea, use this EXACT format:

Business Idea #1
Title: [Business Name]
Description: [One sentence - what it does and who it serves]
Viability: [XX/100] [Excellent/Good/Moderate]
Startup Cost: $[amount]
Time to Launch: [X] months
Revenue: $[X,XXX]/month
Difficulty: [Easy/Medium/Hard]
Category: [service/digital/product/innovative]
Why:
- [How it matches their skills]
- [Why it fits their budget/time]
- [Market opportunity reason]
Target Market: [Who will buy and why]
Revenue Model: [How money is made]
Competition: [Landscape and your advantage]
Next Steps:
1. [Immediate action this week]
2. [Action for week 2]
3. [Action for month 1]

Generate 15 ideas. Mix: 40% service, 30% digital, 20% product, 10% innovative.
Only suggest ideas scoring 55+ viability. Be realistic about costs and revenue.
Make each idea specific, actionable, and personalized to their profile.`;
  };

  const parseIdeas = (text: string): BusinessIdea[] => {
    const ideas: BusinessIdea[] = [];
    const blocks = text.split(/Business Idea #\d+/i).filter((b) => b.trim());

    for (const block of blocks) {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 3) continue;

      let title = "", description = "", viabilityScore = 70, viabilityLabel: BusinessIdea["viabilityLabel"] = "Good";
      let startupCost = "", timeToLaunch = "", revenueMonthly = "", difficulty: BusinessIdea["difficulty"] = "Medium";
      let category: BusinessIdea["category"] = "service";
      let whyItWorks: string[] = [];
      let targetMarket = "", revenueModel = "", competition = "";
      let nextSteps: string[] = [];
      let inWhy = false, inSteps = false;

      for (const line of lines) {
        if (line.toLowerCase().startsWith("title:")) {
          title = line.replace(/^title:\s*/i, "").replace(/^\*+|\*+$/g, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("description:")) {
          description = line.replace(/^description:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("viability:")) {
          const vMatch = line.match(/(\d+)\/100/);
          if (vMatch) viabilityScore = parseInt(vMatch[1]);
          if (line.toLowerCase().includes("excellent")) viabilityLabel = "Excellent";
          else if (line.toLowerCase().includes("moderate")) viabilityLabel = "Moderate";
          else viabilityLabel = "Good";
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("startup cost:")) {
          startupCost = line.replace(/^startup cost:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("time to launch:")) {
          timeToLaunch = line.replace(/^time to launch:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("revenue:")) {
          revenueMonthly = line.replace(/^revenue:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("difficulty:")) {
          const d = line.replace(/^difficulty:\s*/i, "").trim().toLowerCase();
          if (d.includes("easy")) difficulty = "Easy";
          else if (d.includes("hard")) difficulty = "Hard";
          else difficulty = "Medium";
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("category:")) {
          const cat = line.replace(/^category:\s*/i, "").trim().toLowerCase();
          if (cat.includes("digital") || cat.includes("online")) category = "digital";
          else if (cat.includes("product")) category = "product";
          else if (cat.includes("innovat") || cat.includes("creative")) category = "innovative";
          else category = "service";
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("why:")) {
          inWhy = true; inSteps = false;
        } else if (line.toLowerCase().startsWith("target market:")) {
          targetMarket = line.replace(/^target market:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("revenue model:")) {
          revenueModel = line.replace(/^revenue model:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("competition:")) {
          competition = line.replace(/^competition:\s*/i, "").trim();
          inWhy = false; inSteps = false;
        } else if (line.toLowerCase().startsWith("next steps:")) {
          inSteps = true; inWhy = false;
        } else if (inWhy && line.startsWith("-")) {
          whyItWorks.push(line.replace(/^-\s*/, "").trim());
        } else if (inSteps && /^\d+[\.\)]/.test(line)) {
          nextSteps.push(line.replace(/^\d+[\.\)]\s*/, "").trim());
        }
      }

      if (!title || title.length < 3) continue;

      if (viabilityScore >= 85) viabilityLabel = "Excellent";
      else if (viabilityScore >= 70) viabilityLabel = "Good";
      else viabilityLabel = "Moderate";

      ideas.push({
        id: generateId(),
        title,
        description: description || "A personalized business opportunity",
        viabilityScore: Math.min(100, Math.max(0, viabilityScore)),
        viabilityLabel,
        startupCost: startupCost || "Varies",
        timeToLaunch: timeToLaunch || "2-3 months",
        revenueMonthly: revenueMonthly || "Varies",
        difficulty,
        whyItWorks: whyItWorks.length ? whyItWorks : ["Matches your skill set", "Fits within your budget"],
        targetMarket: targetMarket || "To be determined based on research",
        revenueModel: revenueModel || "Service fees and consulting",
        competition: competition || "Moderate - differentiation through specialization",
        nextSteps: nextSteps.length ? nextSteps : ["Research the market", "Create a basic plan", "Find first customer"],
        category,
      });
    }

    if (ideas.length === 0) {
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const match = line.match(/^\d+[\.\)]\s*\**(.+?)\**\s*[-:]\s*(.*)/);
        if (match) {
          const fallbackTitle = match[1].trim();
          if (fallbackTitle.length >= 3 && fallbackTitle.length <= 60) {
            ideas.push({
              id: generateId(),
              title: fallbackTitle,
              description: match[2]?.trim() || "A business opportunity matched to your profile",
              viabilityScore: 70,
              viabilityLabel: "Good",
              startupCost: "Varies",
              timeToLaunch: "2-3 months",
              revenueMonthly: "Varies",
              difficulty: "Medium",
              whyItWorks: ["Matches your skill set", "Fits within your budget"],
              targetMarket: "Research needed",
              revenueModel: "Service fees",
              competition: "Moderate",
              nextSteps: ["Research the market", "Create a plan", "Find first customer"],
              category: "service",
            });
          }
        }
      }
    }

    return ideas;
  };

  const handleGenerate = async () => {
    if (!skills.trim()) return;

    setStreamedContent("");
    setIsDone(false);
    setGeneratedIdeas([]);
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("viability");

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.8,
      maxTokens: 3000,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      setIsDone(true);
      const parsed = parseIdeas(finalContent);
      setGeneratedIdeas(parsed);

      const recordId = generateId();
      setCurrentRecordId(recordId);
      saveGeneration({
        id: recordId,
        skills,
        interests,
        budget,
        ideas: parsed,
        favorites: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleToggleFavorite = (ideaId: string) => {
    if (currentRecordId) toggleFavorite(currentRecordId, ideaId);
  };

  const handleExportFavorites = () => {
    const favIdeas = generatedIdeas.filter((i) => favorites.includes(i.id));
    if (!favIdeas.length) return;
    const text = favIdeas
      .map((i, idx) => `${idx + 1}. ${i.title}\n   ${i.description}\n   Viability: ${i.viabilityScore}/100\n   Startup Cost: ${i.startupCost}\n   Revenue: ${i.revenueMonthly}/month\n   Next Steps: ${i.nextSteps.join("; ")}\n`)
      .join("\n");
    const blob = new Blob([`Business Idea Favorites\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-idea-favorites.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...generatedIdeas];

    if (activeFilter === "favorites") {
      result = result.filter((i) => favorites.includes(i.id));
    } else if (activeFilter !== "all") {
      result = result.filter((i) => i.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "viability") result.sort((a, b) => b.viabilityScore - a.viabilityScore);
    else if (sortBy === "cost") {
      const extractNum = (s: string) => {
        const m = s.replace(/,/g, "").match(/\d+/);
        return m ? parseInt(m[0]) : 99999;
      };
      result.sort((a, b) => extractNum(a.startupCost) - extractNum(b.startupCost));
    } else if (sortBy === "difficulty") {
      const order = { Easy: 0, Medium: 1, Hard: 2 };
      result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }

    return result;
  }, [generatedIdeas, activeFilter, searchQuery, sortBy, favorites]);

  const summaryStats = useMemo(() => {
    if (!generatedIdeas.length) return null;
    return {
      total: generatedIdeas.length,
      highViability: generatedIdeas.filter((i) => i.viabilityScore >= 80).length,
      quickLaunch: generatedIdeas.filter((i) => {
        const m = i.timeToLaunch.match(/(\d+)/);
        return m && parseInt(m[1]) <= 3;
      }).length,
      lowInvestment: generatedIdeas.filter((i) => {
        const num = i.startupCost.replace(/,/g, "").match(/\d+/);
        return num && parseInt(num[0]) <= 5000;
      }).length,
    };
  }, [generatedIdeas]);

  const categoryFilterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: generatedIdeas.length, favorites: favorites.length };
    for (const i of generatedIdeas) counts[i.category] = (counts[i.category] || 0) + 1;
    return counts;
  }, [generatedIdeas, favorites]);

  const streamedTitles = streamedContent
    .split(/Business Idea #\d+/i)
    .filter((b) => b.trim())
    .map((b) => {
      const titleLine = b.split("\n").find((l) => l.trim().toLowerCase().startsWith("title:"));
      return titleLine?.replace(/^title:\s*/i, "").replace(/^\*+|\*+$/g, "").trim() || "";
    })
    .filter((t) => t.length >= 3);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Your Skills & Experience *</label>
            <div className="relative">
              <textarea
                data-testid="input-skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="What are you good at? What's your professional background? e.g., Marketing and social media, Software development, Writing and content creation..."
                maxLength={500}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">{skills.length}/500</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Your Interests & Passions</label>
            <textarea
              data-testid="input-interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="What topics or industries excite you? e.g., Health and wellness, Technology and AI, Sustainability..."
              maxLength={300}
              rows={2}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Available Time *</label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    data-testid={`button-time-${opt.label.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => setTimeCommitment(opt.value)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                      timeCommitment === opt.value
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
              <label className="text-sm font-semibold text-slate-700 ml-1">Startup Budget *</label>
              <div className="relative">
                <select
                  data-testid="select-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                >
                  {BUDGETS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <button
          data-testid="button-toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mt-6 mb-4 transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
          {showAdvanced ? "Hide" : "Show"} Business Preferences
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
                  <label className="text-sm font-semibold text-slate-700 ml-1">Business Model</label>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_MODELS.map((m) => (
                      <button
                        key={m}
                        data-testid={`button-model-${m.toLowerCase().replace(/[\s\/()]/g, "-")}`}
                        onClick={() => toggleModel(m)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                          selectedModels.includes(m)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Industry Interest (up to 5)</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        data-testid={`button-industry-${ind.toLowerCase().replace(/[\s\/&]/g, "-")}`}
                        onClick={() => toggleIndustry(ind)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          selectedIndustries.includes(ind)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Risk Tolerance</label>
                    <div className="flex flex-wrap gap-2">
                      {RISK_OPTIONS.map((r) => (
                        <button
                          key={r.value}
                          data-testid={`button-risk-${r.value.toLowerCase()}`}
                          onClick={() => setRiskTolerance(r.value)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                            riskTolerance === r.value
                              ? "bg-purple-100 border-purple-300 text-purple-700"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {r.label} <span className="text-[10px] opacity-60">({r.desc})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Timeline to Profitability</label>
                    <div className="relative">
                      <select
                        data-testid="select-timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                      >
                        {TIMELINE_OPTIONS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Special Considerations</label>
                  <div className="flex flex-wrap gap-2">
                    {CONSIDERATIONS.map((c) => (
                      <button
                        key={c}
                        data-testid={`button-consideration-${c.toLowerCase().replace(/[\s-]/g, "-")}`}
                        onClick={() => toggleConsideration(c)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          considerations.includes(c)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Ideas to Avoid</label>
                  <input
                    data-testid="input-avoid"
                    type="text"
                    value={avoidIdeas}
                    onChange={(e) => setAvoidIdeas(e.target.value)}
                    placeholder="e.g., food service, consulting, drop shipping"
                    maxLength={200}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
                  />
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

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              data-testid="button-generate-ideas"
              onClick={handleGenerate}
              disabled={!skills.trim() || state === "generating" || state === "downloading" || state === "checking-gpu"}
              className={cn(
                "flex-1 sm:flex-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
                !skills.trim() || ["generating", "downloading", "checking-gpu"].includes(state)
                  ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                  : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
              )}
            >
              {state === "generating" ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Ideas...</>
              ) : (
                <><Lightbulb className="w-5 h-5" /> Generate Business Ideas</>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={() => {
                setSkills("");
                setInterests("");
                setTimeCommitment(TIME_OPTIONS[0].value);
                setBudget(BUDGETS[1].value);
                setSelectedModels(["Online/Digital Business", "Service-Based Business"]);
                setSelectedIndustries([]);
                setRiskTolerance("Medium");
                setTimeline(TIMELINE_OPTIONS[2].value);
                setConsiderations([]);
                setAvoidIdeas("");
                setShowAdvanced(false);
                setStreamedContent("");
                setIsDone(false);
                setGeneratedIdeas([]);
                setCurrentRecordId(null);
              }}
              disabled={state === "generating"}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
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
                <Lightbulb className="w-5 h-5 text-purple-500" /> Your Personalized Business Ideas
                {isDone && generatedIdeas.length > 0 && (
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    ({filteredAndSorted.length} of {generatedIdeas.length})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {state === "generating" && (
                  <span className="text-xs font-semibold text-purple-600 animate-pulse">Analyzing opportunities...</span>
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

            {isDone && summaryStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-800" data-testid="stat-high-viability">{summaryStats.highViability}</p>
                  <p className="text-[11px] text-slate-500">High Viability</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
                  <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-800" data-testid="stat-quick-launch">{summaryStats.quickLaunch}</p>
                  <p className="text-[11px] text-slate-500">Quick Launch</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
                  <DollarSign className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-800" data-testid="stat-low-investment">{summaryStats.lowInvestment}</p>
                  <p className="text-[11px] text-slate-500">Low Investment</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
                  <BarChart3 className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-800" data-testid="stat-total">{summaryStats.total}</p>
                  <p className="text-[11px] text-slate-500">Total Ideas</p>
                </div>
              </div>
            )}

            {isDone && generatedIdeas.length > 0 && (
              <div className="space-y-3 px-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  {["all", "favorites", "service", "digital", "product", "innovative"].map((cat) => {
                    const count = categoryFilterCounts[cat] || 0;
                    if (cat !== "all" && count === 0) return null;
                    const labels: Record<string, string> = { all: "All", favorites: "Favorites", service: "Service", digital: "Digital", product: "Product", innovative: "Innovative" };
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
                                : (CATEGORY_COLORS[cat] || "") + " border-current"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {labels[cat] || cat} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      data-testid="input-search-ideas"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ideas..."
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
                      <option value="viability">Sort: Viability</option>
                      <option value="cost">Sort: Lowest Cost</option>
                      <option value="difficulty">Sort: Easiest First</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {isDone ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredAndSorted.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    isFavorite={favorites.includes(idea.id)}
                    onToggleFavorite={() => handleToggleFavorite(idea.id)}
                  />
                ))}
                {filteredAndSorted.length === 0 && (
                  <div className="col-span-full text-center py-8 text-slate-400 text-sm">
                    No ideas match your filters.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {streamedTitles.map((title, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                  >
                    <p className="text-lg font-bold text-slate-800">{title}</p>
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
                  <RefreshCw className="w-4 h-4" /> Generate More Ideas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IdeaCard({
  idea,
  isFavorite,
  onToggleFavorite,
}: {
  idea: BusinessIdea;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[idea.category] || "bg-slate-100 text-slate-700 border-slate-200";

  const handleCopy = () => {
    const text = `${idea.title}\n${idea.description}\nViability: ${idea.viabilityScore}/100\nStartup Cost: ${idea.startupCost}\nRevenue: ${idea.revenueMonthly}/month\nNext Steps:\n${idea.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viabilityColor = idea.viabilityScore >= 80
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : idea.viabilityScore >= 65
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-orange-100 text-orange-700 border-orange-200";

  const difficultyColor = idea.difficulty === "Easy"
    ? "text-emerald-600"
    : idea.difficulty === "Hard"
      ? "text-rose-600"
      : "text-amber-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group",
        isFavorite ? "border-purple-300 ring-1 ring-purple-100" : "border-slate-100"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 data-testid={`text-title-${idea.id}`} className="text-lg font-bold text-slate-900 leading-tight">
            {idea.title}
          </h4>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{idea.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("px-2 py-1 rounded-lg text-xs font-bold border", viabilityColor)}>
            {idea.viabilityScore}/100
          </span>
          <button
            data-testid={`button-favorite-${idea.id}`}
            onClick={onToggleFavorite}
            className={cn(
              "p-2 rounded-xl border transition-all",
              isFavorite
                ? "bg-pink-50 border-pink-200 text-pink-500"
                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-pink-500 hover:border-pink-200"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize", catColor)}>
          {idea.category}
        </span>
        <span className={cn("text-[11px] font-semibold", viabilityColor.split(" ")[1])}>
          {idea.viabilityLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <DollarSign className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
          <p className="text-xs font-bold text-slate-700 truncate">{idea.startupCost}</p>
          <p className="text-[10px] text-slate-400">Startup</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
          <p className="text-xs font-bold text-slate-700 truncate">{idea.timeToLaunch}</p>
          <p className="text-[10px] text-slate-400">Launch</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <TrendingUp className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
          <p className="text-xs font-bold text-slate-700 truncate">{idea.revenueMonthly}</p>
          <p className="text-[10px] text-slate-400">Revenue/mo</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <Target className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
          <p className={cn("text-xs font-bold truncate", difficultyColor)}>{idea.difficulty}</p>
          <p className="text-[10px] text-slate-400">Difficulty</p>
        </div>
      </div>

      {idea.whyItWorks.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Why This Works For You</p>
          <ul className="space-y-1">
            {idea.whyItWorks.slice(0, 4).map((point, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        data-testid={`button-expand-${idea.id}`}
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 mb-3 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Hide details" : "View full plan"}
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
            <div className="space-y-3 mb-4 pt-2 border-t border-slate-100">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Target Market</p>
                <p className="text-xs text-slate-600">{idea.targetMarket}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Revenue Model</p>
                <p className="text-xs text-slate-600">{idea.revenueModel}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Competition</p>
                <p className="text-xs text-slate-600">{idea.competition}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Next Steps</p>
                <ol className="space-y-1">
                  {idea.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="bg-purple-100 text-purple-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        data-testid={`button-copy-${idea.id}`}
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
          <><Copy className="w-3.5 h-3.5" /> Copy Idea</>
        )}
      </button>
    </motion.div>
  );
}
