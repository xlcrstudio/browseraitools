import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Heart,
  Sparkles, Camera, MessageCircle, Flame,
  Smile, Zap, Brain, Mountain, Coffee, Briefcase
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useDatingProfileStorage,
  type DatingProfile,
} from "@/hooks/use-dating-profile-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const GENDER_OPTIONS = [
  { value: "man", label: "Man" },
  { value: "woman", label: "Woman" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

const APP_OPTIONS = [
  { value: "tinder", label: "Tinder", color: "bg-rose-100 text-rose-700 border-rose-300 ring-rose-200" },
  { value: "bumble", label: "Bumble", color: "bg-amber-100 text-amber-700 border-amber-300 ring-amber-200" },
  { value: "hinge", label: "Hinge", color: "bg-violet-100 text-violet-700 border-violet-300 ring-violet-200" },
];

const VIBE_OPTIONS = [
  { value: "funny-playful", label: "Funny & Playful", icon: Smile, description: "Humor-first, lighthearted energy" },
  { value: "flirty-confident", label: "Flirty & Confident", icon: Flame, description: "Bold, charismatic, self-assured" },
  { value: "deep-thoughtful", label: "Deep & Thoughtful", icon: Brain, description: "Introspective, meaningful connections" },
  { value: "adventurous-active", label: "Adventurous & Active", icon: Mountain, description: "Outdoorsy, spontaneous, thrill-seeking" },
  { value: "chill-easygoing", label: "Chill & Easygoing", icon: Coffee, description: "Relaxed, low-key, go-with-the-flow" },
  { value: "professional-fun", label: "Professional but Fun", icon: Briefcase, description: "Ambitious yet knows how to unwind" },
];

const TONE_OPTIONS = [
  { value: "funny", label: "Funny" },
  { value: "flirty", label: "Flirty" },
  { value: "witty", label: "Witty" },
  { value: "genuine", label: "Genuine" },
];

const MAX_PROMPTS_CHARS = 500;
const MAX_INTERESTS_CHARS = 300;
const MAX_LOOKING_FOR_CHARS = 200;
const MAX_PHOTO_CHARS = 500;

const SYSTEM_PROMPT = `You are an expert dating profile writer who creates authentic, engaging profiles that get matches. Rules:
- Write in first person, conversational tone matching the requested vibe.
- Be specific and original — avoid generic phrases like "love to laugh" or "partner in crime."
- Tailor content for the specific dating app(s) mentioned.
- Keep bios concise but personality-packed.
- Opening lines should be creative conversation starters, not pickup lines.
- Photo captions should be witty and add context to the photo.
- Never use emojis. Never be creepy or inappropriate.
- Write exactly what is requested — no meta-commentary or instructions.`;

export function DatingProfileGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveDatingProfile } = useDatingProfileStorage();

  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [vibe, setVibe] = useState("");
  const [prompts, setPrompts] = useState("");
  const [interests, setInterests] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [photoDescriptions, setPhotoDescriptions] = useState("");
  const [tone, setTone] = useState("witty");
  const [includeOpeningLines, setIncludeOpeningLines] = useState(true);
  const [includePhotoCaptions, setIncludePhotoCaptions] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentProfile, setCurrentProfile] = useState<DatingProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleApp = (app: string) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleReset = () => {
    setAge("");
    setGender("");
    setSelectedApps([]);
    setVibe("");
    setPrompts("");
    setInterests("");
    setLookingFor("");
    setPhotoDescriptions("");
    setTone("witty");
    setIncludeOpeningLines(true);
    setIncludePhotoCaptions(true);
    setStreamingText("");
    setCurrentProfile(null);
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
    const appNames = selectedApps.map(a => APP_OPTIONS.find(o => o.value === a)?.label || a).join(", ");
    const vibeLabel = VIBE_OPTIONS.find(v => v.value === vibe)?.label || vibe;
    const parts = [
      `Age: ${age}`,
      `Gender: ${GENDER_OPTIONS.find(g => g.value === gender)?.label || gender}`,
      `Dating app(s): ${appNames}`,
      `Vibe/personality: ${vibeLabel}`,
      `Tone: ${tone}`,
    ];
    if (interests) parts.push(`Interests/hobbies: ${interests}`);
    if (lookingFor) parts.push(`Looking for: ${lookingFor}`);
    return parts.join("\n");
  };

  const generateSection = async (sectionPrompt: string, maxTokens: number): Promise<string> => {
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sectionPrompt },
      ],
      temperature: 0.6,
      maxTokens,
      onChunk: (text) => setStreamingText(text),
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!age || age < 18 || !gender || selectedApps.length === 0 || !vibe) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentProfile(null);
    setGenerationProgress("");

    const context = buildContext();
    const appNames = selectedApps.map(a => APP_OPTIONS.find(o => o.value === a)?.label || a).join(", ");
    let allRawText = "";
    let profileContent = "";
    let openingLinesText = "";
    let photoCaptionsText = "";

    const hasPrompts = prompts.trim().length > 0;
    const hasPhotos = photoDescriptions.trim().length > 0;
    const shouldGenerateOpeners = includeOpeningLines;
    const shouldGenerateCaptions = includePhotoCaptions && hasPhotos;

    let totalSteps = 1;
    if (hasPrompts) totalSteps++;
    if (shouldGenerateOpeners) totalSteps++;
    if (shouldGenerateCaptions) totalSteps++;
    let currentStep = 0;

    try {
      currentStep++;
      setGenerationProgress(`Crafting your bio... (${currentStep}/${totalSteps})`);
      setStreamingText("--- Crafting your bio... ---");

      const bioPrompt = `Write a dating profile bio for ${appNames}.

${context}

Write a compelling, authentic bio that:
- Fits the ${tone} tone and ${VIBE_OPTIONS.find(v => v.value === vibe)?.label} vibe
- Is optimized for ${appNames} (appropriate length and style for ${selectedApps.length > 1 ? "each app" : "the app"})
- Shows personality without being generic
- Is 3-5 sentences for Tinder/Bumble style, or slightly longer for Hinge
${selectedApps.length > 1 ? `\nWrite a separate version for each app, labeled clearly.` : ""}

Profile Bio:`;

      const bioResult = await generateSection(bioPrompt, 800);
      profileContent = bioResult.trim();
      allRawText = `PROFILE BIO:\n${profileContent}`;
      setStreamingText(allRawText);

      if (hasPrompts) {
        currentStep++;
        setGenerationProgress(`Answering prompts... (${currentStep}/${totalSteps})`);
        setStreamingText(allRawText + "\n\n--- Answering prompts... ---");

        const promptsPrompt = `Answer these dating app prompts for a ${age}-year-old ${GENDER_OPTIONS.find(g => g.value === gender)?.label || gender} on ${appNames}.

${context}

Prompts to answer:
${prompts}

Write creative, ${tone} answers that match the ${VIBE_OPTIONS.find(v => v.value === vibe)?.label} vibe. Each answer should be 1-3 sentences. Label each prompt and its answer.

Prompt Answers:`;

        const promptResult = await generateSection(promptsPrompt, 800);
        allRawText += `\n\nPROMPT ANSWERS:\n${promptResult.trim()}`;
        setStreamingText(allRawText);
      }

      if (shouldGenerateOpeners) {
        currentStep++;
        setGenerationProgress(`Writing opening lines... (${currentStep}/${totalSteps})`);
        setStreamingText(allRawText + "\n\n--- Writing opening lines... ---");

        const openersPrompt = `Write 5-7 creative opening lines / conversation starters for ${appNames}.

${context}

These should be:
- Original and engaging conversation starters (not pickup lines)
- Match the ${tone} tone
- Work well on ${appNames}
- Easy to customize for different matches
- One per line, no numbering

Opening Lines:`;

        const openersResult = await generateSection(openersPrompt, 600);
        openingLinesText = openersResult.trim();
        allRawText += `\n\nOPENING LINES:\n${openingLinesText}`;
        setStreamingText(allRawText);
      }

      if (shouldGenerateCaptions) {
        currentStep++;
        setGenerationProgress(`Creating photo captions... (${currentStep}/${totalSteps})`);
        setStreamingText(allRawText + "\n\n--- Creating photo captions... ---");

        const captionsPrompt = `Write witty photo captions for a dating profile on ${appNames}.

${context}

Photo descriptions:
${photoDescriptions}

Write a short, ${tone} caption for each photo described. Each caption should add personality and context. Label each caption to match the photo it's for.

Photo Captions:`;

        const captionsResult = await generateSection(captionsPrompt, 500);
        photoCaptionsText = captionsResult.trim();
        allRawText += `\n\nPHOTO CAPTIONS:\n${photoCaptionsText}`;
        setStreamingText(allRawText);
      }

      const profile: DatingProfile = {
        id: generateId(),
        age: typeof age === "number" ? age : 0,
        gender,
        apps: selectedApps,
        vibe,
        prompts,
        interests,
        lookingFor,
        photoDescriptions,
        tone,
        profileContent,
        openingLines: openingLinesText,
        photoCaptions: photoCaptionsText,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentProfile(profile);
      saveDatingProfile(profile);
    } catch (err) {
      console.error("Generation error:", err);
      if (profileContent) {
        const partial: DatingProfile = {
          id: generateId(),
          age: typeof age === "number" ? age : 0,
          gender,
          apps: selectedApps,
          vibe,
          prompts,
          interests,
          lookingFor,
          photoDescriptions,
          tone,
          profileContent,
          openingLines: openingLinesText,
          photoCaptions: photoCaptionsText,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentProfile(partial);
        saveDatingProfile(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    typeof age === "number" && age >= 18 &&
    gender.length > 0 &&
    selectedApps.length > 0 &&
    vibe.length > 0 &&
    !isGenerating;

  const parseLines = (text: string): string[] => {
    return text.split("\n").map(l => l.trim()).filter(l => l.length > 5);
  };

  const hasOutput = currentProfile && (currentProfile.profileContent || currentProfile.rawText);

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-dating-profile-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Age *
              </label>
              <input
                id="age-input"
                data-testid="input-age"
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") { setAge(""); return; }
                  const num = parseInt(val);
                  if (!isNaN(num)) setAge(num);
                }}
                onBlur={() => {
                  if (typeof age === "number") {
                    if (age < 18) setAge(18);
                    else if (age > 99) setAge(99);
                  }
                }}
                placeholder="18-99"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="gender-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Gender *
              </label>
              <select
                id="gender-select"
                data-testid="select-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                <option value="">Select gender...</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dating Apps * (select one or more)</label>
            <div className="flex flex-wrap gap-2" data-testid="container-app-options">
              {APP_OPTIONS.map((app) => (
                <button
                  key={app.value}
                  data-testid={`button-app-${app.value}`}
                  onClick={() => toggleApp(app.value)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-sm font-semibold border transition-all",
                    selectedApps.includes(app.value)
                      ? `${app.color} ring-1`
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {app.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vibe / Personality *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="container-vibe-options">
              {VIBE_OPTIONS.map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.value}
                    data-testid={`button-vibe-${v.value}`}
                    onClick={() => setVibe(v.value)}
                    className={cn(
                      "flex flex-col items-start gap-1 px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      vibe === v.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{v.label}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">{v.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="prompts-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Dating Prompts (optional)
            </label>
            <textarea
              id="prompts-input"
              data-testid="input-prompts"
              value={prompts}
              onChange={(e) => setPrompts(e.target.value.slice(0, MAX_PROMPTS_CHARS))}
              placeholder="Paste the prompts your app gave you or describe what you want to say..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <span data-testid="text-prompts-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {prompts.length}/{MAX_PROMPTS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="interests-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Interests / Hobbies (optional)
            </label>
            <input
              id="interests-input"
              data-testid="input-interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value.slice(0, MAX_INTERESTS_CHARS))}
              placeholder="e.g., hiking, cooking, photography, live music, travel"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <span data-testid="text-interests-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {interests.length}/{MAX_INTERESTS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="looking-for-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What You're Looking For (optional)
            </label>
            <input
              id="looking-for-input"
              data-testid="input-looking-for"
              type="text"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value.slice(0, MAX_LOOKING_FOR_CHARS))}
              placeholder="e.g., Something serious, casual dating, someone adventurous"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <span data-testid="text-looking-for-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {lookingFor.length}/{MAX_LOOKING_FOR_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="photo-descriptions-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Photo Descriptions (optional)
            </label>
            <textarea
              id="photo-descriptions-input"
              data-testid="input-photo-descriptions"
              value={photoDescriptions}
              onChange={(e) => setPhotoDescriptions(e.target.value.slice(0, MAX_PHOTO_CHARS))}
              placeholder="Describe your photos for AI-generated captions, e.g., 'Me hiking at sunset', 'Group photo at a concert', 'With my dog at the beach'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <span data-testid="text-photos-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {photoDescriptions.length}/{MAX_PHOTO_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone</label>
            <div className="flex flex-wrap gap-2" data-testid="container-tone-options">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  data-testid={`button-tone-${t.value}`}
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    tone === t.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/30">
              <div>
                <span className="text-sm font-medium text-slate-700">Include Opening Lines</span>
                <p className="text-xs text-slate-400 mt-0.5">Generate 5-7 creative conversation starters</p>
              </div>
              <button
                data-testid="toggle-opening-lines"
                onClick={() => setIncludeOpeningLines(!includeOpeningLines)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  includeOpeningLines ? "bg-purple-500" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  includeOpeningLines && "translate-x-5"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/30">
              <div>
                <span className="text-sm font-medium text-slate-700">Include Photo Captions</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {photoDescriptions.trim().length > 0
                    ? "Generate witty captions for your photos"
                    : "Add photo descriptions above to enable this"
                  }
                </p>
              </div>
              <button
                data-testid="toggle-photo-captions"
                onClick={() => setIncludePhotoCaptions(!includePhotoCaptions)}
                disabled={photoDescriptions.trim().length === 0}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  includePhotoCaptions && photoDescriptions.trim().length > 0 ? "bg-purple-500" : "bg-slate-300",
                  photoDescriptions.trim().length === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  includePhotoCaptions && photoDescriptions.trim().length > 0 && "translate-x-5"
                )} />
              </button>
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
                  ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Crafting your profile...</>
              ) : (
                <><Heart className="w-5 h-5" />Generate Profile (Privately)</>
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
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600" data-testid="text-generation-progress">
              {generationProgress || "Crafting your profile... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentProfile && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Dating Profile</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentProfile.apps.map(a => APP_OPTIONS.find(o => o.value === a)?.label || a).join(", ")} — {VIBE_OPTIONS.find(v => v.value === currentProfile.vibe)?.label || currentProfile.vibe}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentProfile.rawText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <InlineShareButtons />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-apps" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Sparkles className="w-3.5 h-3.5" /> {currentProfile.apps.map(a => APP_OPTIONS.find(o => o.value === a)?.label || a).join(", ")}
            </div>
            <div data-testid="stat-vibe" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Flame className="w-3.5 h-3.5" /> {VIBE_OPTIONS.find(v => v.value === currentProfile.vibe)?.label || currentProfile.vibe}
            </div>
            {currentProfile.openingLines && (
              <div data-testid="stat-openers" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <MessageCircle className="w-3.5 h-3.5" /> Opening lines included
              </div>
            )}
            {currentProfile.photoCaptions && (
              <div data-testid="stat-captions" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <Camera className="w-3.5 h-3.5" /> Photo captions included
              </div>
            )}
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-profile-bio">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800" data-testid="heading-profile-bio">Profile Bio</h3>
              </div>
              <button
                data-testid="button-copy-bio"
                onClick={() => copyToClipboard(currentProfile.profileContent, "bio")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                  copiedId === "bio" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "bio" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === "bio" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-profile-bio">
                {currentProfile.profileContent}
              </p>
            </div>
          </div>

          {currentProfile.openingLines && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-opening-lines">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-opening-lines">Opening Lines</h3>
                </div>
                <button
                  data-testid="button-copy-openers"
                  onClick={() => copyToClipboard(currentProfile.openingLines, "openers")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "openers" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "openers" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "openers" ? "Copied" : "Copy All"}
                </button>
              </div>
              <div className="space-y-2">
                {parseLines(currentProfile.openingLines).map((line, idx) => (
                  <div
                    key={idx}
                    data-testid={`text-opener-${idx}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 group"
                  >
                    <span className="flex-1 text-sm text-slate-700">{line}</span>
                    <button
                      data-testid={`button-copy-opener-${idx}`}
                      onClick={() => copyToClipboard(line, `opener-${idx}`)}
                      className={cn(
                        "shrink-0 p-1.5 rounded-lg text-xs transition-all",
                        copiedId === `opener-${idx}` ? "bg-emerald-100 text-emerald-700" : "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                      )}
                    >
                      {copiedId === `opener-${idx}` ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentProfile.photoCaptions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-photo-captions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-photo-captions">Photo Captions</h3>
                </div>
                <button
                  data-testid="button-copy-captions"
                  onClick={() => copyToClipboard(currentProfile.photoCaptions, "captions")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "captions" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "captions" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "captions" ? "Copied" : "Copy All"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-photo-captions">
                  {currentProfile.photoCaptions}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
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
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700" data-testid="text-engine-status">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
