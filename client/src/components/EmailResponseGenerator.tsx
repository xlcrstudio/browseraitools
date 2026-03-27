import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Loader2, AlertTriangle, CheckCircle2,
  Copy, Download, RotateCcw, ChevronRight, Lock,
  MessageSquare, ThumbsDown, MailOpen, Clock, Heart, AlertCircle, Users, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const RESPONSE_TYPES = [
  { id: "standard", label: "Standard Reply", desc: "1–2 paragraphs, complete response", icon: Mail },
  { id: "quick", label: "Quick Reply", desc: "2–4 sentences, brief acknowledgment", icon: MessageSquare },
  { id: "detailed", label: "Detailed Reply", desc: "3–5 paragraphs, thorough coverage", icon: MailOpen },
  { id: "decline", label: "Polite Decline", desc: "Say no gracefully", icon: ThumbsDown },
  { id: "followup", label: "Follow-Up", desc: "Circle back, no response received", icon: Clock },
  { id: "thankyou", label: "Thank You", desc: "Express genuine gratitude", icon: Heart },
  { id: "apology", label: "Apology", desc: "Address mistakes or delays", icon: AlertCircle },
];

const TONES = [
  { id: "professional", label: "Professional", desc: "Default business tone" },
  { id: "formal", label: "Formal", desc: "Traditional, reserved" },
  { id: "friendly", label: "Friendly", desc: "Warm but professional" },
  { id: "casual", label: "Casual", desc: "Relaxed, conversational" },
  { id: "match", label: "Match Their Tone", desc: "Mirror the sender" },
];

const RELATIONSHIPS = [
  { id: "", label: "Not specified" },
  { id: "boss", label: "Boss / Manager" },
  { id: "colleague", label: "Colleague" },
  { id: "client", label: "Client / Customer" },
  { id: "vendor", label: "Vendor / Supplier" },
  { id: "recruiter", label: "Recruiter" },
  { id: "friend", label: "Friend" },
  { id: "unknown", label: "Unknown / First Contact" },
];

const SYSTEM_PROMPT = `You are an expert email writing assistant. You generate professional, contextually appropriate email responses. Always:
- Match the specified tone exactly
- Address everything asked in the email
- Be concise but complete
- Include a proper greeting, body, and sign-off
- Use concrete next steps when relevant
- Never over-apologize, use passive voice, or leave ambiguous action items
- Generate only the email text, nothing else (no labels, no explanations)`;

function buildPrompt(
  receivedEmail: string,
  responseType: string,
  tone: string,
  relationship: string,
  senderName: string,
  yourName: string,
  keyPoints: string,
) {
  const type = RESPONSE_TYPES.find((t) => t.id === responseType)!;
  const toneObj = TONES.find((t) => t.id === tone)!;

  let prompt = `Write an email response.\n\n`;
  prompt += `RESPONSE TYPE: ${type.label} — ${type.desc}\n`;
  prompt += `TONE: ${toneObj.label} (${toneObj.desc})\n`;

  if (relationship) {
    const rel = RELATIONSHIPS.find((r) => r.id === relationship);
    if (rel) prompt += `RELATIONSHIP: ${rel.label}\n`;
  }
  if (senderName.trim()) prompt += `SENDER'S NAME: ${senderName.trim()}\n`;
  if (yourName.trim()) prompt += `YOUR NAME (for sign-off): ${yourName.trim()}\n`;
  if (keyPoints.trim()) prompt += `KEY POINTS TO INCLUDE: ${keyPoints.trim()}\n`;

  prompt += `\nEMAIL RECEIVED:\n${receivedEmail}\n\n`;

  const typeInstructions: Record<string, string> = {
    standard: `Write a complete standard reply (1-2 paragraphs). Lead with the main point, then supporting details. Use proper greeting and closing.`,
    quick: `Write a brief quick reply (2-4 sentences only). Efficient, friendly, gets straight to the point. No unnecessary padding.`,
    detailed: `Write a thorough detailed reply (3-5 paragraphs). Address every point raised. Use bullet points for multiple items. Include clear next steps.`,
    decline: `Write a polite decline. Be appreciative, give a brief reason (can be vague like "current commitments"), optionally suggest an alternative, wish them well. Do NOT be apologetic or over-explain.`,
    followup: `Write a polite follow-up. Reference the original topic, acknowledge they're busy, gently request a response. Note any time sensitivity if relevant. Keep it brief.`,
    thankyou: `Write a warm thank you reply. Be specific about what you're thanking them for and why it mattered. Sincere but concise — 1 paragraph.`,
    apology: `Write a sincere apology. Acknowledge the specific issue, briefly explain without making excuses, list concrete resolution steps, provide a timeline if possible. Solution-focused, not excuse-focused.`,
  };

  prompt += `INSTRUCTIONS: ${typeInstructions[responseType]}\n\nWrite ONLY the email (greeting through sign-off). Do not add labels, headers, or commentary.`;

  return prompt;
}

function renderEmailOutput(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const content = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (line.trimStart().startsWith("•") || line.trimStart().startsWith("-")) {
        return <span key={j}>{part}</span>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <p key={i} className={cn("leading-relaxed", line === "" ? "h-2" : "")}>
        {content}
      </p>
    );
  });
}

export function EmailResponseGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [receivedEmail, setReceivedEmail] = useState("");
  const [responseType, setResponseType] = useState("standard");
  const [tone, setTone] = useState("professional");
  const [relationship, setRelationship] = useState("");
  const [senderName, setSenderName] = useState("");
  const [yourName, setYourName] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [output, setOutput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputError, setInputError] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);

  const isGenerating = state === "generating";
  const wordCount = receivedEmail.trim() ? receivedEmail.trim().split(/\s+/).length : 0;

  const handleGenerate = async () => {
    if (receivedEmail.trim().length < 10) {
      setInputError("Please paste the email you need to respond to.");
      return;
    }
    setInputError("");
    setOutput("");
    setIsDone(false);
    setCopied(false);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(receivedEmail, responseType, tone, relationship, senderName, yourName, keyPoints) },
      ],
      temperature: 0.6,
      maxTokens: 1536,
      onChunk: (chunk) => {
        setOutput(chunk);
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      },
    });

    if (result) {
      setOutput(result);
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setReceivedEmail("");
    setResponseType("standard");
    setTone("professional");
    setRelationship("");
    setSenderName("");
    setYourName("");
    setKeyPoints("");
    setOutput("");
    setIsDone(false);
    setCopied(false);
    setInputError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-response-${responseType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedType = RESPONSE_TYPES.find((t) => t.id === responseType)!;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="space-y-6">

          {/* Received email */}
          <div className="space-y-2">
            <label htmlFor="er-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Email You Received
            </label>
            <div className="relative">
              <textarea
                id="er-email"
                data-testid="input-email"
                value={receivedEmail}
                onChange={(e) => { setReceivedEmail(e.target.value); setInputError(""); }}
                placeholder={"Paste the email you need to respond to...\n\nExample:\n\"Hi,\n\nI wanted to follow up on our meeting last week. We've reviewed your proposal and have a few questions before moving forward. Could we schedule a 30-minute call this week to discuss?\n\nBest,\nSarah\""}
                maxLength={8000}
                rows={8}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y font-medium placeholder:text-slate-400 text-sm"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                {wordCount} words
              </div>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {inputError}
              </p>
            )}
            <p className="text-xs text-slate-400 ml-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Email content never leaves your browser
            </p>
          </div>

          {/* Response type */}
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">
              Response Type
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RESPONSE_TYPES.map((type) => {
                const TypeIcon = type.icon;
                const isActive = responseType === type.id;
                return (
                  <button
                    key={type.id}
                    data-testid={`button-type-${type.id}`}
                    type="button"
                    onClick={() => setResponseType(type.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-start gap-2 p-3 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-600"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-md shrink-0 mt-0.5",
                      isActive ? "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    )}>
                      <TypeIcon className="w-3 h-3" />
                    </span>
                    <div className="min-w-0">
                      <p className={cn("font-semibold text-xs leading-tight", isActive ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                        {type.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Tone */}
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">
              Tone
            </legend>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const isActive = tone === t.id;
                return (
                  <button
                    key={t.id}
                    data-testid={`button-tone-${t.id}`}
                    type="button"
                    onClick={() => setTone(t.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex flex-col items-start px-3.5 py-2.5 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-600"
                    )}
                  >
                    <span className={cn("text-xs font-semibold", isActive ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                      {t.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Advanced options */}
          <div>
            <button
              data-testid="button-toggle-advanced"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              More options
              <ChevronRight className={cn("w-3 h-3 transition-transform", showAdvanced && "rotate-90")} />
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
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="er-sender" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                          Sender's Name <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input
                          id="er-sender"
                          data-testid="input-sender-name"
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g., Sarah, Mr. Johnson"
                          maxLength={60}
                          className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="er-yourname" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                          Your Name <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input
                          id="er-yourname"
                          data-testid="input-your-name"
                          type="text"
                          value={yourName}
                          onChange={(e) => setYourName(e.target.value)}
                          placeholder="e.g., Alex"
                          maxLength={60}
                          className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="er-relationship" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Relationship <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {RELATIONSHIPS.map((r) => {
                          const isActive = relationship === r.id;
                          return (
                            <button
                              key={r.id}
                              data-testid={`button-rel-${r.id || "none"}`}
                              type="button"
                              onClick={() => setRelationship(r.id)}
                              aria-pressed={isActive}
                              className={cn(
                                "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                                isActive
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                              )}
                            >
                              {r.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="er-keypoints" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Key Points to Include <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="er-keypoints"
                        data-testid="input-key-points"
                        value={keyPoints}
                        onChange={(e) => setKeyPoints(e.target.value)}
                        placeholder="Specific things you want to say in the reply...&#10;e.g., Available Tuesday 2pm or Thursday morning. Prefer video call. Need agenda sent beforehand."
                        maxLength={500}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model loading states */}
        <AnimatePresence>
          {(state === "checking-gpu" || state === "downloading") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {state === "checking-gpu" ? "Checking GPU support…" : "Loading AI model…"}
                </span>
              </div>
              {state === "downloading" && progress && (
                <>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1.5">
                    <div
                      className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(progress.percent)}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {Math.round(progress.percent)}% — {progress.text}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-5 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Error</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            data-testid="button-generate"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || receivedEmail.trim().length < 5}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm",
              isGenerating || receivedEmail.trim().length < 5
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Writing reply…
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Write Reply
              </>
            )}
          </button>

          {(output || receivedEmail) && (
            <button
              data-testid="button-reset"
              type="button"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Output card */}
      <AnimatePresence>
        {(output || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {selectedType.label}
                  </h3>
                  {isDone && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {output.trim().split(/\s+/).length} words
                    </p>
                  )}
                </div>
              </div>

              {isDone && (
                <div className="flex items-center gap-2">
                  <button
                    data-testid="button-copy"
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      copied
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600"
                    )}
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <InlineShareButtons />
                  <button
                    data-testid="button-download"
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .txt
                  </button>
                </div>
              )}
            </div>

            {/* Email output — styled like a real email */}
            <div
              ref={outputRef}
              data-testid="output-email"
              className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 max-h-[520px] overflow-y-auto"
            >
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1 font-[system-ui]">
                {renderEmailOutput(output)}
                {isGenerating && (
                  <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 rounded-sm" />
                )}
              </div>
            </div>

            {isDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reply ready — review before sending
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
