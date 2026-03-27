import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, Plus, Trash2,
  Lock, Download, ChevronDown, ChevronUp, BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Source Types & Fields ────────────────────────────────────────────────────

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
  hint?: string;
}

interface SourceType {
  id: string;
  label: string;
  sublabel: string;
  fields: FieldDef[];
}

const SOURCE_TYPES: SourceType[] = [
  {
    id: "website",
    label: "Website",
    sublabel: "Webpage / Online Article",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First; Last, First" },
      { key: "title", label: "Page Title", placeholder: "Title of the webpage", required: true },
      { key: "siteName", label: "Website Name", placeholder: "e.g. BBC News, Wikipedia" },
      { key: "publishDate", label: "Published Date", placeholder: "2024, January 15" },
      { key: "url", label: "URL", placeholder: "https://example.com/article", required: true },
      { key: "accessDate", label: "Accessed Date", placeholder: "2025, March 20" },
    ],
  },
  {
    id: "book",
    label: "Book",
    sublabel: "Printed or E-book",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First; Last, First", required: true },
      { key: "title", label: "Book Title", placeholder: "The Title of the Book", required: true },
      { key: "year", label: "Year", placeholder: "2023" },
      { key: "publisher", label: "Publisher", placeholder: "Oxford University Press" },
      { key: "city", label: "City of Publication", placeholder: "New York" },
      { key: "edition", label: "Edition", placeholder: "3rd" },
      { key: "doi", label: "DOI or URL (if e-book)", placeholder: "10.xxxx/xxxxx" },
    ],
  },
  {
    id: "journal",
    label: "Journal Article",
    sublabel: "Peer-reviewed paper",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First; Last, First", required: true },
      { key: "title", label: "Article Title", placeholder: "Title of the article", required: true },
      { key: "journal", label: "Journal Name", placeholder: "Nature, Science, JAMA…", required: true },
      { key: "year", label: "Year", placeholder: "2024" },
      { key: "volume", label: "Volume", placeholder: "45" },
      { key: "issue", label: "Issue", placeholder: "2" },
      { key: "pages", label: "Pages", placeholder: "112–130" },
      { key: "doi", label: "DOI", placeholder: "10.xxxx/xxxxx" },
    ],
  },
  {
    id: "book-chapter",
    label: "Book Chapter",
    sublabel: "Chapter in edited book",
    fields: [
      { key: "authors", label: "Chapter Author(s)", placeholder: "Last, First", required: true },
      { key: "chapterTitle", label: "Chapter Title", placeholder: "Title of the chapter", required: true },
      { key: "editors", label: "Book Editor(s)", placeholder: "Last, First (Ed.)" },
      { key: "bookTitle", label: "Book Title", placeholder: "Title of the Book", required: true },
      { key: "pages", label: "Pages", placeholder: "45–78" },
      { key: "year", label: "Year", placeholder: "2023" },
      { key: "publisher", label: "Publisher", placeholder: "Springer" },
      { key: "doi", label: "DOI", placeholder: "10.xxxx/xxxxx" },
    ],
  },
  {
    id: "newspaper",
    label: "Newspaper",
    sublabel: "Print or online news",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First" },
      { key: "title", label: "Article Title", placeholder: "Headline of the article", required: true },
      { key: "newspaper", label: "Newspaper Name", placeholder: "The New York Times", required: true },
      { key: "publishDate", label: "Published Date", placeholder: "2025, January 10" },
      { key: "url", label: "URL (if online)", placeholder: "https://nytimes.com/…" },
    ],
  },
  {
    id: "magazine",
    label: "Magazine",
    sublabel: "Magazine or periodical",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First" },
      { key: "title", label: "Article Title", placeholder: "Title of the article", required: true },
      { key: "magazine", label: "Magazine Name", placeholder: "Time, The Atlantic…", required: true },
      { key: "publishDate", label: "Published Date", placeholder: "2024, June 15" },
      { key: "volume", label: "Volume", placeholder: "40" },
      { key: "issue", label: "Issue", placeholder: "12" },
      { key: "pages", label: "Pages", placeholder: "20–25" },
      { key: "url", label: "URL (if online)", placeholder: "https://…" },
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    sublabel: "Video or livestream",
    fields: [
      { key: "authors", label: "Channel / Creator Name", placeholder: "Kurzgesagt – In a Nutshell", required: true },
      { key: "title", label: "Video Title", placeholder: "Title of the video", required: true },
      { key: "publishDate", label: "Upload Date", placeholder: "2024, March 5" },
      { key: "url", label: "YouTube URL", placeholder: "https://youtube.com/watch?v=…", required: true },
    ],
  },
  {
    id: "podcast",
    label: "Podcast",
    sublabel: "Episode or series",
    fields: [
      { key: "authors", label: "Host(s)", placeholder: "Last, First", required: true },
      { key: "title", label: "Episode Title", placeholder: "Title of the episode", required: true },
      { key: "podcast", label: "Podcast Name", placeholder: "Serial, Radiolab…", required: true },
      { key: "publishDate", label: "Air Date", placeholder: "2024, September 3" },
      { key: "url", label: "URL", placeholder: "https://…" },
    ],
  },
  {
    id: "report",
    label: "Report",
    sublabel: "Government / organizational",
    fields: [
      { key: "authors", label: "Author(s) or Organization", placeholder: "WHO, Smith, J.", required: true },
      { key: "title", label: "Report Title", placeholder: "Title of the report", required: true },
      { key: "year", label: "Year", placeholder: "2024" },
      { key: "organization", label: "Publishing Organization", placeholder: "World Health Organization" },
      { key: "reportNum", label: "Report Number", placeholder: "WHO/2024/001" },
      { key: "url", label: "URL", placeholder: "https://…" },
    ],
  },
  {
    id: "thesis",
    label: "Thesis / Dissertation",
    sublabel: "Masters or PhD",
    fields: [
      { key: "authors", label: "Author", placeholder: "Last, First", required: true },
      { key: "title", label: "Title", placeholder: "Title of the thesis", required: true },
      { key: "year", label: "Year", placeholder: "2023" },
      { key: "degree", label: "Degree Type", placeholder: "PhD Dissertation, Master's Thesis" },
      { key: "university", label: "University", placeholder: "Harvard University" },
      { key: "url", label: "URL / ProQuest ID", placeholder: "https://… or ProQuest #" },
    ],
  },
  {
    id: "blog",
    label: "Blog Post",
    sublabel: "Personal or corporate blog",
    fields: [
      { key: "authors", label: "Author", placeholder: "Last, First or Username" },
      { key: "title", label: "Post Title", placeholder: "Title of the blog post", required: true },
      { key: "blog", label: "Blog Name", placeholder: "Harvard Business Review Blog…" },
      { key: "publishDate", label: "Published Date", placeholder: "2025, February 1" },
      { key: "url", label: "URL", placeholder: "https://…", required: true },
    ],
  },
  {
    id: "conference",
    label: "Conference Paper",
    sublabel: "Proceedings / conference",
    fields: [
      { key: "authors", label: "Author(s)", placeholder: "Last, First; Last, First", required: true },
      { key: "title", label: "Paper Title", placeholder: "Title of the paper", required: true },
      { key: "conference", label: "Conference Name", placeholder: "NeurIPS 2024…", required: true },
      { key: "year", label: "Year", placeholder: "2024" },
      { key: "pages", label: "Pages", placeholder: "1–12" },
      { key: "doi", label: "DOI or URL", placeholder: "10.xxxx/xxxxx" },
    ],
  },
  {
    id: "film",
    label: "Film / Movie",
    sublabel: "Movie, TV episode, documentary",
    fields: [
      { key: "director", label: "Director(s)", placeholder: "Last, First", required: true },
      { key: "title", label: "Title", placeholder: "Title of the film", required: true },
      { key: "year", label: "Year", placeholder: "2023" },
      { key: "studio", label: "Studio / Distributor", placeholder: "Warner Bros., Netflix…" },
      { key: "country", label: "Country", placeholder: "USA" },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    sublabel: "Twitter/X, Instagram, Facebook",
    fields: [
      { key: "authors", label: "Account Name / Username", placeholder: "@username or Real Name", required: true },
      { key: "title", label: "Post Content (first 20 words)", placeholder: "Exact beginning of the post…", required: true },
      { key: "platform", label: "Platform", placeholder: "Twitter/X, Instagram, Facebook, LinkedIn" },
      { key: "publishDate", label: "Post Date", placeholder: "2025, January 5" },
      { key: "url", label: "Post URL", placeholder: "https://x.com/…" },
    ],
  },
];

const CITATION_STYLES = [
  { id: "apa", label: "APA 7th" },
  { id: "mla", label: "MLA 9th" },
  { id: "chicago", label: "Chicago 17th" },
  { id: "harvard", label: "Harvard" },
  { id: "ieee", label: "IEEE" },
  { id: "vancouver", label: "Vancouver" },
];

const DEFAULT_STYLES = ["apa", "mla", "chicago"];

// ─── Types ────────────────────────────────────────────────────────────────────

type CitationMap = Partial<Record<string, string>>;

interface BibEntry {
  id: string;
  sourceTitle: string;
  sourceType: string;
  citations: CitationMap;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(sourceType: SourceType, fields: Record<string, string>, styles: string[]): string {
  const fieldLines = sourceType.fields
    .filter(f => fields[f.key]?.trim())
    .map(f => `${f.label}: ${fields[f.key].trim()}`)
    .join("\n");

  const styleList = styles.map(s => CITATION_STYLES.find(c => c.id === s)?.label).join(", ");

  return `You are an expert academic citation formatter. Generate perfectly formatted citations for the following source.

SOURCE TYPE: ${sourceType.label}
${fieldLines}

Generate citations in these styles: ${styleList}

Format your response EXACTLY like this — one style per section, header on its own line:

${styles.map(s => `${CITATION_STYLES.find(c => c.id === s)?.label}:\n[citation here]`).join("\n\n")}

Rules:
- Follow each style's latest official guidelines precisely
- If a field is missing, omit it gracefully (do not write "n.d." unless year is truly unknown)
- For URLs, include them only when the style requires it
- Do not add explanations, just the formatted citations
- Each citation is a single paragraph — no line breaks within a citation`;
}

function parseCitations(raw: string, styles: string[]): CitationMap {
  const result: CitationMap = {};
  for (const style of styles) {
    const label = CITATION_STYLES.find(c => c.id === style)?.label ?? style;
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escapedLabel}:\\s*([\\s\\S]*?)(?=(?:APA|MLA|Chicago|Harvard|IEEE|Vancouver)\\s*\\d*:|$)`, "i");
    const match = raw.match(regex);
    if (match?.[1]?.trim()) {
      result[style] = match[1].trim().replace(/\n{2,}/g, "\n");
    }
  }
  return result;
}

function uid() { return Math.random().toString(36).slice(2, 10); }

// ─── Citation Card ────────────────────────────────────────────────────────────

function CitationCard({
  styleId, styleLabel, text, onAddToBib,
}: {
  styleId: string; styleLabel: string; text: string; onAddToBib: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styleBadgeColor: Record<string, string> = {
    apa: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    mla: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    chicago: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    harvard: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    ieee: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    vancouver: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full", styleBadgeColor[styleId] ?? "bg-slate-100 text-slate-600")}>
          {styleLabel}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" data-testid={`button-add-bib-${styleId}`}
            onClick={onAddToBib}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-purple-600 transition-colors">
            <Plus className="w-3 h-3" /> Add to Bibliography
          </button>
          <button type="button" data-testid={`button-copy-${styleId}`}
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all",
              copied
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200"
                : "border-slate-200 dark:border-slate-700 text-slate-600 hover:border-purple-300 hover:text-purple-600"
            )}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <InlineShareButtons />
        </div>
      </div>
      <p className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
        {text}
      </p>
    </motion.div>
  );
}

// ─── Bibliography Panel ───────────────────────────────────────────────────────

function BibliographyPanel({ entries, onRemove }: { entries: BibEntry[]; onRemove: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  const [activeStyle, setActiveStyle] = useState("apa");

  const handleExport = () => {
    const styleLabel = CITATION_STYLES.find(s => s.id === activeStyle)?.label ?? activeStyle.toUpperCase();
    const lines = entries
      .map(e => e.citations[activeStyle])
      .filter(Boolean)
      .join("\n\n");
    if (!lines) return;
    const content = `Bibliography — ${styleLabel}\n${"=".repeat(40)}\n\n${lines}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bibliography-${activeStyle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (entries.length === 0) return null;

  const availableStyles = CITATION_STYLES.filter(s =>
    entries.some(e => e.citations[s.id])
  );

  return (
    <div className="glass-panel rounded-2xl overflow-hidden mt-4">
      <button type="button" data-testid="button-toggle-bib"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Bibliography</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            {entries.length} source{entries.length > 1 ? "s" : ""}
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 space-y-3">
              {/* Style tabs */}
              {availableStyles.length > 1 && (
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                  {availableStyles.map(s => (
                    <button key={s.id} type="button" data-testid={`button-bib-style-${s.id}`}
                      onClick={() => setActiveStyle(s.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        activeStyle === s.id ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Entries */}
              <div className="space-y-2">
                {entries.map((entry, i) => (
                  <div key={entry.id} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 mt-0.5 w-5 shrink-0">{i + 1}.</span>
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                      {entry.citations[activeStyle] ?? <span className="text-slate-400 italic text-xs">No {CITATION_STYLES.find(s => s.id === activeStyle)?.label} citation for this source</span>}
                    </p>
                    <button type="button" data-testid={`button-remove-bib-${entry.id}`}
                      onClick={() => onRemove(entry.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Export */}
              <button type="button" data-testid="button-export-bib"
                onClick={handleExport}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors">
                <Download className="w-3 h-3" /> Export {CITATION_STYLES.find(s => s.id === activeStyle)?.label} Bibliography
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CitationGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [sourceTypeId, setSourceTypeId] = useState("website");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [selectedStyles, setSelectedStyles] = useState<string[]>(DEFAULT_STYLES);
  const [citations, setCitations] = useState<CitationMap>({});
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [bibliography, setBibliography] = useState<BibEntry[]>([]);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  const sourceType = SOURCE_TYPES.find(s => s.id === sourceTypeId)!;

  const setField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
    setInputError("");
  };

  const handleSourceTypeChange = (id: string) => {
    setSourceTypeId(id);
    setFields({});
    setCitations({});
    setStreaming("");
    setIsDone(false);
    setInputError("");
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(s => s !== id) : prev) : [...prev, id]
    );
  };

  const validate = () => {
    for (const f of sourceType.fields) {
      if (f.required && !fields[f.key]?.trim()) {
        setInputError(`"${f.label}" is required.`);
        return false;
      }
    }
    if (selectedStyles.length === 0) {
      setInputError("Select at least one citation style.");
      return false;
    }
    return true;
  };

  const handleGenerate = useCallback(async () => {
    if (!validate()) return;
    setCitations({});
    setStreaming("");
    setIsDone(false);

    const prompt = buildPrompt(sourceType, fields, selectedStyles);

    const raw = await generateRaw({
      messages: [
        {
          role: "system",
          content: "You are a precise academic citation formatter. Always follow the exact format requested. Never add explanations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      maxTokens: 1200,
      onChunk: (chunk) => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseCitations(raw, selectedStyles);
      setCitations(parsed);
      setIsDone(true);
    }
    setStreaming("");
  }, [sourceType, fields, selectedStyles, generateRaw]);

  const addToBib = (styleId: string) => {
    const sourceTitle = fields.title || fields.chapterTitle || fields.authors || "Untitled Source";
    setBibliography(prev => {
      // Update existing entry if same source is already in bib
      const existing = prev.find(e => e.sourceTitle === sourceTitle && e.sourceType === sourceTypeId);
      if (existing) {
        return prev.map(e =>
          e.id === existing.id ? { ...e, citations: { ...e.citations, [styleId]: citations[styleId] } } : e
        );
      }
      return [...prev, {
        id: uid(),
        sourceTitle,
        sourceType: sourceTypeId,
        citations: { [styleId]: citations[styleId] },
      }];
    });
  };

  const addAllToBib = () => {
    for (const styleId of selectedStyles) {
      if (citations[styleId]) addToBib(styleId);
    }
  };

  const removeBibEntry = (id: string) => setBibliography(prev => prev.filter(e => e.id !== id));

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Source type selector */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Source Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOURCE_TYPES.map(t => (
            <button key={t.id} type="button" data-testid={`button-source-${t.id}`}
              onClick={() => handleSourceTypeChange(t.id)}
              className={cn(
                "flex flex-col items-start p-2.5 rounded-xl border-2 text-left transition-all",
                sourceTypeId === t.id
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
              )}>
              <span className={cn("text-xs font-bold leading-tight", sourceTypeId === t.id ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                {t.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fields form */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Source Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sourceType.fields.map(f => (
            <div key={f.key} className={cn(
              f.key === "title" || f.key === "chapterTitle" || f.key === "doi" || f.key === "url" ? "sm:col-span-2" : ""
            )}>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>
              <input
                type="text"
                data-testid={`input-field-${f.key}`}
                value={fields[f.key] ?? ""}
                onChange={e => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
              {f.hint && <p className="text-[10px] text-slate-400 mt-0.5">{f.hint}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Style selector */}
      <div className="glass-panel rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Citation Styles</p>
        <div className="flex flex-wrap gap-2">
          {CITATION_STYLES.map(s => (
            <button key={s.id} type="button" data-testid={`button-style-${s.id}`}
              onClick={() => toggleStyle(s.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all",
                selectedStyles.includes(s.id)
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300"
              )}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {inputError && (
        <p className="text-xs text-red-500 flex items-center gap-1.5 px-1">
          <AlertTriangle className="w-3 h-3" />{inputError}
        </p>
      )}

      {/* Generate button */}
      <button type="button" data-testid="button-generate"
        onClick={handleGenerate}
        disabled={isBusy}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
          isBusy
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
        )}>
        {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Citations…</> : "Generate Citations"}
      </button>

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress?.percent ?? 0)}% — {progress?.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Streaming preview */}
      {isGenerating && streaming && !isDone && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">Generating…</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
            {streaming}
            <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
          </p>
        </div>
      )}

      {/* Citations output */}
      {isDone && Object.keys(citations).length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {Object.keys(citations).length} Citation{Object.keys(citations).length > 1 ? "s" : ""} Generated
            </p>
            <button type="button" data-testid="button-add-all-bib"
              onClick={addAllToBib}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors">
              <Plus className="w-3 h-3" /> Add All to Bibliography
            </button>
          </div>

          {selectedStyles.map(styleId => {
            const text = citations[styleId];
            if (!text) return null;
            const style = CITATION_STYLES.find(s => s.id === styleId)!;
            return (
              <CitationCard
                key={styleId}
                styleId={styleId}
                styleLabel={style.label}
                text={text}
                onAddToBib={() => addToBib(styleId)}
              />
            );
          })}

          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1 px-1">
            <Lock className="w-3 h-3" />
            <span>Citations generated locally — your data never leaves your browser</span>
          </div>
        </motion.div>
      )}

      {/* Bibliography */}
      <BibliographyPanel entries={bibliography} onRemove={removeBibEntry} />
    </div>
  );
}
