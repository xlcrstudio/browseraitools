import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, Trash2,
  Lock, FileText, Plus, X, Send, RotateCcw,
  ChevronDown, ChevronUp, Upload, Save, FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { parseFile, ACCEPTED_EXTENSIONS, ACCEPTED_MIME } from "@/lib/file-parsers";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Doc {
  id: string;
  name: string;
  content: string;
  addedAt: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: string[];
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "lkc_session_v1";

function loadSession(): { docs: Doc[]; messages: ChatMessage[] } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(docs: Doc[], messages: ChatMessage[]) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ docs, messages }));
    return true;
  } catch {
    return false;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── RAG-lite Engine ─────────────────────────────────────────────────────────

function chunkText(text: string, size = 250, overlap = 40): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  const step = size - overlap;
  for (let i = 0; i < words.length; i += step) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}

function scoreChunk(chunk: string, queryWords: Set<string>): number {
  const words = chunk.toLowerCase().split(/\W+/);
  return words.filter(w => queryWords.has(w)).length;
}

interface ScoredChunk { docName: string; text: string; score: number }

function getRelevantChunks(docs: Doc[], query: string, topK = 5): ScoredChunk[] {
  const stopWords = new Set(["the", "is", "at", "which", "on", "a", "an", "and", "or", "but", "in", "to", "of", "for", "with", "this", "that", "are", "was", "be", "it"]);
  const queryWords = new Set(
    query.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w))
  );
  if (queryWords.size === 0) {
    // No meaningful query words — return first chunk from each doc
    return docs.map(d => ({ docName: d.name, text: chunkText(d.content)[0] ?? d.content, score: 1 })).slice(0, topK);
  }
  const scored: ScoredChunk[] = [];
  for (const doc of docs) {
    const chunks = chunkText(doc.content);
    for (const chunk of chunks) {
      const score = scoreChunk(chunk, queryWords);
      if (score > 0) scored.push({ docName: doc.name, text: chunk, score });
    }
  }
  // Deduplicate by keeping top chunk per doc first, then fill with others
  const seen = new Set<string>();
  const result: ScoredChunk[] = [];
  const sorted = scored.sort((a, b) => b.score - a.score);
  for (const c of sorted) {
    if (!seen.has(c.docName)) { seen.add(c.docName); result.push(c); }
  }
  for (const c of sorted) {
    if (!seen.has(c.text.slice(0, 30))) { seen.add(c.text.slice(0, 30)); result.push(c); }
    if (result.length >= topK) break;
  }
  return result.slice(0, topK);
}

function buildMessages(docs: Doc[], messages: ChatMessage[], userQuery: string) {
  const chunks = getRelevantChunks(docs, userQuery);
  const context = chunks.length
    ? chunks.map(c => `[Source: ${c.docName}]\n${c.text}`).join("\n\n---\n\n")
    : docs.map(d => `[Source: ${d.name}]\n${d.content.slice(0, 400)}`).join("\n\n---\n\n");

  const sources = [...new Set(chunks.map(c => c.docName))];

  const system = `You are a helpful AI assistant that answers questions using ONLY the provided documents below. 
When you use information from a document, cite it by writing [${sources.length ? sources[0] : "Source"}] or the appropriate source name in square brackets.
If the answer is not in the documents, say clearly: "I don't see that information in the provided documents."
Be concise and direct. Do not make up information beyond what is in the documents.

PROVIDED DOCUMENTS:
${context}`;

  const history = messages.slice(-6).map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

  return {
    msgs: [
      { role: "system" as const, content: system },
      ...history,
      { role: "user" as const, content: userQuery },
    ],
    sources,
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2); }
function fmtSize(n: number) { return n > 1000 ? `${(n / 1000).toFixed(1)}k chars` : `${n} chars`; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function DocBadge({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800 max-w-full group">
      <FileText className="w-3 h-3 shrink-0" />
      <span className="truncate max-w-[120px]">{name}</span>
      <button type="button" onClick={onRemove} data-testid={`button-remove-doc-${name}`}
        className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function SourceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[10px] font-medium">
      <FileText className="w-2.5 h-2.5" />
      {name}
    </span>
  );
}

function MessageBubble({ msg, onCopy }: { msg: ChatMessage; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col max-w-[88%]", isUser ? "self-end items-end" : "self-start items-start")}>
      <div className={cn(
        "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
        isUser
          ? "bg-gradient-primary text-white rounded-br-md"
          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-md shadow-sm"
      )}>
        {msg.content}
      </div>
      {!isUser && (
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {msg.sources.map(s => <SourceTag key={s} name={s} />)}
          <button type="button" onClick={handleCopy}
            className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors ml-1">
            {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LocalKnowledgeChat() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [docs, setDocs] = useState<Doc[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [streamSources, setStreamSources] = useState<string[]>([]);
  const [docsOpen, setDocsOpen] = useState(true);
  const [addMode, setAddMode] = useState<"paste" | "file" | null>(null);
  const [pasteName, setPasteName] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [fileParsing, setFileParsing] = useState(false);
  const [fileParseWarning, setFileParseWarning] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const addDoc = (name: string, content: string) => {
    if (!name.trim() || !content.trim()) { setPasteError("Both a name and content are required."); return; }
    if (content.trim().length < 10) { setPasteError("Content is too short."); return; }
    setDocs(prev => [...prev, { id: uid(), name: name.trim(), content: content.trim(), addedAt: Date.now() }]);
    setPasteName(""); setPasteText(""); setPasteError(""); setAddMode(null);
    setSessionSaved(false);
  };

  const removeDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    setSessionSaved(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";
    setFileParseWarning("");
    setPasteError("");
    setFileParsing(true);
    const warnings: string[] = [];
    for (const file of files) {
      try {
        const { text, warning } = await parseFile(file);
        if (!text || text.trim().length < 10) {
          setPasteError(`Could not extract text from "${file.name}". Try pasting the content directly.`);
          continue;
        }
        const docName = file.name.replace(/\.[^.]+$/, "");
        addDoc(docName, text);
        if (warning) warnings.push(warning);
      } catch (err: any) {
        setPasteError(err?.message ?? `Failed to parse "${file.name}". Try pasting the content instead.`);
      }
    }
    if (warnings.length) setFileParseWarning(warnings.join(" "));
    setFileParsing(false);
  };

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || isBusy) return;
    if (docs.length === 0) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: q, sources: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming("");

    const { msgs, sources } = buildMessages(docs, [...messages, userMsg], q);
    setStreamSources(sources);

    const result = await generateRaw({
      messages: msgs,
      temperature: 0.4,
      maxTokens: 1024,
      onChunk: (chunk) => setStreaming(chunk),
    });

    if (result) {
      const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: result, sources };
      setMessages(prev => [...prev, assistantMsg]);
      setSessionSaved(false);
    }
    setStreaming("");
    setStreamSources([]);
  }, [input, docs, messages, isBusy, generateRaw]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSaveSession = () => {
    const ok = saveSession(docs, messages);
    setSavedMsg(ok ? "Session saved" : "Save failed — too much data");
    setSessionSaved(ok);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const handleLoadSession = () => {
    const session = loadSession();
    if (!session) { setSavedMsg("No saved session found"); setTimeout(() => setSavedMsg(""), 2500); return; }
    setDocs(session.docs);
    setMessages(session.messages);
    setSessionSaved(true);
    setSavedMsg("Session loaded");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const handleClearAll = () => {
    setDocs([]); setMessages([]); setStreaming(""); setSessionSaved(false); clearSession();
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">

      {/* Documents panel */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <button type="button" data-testid="button-toggle-docs"
          onClick={() => setDocsOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Documents
            </span>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              docs.length > 0 ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            )}>
              {docs.length} added
            </span>
          </div>
          {docsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        <AnimatePresence initial={false}>
          {docsOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-4 space-y-3">
                {/* Doc list */}
                {docs.length > 0 && (
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <div key={doc.id} data-testid={`doc-item-${doc.id}`}
                        className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{fmtSize(doc.content.length)}</span>
                        </div>
                        <button type="button" data-testid={`button-remove-${doc.id}`}
                          onClick={() => removeDoc(doc.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {docs.length === 0 && addMode === null && (
                  <div className="text-center py-4 space-y-1">
                    <p className="text-sm text-slate-400">No documents yet. Add notes, articles, or files to chat with them.</p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), .txt, .md, .csv, .json</p>
                  </div>
                )}

                {/* Add doc options */}
                {addMode === null && (
                  <div className="flex gap-2">
                    <button type="button" data-testid="button-add-paste"
                      onClick={() => setAddMode("paste")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Paste Text
                    </button>
                    <button type="button" data-testid="button-add-file"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={fileParsing}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-300 hover:text-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {fileParsing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing…</> : <><Upload className="w-3.5 h-3.5" /> Upload File</>}
                    </button>
                    <input ref={fileInputRef} type="file" accept={ACCEPTED_MIME} multiple className="hidden" onChange={handleFileUpload} data-testid="input-file-upload" />
                  </div>
                )}

                {/* Paste form */}
                {addMode === "paste" && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                    <input type="text" data-testid="input-doc-name"
                      value={pasteName} onChange={e => { setPasteName(e.target.value); setPasteError(""); }}
                      placeholder="Document name (e.g. Meeting Notes, Research Paper…)"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <textarea data-testid="input-doc-content"
                      value={pasteText} onChange={e => { setPasteText(e.target.value); setPasteError(""); }}
                      placeholder="Paste your document content here… (notes, articles, reports, code, anything)"
                      rows={6}
                      className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed"
                    />
                    {pasteError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{pasteError}</p>}
                    <div className="flex gap-2">
                      <button type="button" data-testid="button-cancel-paste" onClick={() => { setAddMode(null); setPasteName(""); setPasteText(""); setPasteError(""); }}
                        className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold hover:border-red-300 hover:text-red-500 transition-all">
                        Cancel
                      </button>
                      <button type="button" data-testid="button-confirm-paste"
                        onClick={() => addDoc(pasteName || "Document " + (docs.length + 1), pasteText)}
                        className="flex-1 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold hover:opacity-90 transition-all">
                        Add Document
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* File parse error / warning */}
                {pasteError && addMode === null && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0" />{pasteError}</p>
                )}
                {fileParseWarning && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />{fileParseWarning}</p>
                )}

                {/* Session actions */}
                {(docs.length > 0 || messages.length > 0) && addMode === null && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" data-testid="button-save-session" onClick={handleSaveSession}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors">
                      <Save className="w-3 h-3" /> Save Session
                    </button>
                    <button type="button" data-testid="button-load-session" onClick={handleLoadSession}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">
                      <FolderOpen className="w-3 h-3" /> Load
                    </button>
                    <button type="button" data-testid="button-clear-all" onClick={handleClearAll}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors ml-auto">
                      <RotateCcw className="w-3 h-3" /> Clear All
                    </button>
                    {savedMsg && (
                      <span className="text-[10px] font-bold text-emerald-600 animate-pulse">{savedMsg}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                  <Lock className="w-3 h-3" />
                  <span>Private — documents never leave your browser</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
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

      {/* Chat panel */}
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: "420px" }}>
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Chat</span>
            {docs.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {docs.slice(0, 3).map(d => <DocBadge key={d.id} name={d.name} onRemove={() => removeDoc(d.id)} />)}
                {docs.length > 3 && <span className="text-[10px] text-slate-400 self-center">+{docs.length - 3} more</span>}
              </div>
            )}
          </div>
          {messages.length > 0 && (
            <button type="button" data-testid="button-clear-chat"
              onClick={() => setMessages([])}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Clear chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flex flex-col" style={{ maxHeight: "480px" }}>
          {messages.length === 0 && !streaming && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-3">
              {docs.length === 0 ? (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Add documents to get started</p>
                    <p className="text-xs text-slate-400 mt-1">Paste notes, articles, reports — then ask anything about them.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Send className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {docs.length} document{docs.length > 1 ? "s" : ""} ready
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Ask anything — the AI will search your documents and cite sources.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {[
                      "Summarize all documents",
                      "What are the key points?",
                      "What action items are mentioned?",
                      "Compare the main topics",
                    ].map(s => (
                      <button key={s} type="button" data-testid={`button-suggestion-${s.slice(0, 10)}`}
                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:text-purple-600 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} onCopy={copyText} />)}

          {isGenerating && streaming && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="self-start max-w-[88%]">
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {streaming}
                <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
              </div>
              {streamSources.length > 0 && (
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  {streamSources.map(s => <SourceTag key={s} name={s} />)}
                </div>
              )}
            </motion.div>
          )}

          {isGenerating && !streaming && (
            <div className="self-start flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
              <span className="text-xs text-slate-400">Searching documents…</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-3">
          <div className={cn(
            "flex items-end gap-2 rounded-xl border-2 transition-all px-3 py-2",
            docs.length === 0 ? "border-slate-200 dark:border-slate-700 opacity-50" : "border-slate-200 dark:border-slate-700 focus-within:border-purple-400"
          )}>
            <textarea
              ref={inputRef}
              data-testid="input-chat-message"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={docs.length === 0 ? "Add documents first…" : "Ask anything about your documents… (Enter to send)"}
              disabled={docs.length === 0 || isBusy}
              rows={1}
              style={{ resize: "none", minHeight: "36px", maxHeight: "120px" }}
              className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 text-sm outline-none placeholder:text-slate-400 leading-relaxed disabled:cursor-not-allowed"
              onInput={e => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button type="button" data-testid="button-send"
              onClick={handleSend}
              disabled={!input.trim() || docs.length === 0 || isBusy}
              className={cn(
                "p-2 rounded-lg transition-all shrink-0",
                !input.trim() || docs.length === 0 || isBusy
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-95 shadow-sm shadow-purple-500/20"
              )}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5">Shift+Enter for new line · AI answers from your documents only</p>
        </div>
      </div>
    </div>
  );
}
