import { useState } from "react";
import {
  Plane, Dumbbell, Palette, Briefcase, Shirt, Sparkles as SparklesIcon,
  UtensilsCrossed, Camera, Monitor, Music2, BookOpen, Home, PawPrint, Trophy,
  Users, Leaf, Gamepad2, PenTool, Film, Coins, Globe, Wrench, Theater, Building2,
  ChevronDown, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw,
  Smartphone, Heart,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useIGBioStorage, type IGBioResult } from "@/hooks/use-ig-bio-storage";
import { Badge } from "@/components/ui/badge";

const NICHES = [
  { value: "Travel", icon: Plane },
  { value: "Fitness & Health", icon: Dumbbell },
  { value: "Art & Design", icon: Palette },
  { value: "Business", icon: Briefcase },
  { value: "Fashion & Style", icon: Shirt },
  { value: "Beauty & Makeup", icon: SparklesIcon },
  { value: "Food & Cooking", icon: UtensilsCrossed },
  { value: "Photography", icon: Camera },
  { value: "Tech & Software", icon: Monitor },
  { value: "Music & Entertainment", icon: Music2 },
  { value: "Education", icon: BookOpen },
  { value: "Lifestyle & Home", icon: Home },
  { value: "Pets & Animals", icon: PawPrint },
  { value: "Sports & Athletics", icon: Trophy },
  { value: "Parenting & Family", icon: Users },
  { value: "Wellness & Mindfulness", icon: Leaf },
  { value: "Gaming", icon: Gamepad2 },
  { value: "Writing & Content", icon: PenTool },
  { value: "Video & Film", icon: Film },
  { value: "Finance & Investing", icon: Coins },
  { value: "Sustainability", icon: Globe },
  { value: "DIY & Crafts", icon: Wrench },
  { value: "Personal Brand", icon: Theater },
  { value: "Company/Brand", icon: Building2 },
] as const;

const BIO_STYLES = [
  { value: "Professional", label: "Professional", description: "Polished and credible - B2B focused" },
  { value: "Fun", label: "Fun & Playful", description: "Energetic and approachable" },
  { value: "Aesthetic", label: "Aesthetic/Minimal", description: "Clean, artistic, trendy" },
  { value: "Friendly", label: "Friendly & Approachable", description: "Warm and relatable" },
  { value: "Motivational", label: "Motivational", description: "Empowering and uplifting" },
  { value: "Direct", label: "Direct & Clear", description: "Straightforward and informative" },
] as const;

const EMOJI_LEVELS = [
  { value: "Lots", label: "Lots", detail: "Multiple emojis, visual appeal" },
  { value: "Moderate", label: "Moderate", detail: "Strategic placement" },
  { value: "Minimal", label: "Minimal", detail: "1-2 emojis only" },
  { value: "None", label: "None", detail: "Text only, no emojis" },
] as const;

const INCLUDE_OPTIONS = [
  "Age/year reference",
  "Achievements/credentials",
  "Mission statement",
  "Call-to-action",
  "Contact email",
  "Branded hashtag",
] as const;

const SYSTEM_PROMPT = `You are a social media branding expert specializing in Instagram profile optimization and personal branding. You create Instagram bios that capture personality in 150 characters, are immediately clear and engaging, use emojis strategically, include proper line breaks for readability, match the user's niche and audience, stand out from generic bios, include relevant calls-to-action, and drive profile engagement. You understand Instagram's character limit (150 chars), different bio styles, niche-specific language, what makes bios memorable, and how to optimize for different goals.`;

interface ParsedBio {
  label: string;
  text: string;
  charCount: number;
  lineCount: number;
  emojiCount: number;
}

function countEmojis(text: string): number {
  try {
    const segments = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)];
    return segments.filter((s) => /\p{Emoji_Presentation}/u.test(s.segment)).length;
  } catch {
    const basic = text.match(/[\u2600-\u27BF\uFE0F]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    return basic ? basic.length : 0;
  }
}

function getCharColor(count: number) {
  if (count <= 130) return "text-green-600 dark:text-green-400";
  if (count <= 150) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export function IGBioGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveBio, deleteBio } = useIGBioStorage();

  const [name, setName] = useState("");
  const [whatYouDo, setWhatYouDo] = useState("");
  const [niche, setNiche] = useState("Personal Brand");
  const [bioStyle, setBioStyle] = useState("Friendly");
  const [emojiUsage, setEmojiUsage] = useState("Moderate");
  const [location, setLocation] = useState("");
  const [locationPin, setLocationPin] = useState(false);
  const [uniqueQualities, setUniqueQualities] = useState("");
  const [includeElements, setIncludeElements] = useState<string[]>([]);
  const [linkInBioText, setLinkInBioText] = useState("");
  const [useLineBreaks, setUseLineBreaks] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [bios, setBios] = useState<ParsedBio[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const canGenerate = name.trim() && whatYouDo.trim() && niche && bioStyle;

  const toggleElement = (el: string) => {
    setIncludeElements((prev) =>
      prev.includes(el) ? prev.filter((e) => e !== el) : [...prev, el]
    );
  };

  const toggleFavorite = (idx: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleReset = () => {
    setName("");
    setWhatYouDo("");
    setNiche("Personal Brand");
    setBioStyle("Friendly");
    setEmojiUsage("Moderate");
    setLocation("");
    setLocationPin(false);
    setUniqueQualities("");
    setIncludeElements([]);
    setLinkInBioText("");
    setUseLineBreaks(true);
    setUseSymbols(false);
    setAdvancedOpen(false);
    setStreamingText("");
    setBios([]);
    setCopiedIdx(null);
    setCopiedAll(false);
    setFavorites(new Set());
  };

  const copyBio = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(
        bios.map((b, i) => `--- BIO ${i + 1}: ${b.label} ---\n${b.text}`).join("\n\n")
      );
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const STYLE_MAP: Record<string, string> = {
    Professional: "Polished and credible, B2B focused, clear value proposition, industry-appropriate",
    Fun: "Energetic, personality-driven, playful humor, approachable",
    Aesthetic: "Clean artistic feel, poetic minimal language, trendy lowercase style",
    Friendly: "Warm, welcoming, builds connection, personal introduction",
    Motivational: "Empowering, uplifting, inspiring action, coach-like",
    Direct: "Straightforward, informative, bullet-style, easy to scan",
  };

  const getStyleVariants = (): [string, string][] => {
    const selectedGuide = STYLE_MAP[bioStyle] || STYLE_MAP["Friendly"];
    const allStyles: [string, string][] = [
      [`${bioStyle} (Primary)`, selectedGuide],
      ["Friendly & Engaging", "Warm, approachable, personality-driven with a welcoming tone"],
      ["Professional & Polished", "Credible, clear value proposition, industry-appropriate with credentials"],
      ["Aesthetic & Minimal", "Clean artistic feel, poetic minimal language, trendy lowercase style"],
      ["Direct & Action-Oriented", "Bullet-style, easy to scan, multiple value propositions with clear CTA"],
      ["Story-Driven & Personal", "Mini transformation story, relatable personal introduction, conversational"],
    ];
    const filtered = allStyles.filter((s) => !s[0].startsWith(bioStyle));
    return [allStyles[0], ...filtered.slice(0, 4)];
  };

  const buildPrompt = (styleName: string, styleGuide: string) => {
    const locationLine = location.trim()
      ? `\nLocation: ${location.trim()}${locationPin ? " (include a location pin at the start of the location line)" : ""}`
      : "";
    const uniqueLine = uniqueQualities.trim() ? `\nUnique qualities to highlight: ${uniqueQualities.trim()}` : "";
    const elementsLine = includeElements.length > 0 ? `\nInclude these elements: ${includeElements.join(", ")}` : "";
    const linkLine = linkInBioText.trim() ? `\nLink-in-bio CTA text: "${linkInBioText.trim()}"` : "";
    const symbolLine = useSymbols ? "\nUse symbols like | or & as separators between items" : "";
    const lineBreakLine = useLineBreaks ? "\nUse line breaks to separate different sections of the bio for visual clarity" : "\nKeep everything on as few lines as possible";

    let emojiGuide = "";
    if (emojiUsage === "Lots") emojiGuide = "Use 6-10 emojis generously throughout the bio for maximum visual appeal.";
    else if (emojiUsage === "Moderate") emojiGuide = "Use 3-5 emojis at strategic points to highlight key information.";
    else if (emojiUsage === "Minimal") emojiGuide = "Use only 1-2 emojis, keeping the look clean and professional.";
    else emojiGuide = "Do NOT include any emojis at all. Text only.";

    return `Write ONE Instagram bio for "${name.trim()}".

CRITICAL RULES:
- The bio MUST be under 150 characters total (including spaces, line breaks, and emojis).
- Write the ACTUAL bio text only. No labels, no explanations, no character counts.
- Do NOT write placeholder text or generic filler. Make it specific to this person.

ABOUT THIS PERSON:
Name/Brand: ${name.trim()}
What they do: ${whatYouDo.trim()}
Niche: ${niche}${locationLine}${uniqueLine}${elementsLine}${linkLine}

STYLE: ${styleName} - ${styleGuide}
${emojiGuide}${symbolLine}${lineBreakLine}

Write the Instagram bio now. Output ONLY the bio text, nothing else:`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setBios([]);
    setCopiedIdx(null);
    setCopiedAll(false);
    setFavorites(new Set());

    const results: ParsedBio[] = [];

    const styleVariants = getStyleVariants();

    try {
      for (let i = 0; i < 5; i++) {
        const [styleName, styleGuide] = styleVariants[i];
        setStreamingText(`Generating ${styleName} bio (${i + 1}/5)...`);

        const result = await generateRaw({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildPrompt(styleName, styleGuide, i) },
          ],
          temperature: 0.8,
          maxTokens: 200,
          onChunk: (text) => setStreamingText(`[${styleName} - ${i + 1}/5]\n\n${text}`),
        });

        if (result) {
          let cleaned = result.trim();
          cleaned = cleaned.replace(/^(Bio|BIO|Instagram Bio|Here'?s?.*?bio.*?:)\s*/i, "").trim();
          cleaned = cleaned.replace(/^["']|["']$/g, "").trim();
          cleaned = cleaned.replace(/\nCharacters?:.*$/i, "").trim();
          cleaned = cleaned.replace(/\n\(?\d+\s*\/?\s*150.*$/i, "").trim();

          const charCount = cleaned.length;
          const lineCount = cleaned.split("\n").filter((l) => l.trim()).length;
          const emojiCount = countEmojis(cleaned);

          results.push({
            label: styleName,
            text: cleaned,
            charCount,
            lineCount,
            emojiCount,
          });
          setBios([...results]);
        }
      }

      if (results.length > 0) {
        const record: IGBioResult = {
          id: generateId(),
          name: name.trim(),
          whatYouDo: whatYouDo.trim(),
          niche,
          bioStyle,
          emojiUsage,
          location: location.trim(),
          locationPin,
          uniqueQualities: uniqueQualities.trim(),
          includeElements,
          linkInBioText: linkInBioText.trim(),
          useLineBreaks,
          useSymbols,
          bios: results.map((b) => b.text).join("\n---\n"),
          rawText: results.map((b) => `[${b.label}]\n${b.text}`).join("\n\n===\n\n"),
          createdAt: new Date().toISOString(),
        };
        saveBio(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Generate Your Perfect Instagram Bio
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Name / Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              data-testid="input-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="e.g., Alex, Sarah's Kitchen, TechTips"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              maxLength={50}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{name.length}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What Do You Do? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              data-testid="input-what-you-do"
              value={whatYouDo}
              onChange={(e) => setWhatYouDo(e.target.value.slice(0, 100))}
              placeholder="e.g., Travel photographer, Fitness coach, Coffee shop owner"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              maxLength={100}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{whatYouDo.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Niche / Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" data-testid="container-niche-cards">
              {NICHES.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={niche === value}
                  data-testid={`toggle-niche-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => setNiche(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all text-center",
                    niche === value
                      ? "border-pink-400 dark:border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 ring-1 ring-pink-300 dark:ring-pink-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-pink-300 dark:hover:border-pink-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="leading-tight">{value}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Bio Tone / Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="container-style-cards">
              {BIO_STYLES.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={bioStyle === value}
                  data-testid={`toggle-style-${value.toLowerCase()}`}
                  onClick={() => setBioStyle(value)}
                  className={cn(
                    "flex flex-col items-start px-3 py-3 rounded-xl border text-left transition-all",
                    bioStyle === value
                      ? "border-pink-400 dark:border-pink-500 bg-pink-50 dark:bg-pink-900/30 ring-1 ring-pink-300 dark:ring-pink-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300 dark:hover:border-pink-600"
                  )}
                >
                  <span className={cn("text-sm font-semibold", bioStyle === value ? "text-pink-700 dark:text-pink-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Emoji Usage <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-emoji-cards">
              {EMOJI_LEVELS.map(({ value, label, detail }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={emojiUsage === value}
                  data-testid={`toggle-emoji-${value.toLowerCase()}`}
                  onClick={() => setEmojiUsage(value)}
                  className={cn(
                    "flex flex-col items-center px-3 py-2.5 rounded-xl border text-center transition-all",
                    emojiUsage === value
                      ? "border-pink-400 dark:border-pink-500 bg-pink-50 dark:bg-pink-900/30 ring-1 ring-pink-300 dark:ring-pink-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300 dark:hover:border-pink-600"
                  )}
                >
                  <span className={cn("text-sm font-semibold", emojiUsage === value ? "text-pink-700 dark:text-pink-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Location <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              data-testid="input-location"
              value={location}
              onChange={(e) => setLocation(e.target.value.slice(0, 30))}
              placeholder="e.g., NYC, Los Angeles, Based in Tokyo"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              maxLength={30}
            />
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="toggle-location-pin"
                  checked={locationPin}
                  onChange={(e) => setLocationPin(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Include location pin emoji</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What Makes You Unique? <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              data-testid="input-unique"
              value={uniqueQualities}
              onChange={(e) => setUniqueQualities(e.target.value.slice(0, 150))}
              placeholder="What sets you apart? e.g., 'Featured in Forbes', 'Traveled to 50 countries'"
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
              maxLength={150}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{uniqueQualities.length}/150</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Include in Bio <span className="text-slate-400">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-include-elements">
              {INCLUDE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={includeElements.includes(opt)}
                  data-testid={`toggle-include-${opt.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => toggleElement(opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                    includeElements.includes(opt)
                      ? "border-pink-400 dark:border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-pink-300 dark:hover:border-pink-600"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              data-testid="toggle-advanced"
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Advanced Options
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
            </button>

            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Link in Bio Text
                  </label>
                  <input
                    type="text"
                    data-testid="input-link-text"
                    value={linkInBioText}
                    onChange={(e) => setLinkInBioText(e.target.value)}
                    placeholder="e.g., Check out my latest video, Shop my looks, Free guide below"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid="toggle-line-breaks"
                      checked={useLineBreaks}
                      onChange={(e) => setUseLineBreaks(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-pink-500 focus:ring-pink-400"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Include line breaks (aesthetic formatting)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid="toggle-symbols"
                      checked={useSymbols}
                      onChange={(e) => setUseSymbols(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-pink-500 focus:ring-pink-400"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Use symbols (| & -)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {state !== "ready" && state !== "generating" && (
            <div data-testid="container-engine-status">
              {state === "error" ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50" data-testid="container-error">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700/50" data-testid="container-loading">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
                    <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                      {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
                    </p>
                  </div>
                  <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                      data-testid="bar-engine-progress"
                    />
                  </div>
                  <p className="text-xs text-pink-600 dark:text-pink-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              data-testid="button-generate"
              disabled={!canGenerate || isGenerating || state !== "ready"}
              onClick={handleGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                canGenerate && !isGenerating && state === "ready"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating perfect bios...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate Instagram Bios
                </>
              )}
            </button>
            {(bios.length > 0 || streamingText) && (
              <button
                data-testid="button-reset"
                onClick={handleReset}
                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {isGenerating && streamingText && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating bio options ({bios.length + 1}/5)...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap" data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {bios.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                Your Instagram Bio Options ({bios.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="button-copy-all"
                  onClick={copyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button
                  type="button"
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
            </div>

            {bios.map((bio, idx) => (
              <div
                key={idx}
                data-testid={`card-bio-${idx}`}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{`Bio #${idx + 1}`}</Badge>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{bio.label}</span>
                  </div>
                  <span className={cn("text-sm font-mono font-bold", getCharColor(bio.charCount))} data-testid={`text-char-count-${idx}`}>
                    {bio.charCount}/150
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Instagram Bio Preview</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed" data-testid={`text-bio-preview-${idx}`}>
                        {bio.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
                    <span data-testid={`text-char-info-${idx}`}>Characters: <strong className={getCharColor(bio.charCount)}>{bio.charCount}/150</strong> {bio.charCount <= 150 ? "OK" : "Over limit"}</span>
                    <span>Lines: <strong>{bio.lineCount}</strong></span>
                    <span>Emojis: <strong>{bio.emojiCount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid={`button-copy-bio-${idx}`}
                      onClick={() => copyBio(bio.text, idx)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700/50 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIdx === idx ? "Copied!" : "Copy Bio"}
                    </button>
                    <button
                      type="button"
                      data-testid={`button-favorite-${idx}`}
                      aria-pressed={favorites.has(idx)}
                      onClick={() => toggleFavorite(idx)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                        favorites.has(idx)
                          ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/50"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", favorites.has(idx) && "fill-current")} />
                      Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && !isGenerating && (
          <div className="mt-10" data-testid="container-history">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Generations</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  data-testid={`card-history-${record.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{record.name} - {record.whatYouDo}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{record.niche} | {record.bioStyle} | {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    data-testid={`button-delete-history-${record.id}`}
                    onClick={() => deleteBio(record.id)}
                    className="ml-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
