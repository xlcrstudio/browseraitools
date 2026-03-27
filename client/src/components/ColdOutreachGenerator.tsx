import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  Target, Sparkles, RotateCcw, Star, Users, Handshake, Mic,
  Lightbulb, Phone, Globe, Mail, Linkedin, Clock, TrendingUp
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useColdOutreachStorage } from "@/hooks/use-cold-outreach-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const HOW_FOUND_OPTIONS = [
  { value: "content", label: "Their Content / Work", desc: "Saw their post, article, or project" },
  { value: "mutual", label: "Mutual Connection", desc: "Someone you both know" },
  { value: "research", label: "Company / Industry Research", desc: "Found them while researching" },
  { value: "event", label: "Event / Conference", desc: "Met or saw them at an event" },
  { value: "group", label: "Shared Interest / Group", desc: "Common community or interest" },
];

const PURPOSE_OPTIONS = [
  { value: "partnership", label: "Partnership / Collaboration", desc: "Working together on something", icon: Handshake },
  { value: "interview", label: "Interview / Feature", desc: "Podcast, article, or content", icon: Mic },
  { value: "advice", label: "Pick Their Brain / Advice", desc: "Learning from their experience", icon: Lightbulb },
  { value: "introduction", label: "Introduction Request", desc: "Connect me to someone", icon: Phone },
  { value: "project", label: "Collaboration Opportunity", desc: "Specific project together", icon: Target },
  { value: "networking", label: "General Networking", desc: "Build relationship, no immediate ask", icon: Globe },
];

const FORMAT_OPTIONS = [
  { value: "linkedin-request", label: "LinkedIn Connection Request", desc: "300 character limit" },
  { value: "linkedin-message", label: "LinkedIn Message", desc: "Full message format" },
  { value: "email", label: "Email", desc: "Subject line + body" },
  { value: "both", label: "Both LinkedIn & Email", desc: "Two formats generated" },
];

const TONE_OPTIONS = [
  { value: "friendly", label: "Friendly / Warm", desc: "Approachable and personable" },
  { value: "professional", label: "Professional", desc: "Polished but personable" },
  { value: "direct", label: "Direct / Concise", desc: "Straight to the point" },
  { value: "casual", label: "Casual", desc: "Relaxed and conversational" },
];

const LENGTH_OPTIONS = [
  { value: "brief", label: "Brief", desc: "2-3 sentences" },
  { value: "medium", label: "Medium", desc: "4-6 sentences" },
  { value: "detailed", label: "Detailed", desc: "Full context" },
];

const SYSTEM_PROMPT = `You are an expert networking and professional relationship specialist with deep experience in authentic outreach and business development.

You write outreach messages that:
- Feel genuine and authentic (not salesy)
- Focus on mutual benefit
- Include specific personalization
- Have clear, low-barrier asks
- Respect recipient's time
- Build real relationships
- Get actual responses

You understand:
- People ignore generic messages
- Value-first approach works best
- Specificity builds trust
- Brevity shows respect
- Mutual connections are gold
- Content appreciation works well
- Follow-up is critical but must be graceful`;

interface ParsedMessage {
  id: string;
  angle: string;
  messageText: string;
  subjectLine: string;
  wordCount: number;
  responseProbability: string;
  score: number;
  analysis: string[];
  whenToUse: string;
  followUp: string;
}

function parseProbabilityColor(prob: string) {
  const lower = prob.toLowerCase();
  if (lower.includes("very high") || lower.includes("excellent")) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (lower.includes("high")) return "text-blue-600 bg-blue-50 border-blue-200";
  if (lower.includes("medium")) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function parseMessages(raw: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  const sections = raw.split(/(?:MESSAGE\s*#?\s*\d|VARIATION\s*#?\s*\d)/i);

  for (let i = 1; i < sections.length && messages.length < 5; i++) {
    const section = sections[i];

    const angleMatch = section.match(/^[:\s\-]*(.+?)(?:\n|$)/);
    let angle = angleMatch ? angleMatch[1].replace(/^[:\s*\-]+/, "").trim() : `Message ${i}`;
    angle = angle.replace(/\(.*?\)/, "").trim();
    if (angle.length > 40) angle = angle.slice(0, 40) + "...";

    const subjectMatch = section.match(/subject(?:\s*line)?\s*[:\s]*["']?(.+?)["']?\s*$/im);
    const subjectLine = subjectMatch ? subjectMatch[1].trim() : "";

    let messageText = "";
    const bodyPatterns = [
      /(?:^[:\s\-]*[^\n]+\n)([\s\S]*?)(?=response\s*prob|structure\s*score|score|analysis|why\s*this|when\s*to\s*use|follow|word\s*count|length|reading|message\s*#|variation\s*#|━|───)/i,
      /(?:^[:\s\-]*[^\n]+\n)([\s\S]*?)$/i,
    ];

    for (const pat of bodyPatterns) {
      const m = section.match(pat);
      if (m) {
        const lines = m[1].split("\n");
        const bodyLines: string[] = [];
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) { bodyLines.push(""); continue; }
          if (/^(subject|response prob|structure|score|analysis|why this|when to|follow|word count|length|reading|personalization|━|───)/i.test(trimmed)) break;
          if (/^(message|variation)\s*#/i.test(trimmed)) break;
          bodyLines.push(trimmed);
        }
        messageText = bodyLines.join("\n").replace(/^[\s"]+|[\s"]+$/g, "").trim();
        if (messageText.length > 30) break;
      }
    }

    const wordCount = messageText ? messageText.split(/\s+/).filter(w => w.length > 0).length : 0;

    const probMatch = section.match(/response\s*prob[a-z]*\s*[:\s]*([\w\s\-]+)/i);
    const responseProbability = probMatch ? probMatch[1].trim() : "Medium";

    const scoreMatch = section.match(/(?:structure\s*score|score)\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.5;

    const analysis: string[] = [];
    const analysisBlock = section.match(/(?:analysis|why\s*this\s*works?)\s*[:\s]*([\s\S]*?)(?=when\s*to\s*use|follow|message\s*#|variation\s*#|\n\s*\n\s*\n|$)/i);
    if (analysisBlock) {
      const lines = analysisBlock[1].split("\n");
      for (const line of lines) {
        const cleaned = line.replace(/^[\s\-*•✓✅]+/, "").trim();
        if (cleaned.length > 5 && !cleaned.match(/^(when to|follow|message|variation)/i)) analysis.push(cleaned);
      }
    }

    const whenMatch = section.match(/when\s*to\s*use\s*[:\s]*([\s\S]*?)(?=follow|message\s*#|variation\s*#|\n\s*\n\s*\n|$)/i);
    const whenToUse = whenMatch
      ? whenMatch[1].split("\n").map(l => l.replace(/^[\s\-*•]+/, "").trim()).filter(l => l.length > 3).join(", ")
      : "";

    const followMatch = section.match(/follow[- ]?up\s*[:\s]*([\s\S]*?)(?=message\s*#|variation\s*#|\n\s*\n\s*\n|$)/i);
    const followUp = followMatch
      ? followMatch[1].split("\n").map(l => l.replace(/^[\s\-*•]+/, "").trim()).filter(l => l.length > 3).join(" ")
      : "";

    if (messageText.length > 20) {
      messages.push({
        id: generateId(),
        angle,
        messageText,
        subjectLine,
        wordCount,
        responseProbability,
        score: Math.round(score * 10) / 10,
        analysis: analysis.slice(0, 6),
        whenToUse,
        followUp,
      });
    }
  }

  return messages;
}

export function ColdOutreachGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useColdOutreachStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [yourRole, setYourRole] = useState("");
  const [yourCompany, setYourCompany] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [howFound, setHowFound] = useState("content");
  const [purpose, setPurpose] = useState("partnership");
  const [valueContext, setValueContext] = useState("");
  const [messageFormat, setMessageFormat] = useState("linkedin-message");
  const [tone, setTone] = useState("professional");
  const [messageLength, setMessageLength] = useState("medium");

  const [streamedContent, setStreamedContent] = useState("");
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = yourRole.trim() && recipientRole.trim();

  const buildPrompt = () => {
    const howFoundLabel = HOW_FOUND_OPTIONS.find(h => h.value === howFound)?.label || howFound;
    const purposeLabel = PURPOSE_OPTIONS.find(p => p.value === purpose)?.label || purpose;
    const formatLabel = FORMAT_OPTIONS.find(f => f.value === messageFormat)?.label || messageFormat;
    const toneLabel = TONE_OPTIONS.find(t => t.value === tone)?.label || tone;
    const lengthLabel = LENGTH_OPTIONS.find(l => l.value === messageLength)?.label || messageLength;

    let prompt = `Generate 5 authentic cold outreach message variations.

YOUR INFO:
Role: ${yourRole}`;
    if (yourCompany.trim()) prompt += `\nCompany: ${yourCompany}`;
    prompt += `

RECIPIENT INFO:
Role: ${recipientRole}`;
    if (recipientCompany.trim()) prompt += `\nCompany: ${recipientCompany}`;
    prompt += `
How Found: ${howFoundLabel}

PURPOSE: ${purposeLabel}`;
    if (valueContext.trim()) prompt += `\nValue/Context: ${valueContext}`;
    prompt += `

FORMAT: ${formatLabel}
Tone: ${toneLabel}
Length: ${lengthLabel}

REQUIREMENTS:
- Reference how you found them
- Show genuine interest
- Use specific details (not generic)
- Natural, human language

STRUCTURE for each message:
1. Personalized opening (reference specific thing)
2. Brief context about you (one sentence)
3. Mutual value proposition
4. Specific, low-barrier ask
5. Professional close

GENERATE 5 VARIATIONS:

MESSAGE #1: Value-First Approach
- Lead with what you can offer them
- Clear benefit to recipient
- Collaborative tone

MESSAGE #2: Mutual Connection Angle
- Reference shared community or interest
- Leverage social proof
- Warm introduction feel

MESSAGE #3: Content Appreciation
- Genuine appreciation for their work
- Specific content reference
- Idea exchange offer

MESSAGE #4: Direct / Concise
- Straight to the point
- Respect their time
- Clear ask upfront

MESSAGE #5: Question / Advice Seeking
- Ask for their perspective
- Position them as expert
- Low pressure approach

For EACH message output this exact format:

MESSAGE #(number): (Angle Name)
${messageFormat === "email" || messageFormat === "both" ? "\nSubject: (email subject line)\n" : ""}
(Write the complete message text here, as natural written words. 5-7 sentences.)

Response Probability: (Very High / High / Medium-High / Medium)

Score: X/10

Why This Works:
- (reason 1)
- (reason 2)
- (reason 3)

When to Use:
- (scenario)

Follow-up: (Brief suggestion for a follow-up message if no response after 5-7 days)

Output 5 complete, authentic outreach messages. Keep them brief, personalized, and genuine.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStreamedContent("");
    setMessages([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedMsg(null);

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
      console.log("Raw cold outreach output:", finalContent);
      const parsed = parseMessages(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse outreach messages. Please try generating again.");
      } else {
        setMessages(parsed);
        setExpandedMsg(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setYourRole("");
    setYourCompany("");
    setRecipientRole("");
    setRecipientCompany("");
    setHowFound("content");
    setPurpose("partnership");
    setValueContext("");
    setMessageFormat("linkedin-message");
    setTone("professional");
    setMessageLength("medium");
    setStreamedContent("");
    setMessages([]);
    setIsDone(false);
    setExpandedMsg(null);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
  };

  const handleCopyMessage = (msg: ParsedMessage) => {
    const text = msg.subjectLine ? `Subject: ${msg.subjectLine}\n\n${msg.messageText}` : msg.messageText;
    navigator.clipboard.writeText(text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = messages.map((m, i) => [
      `--- MESSAGE ${i + 1}: ${m.angle} ---`,
      m.subjectLine ? `Subject: ${m.subjectLine}` : "",
      "",
      m.messageText,
      "",
      `Response Probability: ${m.responseProbability} | Score: ${m.score}/10`,
    ].filter(Boolean).join("\n")).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const text = messages.map((m, i) => [
      `--- MESSAGE ${i + 1}: ${m.angle} ---`,
      m.subjectLine ? `Subject: ${m.subjectLine}` : "",
      "",
      m.messageText,
      "",
      `Response Probability: ${m.responseProbability}`,
      `Score: ${m.score}/10`,
      `Words: ${m.wordCount}`,
      m.analysis.length > 0 ? `\nWhy This Works:\n${m.analysis.map(a => `  - ${a}`).join("\n")}` : "",
      m.whenToUse ? `\nWhen to Use: ${m.whenToUse}` : "",
      m.followUp ? `\nFollow-up: ${m.followUp}` : "",
    ].filter(Boolean).join("\n")).join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cold-outreach-${recipientRole.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = messages.map((m, i) =>
      `MESSAGE ${i + 1}: ${m.angle}\n${m.subjectLine ? `Subject: ${m.subjectLine}\n` : ""}${m.messageText}\nScore: ${m.score}/10`
    ).join("\n\n---\n\n");

    saveDraft({
      recipientRole,
      purpose,
      outreachContent: content,
      formData: { yourRole, yourCompany, recipientRole, recipientCompany, howFound, purpose, valueContext, messageFormat, tone, messageLength },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setYourRole(fd.yourRole);
    setYourCompany(fd.yourCompany);
    setRecipientRole(fd.recipientRole);
    setRecipientCompany(fd.recipientCompany);
    setHowFound(fd.howFound);
    setPurpose(fd.purpose);
    setValueContext(fd.valueContext);
    setMessageFormat(fd.messageFormat);
    setTone(fd.tone);
    setMessageLength(fd.messageLength);
    setStreamedContent(draft.outreachContent);
    const parsed = parseMessages(draft.outreachContent);
    if (parsed.length > 0) {
      setMessages(parsed);
      setExpandedMsg(parsed[0].id);
    }
    setIsDone(true);
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestMessage = messages.length > 0 ? messages.reduce((best, m) => m.score > best.score ? m : best, messages[0]) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button
            data-testid="button-toggle-drafts"
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Saved Messages ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-500" /> Saved Messages
                </h4>
                <button
                  data-testid="button-close-drafts"
                  onClick={() => setShowDrafts(false)}
                  aria-label="Close saved messages"
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button
                    data-testid={`button-load-draft-${draft.id}`}
                    type="button"
                    onClick={() => loadDraft(draft)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {draft.recipientRole} &middot; {PURPOSE_OPTIONS.find(p => p.value === draft.purpose)?.label || draft.purpose}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.updatedAt).toLocaleDateString()}</p>
                  </button>
                  <button
                    data-testid={`button-delete-draft-${draft.id}`}
                    onClick={() => deleteDraft(draft.id)}
                    aria-label="Delete saved message"
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="mb-6">
          <h3 data-testid="text-section-your-info" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" /> Your Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Your Role / Title *</label>
              <input
                data-testid="input-your-role"
                type="text"
                value={yourRole}
                onChange={(e) => setYourRole(e.target.value)}
                placeholder="e.g., Founder, Marketing Manager"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Your Company / Background <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                data-testid="input-your-company"
                type="text"
                value={yourCompany}
                onChange={(e) => setYourCompany(e.target.value)}
                placeholder="e.g., AI startup, Freelance consultant"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-recipient" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Recipient Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Recipient's Role / Title *</label>
              <input
                data-testid="input-recipient-role"
                type="text"
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="e.g., VP of Marketing, Podcast Host"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Recipient's Company <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                data-testid="input-recipient-company"
                type="text"
                value={recipientCompany}
                onChange={(e) => setRecipientCompany(e.target.value)}
                placeholder="e.g., SaaS company, Tech podcast"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">How Did You Find Them? *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOW_FOUND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-found-${opt.value}`}
                  onClick={() => setHowFound(opt.value)}
                  aria-pressed={howFound === opt.value}
                  className={cn(
                    "flex flex-col items-start px-4 py-3 rounded-xl border text-sm transition-all text-left",
                    howFound === opt.value
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-[11px] opacity-70">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-purpose" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Outreach Purpose
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {PURPOSE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  data-testid={`button-purpose-${opt.value}`}
                  onClick={() => setPurpose(opt.value)}
                  aria-pressed={purpose === opt.value}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all text-left",
                    purpose === opt.value
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", purpose === opt.value ? "text-purple-600" : "text-slate-400")} />
                  <div>
                    <span className="font-semibold block">{opt.label}</span>
                    <span className="text-[11px] opacity-70">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              What Value Can You Offer? <span className="text-slate-400 font-normal">(optional but recommended)</span>
            </label>
            <div className="relative">
              <textarea
                data-testid="input-value-context"
                value={valueContext}
                onChange={(e) => setValueContext(e.target.value)}
                placeholder={"What makes this relevant? What's in it for them?\n\nExamples:\n- I have an audience they'd love to reach\n- We're in complementary markets\n- I can help with their new product launch"}
                maxLength={200}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span className="absolute bottom-3 right-3 text-xs text-slate-400">{valueContext.length}/200</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-preferences" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" /> Message Preferences
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Message Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    data-testid={`button-format-${opt.value}`}
                    onClick={() => setMessageFormat(opt.value)}
                    aria-pressed={messageFormat === opt.value}
                    className={cn(
                      "flex flex-col items-start px-4 py-3 rounded-xl border text-sm transition-all text-left",
                      messageFormat === opt.value
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                    )}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-[11px] opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tone / Style</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      data-testid={`button-tone-${opt.value}`}
                      onClick={() => setTone(opt.value)}
                      aria-pressed={tone === opt.value}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                        tone === opt.value
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Message Length</label>
                <div className="flex flex-wrap gap-2">
                  {LENGTH_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      data-testid={`button-length-${opt.value}`}
                      onClick={() => setMessageLength(opt.value)}
                      aria-pressed={messageLength === opt.value}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                        messageLength === opt.value
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(state === "checking-gpu" || state === "downloading") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating || !isReady}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
              isFormValid && !isGenerating && isReady
                ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Crafting Messages...</>
            ) : (
              <><Handshake className="w-5 h-5" /> Generate Outreach Messages</>
            )}
          </button>
          <button
            data-testid="button-reset"
            type="button"
            onClick={handleReset}
            disabled={isGenerating}
            className={cn(
              "px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2",
              isGenerating
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            )}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {emptyError && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3" data-testid="alert-empty-result">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{emptyError}</p>
        </div>
      )}

      {isGenerating && streamedContent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Crafting authentic messages...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && messages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  {messages.length} Outreach Message{messages.length > 1 ? "s" : ""} Generated
                </h3>
                {bestMessage && (
                  <p className="text-sm text-slate-500 mt-0.5" data-testid="text-best-message">
                    Strongest: {bestMessage.angle} (Score: {bestMessage.score}/10)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
                <button data-testid="button-save-all" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download" onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {messages.map((msg, index) => {
              const isBest = bestMessage?.id === msg.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden", isBest ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200")}
                >
                  <button
                    data-testid={`button-expand-message-${index}`}
                    type="button"
                    onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                    aria-expanded={expandedMsg === msg.id}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn("flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0", isBest ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700")}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
                          {msg.angle}
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Star className="w-3 h-3" /> Strongest
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {msg.wordCount} words &middot; {msg.responseProbability}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(msg.score))}>
                        {msg.score}/10
                      </span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedMsg === msg.id && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedMsg === msg.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          {msg.subjectLine && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                              <span className="font-semibold text-slate-700">Subject:</span>
                              <span className="text-slate-600">{msg.subjectLine}</span>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5" /> Message
                            </p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{msg.messageText}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", parseProbabilityColor(msg.responseProbability))}>
                              <TrendingUp className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Response Probability</p>
                                <p className="text-sm font-bold">{msg.responseProbability}</p>
                              </div>
                            </div>
                            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", getScoreColor(msg.score))}>
                              <Target className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Score</p>
                                <p className="text-sm font-bold">{msg.score}/10</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                              <Clock className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Words</p>
                                <p className="text-sm font-bold">{msg.wordCount}</p>
                              </div>
                            </div>
                          </div>

                          {msg.analysis.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Why This Works</p>
                              <ul className="space-y-1">
                                {msg.analysis.map((item, ai) => (
                                  <li key={ai} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {msg.whenToUse && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">When to Use</p>
                              <p className="text-sm text-slate-600">{msg.whenToUse}</p>
                            </div>
                          )}

                          {msg.followUp && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5" /> Follow-up Suggestion
                              </p>
                              <p className="text-sm text-slate-600 bg-purple-50 rounded-lg border border-purple-100 p-3">{msg.followUp}</p>
                            </div>
                          )}

                          <button
                            data-testid={`button-copy-message-${index}`}
                            onClick={() => handleCopyMessage(msg)}
                            className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                          >
                            {copiedId === msg.id ? (
                              <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                            ) : (
                              <><Copy className="w-4 h-4" /> Copy Message</>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
