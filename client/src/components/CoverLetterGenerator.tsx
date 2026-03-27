import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Edit3, Save, FileText, FolderOpen, Trash2, X, RotateCcw
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useCoverLetterStorage } from "@/hooks/use-cover-letter-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const EXPERIENCE_LEVELS = [
  "Entry-level (0-2 years)",
  "Mid-level (3-5 years)",
  "Senior (6-10 years)",
  "Expert (10+ years)",
  "Career Changer",
  "Recent Graduate",
];

const TONES = ["Professional", "Enthusiastic", "Formal", "Creative", "Balanced"];
const LENGTHS = [
  { label: "Concise", desc: "250-300 words", value: "concise" },
  { label: "Standard", desc: "350-400 words", value: "standard" },
  { label: "Detailed", desc: "450-500 words", value: "detailed" },
];

const SPECIAL_CONSIDERATIONS = [
  { id: "employment-gap", label: "Employment gap" },
  { id: "relocation", label: "Relocation" },
  { id: "remote-work", label: "Remote work preference" },
];

const SYSTEM_PROMPT = `You are an expert career coach and professional resume writer with 15+ years of experience helping job seekers land interviews at Fortune 500 companies and startups.
Your expertise includes:
- Writing compelling, personalized cover letters that get interviews
- Understanding ATS optimization
- Tailoring content to specific industries and experience levels
- Matching candidate skills to job requirements
- Professional business writing with appropriate tone
- Career transition strategies
You write cover letters that are personalized, highlight achievements, show enthusiasm, use professional tone, are ATS-optimized, follow business letter format, are concise (250-500 words), and avoid clichés.`;

export function CoverLetterGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useCoverLetterStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [keySkills, setKeySkills] = useState("");
  const [whyThisJob, setWhyThisJob] = useState("");
  const [careerTransitionInfo, setCareerTransitionInfo] = useState("");

  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("standard");
  const [specialConsiderations, setSpecialConsiderations] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const isCareerChanger = experienceLevel === "Career Changer";

  const isFormValid =
    jobTitle.trim() &&
    companyName.trim() &&
    candidateName.trim() &&
    currentJobTitle.trim() &&
    keySkills.trim() &&
    whyThisJob.trim();

  const wordCount = (isEditing ? editedContent : letterContent)
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const toggleConsideration = (id: string) => {
    setSpecialConsiderations((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setJobTitle(fd.jobTitle);
    setCompanyName(fd.companyName);
    setJobDescription(fd.jobDescription);
    setCompanyInfo(fd.companyInfo);
    setCandidateName(fd.candidateName);
    setCurrentJobTitle(fd.currentJobTitle);
    setExperienceLevel(fd.yearsOfExperience);
    setKeySkills(fd.keySkills);
    setWhyThisJob(fd.whyThisJob);
    setCareerTransitionInfo(fd.careerTransitionInfo);
    setTone(fd.tone);
    setLength(fd.length);
    setSpecialConsiderations(fd.specialConsiderations);
    setAdditionalNotes(fd.additionalNotes);
    setLetterContent(draft.letterContent);
    setEditedContent(draft.letterContent);
    setStreamedContent(draft.letterContent);
    setIsDone(true);
    setIsEditing(false);
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPrompt = () => {
    const lengthGuidance: Record<string, string> = {
      concise: "Keep the cover letter concise at 250-300 words.",
      standard: "Write a standard-length cover letter of 350-400 words.",
      detailed: "Write a detailed cover letter of 450-500 words.",
    };

    const experienceGuidance: Record<string, string> = {
      "Entry-level (0-2 years)":
        "The candidate is entry-level. Focus on transferable skills, education, eagerness to learn, and relevant coursework or internships.",
      "Mid-level (3-5 years)":
        "The candidate is mid-level. Highlight growing responsibilities, specific achievements, and career progression.",
      "Senior (6-10 years)":
        "The candidate is senior-level. Emphasize leadership, strategic thinking, measurable impact, and industry expertise.",
      "Expert (10+ years)":
        "The candidate is an industry expert. Focus on thought leadership, transformational achievements, and executive presence.",
      "Career Changer":
        "The candidate is changing careers. Emphasize transferable skills, passion for the new field, and how previous experience adds unique value.",
      "Recent Graduate":
        "The candidate is a recent graduate. Focus on academic achievements, relevant projects, internships, and enthusiasm for starting their career.",
    };

    let prompt = `Write a professional cover letter for the following job application.

JOB DETAILS:
- Job Title: ${jobTitle}
- Company: ${companyName}
${jobDescription ? `- Job Description: ${jobDescription}` : ""}
${companyInfo ? `- Company Info: ${companyInfo}` : ""}

CANDIDATE DETAILS:
- Name: ${candidateName}
- Current/Recent Title: ${currentJobTitle}
- Experience Level: ${experienceLevel}
- Key Skills & Achievements: ${keySkills}
- Why This Job: ${whyThisJob}
${isCareerChanger && careerTransitionInfo ? `- Career Transition Context: ${careerTransitionInfo}` : ""}

TONE: ${tone}
${lengthGuidance[length]}
${experienceGuidance[experienceLevel]}`;

    if (specialConsiderations.length > 0) {
      prompt += `\n\nSPECIAL CONSIDERATIONS: ${specialConsiderations.join(", ")}. Address these naturally in the letter.`;
    }

    if (additionalNotes.trim()) {
      prompt += `\n\nADDITIONAL NOTES: ${additionalNotes}`;
    }

    prompt += `\n\nOUTPUT FORMAT:
Write the cover letter in proper business letter format with:
- A professional salutation (use "Dear Hiring Manager" if no specific name)
- An engaging opening paragraph
- 1-2 body paragraphs highlighting relevant skills and achievements
- A strong closing paragraph with a call to action
- A professional sign-off

Output ONLY the cover letter text. No explanations, no meta-commentary.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStreamedContent("");
    setLetterContent("");
    setIsDone(false);
    setIsEditing(false);
    setCopied(false);
    setSaved(false);

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.7,
      maxTokens: 1500,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      setLetterContent(finalContent);
      setEditedContent(finalContent);
      setIsDone(true);
    }
  };

  const handleCopy = () => {
    const content = isEditing ? editedContent : letterContent;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = isEditing ? editedContent : letterContent;
    const blob = new Blob(
      [`Cover Letter - ${jobTitle} at ${companyName}\n\n${content}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = isEditing ? editedContent : letterContent;
    saveDraft({
      jobTitle,
      companyName,
      candidateName,
      letterContent: content,
      formData: {
        jobTitle,
        companyName,
        jobDescription,
        companyInfo,
        candidateName,
        currentJobTitle,
        yearsOfExperience: experienceLevel,
        keySkills,
        whyThisJob,
        careerTransitionInfo,
        tone,
        length,
        specialConsiderations,
        additionalNotes,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setLetterContent(editedContent);
    }
    setIsEditing(!isEditing);
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
            My Saved Letters ({drafts.length})
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
                  <FolderOpen className="w-4 h-4 text-purple-500" /> Saved Cover Letters
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
                    onClick={() => loadDraft(draft)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {draft.jobTitle} at {draft.companyName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {draft.candidateName} &middot; {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    data-testid={`button-delete-draft-${draft.id}`}
                    onClick={() => deleteDraft(draft.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Delete draft"
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
          <h3 data-testid="text-section-job-details" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" /> Job Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Job Title *</label>
              <input
                data-testid="input-job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Company Name *</label>
              <input
                data-testid="input-company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Google, Acme Corp"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Job Description <span className="text-slate-400 font-normal">(optional but recommended)</span>
            </label>
            <div className="relative">
              <textarea
                data-testid="input-job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for a more tailored cover letter..."
                maxLength={5000}
                rows={5}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-job-desc-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {jobDescription.length}/5000
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Company Info <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              data-testid="input-company-info"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              placeholder="Any relevant info about the company culture, mission, or values..."
              maxLength={500}
              rows={2}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-background" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" /> Your Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Your Name *</label>
              <input
                data-testid="input-candidate-name"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Current/Most Recent Job Title *</label>
              <input
                data-testid="input-current-job-title"
                type="text"
                value={currentJobTitle}
                onChange={(e) => setCurrentJobTitle(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Years of Experience *</label>
            <div className="relative">
              <select
                data-testid="select-experience-level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Key Skills & Achievements *</label>
            <div className="relative">
              <textarea
                data-testid="input-key-skills"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                placeholder="List your most relevant skills, certifications, and achievements..."
                maxLength={1000}
                rows={4}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-skills-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {keySkills.length}/1000
              </span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Why This Job? *</label>
            <textarea
              data-testid="input-why-this-job"
              value={whyThisJob}
              onChange={(e) => setWhyThisJob(e.target.value)}
              placeholder="What excites you about this role and company?"
              maxLength={300}
              rows={2}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
            />
          </div>

          <AnimatePresence>
            {isCareerChanger && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Career Transition Info</label>
                  <textarea
                    data-testid="input-career-transition"
                    value={careerTransitionInfo}
                    onChange={(e) => setCareerTransitionInfo(e.target.value)}
                    placeholder="Describe your career transition context and what drives the change..."
                    maxLength={300}
                    rows={2}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="space-y-6 mb-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        data-testid={`button-tone-${t.toLowerCase()}`}
                        onClick={() => setTone(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          tone === t
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Length</label>
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.value}
                        data-testid={`button-length-${l.value}`}
                        onClick={() => setLength(l.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          length === l.value
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {l.label} <span className="text-xs opacity-70">({l.desc})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Special Considerations</label>
                  <div className="flex flex-wrap gap-3">
                    {SPECIAL_CONSIDERATIONS.map((item) => (
                      <label
                        key={item.id}
                        data-testid={`checkbox-${item.id}`}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={specialConsiderations.includes(item.id)}
                          onChange={() => toggleConsideration(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    data-testid="input-additional-notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any other details you'd like included in your cover letter..."
                    maxLength={300}
                    rows={2}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full text-sm font-medium">
            {state === "checking-gpu" && (
              <span className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying hardware...
              </span>
            )}
            {state === "downloading" && (
              <div className="space-y-1.5 w-full max-w-xs">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading AI Engine (First time only)
                  </span>
                  <span className="text-purple-700 font-bold">{progress.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}
            {state === "error" && (
              <span className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
            {state === "ready" && !error && (
              <span className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI ready to generate
              </span>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              data-testid="button-generate-cover-letter"
              onClick={handleGenerate}
              disabled={!isFormValid || state === "generating" || state === "downloading" || state === "checking-gpu"}
              className={cn(
                "flex-1 sm:flex-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
                !isFormValid || ["generating", "downloading", "checking-gpu"].includes(state)
                  ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                  : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
              )}
            >
              {state === "generating" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating your cover letter...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" /> Generate My Cover Letter
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={() => {
                setJobTitle("");
                setCompanyName("");
                setJobDescription("");
                setCompanyInfo("");
                setCandidateName("");
                setCurrentJobTitle("");
                setExperienceLevel(EXPERIENCE_LEVELS[0]);
                setKeySkills("");
                setWhyThisJob("");
                setCareerTransitionInfo("");
                setTone("Professional");
                setLength("standard");
                setSpecialConsiderations([]);
                setAdditionalNotes("");
                setShowAdvanced(false);
                setStreamedContent("");
                setLetterContent("");
                setIsDone(false);
                setIsEditing(false);
                setEditedContent("");
              }}
              disabled={state === "generating"}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(streamedContent || isDone) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
              <h3 data-testid="text-output-heading" className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" /> Your Cover Letter
                {isDone && (
                  <span data-testid="text-word-count" className="text-sm font-normal text-slate-500 ml-1">
                    ({wordCount} words)
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {state === "generating" && (
                  <span className="text-xs font-semibold text-purple-600 animate-pulse">Writing...</span>
                )}
              </div>
            </div>

            {isDone && (
              <div className="flex flex-wrap items-center gap-2 px-2">
                <button
                  data-testid="button-copy-letter"
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border transition-colors",
                    copied
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-white border-slate-200 text-slate-500 hover:text-purple-600"
                  )}
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <InlineShareButtons />
                <button
                  data-testid="button-download-letter"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download as .txt
                </button>
                <button
                  data-testid="button-toggle-edit"
                  onClick={handleToggleEdit}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border transition-colors",
                    isEditing
                      ? "bg-purple-50 border-purple-200 text-purple-600"
                      : "bg-white border-slate-200 text-slate-500 hover:text-purple-600"
                  )}
                >
                  <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Done Editing" : "Edit in Browser"}
                </button>
                <button
                  data-testid="button-save-draft"
                  onClick={handleSave}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border transition-colors",
                    saved
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-white border-slate-200 text-slate-500 hover:text-purple-600"
                  )}
                >
                  {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {saved ? "Saved!" : "Save Draft"}
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
              {isEditing ? (
                <textarea
                  data-testid="textarea-edit-letter"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[400px] bg-slate-50 border-2 border-purple-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium leading-relaxed resize-y"
                />
              ) : (
                <div data-testid="text-letter-content" className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {isDone ? letterContent : streamedContent}
                </div>
              )}
            </div>

            {isDone && (
              <div className="flex justify-center pt-6">
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate Cover Letter
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
