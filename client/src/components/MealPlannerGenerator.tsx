import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, UtensilsCrossed,
  ShoppingCart, BookOpen, BarChart3, DollarSign,
  Users, Calendar, Clock
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useMealPlannerStorage,
  type MealPlan,
} from "@/hooks/use-meal-planner-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const DIETARY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "halal", label: "Halal" },
];

const BUDGET_OPTIONS = [
  { value: "under-50", label: "Under $50" },
  { value: "50-75", label: "$50-$75" },
  { value: "75-100", label: "$75-$100" },
  { value: "100-150", label: "$100-$150" },
  { value: "150-plus", label: "$150+" },
];

const DAYS_OF_WEEK = [
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
  { value: "Sun", label: "Sun" },
];

const CUISINE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "american", label: "American" },
  { value: "mexican", label: "Mexican" },
  { value: "italian", label: "Italian" },
  { value: "asian", label: "Asian" },
  { value: "indian", label: "Indian" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "middle-eastern", label: "Middle Eastern" },
];

const PREP_TIME_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "none", label: "No limit" },
];

const MAX_INGREDIENTS_CHARS = 500;

const SYSTEM_PROMPT = `You are an expert nutritionist and meal planning assistant. Create practical, budget-friendly meal plans with accurate nutrition info. Write exactly the section requested. Keep meals simple and family-friendly. Use common, affordable ingredients. Be specific with quantities and portions.`;

export function MealPlannerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveMealPlan } = useMealPlannerStorage();

  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(["none"]);
  const [familySize, setFamilySize] = useState<number | "">(2);
  const [budget, setBudget] = useState("");
  const [ingredientsOnHand, setIngredientsOnHand] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(DAYS_OF_WEEK.map(d => d.value));
  const [cuisinePrefs, setCuisinePrefs] = useState<string[]>(["any"]);
  const [calorieGoal, setCalorieGoal] = useState<number | "">("");
  const [mealPrepTimeLimit, setMealPrepTimeLimit] = useState("30");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleDietary = (value: string) => {
    setDietaryRestrictions((prev) => {
      if (value === "none") return ["none"];
      const without = prev.filter(v => v !== "none");
      if (without.includes(value)) {
        const updated = without.filter(v => v !== value);
        return updated.length === 0 ? ["none"] : updated;
      }
      return [...without, value];
    });
  };

  const toggleDay = (day: string) => {
    setDaysOfWeek((prev) => {
      if (prev.includes(day)) {
        const updated = prev.filter(d => d !== day);
        return updated.length === 0 ? prev : updated;
      }
      return [...prev, day];
    });
  };

  const toggleCuisine = (value: string) => {
    setCuisinePrefs((prev) => {
      if (value === "any") return ["any"];
      const without = prev.filter(v => v !== "any");
      if (without.includes(value)) {
        const updated = without.filter(v => v !== value);
        return updated.length === 0 ? ["any"] : updated;
      }
      return [...without, value];
    });
  };

  const handleReset = () => {
    setDietaryRestrictions(["none"]);
    setFamilySize(2);
    setBudget("");
    setIngredientsOnHand("");
    setDaysOfWeek(DAYS_OF_WEEK.map(d => d.value));
    setCuisinePrefs(["any"]);
    setCalorieGoal("");
    setMealPrepTimeLimit("30");
    setStreamingText("");
    setCurrentPlan(null);
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
    const dietLabel = dietaryRestrictions.map(d => DIETARY_OPTIONS.find(o => o.value === d)?.label || d).join(", ");
    const budgetLabel = BUDGET_OPTIONS.find(b => b.value === budget)?.label || budget;
    const cuisineLabel = cuisinePrefs.map(c => CUISINE_OPTIONS.find(o => o.value === c)?.label || c).join(", ");
    const prepLabel = PREP_TIME_OPTIONS.find(p => p.value === mealPrepTimeLimit)?.label || mealPrepTimeLimit;
    const parts = [
      `Dietary restrictions: ${dietLabel}`,
      `Family size: ${familySize} people`,
      `Weekly budget: ${budgetLabel}`,
      `Days to plan: ${daysOfWeek.join(", ")}`,
      `Cuisine preferences: ${cuisineLabel}`,
      `Max meal prep time: ${prepLabel}`,
    ];
    if (ingredientsOnHand.trim()) parts.push(`Ingredients already on hand: ${ingredientsOnHand.trim()}`);
    if (typeof calorieGoal === "number") parts.push(`Calorie goal per person per day: ${calorieGoal}`);
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
    if (!budget || daysOfWeek.length === 0 || dietaryRestrictions.length === 0) return;
    if (typeof familySize !== "number" || familySize < 1) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentPlan(null);
    setGenerationProgress("");

    const context = buildContext();
    let allRawText = "";
    let mealPlanContent = "";
    let recipesContent = "";
    let groceryListContent = "";
    let nutritionSummaryContent = "";

    try {
      setGenerationProgress("Planning your meals... (1/4)");
      setStreamingText("--- Planning your meals... ---");

      const mealPlanPrompt = `Create a meal plan for the following requirements:

${context}

Write a ${daysOfWeek.length}-day meal plan with breakfast, lunch, and dinner for each day (${daysOfWeek.join(", ")}). Include portion sizes for ${familySize} people. Keep meals simple and budget-friendly.

Meal Plan:`;

      const mealPlanResult = await generateSection(mealPlanPrompt, 800, 0.6);
      mealPlanContent = mealPlanResult.trim();
      allRawText = `MEAL PLAN:\n${mealPlanContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Writing recipes... (2/4)");
      setStreamingText(allRawText + "\n\n--- Writing recipes... ---");

      const recipesPrompt = `Write 3-5 key recipes from this meal plan:

${mealPlanContent.slice(0, 600)}

Requirements: ${context}

For each recipe: name, ingredients with quantities, cook time, brief instructions. Only include recipes from the meal plan above.

Recipes:`;

      const recipesResult = await generateSection(recipesPrompt, 800, 0.6);
      recipesContent = recipesResult.trim();
      allRawText += `\n\nRECIPES:\n${recipesContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Building grocery list... (3/4)");
      setStreamingText(allRawText + "\n\n--- Building grocery list... ---");

      const groceryPrompt = `Create a grocery list for these recipes:

${recipesContent.slice(0, 600)}

Organize by aisle: Produce, Proteins, Dairy, Grains, Pantry, Frozen, Other. Quantities for ${familySize} people, ${daysOfWeek.length} days.${ingredientsOnHand ? ` Skip items already on hand: ${ingredientsOnHand}` : ""}

Grocery List:`;

      const groceryResult = await generateSection(groceryPrompt, 600, 0.5);
      groceryListContent = groceryResult.trim();
      allRawText += `\n\nGROCERY LIST:\n${groceryListContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Calculating nutrition... (4/4)");
      setStreamingText(allRawText + "\n\n--- Calculating nutrition... ---");

      const nutritionPrompt = `Nutrition summary for this meal plan:

${mealPlanContent.slice(0, 400)}

Diet: ${dietaryRestrictions.join(", ")}. Family: ${familySize}.${typeof calorieGoal === "number" ? ` Target: ${calorieGoal} cal/day.` : ""}

Provide: estimated daily calories per person, macro breakdown (protein/carbs/fat in grams), and a brief "Why This Plan Works" paragraph.

Nutrition Summary:`;

      const nutritionResult = await generateSection(nutritionPrompt, 500, 0.6);
      nutritionSummaryContent = nutritionResult.trim();
      allRawText += `\n\nNUTRITION SUMMARY:\n${nutritionSummaryContent}`;
      setStreamingText(allRawText);

      const plan: MealPlan = {
        id: generateId(),
        dietaryRestrictions,
        familySize: typeof familySize === "number" ? familySize : 2,
        budget,
        ingredientsOnHand,
        daysOfWeek,
        cuisinePrefs,
        calorieGoal: typeof calorieGoal === "number" ? calorieGoal : null,
        mealPrepTimeLimit,
        mealPlanContent,
        groceryList: groceryListContent,
        nutritionSummary: nutritionSummaryContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentPlan(plan);
      saveMealPlan(plan);
    } catch (err) {
      console.error("Generation error:", err);
      if (mealPlanContent) {
        const partial: MealPlan = {
          id: generateId(),
          dietaryRestrictions,
          familySize: typeof familySize === "number" ? familySize : 2,
          budget,
          ingredientsOnHand,
          daysOfWeek,
          cuisinePrefs,
          calorieGoal: typeof calorieGoal === "number" ? calorieGoal : null,
          mealPrepTimeLimit,
          mealPlanContent,
          groceryList: groceryListContent,
          nutritionSummary: nutritionSummaryContent,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentPlan(partial);
        saveMealPlan(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    typeof familySize === "number" && familySize >= 1 &&
    budget.length > 0 &&
    dietaryRestrictions.length > 0 &&
    daysOfWeek.length > 0 &&
    !isGenerating;

  const hasOutput = currentPlan && (currentPlan.mealPlanContent || currentPlan.rawText);

  const dietLabel = dietaryRestrictions.map(d => DIETARY_OPTIONS.find(o => o.value === d)?.label || d).join(", ");
  const budgetLabel = BUDGET_OPTIONS.find(b => b.value === budget)?.label || budget;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-meal-planner-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Restrictions * (select one or more)</label>
            <div className="flex flex-wrap gap-2" data-testid="container-dietary-options">
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-dietary-${opt.value}`}
                  onClick={() => toggleDietary(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    dietaryRestrictions.includes(opt.value)
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="family-size-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Family Size *
              </label>
              <input
                id="family-size-input"
                data-testid="input-family-size"
                type="number"
                min={1}
                max={10}
                value={familySize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") { setFamilySize(""); return; }
                  const num = parseInt(val);
                  if (!isNaN(num)) setFamilySize(num);
                }}
                onBlur={() => {
                  if (typeof familySize === "number") {
                    if (familySize < 1) setFamilySize(1);
                    else if (familySize > 10) setFamilySize(10);
                  } else {
                    setFamilySize(2);
                  }
                }}
                placeholder="1-10"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="budget-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Budget Per Week *
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
            <label htmlFor="ingredients-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Ingredients On Hand (optional)
            </label>
            <textarea
              id="ingredients-input"
              data-testid="input-ingredients"
              value={ingredientsOnHand}
              onChange={(e) => setIngredientsOnHand(e.target.value.slice(0, MAX_INGREDIENTS_CHARS))}
              placeholder="List ingredients you already have, e.g., rice, chicken breast, olive oil, garlic..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-ingredients-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {ingredientsOnHand.length}/{MAX_INGREDIENTS_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Days to Plan * (select at least 1)</label>
            <div className="flex flex-wrap gap-2" data-testid="container-days-options">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  data-testid={`button-day-${day.value}`}
                  onClick={() => toggleDay(day.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    daysOfWeek.includes(day.value)
                      ? "bg-blue-100 text-blue-700 border-blue-300 ring-1 ring-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cuisine Preferences (select one or more)</label>
            <div className="flex flex-wrap gap-2" data-testid="container-cuisine-options">
              {CUISINE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-cuisine-${opt.value}`}
                  onClick={() => toggleCuisine(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    cuisinePrefs.includes(opt.value)
                      ? "bg-orange-100 text-orange-700 border-orange-300 ring-1 ring-orange-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-orange-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="calorie-goal-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Calorie Goal Per Person Per Day (optional)
            </label>
            <input
              id="calorie-goal-input"
              data-testid="input-calorie-goal"
              type="number"
              min={1200}
              max={4000}
              value={calorieGoal}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") { setCalorieGoal(""); return; }
                const num = parseInt(val);
                if (!isNaN(num)) setCalorieGoal(num);
              }}
              onBlur={() => {
                if (typeof calorieGoal === "number") {
                  if (calorieGoal < 1200) setCalorieGoal(1200);
                  else if (calorieGoal > 4000) setCalorieGoal(4000);
                }
              }}
              placeholder="e.g. 2000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Meal Prep Time Limit</label>
            <div className="flex flex-wrap gap-2" data-testid="container-prep-time-options">
              {PREP_TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-prep-${opt.value}`}
                  onClick={() => setMealPrepTimeLimit(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    mealPrepTimeLimit === opt.value
                      ? "bg-violet-100 text-violet-700 border-violet-300 ring-1 ring-violet-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
                <><Loader2 className="w-5 h-5 animate-spin" />Planning your meals...</>
              ) : (
                <><UtensilsCrossed className="w-5 h-5" />Generate Meal Plan (Privately)</>
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
              {generationProgress || "Planning your meals... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentPlan && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Your Meal Plan</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {dietLabel} — {daysOfWeek.length} days — {budgetLabel}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentPlan.rawText, "all")}
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
            <div data-testid="stat-diet" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <UtensilsCrossed className="w-3.5 h-3.5" /> {dietLabel}
            </div>
            <div data-testid="stat-family-size" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Users className="w-3.5 h-3.5" /> {currentPlan.familySize} {currentPlan.familySize === 1 ? "person" : "people"}
            </div>
            <div data-testid="stat-budget" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <DollarSign className="w-3.5 h-3.5" /> {BUDGET_OPTIONS.find(b => b.value === currentPlan.budget)?.label || currentPlan.budget}
            </div>
            <div data-testid="stat-days" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Calendar className="w-3.5 h-3.5" /> {currentPlan.daysOfWeek.length} days
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentPlan.mealPlanContent && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-meal-plan">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-meal-plan">Meal Plan</h3>
                </div>
                <button
                  data-testid="button-copy-meal-plan"
                  onClick={() => copyToClipboard(currentPlan.mealPlanContent, "meal-plan")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "meal-plan" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "meal-plan" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "meal-plan" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-meal-plan">
                  {currentPlan.mealPlanContent}
                </p>
              </div>
            </div>
          )}

          {currentPlan.rawText.includes("RECIPES:") && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-recipes">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-recipes">Recipes</h3>
                </div>
                <button
                  data-testid="button-copy-recipes"
                  onClick={() => {
                    const recipesText = currentPlan.rawText.split("RECIPES:\n")[1]?.split("\n\nGROCERY LIST:")[0] || "";
                    copyToClipboard(recipesText.trim(), "recipes");
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "recipes" ? "bg-emerald-100 text-emerald-700" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {copiedId === "recipes" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "recipes" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-green-50/50 border border-green-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-recipes">
                  {currentPlan.rawText.split("RECIPES:\n")[1]?.split("\n\nGROCERY LIST:")[0]?.trim() || ""}
                </p>
              </div>
            </div>
          )}

          {currentPlan.groceryList && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-grocery-list">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-grocery-list">Grocery List</h3>
                </div>
                <button
                  data-testid="button-copy-grocery"
                  onClick={() => copyToClipboard(currentPlan.groceryList, "grocery")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "grocery" ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {copiedId === "grocery" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "grocery" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-grocery-list">
                  {currentPlan.groceryList}
                </p>
              </div>
            </div>
          )}

          {currentPlan.nutritionSummary && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-nutrition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-nutrition">Nutrition Summary</h3>
                </div>
                <button
                  data-testid="button-copy-nutrition"
                  onClick={() => copyToClipboard(currentPlan.nutritionSummary, "nutrition")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "nutrition" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "nutrition" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "nutrition" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-nutrition">
                  {currentPlan.nutritionSummary}
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
