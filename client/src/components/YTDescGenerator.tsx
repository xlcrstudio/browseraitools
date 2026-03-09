import { useState } from "react";
import {
  BookOpen, Monitor, Film, Briefcase, Gamepad2, Leaf,
  ChevronDown, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw,
  FileText, Newspaper, Package,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useYTDescStorage, type YTDescResult } from "@/hooks/use-yt-desc-storage";
import { Badge } from "@/components/ui/badge";

const VIDEO_TYPES = [
  { value: "Educational", label: "Educational / Tutorial", icon: BookOpen, description: "How-to, guides, teaching" },
  { value: "Review", label: "Review / Comparison", icon: Monitor, description: "Product reviews, comparisons" },
  { value: "Vlog", label: "Vlog / Lifestyle", icon: Film, description: "Daily vlogs, personal stories" },
  { value: "Gaming", label: "Gaming / Entertainment", icon: Gamepad2, description: "Gaming, reactions, comedy" },
  { value: "News", label: "News / Commentary", icon: Newspaper, description: "Current events, analysis" },
  { value: "Unboxing", label: "Unboxing / First Look", icon: Package, description: "Product unboxing, first impressions" },
] as const;

const CHANNEL_TYPES = [
  "Tech/Software", "Business/Finance", "Health/Fitness", "Beauty/Fashion",
  "Food/Cooking", "Travel", "Gaming", "Education", "Lifestyle",
  "Entertainment", "DIY/Crafts", "Music",
] as const;

const DESC_LENGTHS = [
  { value: "Short", label: "Short", detail: "100-150 words", sub: "Concise, direct - for simple videos" },
  { value: "Standard", label: "Standard", detail: "200-300 words", sub: "Balanced - most common" },
  { value: "Detailed", label: "Detailed", detail: "300-500 words", sub: "Comprehensive - for in-depth videos" },
] as const;

const CTA_OPTIONS = [
  "Subscribe to channel",
  "Like the video",
  "Leave a comment",
  "Check out other videos",
  "Visit website",
  "Follow on social media",
] as const;

const SYSTEM_PROMPT = `You are a YouTube SEO specialist and video marketing expert with deep knowledge of YouTube's algorithm and search optimization. You create YouTube descriptions that hook viewers in the first 2 lines, integrate keywords naturally, include clear organized structure, provide strategic timestamps, optimize hashtags (8-15 range), include effective CTAs, format for readability with emojis and bullets, and help videos rank in YouTube search. You understand the importance of the first 150 characters, timestamp benefits for watch time, and hashtag best practices.`;

interface ParsedDescription {
  label: string;
  text: string;
  wordCount: number;
  seoScore: number;
}

function getSeoScoreColor(score: number) {
  if (score >= 8) return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
  if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
  if (score >= 4) return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
}

export function YTDescGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveDesc } = useYTDescStorage();

  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [videoType, setVideoType] = useState("Educational");
  const [channelType, setChannelType] = useState("Tech/Software");
  const [descLength, setDescLength] = useState("Standard");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [numSections, setNumSections] = useState(5);
  const [videoDuration, setVideoDuration] = useState("");
  const [links, setLinks] = useState("");
  const [ctas, setCtas] = useState<string[]>(["Subscribe to channel", "Like the video"]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [channelName, setChannelName] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [descriptions, setDescriptions] = useState<ParsedDescription[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const toggleCta = (cta: string) => {
    setCtas((prev) =>
      prev.includes(cta) ? prev.filter((c) => c !== cta) : [...prev, cta]
    );
  };

  const handleReset = () => {
    setTopic("");
    setSummary("");
    setKeywords("");
    setVideoType("Educational");
    setChannelType("Tech/Software");
    setDescLength("Standard");
    setIncludeTimestamps(true);
    setNumSections(5);
    setVideoDuration("");
    setLinks("");
    setCtas(["Subscribe to channel", "Like the video"]);
    setAdvancedOpen(false);
    setIncludeHashtags(true);
    setIncludeEmoji(true);
    setChannelName("");
    setStreamingText("");
    setDescriptions([]);
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
      await navigator.clipboard.writeText(
        descriptions.map((d, i) => `--- OPTION ${i + 1}: ${d.label} ---\n\n${d.text}`).join("\n\n\n")
      );
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const buildPrompt = (style: string, styleInstruction: string) => {
    const summaryLine = summary.trim() ? `\nVideo Summary: ${summary.trim()}` : "";
    const durationLine = videoDuration.trim() ? ` (total duration: ${videoDuration.trim()})` : "";
    const linksLine = links.trim() ? `\n\nLINKS TO INCLUDE:\n${links.trim()}` : "";
    const ctaLine = ctas.length > 0 ? ctas.join(", ") : "Subscribe and like";
    const channelLine = channelName.trim() ? ` for the channel "${channelName.trim()}"` : "";
    const hashtagLine = includeHashtags ? "\n- End with 8-15 relevant hashtags on one line, space-separated" : "";
    const emojiLine = includeEmoji ? "\n- Use emojis for section headers and bullet points" : "";
    const timestampBlock = includeTimestamps
      ? `\n- Include TIMESTAMPS section with ${numSections} chapters in MM:SS - Topic format, starting at 00:00${durationLine}`
      : "";

    const lengthGuide = descLength === "Short" ? "100-150"
      : descLength === "Detailed" ? "300-500"
      : "200-300";

    return `Write a complete, ready-to-paste YouTube video description${channelLine}.

IMPORTANT CONTEXT - this description MUST be specifically about: "${topic.trim()}". Do NOT write generic or placeholder text. Write the ACTUAL full description.
${summaryLine}
Main Keywords to integrate naturally: ${keywords.trim()}
Video Type: ${videoType} | Channel Type: ${channelType}

STYLE: ${style} - ${styleInstruction}

TARGET LENGTH: ${lengthGuide} words.

REQUIRED STRUCTURE:
- Start with a compelling 2-3 line HOOK that includes the primary keyword and grabs attention
- Add a VALUE PROPOSITION paragraph explaining what viewers will learn
- Include a WHAT'S COVERED section with 4-8 bullet points of key topics${timestampBlock}${linksLine ? "\n- Include a LINKS section with the provided links formatted nicely" : ""}
- Add CALL-TO-ACTION for: ${ctaLine}${hashtagLine}${emojiLine}

Write the complete description now. Do NOT use placeholders or brackets. Write real, specific content about "${topic.trim()}":`;
  };

  const STYLES: [string, string][] = [
    ["SEO-Optimized", "Maximum keyword integration, structured for YouTube search ranking"],
    ["Concise & Direct", "Shorter, punchy, gets straight to the point for quick scanning"],
    ["Comprehensive", "Detailed and thorough, extra context and resources"],
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setDescriptions([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const results: ParsedDescription[] = [];

    try {
      for (let i = 0; i < 3; i++) {
        const [styleName, styleInstruction] = STYLES[i];
        setStreamingText(`Generating ${styleName} description (${i + 1}/3)...`);

        const result = await generateRaw({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildPrompt(styleName, styleInstruction) },
          ],
          temperature: 0.7,
          maxTokens: 1200,
          onChunk: (text) => setStreamingText(`[${styleName} - ${i + 1}/3]\n\n${text}`),
        });

        if (result) {
          const cleaned = result.trim();
          const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
          const hasKeywords = keywords.split(",").some((k) => cleaned.toLowerCase().includes(k.trim().toLowerCase()));
          const seoScore = Math.min(10, 6 + (hasKeywords ? 1.5 : 0) + (cleaned.includes("00:00") ? 0.5 : 0) + (cleaned.includes("#") ? 0.5 : 0) + Math.min(1.5, wordCount / 200));
          results.push({
            label: styleName,
            text: cleaned,
            wordCount,
            seoScore: Math.round(seoScore * 10) / 10,
          });
          setDescriptions([...results]);
        }
      }

      if (results.length > 0) {
        const record: YTDescResult = {
          id: generateId(),
          topic: topic.trim(),
          summary: summary.trim(),
          keywords: keywords.trim(),
          videoType,
          channelType,
          descLength,
          includeTimestamps,
          numSections,
          videoDuration: videoDuration.trim(),
          links: links.trim(),
          ctas,
          includeHashtags,
          includeEmoji,
          channelName: channelName.trim(),
          descriptions: results.map((d) => d.text).join("\n---\n"),
          rawText: results.map((d) => `[${d.label}]\n${d.text}`).join("\n\n===\n\n"),
          createdAt: new Date().toISOString(),
        };
        saveDesc(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating && topic.trim().length > 0 && keywords.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-yt-desc-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="yt-desc-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Video Topic / Title *
            </label>
            <input
              id="yt-desc-topic"
              type="text"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              placeholder="e.g., Best AI Tools for Productivity, Morning Skincare Routine, How to Build a Gaming PC"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">What is your video about?</span>
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/200</span>
            </div>
          </div>

          <div>
            <label htmlFor="yt-desc-summary" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Video Content Summary <span className="text-xs font-normal text-slate-400">(recommended)</span>
            </label>
            <textarea
              id="yt-desc-summary"
              data-testid="input-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, 500))}
              placeholder="Briefly describe what happens in your video, e.g., 'I review 10 AI productivity tools, showing demos of each and comparing features, pricing, and use cases.'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">More detail = better description</span>
              <span data-testid="text-summary-char-count" className="text-xs text-slate-400">{summary.length}/500</span>
            </div>
          </div>

          <div>
            <label htmlFor="yt-desc-keywords" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Main Keywords *
            </label>
            <input
              id="yt-desc-keywords"
              type="text"
              data-testid="input-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 150))}
              placeholder="e.g., AI tools, productivity, automation, workflow"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Keywords viewers might search for (comma-separated)</span>
              <span data-testid="text-keywords-char-count" className="text-xs text-slate-400">{keywords.length}/150</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Video Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="container-video-type">
              {VIDEO_TYPES.map((vt) => {
                const Icon = vt.icon;
                return (
                  <button
                    key={vt.value}
                    data-testid={`toggle-video-type-${vt.value.toLowerCase()}`}
                    aria-pressed={videoType === vt.value}
                    onClick={() => setVideoType(vt.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      videoType === vt.value
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">{vt.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{vt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="yt-desc-channel-type" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Channel Type
            </label>
            <select
              id="yt-desc-channel-type"
              data-testid="select-channel-type"
              value={channelType}
              onChange={(e) => setChannelType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            >
              {CHANNEL_TYPES.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Description Length *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" data-testid="container-desc-length">
              {DESC_LENGTHS.map((dl) => (
                <button
                  key={dl.value}
                  data-testid={`toggle-length-${dl.value.toLowerCase()}`}
                  aria-pressed={descLength === dl.value}
                  onClick={() => setDescLength(dl.value)}
                  className={cn(
                    "p-3 rounded-xl text-left border transition-all",
                    descLength === dl.value
                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{dl.label}</span>
                    <span className="text-xs opacity-70">{dl.detail}</span>
                  </div>
                  <p className="text-xs opacity-70">{dl.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <label htmlFor="toggle-timestamps" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Include Timestamps</label>
              <p className="text-xs text-slate-400 mt-0.5">Auto-generate chapter markers</p>
            </div>
            <button
              id="toggle-timestamps"
              data-testid="toggle-timestamps"
              aria-pressed={includeTimestamps}
              onClick={() => setIncludeTimestamps(!includeTimestamps)}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors shrink-0",
                includeTimestamps ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"
              )}
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                includeTimestamps && "translate-x-5"
              )} />
            </button>
          </div>

          {includeTimestamps && (
            <div className="pl-4 space-y-3">
              <div>
                <label htmlFor="yt-desc-sections" className="block text-sm text-slate-700 dark:text-slate-200 mb-1.5">
                  Number of Sections: <span className="font-semibold">{numSections}</span>
                </label>
                <input
                  id="yt-desc-sections"
                  type="range"
                  data-testid="input-sections"
                  min={3}
                  max={10}
                  value={numSections}
                  onChange={(e) => setNumSections(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>3</span>
                  <span>10</span>
                </div>
              </div>
              <div>
                <label htmlFor="yt-desc-duration" className="block text-sm text-slate-700 dark:text-slate-200 mb-1.5">
                  Video Duration <span className="text-xs font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="yt-desc-duration"
                  type="text"
                  data-testid="input-duration"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value.slice(0, 10))}
                  placeholder="e.g., 15:30"
                  className="w-full max-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="yt-desc-links" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Links to Include <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="yt-desc-links"
              data-testid="input-links"
              value={links}
              onChange={(e) => setLinks(e.target.value.slice(0, 500))}
              placeholder={"Paste links (one per line):\nMy Website: https://example.com\nInstagram: @username\nTwitter: @username"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Call-to-Action
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-ctas">
              {CTA_OPTIONS.map((cta) => (
                <button
                  key={cta}
                  data-testid={`toggle-cta-${cta.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-pressed={ctas.includes(cta)}
                  onClick={() => toggleCta(cta)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    ctas.includes(cta)
                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                  )}
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              data-testid="button-advanced-toggle"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full px-4 py-3 flex items-center justify-between gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/50"
            >
              Advanced Options
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
            </button>
            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700" data-testid="container-advanced-options">
                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-hashtags" className="text-sm text-slate-700 dark:text-slate-200">Include Hashtags (max 15)</label>
                  <button
                    id="toggle-hashtags"
                    data-testid="toggle-hashtags"
                    aria-pressed={includeHashtags}
                    onClick={() => setIncludeHashtags(!includeHashtags)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeHashtags ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeHashtags && "translate-x-5"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-emoji" className="text-sm text-slate-700 dark:text-slate-200">Include Emoji</label>
                  <button
                    id="toggle-emoji"
                    data-testid="toggle-emoji"
                    aria-pressed={includeEmoji}
                    onClick={() => setIncludeEmoji(!includeEmoji)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeEmoji ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeEmoji && "translate-x-5"
                    )} />
                  </button>
                </div>

                <div>
                  <label htmlFor="yt-desc-channel-name" className="block text-sm text-slate-700 dark:text-slate-200 mb-1.5">Channel / Brand Name</label>
                  <input
                    id="yt-desc-channel-name"
                    type="text"
                    data-testid="input-channel-name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value.slice(0, 100))}
                    placeholder="Your Channel Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating optimized description...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate YouTube Description
                </>
              )}
            </button>
            {(descriptions.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating description options ({descriptions.length + 1}/3)...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap" data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {descriptions.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
              Your YouTube Description Options ({descriptions.length} Variations)
            </h3>

            <div className="space-y-4">
              {descriptions.map((desc, idx) => (
                <div
                  key={idx}
                  data-testid={`card-desc-${idx}`}
                  className={cn(
                    "rounded-2xl border p-5",
                    idx === 0
                      ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                      : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {idx === 0 && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 no-default-hover-elevate no-default-active-elevate">
                          Recommended
                        </Badge>
                      )}
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200" data-testid={`text-desc-label-${idx}`}>
                        {desc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500 dark:text-slate-400" data-testid={`text-word-count-${idx}`}>
                        {desc.wordCount} words
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs no-default-hover-elevate no-default-active-elevate gap-1", getSeoScoreColor(desc.seoScore))}
                        data-testid={`badge-seo-${idx}`}
                      >
                        SEO {desc.seoScore.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <p
                      className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                      data-testid={`text-desc-${idx}`}
                    >
                      {desc.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      data-testid={`button-copy-desc-${idx}`}
                      onClick={() => copyToClipboard(desc.text, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Description
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
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
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
                    Export All 3
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
    <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-purple-100 dark:bg-purple-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-purple-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
