import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Copy, Heart, Star, MessageCircle, Type, RotateCcw,
  Lightbulb, BookOpen, Target, HelpCircle, Megaphone, List
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useLinkedInPostStorage,
  type LinkedInPostVersion,
  type LinkedInFirstComment,
  type LinkedInPostRecord,
} from "@/hooks/use-linkedin-post-storage";

const POST_TYPES = [
  { value: "value", label: "Value/Advice Post", desc: "Share actionable tips, lessons, or insights", icon: Lightbulb },
  { value: "story", label: "Story Post", desc: "Tell a personal or professional story", icon: BookOpen },
  { value: "insight", label: "Insight/Opinion Post", desc: "Share your perspective on industry trends", icon: Target },
  { value: "question", label: "Question Post", desc: "Ask your network for input or discussion", icon: HelpCircle },
  { value: "announcement", label: "Announcement Post", desc: "Share news about job, project, achievement", icon: Megaphone },
  { value: "list", label: "List Post", desc: "Numbered or bulleted list of tips/resources", icon: List },
];

const TONES = [
  { value: "professional", label: "Professional", desc: "Standard business tone" },
  { value: "inspirational", label: "Inspirational", desc: "Motivating and uplifting" },
  { value: "conversational", label: "Conversational", desc: "Friendly and approachable" },
  { value: "thought-provoking", label: "Thought-Provoking", desc: "Challenging assumptions" },
];

const POST_LENGTHS = [
  { value: "short", label: "Short", desc: "100-200 words", read: "~30 sec read" },
  { value: "medium", label: "Medium", desc: "200-400 words", read: "~1-2 min read" },
  { value: "long", label: "Long", desc: "400-800 words", read: "~3-4 min read" },
];

const OPTIMIZE_OPTIONS = ["Reach", "Engagement", "Authority"];

const SYSTEM_PROMPT = `You are a LinkedIn content strategist and thought leader who understands what drives engagement on the LinkedIn platform.

Your expertise includes:
- LinkedIn algorithm optimization
- Professional storytelling and thought leadership positioning
- B2B content strategy and personal branding
- Engagement-driving formats and professional networking etiquette

You create LinkedIn posts that:
- Provide genuine professional value
- Tell compelling stories with takeaways
- Use formatting for scannability (short paragraphs, line breaks, bullet points)
- Include strategic hooks in the first 3 lines
- Drive meaningful engagement (comments, not just likes)
- Build authority and credibility
- Are authentic and personal
- Avoid overly salesy content

You understand:
- The LinkedIn professional audience
- How formatting affects readability (1-3 sentence paragraphs, line breaks)
- The power of vulnerability in professional context
- Different post types (advice, stories, insights, questions, announcements, lists)
- The LinkedIn algorithm (dwell time, early engagement, comments > likes)`;

export function LinkedInPostGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveGeneration, toggleFavorite } = useLinkedInPostStorage();

  const [topic, setTopic] = useState("");
  const [postType, setPostType] = useState("value");
  const [targetAudience, setTargetAudience] = useState("");
  const [personalExperience, setPersonalExperience] = useState("");
  const [keyMessage, setKeyMessage] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [tone, setTone] = useState("professional");
  const [postLength, setPostLength] = useState("medium");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [numHashtags, setNumHashtags] = useState(3);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [numVersions, setNumVersions] = useState(2);
  const [optimizeFor, setOptimizeFor] = useState("Engagement");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<LinkedInPostRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReset = () => {
    setTopic("");
    setPostType("value");
    setTargetAudience("");
    setPersonalExperience("");
    setKeyMessage("");
    setCallToAction("");
    setTone("professional");
    setPostLength("medium");
    setShowAdvanced(false);
    setIncludeHashtags(true);
    setNumHashtags(3);
    setIncludeEmojis(true);
    setNumVersions(2);
    setOptimizeFor("Engagement");
    setStreamingText("");
    setCurrentRecord(null);
    setCopiedId(null);
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
    if (!topic.trim() || !targetAudience.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const postTypeLabel = POST_TYPES.find((p) => p.value === postType)?.label || "Value/Advice Post";
    const toneLabel = TONES.find((t) => t.value === tone)?.label || "Professional";
    const lengthLabel = POST_LENGTHS.find((l) => l.value === postLength)?.desc || "200-400 words";

    const userPrompt = `Write ${numVersions} LinkedIn post${numVersions > 1 ? " versions" : ""} about: "${topic.trim()}"

Post Type: ${postTypeLabel}
Target Audience: ${targetAudience.trim()}
${personalExperience ? `Personal Experience: ${personalExperience.trim()}` : ""}
${keyMessage ? `Key Message: ${keyMessage.trim()}` : ""}
${callToAction ? `Call-to-Action: ${callToAction.trim()}` : ""}
Tone: ${toneLabel}
Length: ${postLength} (${lengthLabel})
${includeHashtags ? `Include ${numHashtags} professional hashtags at the end.` : "No hashtags."}
${includeEmojis ? "Use 2-4 professional emojis sparingly." : "No emojis."}
Optimize for: ${optimizeFor}

IMPORTANT RULES:
- The first 3 lines are CRITICAL -- they must hook the reader before the "see more" button
- Use short paragraphs (1-3 sentences max)
- Use line breaks between every paragraph
- Use bullet points with arrows or dashes for lists
- End with a question or invitation for comments
- Keep it authentic and professional (not salesy)

Here is an example of one complete version so you know the exact format:

VERSION 1: Story Hook
TONE: Professional

I made a $50,000 mistake last quarter.

And it taught me more about leadership than any success ever has.

We were building the wrong feature for three weeks. I ignored the data because I was attached to my vision.

Here's what I learned:

- Great leaders listen to their team, even when it's uncomfortable
- Data beats intuition when you're emotionally invested
- Failing fast is cheaper than failing slow

We pivoted immediately, shipped on time, and saw 143% better engagement.

Sometimes the best thing you can do is admit you're wrong and change course. Fast.

What's a mistake that taught you an important lesson? I'd love to hear your story.

#leadership #productmanagement #lessonslearned

WHY IT WORKS:
- Specific dollar amount creates curiosity
- Vulnerable opening builds trust
- Actionable bullet points provide value
- Question CTA drives comments

WORD COUNT: 127
ENGAGEMENT: High

---

Now write ${numVersions} COMPLETELY DIFFERENT real LinkedIn posts about "${topic.trim()}" for ${targetAudience.trim()}. Each must be a unique, complete post ready to paste into LinkedIn. Use the ${postTypeLabel} format. Do NOT write placeholder text -- write the actual post content.

Use this exact format for each:

VERSION N: Angle Name
TONE: ${toneLabel}

actual LinkedIn post content here with proper formatting and line breaks

WHY IT WORKS:
- reason 1
- reason 2
- reason 3

WORD COUNT: number
ENGAGEMENT: High/Medium/Low

---

After all versions, add:

FIRST COMMENT:
Suggested first comment to post immediately after publishing for engagement boost.`;

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
        let { versions, firstComment } = parseLinkedInOutput(result);
        if (versions.length === 0) {
          versions = [
            {
              id: generateId(),
              content: result.trim(),
              angle: "Generated Post",
              tone: "",
              wordCount: result.trim().split(/\s+/).length,
              readTime: `${Math.ceil(result.trim().split(/\s+/).length / 200)} min`,
              hookStrength: 4,
              engagementPotential: "Medium",
              whyItWorks: [],
              hashtags: [...new Set(result.match(/#[a-zA-Z0-9_]+/g) || [])],
            },
          ];
        }
        const record: LinkedInPostRecord = {
          id: generateId(),
          topic: topic.trim(),
          postType,
          tone,
          versions,
          firstComment,
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

  const canGenerate = state === "ready" && topic.trim().length > 0 && targetAudience.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-linkedin-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What's Your Post About? *
            </label>
            <textarea
              id="topic"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 300))}
              placeholder="What do you want to share with your LinkedIn network? e.g., 'Career lesson I learned from a recent project failure' or '5 productivity tips that actually work for remote workers'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Be specific about your topic or message</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{topic.length}/300</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Post Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2" data-testid="container-post-type">
              {POST_TYPES.map((pt) => {
                const Icon = pt.icon;
                return (
                  <button
                    key={pt.value}
                    data-testid={`toggle-type-${pt.value}`}
                    onClick={() => setPostType(pt.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      postType === pt.value
                        ? "bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold leading-tight">{pt.label}</span>
                    </div>
                    <p className="text-xs opacity-70 leading-tight">{pt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="target-audience" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Audience *
            </label>
            <input
              id="target-audience"
              data-testid="input-target-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value.slice(0, 100))}
              placeholder="e.g., Marketing professionals, Software developers, Startup founders, HR leaders"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="personal-experience" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Your Personal Experience <span className="text-xs font-normal text-slate-400">(recommended for story posts)</span>
            </label>
            <textarea
              id="personal-experience"
              data-testid="input-personal-experience"
              value={personalExperience}
              onChange={(e) => setPersonalExperience(e.target.value.slice(0, 300))}
              placeholder="Share your specific experience related to this topic. Example: 'Last quarter, I led a team through a major product launch that taught me...'"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="key-message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Key Message/Takeaway
              </label>
              <input
                id="key-message"
                data-testid="input-key-message"
                type="text"
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value.slice(0, 200))}
                placeholder="What's the main point you want readers to remember?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="cta" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Call-to-Action
              </label>
              <input
                id="cta"
                data-testid="input-cta"
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value.slice(0, 100))}
                placeholder="e.g., What's your experience with this?, Share your thoughts below"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tone *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2" data-testid="container-tone">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  data-testid={`toggle-tone-${t.value}`}
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    tone === t.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-xs opacity-60">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Post Length
            </label>
            <div className="flex gap-2" data-testid="container-post-length">
              {POST_LENGTHS.map((l) => (
                <button
                  key={l.value}
                  data-testid={`toggle-length-${l.value}`}
                  onClick={() => setPostLength(l.value)}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    postLength === l.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-xs opacity-60">{l.desc}</div>
                  <div className="text-xs opacity-40">{l.read}</div>
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
                          max={5}
                          step={1}
                          value={numHashtags}
                          onChange={(e) => setNumHashtags(parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>3</span>
                          <span>5</span>
                        </div>
                      </div>
                    )}
                    <ToggleOption
                      testId="toggle-include-emojis"
                      label="Include professional emojis"
                      value={includeEmojis}
                      onChange={() => setIncludeEmojis(!includeEmojis)}
                    />
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Number of versions</span>
                        <span className="text-sm font-bold text-purple-600" data-testid="text-num-versions">{numVersions}</span>
                      </div>
                      <input
                        data-testid="input-num-versions"
                        type="range"
                        min={1}
                        max={3}
                        step={1}
                        value={numVersions}
                        onChange={(e) => setNumVersions(parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>1</span>
                        <span>3</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-sm font-medium text-slate-700 block mb-2">Optimize for</span>
                      <div className="flex gap-2">
                        {OPTIMIZE_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            data-testid={`toggle-optimize-${opt.toLowerCase()}`}
                            onClick={() => setOptimizeFor(opt)}
                            className={cn(
                              "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                              optimizeFor === opt
                                ? "bg-purple-100 text-purple-700 border-purple-300"
                                : "bg-white text-slate-500 border-slate-200 hover:border-purple-200"
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
                  Crafting your professional post...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  Generate LinkedIn Post
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
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
            <span className="text-sm font-medium text-purple-600">Creating hook... Structuring content... Optimizing engagement...</span>
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
              Your LinkedIn Post{currentRecord.versions.length > 1 ? ` (${currentRecord.versions.length} Versions)` : ""}
            </h3>
          </div>

          <div className="space-y-4">
            {currentRecord.versions.map((version, i) => (
              <PostVersionCard
                key={version.id}
                version={version}
                index={i}
                total={currentRecord.versions.length}
                isFavorite={currentRecord.favorites.includes(version.id)}
                onToggleFavorite={() => {
                  toggleFavorite(currentRecord.id, version.id);
                  setCurrentRecord((prev) => {
                    if (!prev) return prev;
                    const isFav = prev.favorites.includes(version.id);
                    return {
                      ...prev,
                      favorites: isFav
                        ? prev.favorites.filter((id) => id !== version.id)
                        : [...prev.favorites, version.id],
                    };
                  });
                }}
                onCopy={(text) => copyToClipboard(text, version.id)}
                copied={copiedId === version.id}
              />
            ))}
          </div>

          {currentRecord.firstComment && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-first-comment">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-slate-800">First Comment Strategy</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">Post this as your first comment immediately after publishing for an algorithm boost:</p>
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-700" data-testid="text-first-comment">{currentRecord.firstComment.text}</p>
                <button
                  data-testid="button-copy-first-comment"
                  onClick={() => copyToClipboard(currentRecord.firstComment!.text, "first-comment")}
                  className="shrink-0"
                >
                  {copiedId === "first-comment" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />
                  )}
                </button>
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
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
            value ? "left-5" : "left-1"
          )}
        />
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

function PostVersionCard({
  version,
  index,
  total,
  isFavorite,
  onToggleFavorite,
  onCopy,
  copied,
}: {
  version: LinkedInPostVersion;
  index: number;
  total: number;
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
      data-testid={`card-post-${version.id}`}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              {total > 1 ? `Version ${index + 1}` : "Your Post"}
            </span>
            {version.angle && (
              <span className="text-xs text-slate-400 ml-2">{version.angle}</span>
            )}
          </div>
          {version.tone && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {version.tone}
            </span>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line" data-testid={`text-post-${version.id}`}>
            {version.content}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1" data-testid={`stat-words-${version.id}`}>
            <Type className="w-3.5 h-3.5" />
            {version.wordCount} words
          </div>
          <div className="flex items-center gap-1" data-testid={`stat-read-${version.id}`}>
            {version.readTime}
          </div>
          <div className="flex items-center gap-1" data-testid={`stat-hook-${version.id}`}>
            Hook:
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < version.hookStrength ? "text-amber-400 fill-amber-400" : "text-slate-200"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1" data-testid={`stat-engagement-${version.id}`}>
            Engagement: <span className="font-medium">{version.engagementPotential}</span>
          </div>
        </div>

        {version.whyItWorks.length > 0 && (
          <>
            <button
              data-testid={`button-analysis-${version.id}`}
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 mb-3"
            >
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAnalysis && "rotate-180")} />
              Why it works
            </button>
            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 mb-4 pl-1">
                    {version.whyItWorks.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            data-testid={`button-copy-${version.id}`}
            onClick={() => onCopy(version.content)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            )}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Post"}
          </button>
          <button
            data-testid={`button-fav-${version.id}`}
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

function parseLinkedInOutput(raw: string): { versions: LinkedInPostVersion[]; firstComment: LinkedInFirstComment | null } {
  const versions: LinkedInPostVersion[] = [];
  let firstComment: LinkedInFirstComment | null = null;

  const firstCommentMatch = raw.match(/FIRST COMMENT:?\s*\n([\s\S]*?)(?:$|---|\n\n\n)/i);
  if (firstCommentMatch) {
    const commentText = firstCommentMatch[1].trim().replace(/^["']|["']$/g, "");
    if (commentText.length > 10) {
      firstComment = { id: generateId(), text: commentText };
    }
  }

  const versionRegex = /VERSION\s+(\d+)[:\s]*(?:\(([^)]*)\)|([^\n]*))/gi;
  const versionMatches = [...raw.matchAll(versionRegex)];

  if (versionMatches.length > 0) {
    for (let i = 0; i < versionMatches.length; i++) {
      const match = versionMatches[i];
      const startIdx = match.index! + match[0].length;
      const endIdx = i < versionMatches.length - 1
        ? versionMatches[i + 1].index!
        : (firstCommentMatch?.index ?? raw.length);

      const sectionText = raw.slice(startIdx, endIdx).trim();
      const angle = (match[2] || match[3] || "").trim();

      const toneMatch = sectionText.match(/^TONE:\s*(.+)/im);
      const toneVal = toneMatch ? toneMatch[1].trim() : "";

      const whyMatch = sectionText.match(/WHY IT WORKS:?\s*\n([\s\S]*?)(?:\n\n|WORD COUNT|ENGAGEMENT|---|\n[A-Z]{3,}|$)/i);
      const whyItWorks: string[] = [];
      if (whyMatch) {
        const lines = whyMatch[1].split("\n");
        for (const line of lines) {
          const cleaned = line.trim().replace(/^[-*\u2022]\s*/, "");
          if (cleaned.length > 5) whyItWorks.push(cleaned);
        }
      }

      const wordCountMatch = sectionText.match(/WORD COUNT:?\s*(\d+)/i);
      const engagementMatch = sectionText.match(/ENGAGEMENT:?\s*(\w+)/i);

      let postContent = sectionText;
      postContent = postContent.replace(/^TONE:\s*.+\n?/im, "");
      postContent = postContent.replace(/WHY IT WORKS:?[\s\S]*$/i, "");
      postContent = postContent.replace(/WORD COUNT:?.*$/im, "");
      postContent = postContent.replace(/ENGAGEMENT:?.*$/im, "");
      postContent = postContent.replace(/^---+\s*$/gm, "");
      postContent = postContent.replace(/Why This Version:?[\s\S]*$/i, "");
      postContent = postContent.replace(/When to Use:?[\s\S]*$/i, "");
      postContent = postContent.trim();

      if (!postContent || postContent.length < 20) continue;

      const hashtags = postContent.match(/#[a-zA-Z0-9_]+/g) || [];
      const wordCount = wordCountMatch ? parseInt(wordCountMatch[1]) : postContent.split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);
      const readTime = readTimeMinutes <= 1 ? "~30 sec read" : `~${readTimeMinutes} min read`;
      const engagementPotential = engagementMatch ? engagementMatch[1] : "Medium";

      versions.push({
        id: generateId(),
        content: postContent,
        angle,
        tone: toneVal,
        wordCount,
        readTime,
        hookStrength: Math.min(5, Math.max(3, whyItWorks.length)),
        engagementPotential,
        whyItWorks,
        hashtags: [...new Set(hashtags)],
      });
    }
  }

  if (versions.length === 0) {
    const sections = raw.split(/\n---+\n/);
    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.length < 30) continue;
      if (/^FIRST COMMENT/i.test(trimmed) || /^POSTING/i.test(trimmed)) continue;

      let postContent = trimmed;
      postContent = postContent.replace(/WHY IT WORKS:?[\s\S]*$/i, "");
      postContent = postContent.replace(/WORD COUNT:?.*$/im, "");
      postContent = postContent.replace(/ENGAGEMENT:?.*$/im, "");
      postContent = postContent.trim();

      if (postContent.length < 30) continue;

      const hashtags = postContent.match(/#[a-zA-Z0-9_]+/g) || [];
      const wordCount = postContent.split(/\s+/).length;

      versions.push({
        id: generateId(),
        content: postContent,
        angle: "",
        tone: "",
        wordCount,
        readTime: `~${Math.ceil(wordCount / 200)} min read`,
        hookStrength: 4,
        engagementPotential: "Medium",
        whyItWorks: [],
        hashtags: [...new Set(hashtags)],
      });
    }
  }

  return { versions, firstComment };
}
