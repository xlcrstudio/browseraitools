import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  RotateCcw, Users, Handshake, Target, User, Building2,
  Wrench, FileText, CheckSquare, Calendar, AlertCircle, Mail
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useMeetingStorage } from "@/hooks/use-meeting-storage";

const MEETING_TYPES = [
  { id: "team", label: "Team Meeting", desc: "Standups, syncs, sprint planning", icon: Users },
  { id: "client", label: "Client Meeting", desc: "Customer calls, sales, demos", icon: Handshake },
  { id: "strategy", label: "Strategy Meeting", desc: "Planning, brainstorming, decisions", icon: Target },
  { id: "1on1", label: "1-on-1 Meeting", desc: "Check-ins, reviews, coaching", icon: User },
  { id: "all-hands", label: "All-Hands", desc: "Company-wide updates, Q&A", icon: Building2 },
  { id: "project", label: "Project Meeting", desc: "Status, milestones, risks", icon: Wrench },
];

const SUMMARY_STYLES = [
  { id: "executive", label: "Executive", desc: "Brief, high-level" },
  { id: "standard", label: "Standard", desc: "Balanced, comprehensive" },
  { id: "detailed", label: "Detailed", desc: "Full context, all points" },
];

const INCLUDE_OPTIONS = [
  { id: "summary", label: "Meeting summary", defaultOn: true },
  { id: "keypoints", label: "Key discussion points", defaultOn: true },
  { id: "decisions", label: "Decisions made", defaultOn: true },
  { id: "actions", label: "Action items with owners", defaultOn: true },
  { id: "followup", label: "Follow-up tasks", defaultOn: true },
  { id: "email", label: "Follow-up email draft", defaultOn: false },
  { id: "blockers", label: "Blockers and concerns", defaultOn: false },
  { id: "deadlines", label: "Deadlines and milestones", defaultOn: false },
];

const DEFAULT_INCLUDES = INCLUDE_OPTIONS.filter(o => o.defaultOn).map(o => o.id);

const SECTION_ICONS: Record<string, typeof ClipboardList> = {
  summary: FileText,
  keypoints: ClipboardList,
  decisions: CheckCircle2,
  actions: CheckSquare,
  deadlines: Calendar,
  blockers: AlertCircle,
  email: Mail,
  followup: RefreshCw,
};

const SYSTEM_PROMPT = `You are an expert executive assistant specializing in meeting documentation. You extract key information from unstructured notes and produce clear, professional meeting summaries with action items, decisions, and follow-ups. You are thorough, concise, and action-oriented.`;

interface ParsedSection {
  id: string;
  title: string;
  type: string;
  content: string;
}

function parseSummary(raw: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = raw.split("\n");

  const sectionPatterns: { pattern: RegExp; type: string; title: string }[] = [
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:MEETING\s*SUMMARY|EXECUTIVE\s*SUMMARY|OVERVIEW)/i, type: "summary", title: "Meeting Summary" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:KEY\s*(?:DISCUSSION\s*)?POINTS|DISCUSSION\s*POINTS|KEY\s*TOPICS)/i, type: "keypoints", title: "Key Discussion Points" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:DECISIONS?\s*(?:MADE)?|KEY\s*DECISIONS)/i, type: "decisions", title: "Decisions Made" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:ACTION\s*ITEMS?|TASKS?|TO[- ]?DOS?|ASSIGNMENTS?)/i, type: "actions", title: "Action Items" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:DEADLINES?|MILESTONES?|TIMELINE|UPCOMING)/i, type: "deadlines", title: "Deadlines & Milestones" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:BLOCKERS?|CONCERNS?|RISKS?|OPEN\s*QUESTIONS?|ISSUES?)/i, type: "blockers", title: "Blockers & Concerns" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:FOLLOW[- ]?UP\s*EMAIL|EMAIL\s*DRAFT|DRAFT\s*EMAIL)/i, type: "email", title: "Follow-Up Email Draft" },
    { pattern: /^(?:#{1,3}\s*)?(?:\*{2})?(?:FOLLOW[- ]?UP\s*(?:TASKS?|ITEMS?)?|NEXT\s*STEPS?)/i, type: "followup", title: "Follow-Up Tasks" },
  ];

  const headerIndices: { lineIdx: number; type: string; title: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    for (const sp of sectionPatterns) {
      if (sp.pattern.test(line)) {
        if (!headerIndices.some(h => h.type === sp.type)) {
          headerIndices.push({ lineIdx: i, type: sp.type, title: sp.title });
        }
        break;
      }
    }
  }

  if (headerIndices.length === 0) {
    if (raw.trim().length > 20) {
      sections.push({ id: generateId(), title: "Meeting Summary", type: "summary", content: raw.trim() });
    }
    return sections;
  }

  for (let h = 0; h < headerIndices.length; h++) {
    const startLine = headerIndices[h].lineIdx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].lineIdx : lines.length;
    const body = lines.slice(startLine, endLine).join("\n").trim();
    if (body.length < 5) continue;

    sections.push({
      id: generateId(),
      title: headerIndices[h].title,
      type: headerIndices[h].type,
      content: body,
    });
  }

  return sections;
}

function countStats(sections: ParsedSection[]) {
  let actionCount = 0;
  let decisionCount = 0;
  let keyPointCount = 0;
  let deadlineCount = 0;

  for (const s of sections) {
    const numberedItems = s.content.match(/^(?:\d+[\.\)]\s+|[☐☑✅•\-]\s+|(?:ACTION|DECISION)\s*#?\d)/gim);
    if (s.type === "actions") actionCount = numberedItems?.length || (s.content.split("\n").filter(l => l.trim().length > 10).length);
    if (s.type === "decisions") decisionCount = numberedItems?.length || (s.content.split("\n").filter(l => l.trim().length > 10).length);
    if (s.type === "keypoints") keyPointCount = numberedItems?.length || (s.content.split("\n").filter(l => l.trim().length > 10).length);
    if (s.type === "deadlines") deadlineCount = numberedItems?.length || (s.content.split("\n").filter(l => l.trim().length > 10).length);
  }

  return { actionCount, decisionCount, keyPointCount, deadlineCount };
}

export function MeetingSummaryGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useMeetingStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("team");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("standard");
  const [includeSections, setIncludeSections] = useState<string[]>(DEFAULT_INCLUDES);

  const [streamedContent, setStreamedContent] = useState("");
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = notes.trim().length > 10;

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  const toggleInclude = (id: string) => {
    setIncludeSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const selectedType = MEETING_TYPES.find(t => t.id === meetingType) || MEETING_TYPES[0];

  const buildPrompt = () => {
    const sectionNames = includeSections.map(id => INCLUDE_OPTIONS.find(o => o.id === id)?.label).filter(Boolean).join(", ");
    const styleObj = SUMMARY_STYLES.find(s => s.id === summaryStyle);

    let prompt = `Generate a professional meeting summary from these raw notes.

MEETING NOTES:
${notes}

MEETING TYPE: ${selectedType.label}`;
    if (meetingTitle.trim()) prompt += `\nMEETING TITLE: ${meetingTitle}`;
    if (meetingDate) prompt += `\nDATE: ${meetingDate}`;
    if (participants.trim()) prompt += `\nPARTICIPANTS:\n${participants}`;
    prompt += `\nSUMMARY STYLE: ${styleObj?.label} (${styleObj?.desc})`;
    prompt += `\nINCLUDE THESE SECTIONS: ${sectionNames}`;

    prompt += `\n\nWrite each section with a clear header on its own line. Only include the sections listed below:\n`;

    if (includeSections.includes("summary")) prompt += `\nMEETING SUMMARY:\n(${summaryStyle === "executive" ? "2-3 sentences" : summaryStyle === "detailed" ? "5-8 sentences" : "3-5 sentences"} overview)`;
    if (includeSections.includes("keypoints")) prompt += `\n\nKEY DISCUSSION POINTS:\n(Numbered list with topic headings and 2-3 sentence explanations)`;
    if (includeSections.includes("decisions")) prompt += `\n\nDECISIONS MADE:\n(Each decision with who decided, rationale, and impact level)`;
    if (includeSections.includes("actions")) prompt += `\n\nACTION ITEMS:\n(Each with owner, deadline, priority High/Medium/Low)`;
    if (includeSections.includes("deadlines")) prompt += `\n\nDEADLINES & MILESTONES:\n(Chronological list)`;
    if (includeSections.includes("blockers")) prompt += `\n\nBLOCKERS & CONCERNS:\n(Risks, open questions, dependencies)`;
    if (includeSections.includes("email")) prompt += `\n\nFOLLOW-UP EMAIL DRAFT:\n(Professional email with subject, greeting, key decisions, action items, next meeting, closing)`;
    if (includeSections.includes("followup")) prompt += `\n\nFOLLOW-UP TASKS:\n(Next steps beyond immediate action items)`;

    prompt += `\n\nBe specific, professional, and action-oriented. Extract every action item and decision. Assign ownership when participants are named.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent("");
    setSections([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedId(null);

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.6,
      maxTokens: 4096,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw meeting summary output:", finalContent);
      const parsed = parseSummary(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse meeting summary. Please try generating again.");
      } else {
        setSections(parsed);
        setExpandedId(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setNotes(""); setMeetingType("team"); setMeetingTitle("");
    setMeetingDate(""); setParticipants("");
    setSummaryStyle("standard"); setIncludeSections(DEFAULT_INCLUDES);
    setStreamedContent(""); setSections([]);
    setIsDone(false); setExpandedId(null);
    setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopySection = (s: ParsedSection) => {
    navigator.clipboard.writeText(`${s.title}\n\n${s.content}`);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = sections.map(s => `=== ${s.title.toUpperCase()} ===\n\n${s.content}`).join("\n\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const header = meetingTitle ? `Meeting: ${meetingTitle}\n` : "";
    const date = meetingDate ? `Date: ${meetingDate}\n` : "";
    const text = `${header}${date}Type: ${selectedType.label}\n\n` + sections.map(s => `=== ${s.title.toUpperCase()} ===\n\n${s.content}`).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `meeting-summary${meetingTitle ? `-${meetingTitle.slice(0, 30).replace(/\s+/g, "-")}` : ""}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const header = meetingTitle ? `# Meeting Summary: ${meetingTitle}\n\n` : "# Meeting Summary\n\n";
    const date = meetingDate ? `**Date:** ${meetingDate}\n` : "";
    const type = `**Type:** ${selectedType.label}\n\n`;
    const md = header + date + type + sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `meeting-summary${meetingTitle ? `-${meetingTitle.slice(0, 30).replace(/\s+/g, "-")}` : ""}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = JSON.stringify(sections);
    saveDraft({
      label: meetingTitle || notes.slice(0, 60),
      content,
      formData: { notes, meetingType, meetingTitle, meetingDate, participants, summaryStyle, includeSections },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setNotes(fd.notes || "");
    setMeetingType(fd.meetingType); setMeetingTitle(fd.meetingTitle);
    setMeetingDate(fd.meetingDate); setParticipants(fd.participants);
    setSummaryStyle(fd.summaryStyle); setIncludeSections(fd.includeSections);
    try {
      const restored: ParsedSection[] = JSON.parse(draft.content);
      if (Array.isArray(restored) && restored.length > 0) {
        setSections(restored);
        setExpandedId(restored[0].id);
      }
    } catch {
      const parsed = parseSummary(draft.content);
      if (parsed.length > 0) { setSections(parsed); setExpandedId(parsed[0].id); }
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = isDone && sections.length > 0 ? countStats(sections) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="ms-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="ms-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Summaries</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved summaries" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved summary" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="ms-notes" className="text-sm font-semibold text-slate-700 ml-1">Paste Your Meeting Notes *</label>
            <div className="relative">
              <textarea id="ms-notes" data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={"Paste your meeting notes, transcript, or recording here...\n\nCan be rough notes, Zoom/Teams transcripts, bullet points, or full paragraphs.\n\nExample:\n'Discussed Q4 marketing budget. Sarah said we need $50k for paid ads. John suggested focusing on organic first. Decided to split 70/30. Mike will present options by Friday. Also talked about new website launch - targeting Nov 15. Lisa needs help from design team.'"} maxLength={10000} rows={8} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} words</span>
                <span>{notes.length}/10,000</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 ml-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Your notes never leave your browser
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Meeting Type *</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MEETING_TYPES.map((type) => {
                const TypeIcon = type.icon;
                const isActive = meetingType === type.id;
                return (
                  <button key={type.id} data-testid={`button-type-${type.id}`} type="button" onClick={() => setMeetingType(type.id)} aria-pressed={isActive} className={cn("flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5", isActive ? "bg-purple-200 text-purple-800" : "bg-slate-100 text-slate-500")}>
                      <TypeIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className={cn("font-semibold text-xs", isActive ? "text-purple-800" : "text-slate-700")}>{type.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ms-title" className="text-sm font-semibold text-slate-700 ml-1">Meeting Title <span className="text-slate-400 font-normal">(optional)</span></label>
              <input id="ms-title" data-testid="input-title" type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="e.g., Q4 Marketing Planning" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 text-sm" />
            </div>
            <div className="space-y-2">
              <label htmlFor="ms-date" className="text-sm font-semibold text-slate-700 ml-1">Meeting Date <span className="text-slate-400 font-normal">(optional)</span></label>
              <input id="ms-date" data-testid="input-date" type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="ms-participants" className="text-sm font-semibold text-slate-700 ml-1">Participants <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea id="ms-participants" data-testid="input-participants" value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder={"List participants (one per line):\nSarah (Marketing Manager)\nJohn (CEO)\nMike (Sales Lead)"} maxLength={500} rows={3} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Summary Style</legend>
            <div className="flex flex-wrap gap-2">
              {SUMMARY_STYLES.map((style) => {
                const isActive = summaryStyle === style.id;
                return (
                  <button key={style.id} data-testid={`button-style-${style.id}`} type="button" onClick={() => setSummaryStyle(style.id)} aria-pressed={isActive} className={cn("px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", isActive ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-300")}>
                    {style.label} <span className="text-xs font-normal text-slate-400 ml-1">({style.desc})</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Include Sections</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INCLUDE_OPTIONS.map((opt) => {
                const isChecked = includeSections.includes(opt.id);
                return (
                  <label key={opt.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" data-testid={`checkbox-include-${opt.id}`}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleInclude(opt.id)} className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                    <span className={cn("text-sm font-medium", isChecked ? "text-slate-800" : "text-slate-500")}>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
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
          <button data-testid="button-generate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className={cn("flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3", isFormValid && !isGenerating && isReady ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Notes...</>) : (<><ClipboardList className="w-5 h-5" /> Generate Meeting Summary</>)}
          </button>
          <button data-testid="button-reset" type="button" onClick={handleReset} disabled={isGenerating} className={cn("px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2", isGenerating ? "border-slate-200 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50")}>
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
            <span className="text-sm font-semibold text-purple-600">Analyzing meeting notes...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && sections.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  {meetingTitle ? `Summary: ${meetingTitle}` : "Meeting Summary"}
                </h3>
                {stats && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {stats.actionCount > 0 && <span data-testid="stat-actions" className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><CheckSquare className="w-3 h-3 inline mr-1" />{stats.actionCount} Action Items</span>}
                    {stats.decisionCount > 0 && <span data-testid="stat-decisions" className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 inline mr-1" />{stats.decisionCount} Decisions</span>}
                    {stats.keyPointCount > 0 && <span data-testid="stat-keypoints" className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"><ClipboardList className="w-3 h-3 inline mr-1" />{stats.keyPointCount} Key Points</span>}
                    {stats.deadlineCount > 0 && <span data-testid="stat-deadlines" className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Calendar className="w-3 h-3 inline mr-1" />{stats.deadlineCount} Deadlines</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <button data-testid="button-save-all" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download-txt" onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button data-testid="button-download-md" onClick={handleDownloadMd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> MD
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {sections.map((s, index) => {
              const SectionIcon = SECTION_ICONS[s.type] || ClipboardList;
              const sectionColors: Record<string, string> = {
                summary: "bg-slate-100 text-slate-700",
                keypoints: "bg-purple-100 text-purple-700",
                decisions: "bg-emerald-100 text-emerald-700",
                actions: "bg-blue-100 text-blue-700",
                deadlines: "bg-amber-100 text-amber-700",
                blockers: "bg-red-100 text-red-700",
                email: "bg-indigo-100 text-indigo-700",
                followup: "bg-teal-100 text-teal-700",
              };
              const iconColor = sectionColors[s.type] || "bg-slate-100 text-slate-700";
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button data-testid={`button-expand-section-${index}`} type="button" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} aria-expanded={expandedId === s.id} aria-controls={`ms-section-${s.id}`} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0", iconColor)}>
                        <SectionIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Section {index + 1} of {sections.length}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 ml-3", expandedId === s.id && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {expandedId === s.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div id={`ms-section-${s.id}`} className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{s.content}</pre>
                          </div>
                          <button data-testid={`button-copy-section-${index}`} onClick={() => handleCopySection(s)} className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                            {copiedId === s.id ? (<><CheckCircle2 className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy Section</>)}
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

function ShieldCheck(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
