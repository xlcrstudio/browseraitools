import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, MapPin,
  Calendar, DollarSign, Users, Compass,
  Luggage, BarChart3, Lightbulb, Plane
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useTravelPlannerStorage,
  type TravelItinerary,
} from "@/hooks/use-travel-planner-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const BUDGET_OPTIONS = [
  { value: "backpacker", label: "Backpacker (<$50/day)" },
  { value: "budget", label: "Budget ($50-$100/day)" },
  { value: "mid-range", label: "Mid-Range ($100-$200/day)" },
  { value: "luxury", label: "Luxury ($200-$500/day)" },
  { value: "no-limit", label: "No Limit" },
];

const INTEREST_OPTIONS = [
  { value: "culture-history", label: "Culture & History" },
  { value: "food-dining", label: "Food & Dining" },
  { value: "nature-outdoors", label: "Nature & Outdoors" },
  { value: "adventure-sports", label: "Adventure & Sports" },
  { value: "shopping", label: "Shopping" },
  { value: "nightlife", label: "Nightlife" },
  { value: "relaxation-wellness", label: "Relaxation & Wellness" },
  { value: "art-museums", label: "Art & Museums" },
  { value: "photography", label: "Photography" },
  { value: "family-activities", label: "Family Activities" },
];

const TRAVEL_STYLE_OPTIONS = [
  { value: "fast-paced", label: "Fast-Paced (see everything)" },
  { value: "balanced", label: "Balanced" },
  { value: "relaxed", label: "Relaxed (slow travel)" },
];

const MAX_DESTINATION_CHARS = 200;
const MAX_MUST_SEES_CHARS = 500;

const SYSTEM_PROMPT = `You are an expert travel planner. Create practical, detailed day-by-day itineraries with realistic timings and local insights. Write exactly the section requested. Be specific with place names, times, and costs. Prioritize authentic local experiences.`;

export function TravelPlannerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveTravelItinerary } = useTravelPlannerStorage();

  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState<number | "">(5);
  const [budget, setBudget] = useState("");
  const [groupSize, setGroupSize] = useState<number | "">(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [mustSees, setMustSees] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentItinerary, setCurrentItinerary] = useState<TravelItinerary | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleInterest = (value: string) => {
    setInterests((prev) => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      return [...prev, value];
    });
  };

  const handleReset = () => {
    setDestination("");
    setDuration(5);
    setBudget("");
    setGroupSize(2);
    setInterests([]);
    setTravelStyle("balanced");
    setMustSees("");
    setArrivalTime("");
    setStreamingText("");
    setCurrentItinerary(null);
    setCopiedId(null);
    setGenerationProgress("");
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const buildContext = () => {
    const budgetLabel = BUDGET_OPTIONS.find(b => b.value === budget)?.label || budget;
    const interestLabels = interests.map(i => INTEREST_OPTIONS.find(o => o.value === i)?.label || i).join(", ");
    const styleLabel = TRAVEL_STYLE_OPTIONS.find(s => s.value === travelStyle)?.label || travelStyle;
    const parts = [
      `Destination: ${destination.trim()}`,
      `Trip duration: ${duration} days`,
      `Budget level: ${budgetLabel}`,
      `Group size: ${groupSize} ${typeof groupSize === "number" && groupSize === 1 ? "person" : "people"}`,
      `Interests: ${interestLabels}`,
      `Travel style: ${styleLabel}`,
    ];
    if (mustSees.trim()) parts.push(`Must-see places/activities: ${mustSees.trim()}`);
    if (arrivalTime.trim()) parts.push(`Flight arrival time: ${arrivalTime.trim()}`);
    return parts.join("\n");
  };

  const generateSection = async (sectionPrompt: string, maxTokens: number, temperature: number): Promise<string> => {
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sectionPrompt },
      ],
      temperature,
      maxTokens,
      onChunk: (text) => setStreamingText(text),
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!destination.trim() || !budget || interests.length === 0) return;
    if (typeof duration !== "number" || duration < 1) return;
    if (typeof groupSize !== "number" || groupSize < 1) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentItinerary(null);
    setGenerationProgress("");

    const context = buildContext();
    let allRawText = "";
    let itineraryContent = "";
    let packingListContent = "";
    let budgetBreakdownContent = "";
    let tripTipsContent = "";

    try {
      setGenerationProgress("Planning your itinerary... (1/4)");
      setStreamingText("--- Planning your itinerary... ---");

      const itineraryPrompt = `Create a detailed day-by-day travel itinerary for:

${context}

Write a ${duration}-day itinerary with morning, afternoon, and evening activities for each day. Include specific place names, estimated times, transport tips between locations, and restaurant recommendations. ${arrivalTime.trim() ? `Day 1 starts with arrival at ${arrivalTime.trim()}.` : ""}

Day-by-Day Itinerary:`;

      const itineraryResult = await generateSection(itineraryPrompt, 800, 0.6);
      itineraryContent = itineraryResult.trim();
      allRawText = `DAY-BY-DAY ITINERARY:\n${itineraryContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Creating packing list... (2/4)");
      setStreamingText(allRawText + "\n\n--- Creating packing list... ---");

      const packingPrompt = `Create a packing list for this trip:

${itineraryContent.slice(0, 600)}

Destination: ${destination.trim()}
Duration: ${duration} days
Activities planned: ${interests.map(i => INTEREST_OPTIONS.find(o => o.value === i)?.label || i).join(", ")}

Create a weather-appropriate, activity-specific packing list organized by category (Clothing, Toiletries, Electronics, Documents, Activity-Specific Gear, Miscellaneous). Be practical and specific.

Packing List:`;

      const packingResult = await generateSection(packingPrompt, 500, 0.5);
      packingListContent = packingResult.trim();
      allRawText += `\n\nPACKING LIST:\n${packingListContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Calculating budget... (3/4)");
      setStreamingText(allRawText + "\n\n--- Calculating budget... ---");

      const budgetPrompt = `Create a budget breakdown for this trip:

${itineraryContent.slice(0, 600)}

Destination: ${destination.trim()}
Duration: ${duration} days
Budget level: ${BUDGET_OPTIONS.find(b => b.value === budget)?.label || budget}
Group size: ${groupSize}

Provide estimated costs for: Accommodation, Food & Dining, Transport (local + between cities), Activities & Attractions, Miscellaneous. Give daily estimates and total estimates for the full trip. Use realistic local prices.

Budget Breakdown:`;

      const budgetResult = await generateSection(budgetPrompt, 500, 0.5);
      budgetBreakdownContent = budgetResult.trim();
      allRawText += `\n\nBUDGET BREAKDOWN:\n${budgetBreakdownContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Adding trip tips... (4/4)");
      setStreamingText(allRawText + "\n\n--- Adding trip tips... ---");

      const tipsPrompt = `Write trip tips for this travel plan:

${itineraryContent.slice(0, 400)}

Destination: ${destination.trim()}
Duration: ${duration} days

Provide: local tips, safety advice, best times to visit key attractions, cultural notes and etiquette, and a brief "Why This Itinerary Works" paragraph.

Trip Tips:`;

      const tipsResult = await generateSection(tipsPrompt, 400, 0.6);
      tripTipsContent = tipsResult.trim();
      allRawText += `\n\nTRIP TIPS:\n${tripTipsContent}`;
      setStreamingText(allRawText);

      const itinerary: TravelItinerary = {
        id: generateId(),
        destination: destination.trim(),
        duration: typeof duration === "number" ? duration : 5,
        budget,
        groupSize: typeof groupSize === "number" ? groupSize : 2,
        interests,
        travelStyle,
        mustSees,
        arrivalTime,
        itineraryContent,
        packingList: packingListContent,
        budgetBreakdown: budgetBreakdownContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentItinerary(itinerary);
      saveTravelItinerary(itinerary);
    } catch (err) {
      console.error("Generation error:", err);
      if (itineraryContent) {
        const partial: TravelItinerary = {
          id: generateId(),
          destination: destination.trim(),
          duration: typeof duration === "number" ? duration : 5,
          budget,
          groupSize: typeof groupSize === "number" ? groupSize : 2,
          interests,
          travelStyle,
          mustSees,
          arrivalTime,
          itineraryContent,
          packingList: packingListContent,
          budgetBreakdown: budgetBreakdownContent,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentItinerary(partial);
        saveTravelItinerary(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    destination.trim().length > 0 &&
    typeof duration === "number" && duration >= 1 &&
    budget.length > 0 &&
    typeof groupSize === "number" && groupSize >= 1 &&
    interests.length > 0 &&
    !isGenerating;

  const hasOutput = currentItinerary && (currentItinerary.itineraryContent || currentItinerary.rawText);

  const budgetLabel = BUDGET_OPTIONS.find(b => b.value === (currentItinerary?.budget || budget))?.label || budget;
  const styleLabel = TRAVEL_STYLE_OPTIONS.find(s => s.value === (currentItinerary?.travelStyle || travelStyle))?.label || travelStyle;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-travel-planner-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="destination-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Destination * (city, country, or region)
            </label>
            <input
              id="destination-input"
              data-testid="input-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.slice(0, MAX_DESTINATION_CHARS))}
              placeholder="Where are you going? (e.g., Tokyo, Japan)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-destination-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {destination.length}/{MAX_DESTINATION_CHARS}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Trip Duration (days) *
              </label>
              <input
                id="duration-input"
                data-testid="input-duration"
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") { setDuration(""); return; }
                  const num = parseInt(val);
                  if (!isNaN(num)) setDuration(num);
                }}
                onBlur={() => {
                  if (typeof duration === "number") {
                    if (duration < 1) setDuration(1);
                    else if (duration > 30) setDuration(30);
                  } else {
                    setDuration(5);
                  }
                }}
                placeholder="1-30"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="budget-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Budget *
              </label>
              <select
                id="budget-select"
                data-testid="select-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              >
                <option value="">Select budget...</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="group-size-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Group Size *
            </label>
            <input
              id="group-size-input"
              data-testid="input-group-size"
              type="number"
              min={1}
              max={20}
              value={groupSize}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") { setGroupSize(""); return; }
                const num = parseInt(val);
                if (!isNaN(num)) setGroupSize(num);
              }}
              onBlur={() => {
                if (typeof groupSize === "number") {
                  if (groupSize < 1) setGroupSize(1);
                  else if (groupSize > 20) setGroupSize(20);
                } else {
                  setGroupSize(2);
                }
              }}
              placeholder="1-20"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Interests * (select at least 1)</label>
            <div className="flex flex-wrap gap-2" data-testid="container-interest-options">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-interest-${opt.value}`}
                  onClick={() => toggleInterest(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    interests.includes(opt.value)
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Style</label>
            <div className="flex flex-wrap gap-2" data-testid="container-travel-style-options">
              {TRAVEL_STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-style-${opt.value}`}
                  onClick={() => setTravelStyle(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    travelStyle === opt.value
                      ? "bg-blue-100 text-blue-700 border-blue-300 ring-1 ring-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="must-sees-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Must-See Places / Activities (optional)
            </label>
            <textarea
              id="must-sees-input"
              data-testid="input-must-sees"
              value={mustSees}
              onChange={(e) => setMustSees(e.target.value.slice(0, MAX_MUST_SEES_CHARS))}
              placeholder="Any specific places or activities you don't want to miss, e.g., Eiffel Tower, local cooking class..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-must-sees-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {mustSees.length}/{MAX_MUST_SEES_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="arrival-time-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Flight Arrival Time (optional)
            </label>
            <input
              id="arrival-time-input"
              data-testid="input-arrival-time"
              type="text"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder='e.g., "Morning", "2pm", "Late night"'
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span data-testid="text-privacy-reminder">Processed 100% locally in your browser — nothing is sent to any server</span>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Planning your trip...</>
              ) : (
                <><Plane className="w-5 h-5" />Generate Itinerary (Privately)</>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
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
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600" data-testid="text-generation-progress">
              {generationProgress || "Planning your trip... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentItinerary && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Your Travel Itinerary</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentItinerary.destination} — {currentItinerary.duration} days — {BUDGET_OPTIONS.find(b => b.value === currentItinerary.budget)?.label || currentItinerary.budget}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentItinerary.rawText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <InlineShareButtons />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-destination" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <MapPin className="w-3.5 h-3.5" /> {currentItinerary.destination}
            </div>
            <div data-testid="stat-duration" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Calendar className="w-3.5 h-3.5" /> {currentItinerary.duration} {currentItinerary.duration === 1 ? "day" : "days"}
            </div>
            <div data-testid="stat-budget" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <DollarSign className="w-3.5 h-3.5" /> {BUDGET_OPTIONS.find(b => b.value === currentItinerary.budget)?.label || currentItinerary.budget}
            </div>
            <div data-testid="stat-group-size" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Users className="w-3.5 h-3.5" /> {currentItinerary.groupSize} {currentItinerary.groupSize === 1 ? "person" : "people"}
            </div>
            <div data-testid="stat-travel-style" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Compass className="w-3.5 h-3.5" /> {TRAVEL_STYLE_OPTIONS.find(s => s.value === currentItinerary.travelStyle)?.label || currentItinerary.travelStyle}
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentItinerary.itineraryContent && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-itinerary">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-itinerary">Day-by-Day Itinerary</h3>
                </div>
                <button
                  data-testid="button-copy-itinerary"
                  onClick={() => copyToClipboard(currentItinerary.itineraryContent, "itinerary")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "itinerary" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "itinerary" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "itinerary" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-itinerary">
                  {currentItinerary.itineraryContent}
                </p>
              </div>
            </div>
          )}

          {currentItinerary.packingList && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-packing-list">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-packing-list">Packing List</h3>
                </div>
                <button
                  data-testid="button-copy-packing"
                  onClick={() => copyToClipboard(currentItinerary.packingList, "packing")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "packing" ? "bg-emerald-100 text-emerald-700" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {copiedId === "packing" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "packing" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-green-50/50 border border-green-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-packing-list">
                  {currentItinerary.packingList}
                </p>
              </div>
            </div>
          )}

          {currentItinerary.budgetBreakdown && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-budget-breakdown">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-budget-breakdown">Budget Breakdown</h3>
                </div>
                <button
                  data-testid="button-copy-budget"
                  onClick={() => copyToClipboard(currentItinerary.budgetBreakdown, "budget")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "budget" ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {copiedId === "budget" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "budget" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-budget-breakdown">
                  {currentItinerary.budgetBreakdown}
                </p>
              </div>
            </div>
          )}

          {currentItinerary.rawText.includes("TRIP TIPS:") && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-trip-tips">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-trip-tips">Trip Tips & Why This Itinerary Works</h3>
                </div>
                <button
                  data-testid="button-copy-tips"
                  onClick={() => {
                    const tipsText = currentItinerary.rawText.split("TRIP TIPS:\n")[1] || "";
                    copyToClipboard(tipsText.trim(), "tips");
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "tips" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "tips" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "tips" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-trip-tips">
                  {currentItinerary.rawText.split("TRIP TIPS:\n")[1]?.trim() || ""}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
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
          <p className="text-sm font-semibold text-red-700" data-testid="text-error-title">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1" data-testid="text-error-message">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span className="text-sm font-medium text-emerald-700" data-testid="text-engine-status">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
