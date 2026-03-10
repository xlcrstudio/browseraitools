import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  Target, ShieldAlert, TrendingUp, Sparkles
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useSalesEmailStorage } from "@/hooks/use-sales-email-storage";

const OBJECTIVES = [
  "Book a meeting",
  "Schedule demo",
  "Sell product directly",
  "Introduce service",
  "Partnership/collaboration",
  "Request introduction",
];

const TONES = ["Professional", "Friendly", "Persuasive", "Casual", "Executive (C-level)"];

const LENGTHS = [
  { label: "Short", desc: "2-3 sentences", value: "short" },
  { label: "Medium", desc: "4-6 sentences", value: "medium" },
  { label: "Long", desc: "Full pitch", value: "long" },
];

const SYSTEM_PROMPT = `You are an expert sales copywriter specializing in cold email outreach with 15+ years of experience in B2B sales. You write emails that are personalized, avoid spam triggers, focus on recipient benefit, and include low-barrier CTAs. You never use placeholder brackets like [Name] or [Company] - instead you use merge field syntax with double curly braces.`;

interface ParsedEmail {
  id: string;
  title: string;
  subjectLines: string[];
  body: string;
  spamRisk: string;
  responseProbability: string;
  whyItWorks: string[];
  whenToUse: string;
}

function parseEmails(raw: string): ParsedEmail[] {
  const emails: ParsedEmail[] = [];
  const sections = raw.split(/(?:EMAIL\s*(?:VARIATION\s*)?#?\s*\d|VARIATION\s*#?\s*\d)/i);

  for (let i = 1; i < sections.length && emails.length < 5; i++) {
    const section = sections[i];

    const titleMatch = section.match(/^[:\s-]*(.+?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1].replace(/^[:\s*-]+/, "").trim() : `Variation ${i}`;

    const subjectLines: string[] = [];
    const subjectBlock = section.match(/subject\s*line[s]?\s*(?:options?\s*)?[:]\s*([\s\S]*?)(?=\n\s*(?:email\s*body|hi\s|hey\s|hello\s|dear\s)|$)/i);
    if (subjectBlock) {
      const lines = subjectBlock[1].split("\n");
      for (const line of lines) {
        const cleaned = line.replace(/^[\s\-*•\d.]+/, "").replace(/^["']|["']$/g, "").trim();
        if (cleaned.length > 5 && cleaned.length < 200) {
          subjectLines.push(cleaned);
        }
      }
    }

    const bodyMatch = section.match(/(?:email\s*body\s*[:\n]|(?:hi|hey|hello|dear)\s)/i);
    let body = "";
    if (bodyMatch && bodyMatch.index !== undefined) {
      const afterBody = section.slice(
        bodyMatch[0].toLowerCase().startsWith("email") ? bodyMatch.index + bodyMatch[0].length : bodyMatch.index
      );
      const endMarkers = /(?:━+|───+|analysis|spam\s*risk|response\s*probability|why\s*this\s*works|when\s*to\s*use)/i;
      const endMatch = afterBody.match(endMarkers);
      body = (endMatch && endMatch.index !== undefined ? afterBody.slice(0, endMatch.index) : afterBody).trim();
    }

    if (!body) {
      const fallbackMatch = section.match(/(?:hi|hey|hello|dear)\s[\s\S]*?(?:best|regards|sincerely|cheers|thanks)[,\s][\s\S]*?\n/i);
      if (fallbackMatch) body = fallbackMatch[0].trim();
    }

    const spamMatch = section.match(/spam\s*risk\s*[:\s]*(\w+)/i);
    const spamRisk = spamMatch ? spamMatch[1].trim() : "Low";

    const responseMatch = section.match(/response\s*probability\s*[:\s]*(\w+)/i);
    const responseProbability = responseMatch ? responseMatch[1].trim() : "Medium";

    const whyItWorks: string[] = [];
    const whyBlock = section.match(/why\s*this\s*works\s*[:\s]*([\s\S]*?)(?=when\s*to\s*use|email\s*variation|variation\s*#|\n\s*\n\s*\n|$)/i);
    if (whyBlock) {
      const lines = whyBlock[1].split("\n");
      for (const line of lines) {
        const cleaned = line.replace(/^[\s\-*•]+/, "").trim();
        if (cleaned.length > 5) whyItWorks.push(cleaned);
      }
    }

    const whenMatch = section.match(/when\s*to\s*use\s*[:\s]*([\s\S]*?)(?=email\s*variation|variation\s*#|\n\s*\n\s*\n|$)/i);
    const whenToUse = whenMatch
      ? whenMatch[1].split("\n").map(l => l.replace(/^[\s\-*•]+/, "").trim()).filter(l => l.length > 3).join(", ")
      : "";

    if (body || subjectLines.length > 0) {
      emails.push({
        id: generateId(),
        title,
        subjectLines: subjectLines.slice(0, 5),
        body,
        spamRisk,
        responseProbability,
        whyItWorks: whyItWorks.slice(0, 5),
        whenToUse,
      });
    }
  }

  return emails;
}

function getSpamColor(risk: string) {
  const r = risk.toLowerCase();
  if (r.includes("low")) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (r.includes("medium")) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function getResponseColor(prob: string) {
  const p = prob.toLowerCase();
  if (p.includes("high")) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (p.includes("medium")) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export function SalesEmailGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useSalesEmailStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [product, setProduct] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [tone, setTone] = useState("Professional");
  const [emailLength, setEmailLength] = useState("medium");
  const [personalizationFields, setPersonalizationFields] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [emails, setEmails] = useState<ParsedEmail[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = product.trim() && targetCustomer.trim();

  const buildPrompt = () => {
    const lengthGuide: Record<string, string> = {
      short: "Keep each email very short: 2-3 sentences only. Be direct and concise.",
      medium: "Write medium-length emails: 4-6 sentences. Balance detail with brevity.",
      long: "Write detailed emails: full sales pitch with context, social proof, and value proposition.",
    };

    let prompt = `Generate 5 sales email variations for cold outreach.

PRODUCT/SERVICE: ${product}

TARGET CUSTOMER: ${targetCustomer}

EMAIL OBJECTIVE: ${objective}

TONE: ${tone}

LENGTH: ${lengthGuide[emailLength]}`;

    if (personalizationFields.trim()) {
      prompt += `\n\nPERSONALIZATION FIELDS TO INCLUDE: ${personalizationFields}`;
    }

    prompt += `

For EACH of the 5 email variations, output in this exact format:

EMAIL VARIATION #(number): (approach name)

Subject Line Options:
- (subject line 1)
- (subject line 2)
- (subject line 3)

Email Body:
(write the complete email here, using {{firstName}}, {{companyName}} as merge fields)

Spam Risk: (Low/Medium/High)
Response Probability: (Low/Medium/High)

Why This Works:
- (reason 1)
- (reason 2)
- (reason 3)

When to Use:
- (use case)

Generate 5 completely different approaches. Each must have unique subject lines, different opening strategies, and varied CTAs. Avoid spam trigger words. Focus on recipient benefit. Make CTAs specific and low-barrier.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStreamedContent("");
    setEmails([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedEmail(null);

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
      console.log("Raw sales email output:", finalContent);
      const parsed = parseEmails(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse email variations. Please try generating again.");
      } else {
        setEmails(parsed);
        setExpandedEmail(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleCopyEmail = (email: ParsedEmail) => {
    const text = [
      email.subjectLines.length > 0 ? `Subject: ${email.subjectLines[0]}` : "",
      "",
      email.body,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedId(email.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const text = emails
      .map((e, i) => [
        `--- EMAIL ${i + 1}: ${e.title} ---`,
        "",
        "Subject Lines:",
        ...e.subjectLines.map((s) => `  - ${s}`),
        "",
        e.body,
        "",
        `Spam Risk: ${e.spamRisk}`,
        `Response Probability: ${e.responseProbability}`,
        "",
      ].join("\n"))
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-emails-${product.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = emails.map((e, i) =>
      `EMAIL ${i + 1}: ${e.title}\n${e.subjectLines.join("\n")}\n\n${e.body}`
    ).join("\n\n---\n\n");

    saveDraft({
      product,
      objective,
      emailContent: content,
      formData: { product, targetCustomer, objective, tone, emailLength, personalizationFields },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setProduct(fd.product);
    setTargetCustomer(fd.targetCustomer);
    setObjective(fd.objective);
    setTone(fd.tone);
    setEmailLength(fd.emailLength);
    setPersonalizationFields(fd.personalizationFields);
    setStreamedContent(draft.emailContent);
    const parsed = parseEmails(draft.emailContent);
    if (parsed.length > 0) {
      setEmails(parsed);
      setExpandedEmail(parsed[0].id);
    }
    setIsDone(true);
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            Saved Emails ({drafts.length})
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
                  <FolderOpen className="w-4 h-4 text-purple-500" /> Saved Sales Emails
                </h4>
                <button
                  data-testid="button-close-drafts"
                  onClick={() => setShowDrafts(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors"
                >
                  <button
                    data-testid={`button-load-draft-${draft.id}`}
                    type="button"
                    onClick={() => loadDraft(draft)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {draft.product} &middot; {draft.objective}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    data-testid={`button-delete-draft-${draft.id}`}
                    onClick={() => deleteDraft(draft.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Delete"
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
          <h3 data-testid="text-section-product" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" /> What You're Selling
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Product/Service *</label>
            <div className="relative">
              <textarea
                data-testid="input-product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Describe what you're selling. Include key benefits and what makes it unique..."
                maxLength={400}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-product-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {product.length}/400
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Target Customer *</label>
            <div className="relative">
              <textarea
                data-testid="input-target-customer"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                placeholder="Who are you emailing? Include their industry, role, company size, and pain points they face..."
                maxLength={400}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-target-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {targetCustomer.length}/400
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-objective" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Email Settings
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Objective *</label>
            <div className="flex flex-wrap gap-2">
              {OBJECTIVES.map((obj) => (
                <button
                  key={obj}
                  data-testid={`button-objective-${obj.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setObjective(obj)}
                  aria-pressed={objective === obj}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    objective === obj
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Tone *</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  data-testid={`button-tone-${t.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setTone(t)}
                  aria-pressed={tone === t}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    tone === t
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Length</label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  data-testid={`button-length-${l.value}`}
                  onClick={() => setEmailLength(l.value)}
                  aria-pressed={emailLength === l.value}
                  className={cn(
                    "flex flex-col items-center px-3 py-2.5 rounded-xl border text-sm transition-all",
                    emailLength === l.value
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  <span className="font-semibold">{l.label}</span>
                  <span className="text-[11px] opacity-70">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          data-testid="button-toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-4 transition-colors"
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
              <div className="space-y-4 mb-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Personalization Fields <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    data-testid="input-personalization"
                    value={personalizationFields}
                    onChange={(e) => setPersonalizationFields(e.target.value)}
                    placeholder="e.g., {{firstName}}, {{companyName}}, {{industry}}, or any custom merge fields you want included..."
                    maxLength={200}
                    rows={2}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(state === "checking-gpu" || state === "downloading" || state === "preparing") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
                {state === "preparing" && "Preparing model..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
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

        <button
          data-testid="button-generate"
          onClick={handleGenerate}
          disabled={!isFormValid || isGenerating || !isReady}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
            isFormValid && !isGenerating && isReady
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generating Emails...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate 5 Sales Emails
            </>
          )}
        </button>
      </div>

      {emptyError && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{emptyError}</p>
        </div>
      )}

      {isGenerating && streamedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Writing your sales emails...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">
            {streamedContent}
          </pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && emails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                {emails.length} Email Variation{emails.length > 1 ? "s" : ""} Generated
              </h3>
              <div className="flex items-center gap-2">
                <button
                  data-testid="button-save-all"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  data-testid="button-download-all"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {emails.map((email, index) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  data-testid={`button-expand-email-${index}`}
                  type="button"
                  onClick={() => setExpandedEmail(expandedEmail === email.id ? null : email.id)}
                  aria-expanded={expandedEmail === email.id}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{email.title}</p>
                      {email.subjectLines[0] && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Subject: {email.subjectLines[0]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getSpamColor(email.spamRisk))}>
                      Spam: {email.spamRisk}
                    </span>
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getResponseColor(email.responseProbability))}>
                      Response: {email.responseProbability}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedEmail === email.id && "rotate-180")} />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedEmail === email.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                        {email.subjectLines.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" /> Subject Line Options
                            </p>
                            <div className="space-y-1.5">
                              {email.subjectLines.map((sl, si) => (
                                <div
                                  key={si}
                                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
                                >
                                  <span className="text-sm text-slate-700">{sl}</span>
                                  <button
                                    data-testid={`button-copy-subject-${index}-${si}`}
                                    onClick={() => {
                                      navigator.clipboard.writeText(sl);
                                      setCopiedId(`sub-${index}-${si}`);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="shrink-0 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    {copiedId === `sub-${index}-${si}` ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {email.body && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Email Body</p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                                {email.body}
                              </pre>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", getSpamColor(email.spamRisk))}>
                            <ShieldAlert className="w-4 h-4" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Spam Risk</p>
                              <p className="text-sm font-bold">{email.spamRisk}</p>
                            </div>
                          </div>
                          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", getResponseColor(email.responseProbability))}>
                            <TrendingUp className="w-4 h-4" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Response Prob.</p>
                              <p className="text-sm font-bold">{email.responseProbability}</p>
                            </div>
                          </div>
                        </div>

                        {email.whyItWorks.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Why This Works</p>
                            <ul className="space-y-1">
                              {email.whyItWorks.map((reason, ri) => (
                                <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {email.whenToUse && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">When to Use</p>
                            <p className="text-sm text-slate-600">{email.whenToUse}</p>
                          </div>
                        )}

                        <button
                          data-testid={`button-copy-email-${index}`}
                          onClick={() => handleCopyEmail(email)}
                          className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedId === email.id ? (
                            <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Copy Email</>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
