import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Plus, Search, Pin, Trash2, Copy, Check, Loader2,
  RotateCcw, ChevronLeft, ChevronRight, Lock, Maximize2, Minimize2,
  AlignLeft, ZoomIn, MessageSquare,
} from "lucide-react";
import { loadThreads, saveThreads, genId, makeTitle, type ChatThread, type Message } from "@/lib/chat-storage";

const SYSTEM = "You are a helpful, knowledgeable AI assistant running privately in the user's browser. Give clear, accurate, concise responses. Format with markdown bullet points and headers where helpful.";

const PROMPT_SUGGESTIONS = [
  "Write a professional bio for my LinkedIn",
  "Explain quantum computing in simple terms",
  "Give me 5 viral YouTube hook ideas",
  "Write a cold email that actually gets replies",
  "What's the difference between AI and machine learning?",
  "Write a Python function to reverse a string",
  "Summarize the key principles of stoic philosophy",
  "Give me 10 business name ideas for a coffee shop",
];

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function MsgContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const els: JSX.Element[] = [];
  let listItems: string[] = [];
  let key = 0;

  const renderInline = (s: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
      if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-xs font-mono">{p.slice(1, -1)}</code>;
      return <span key={i}>{p}</span>;
    });
  };

  const flushList = () => {
    if (!listItems.length) return;
    els.push(
      <ul key={key++} className="space-y-0.5 my-1.5">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm leading-relaxed">
            <span className="shrink-0 text-purple-400 font-bold mt-0.5">•</span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushList();
      els.push(<p key={key++} className="font-bold text-base mt-2 mb-1">{renderInline(line.slice(2))}</p>);
    } else if (line.startsWith("## ") || line.startsWith("### ")) {
      flushList();
      const level = line.startsWith("### ") ? 4 : 3;
      els.push(<p key={key++} className={`font-semibold ${level === 3 ? "text-sm" : "text-xs"} mt-2 mb-0.5`}>{renderInline(line.replace(/^#{2,3} /, ""))}</p>);
    } else if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^[-*]\s|\d+\.\s/, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      els.push(<p key={key++} className="text-sm leading-relaxed mb-1">{renderInline(line)}</p>);
    }
  }
  flushList();
  return <>{els}</>;
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onCopy, onAction, isCopied, isActionLoading, copiedId }: {
  msg: Message;
  onCopy: (id: string, text: string) => void;
  onAction: (id: string, action: "rewrite" | "expand" | "summarize") => void;
  isCopied: boolean;
  isActionLoading: string | null;
  copiedId: string | null;
}) {
  const [hovered, setHovered] = useState(false);
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-start gap-3 group ${isUser ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isUser ? "bg-slate-200 dark:bg-slate-600" : "bg-gradient-primary"}`}>
        {isUser
          ? <span className="text-xs font-bold text-slate-600 dark:text-slate-200">You</span>
          : <Bot className="w-4 h-4 text-white" />
        }
      </div>

      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-primary text-white rounded-tr-sm"
            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm"
        }`} data-testid={`msg-${msg.role}-${msg.id.slice(0, 6)}`}>
          {isUser ? msg.content : <MsgContent text={msg.content} />}
        </div>

        {/* Inline actions for assistant messages */}
        {!isUser && (
          <AnimatePresence>
            {(hovered || isActionLoading) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                <button data-testid={`button-copy-msg-${msg.id.slice(0, 6)}`}
                  onClick={() => onCopy(msg.id, msg.content)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
                {(["rewrite", "expand", "summarize"] as const).map(action => (
                  <button key={action} data-testid={`button-${action}-${msg.id.slice(0, 6)}`}
                    onClick={() => onAction(msg.id, action)}
                    disabled={!!isActionLoading}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 capitalize">
                    {isActionLoading === `${msg.id}-${action}`
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : action === "rewrite" ? <RotateCcw className="w-3 h-3" />
                      : action === "expand" ? <Maximize2 className="w-3 h-3" />
                      : <Minimize2 className="w-3 h-3" />
                    }
                    {action}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Timestamp */}
        <p className="text-xs text-slate-400 dark:text-slate-500 px-1">{formatTime(msg.timestamp)}</p>
      </div>
    </div>
  );
}

// ─── Thread item in sidebar ───────────────────────────────────────────────────
function ThreadItem({ thread, isActive, onSelect, onDelete, onPin }: {
  thread: ChatThread; isActive: boolean;
  onSelect: () => void; onDelete: () => void; onPin: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      data-testid={`thread-${thread.id.slice(0, 6)}`}
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        isActive
          ? "bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/50"
          : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {thread.pinned && <Pin className="w-3 h-3 text-purple-400 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isActive ? "text-purple-700 dark:text-purple-200" : "text-slate-700 dark:text-slate-300"}`}>
          {thread.title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{formatTime(thread.updatedAt)}</p>
      </div>
      <AnimatePresence>
        {hover && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={onPin} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-purple-500 transition-colors">
              <Pin className="w-3 h-3" />
            </button>
            <button onClick={onDelete} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AIChat() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();

  const [threads, setThreads] = useState<ChatThread[]>(() => loadThreads());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const ts = loadThreads();
    return ts.length > 0 ? ts[0].id : null;
  });
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const streamRef = useRef("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  // Persist
  useEffect(() => { saveThreads(threads); }, [threads]);

  // Stream polling
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setStreamText(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  // Scroll to bottom — scroll the container, not the page
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threads, streamText, activeId]);

  const activeThread = threads.find(t => t.id === activeId) ?? null;
  const displayMessages = activeThread?.messages ?? [];

  const pinnedThreads = threads.filter(t => t.pinned);
  const recentThreads = threads.filter(t => !t.pinned);
  const filteredPinned = search ? pinnedThreads.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) : pinnedThreads;
  const filteredRecent = search ? recentThreads.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) : recentThreads;

  const createNewThread = useCallback(() => {
    const id = genId();
    const thread: ChatThread = { id, title: "New Chat", messages: [], createdAt: Date.now(), updatedAt: Date.now(), pinned: false };
    setThreads(prev => [thread, ...prev]);
    setActiveId(id);
    setInput("");
    textareaRef.current?.focus();
  }, []);

  const deleteThread = useCallback((id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeId === id) {
      setActiveId(threads.find(t => t.id !== id)?.id ?? null);
    }
  }, [activeId, threads]);

  const pinThread = useCallback((id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  }, []);

  const send = useCallback(async (overrideText?: string) => {
    const userText = (overrideText ?? input).trim();
    if (!userText || !isReady || isGenerating) return;

    let threadId = activeId;
    const isNewThread = !threadId || !threads.find(t => t.id === threadId);

    if (isNewThread) {
      threadId = genId();
    }

    const userMsg: Message = { id: genId(), role: "user", content: userText, timestamp: Date.now() };

    // Build context BEFORE state updates
    const currentMsgs = threads.find(t => t.id === threadId)?.messages ?? [];
    const contextMsgs = [...currentMsgs, userMsg].slice(-10);

    setInput("");
    setIsGenerating(true);
    streamRef.current = "";
    setStreamText("");

    setThreads(prev => {
      if (isNewThread) {
        const newThread: ChatThread = {
          id: threadId!,
          title: makeTitle(userText),
          messages: [userMsg],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          pinned: false,
        };
        return [newThread, ...prev];
      }
      return prev.map(t =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, userMsg],
              title: t.messages.length === 0 ? makeTitle(userText) : t.title,
              updatedAt: Date.now(),
            }
          : t
      );
    });

    if (isNewThread) setActiveId(threadId);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM },
        ...contextMsgs.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      maxTokens: 1200,
      onChunk: (t) => { streamRef.current = t; },
    });

    const assistantMsg: Message = {
      id: genId(),
      role: "assistant",
      content: result ?? streamRef.current ?? "",
      timestamp: Date.now(),
    };

    setThreads(prev => prev.map(t =>
      t.id === threadId
        ? { ...t, messages: [...t.messages, assistantMsg], updatedAt: Date.now() }
        : t
    ));
    setIsGenerating(false);
    setStreamText("");
  }, [input, activeId, threads, isReady, isGenerating, generateRaw]);

  const performAction = useCallback(async (msgId: string, action: "rewrite" | "expand" | "summarize") => {
    if (isGenerating || !isReady) return;
    const msg = displayMessages.find(m => m.id === msgId);
    if (!msg) return;

    const actionKey = `${msgId}-${action}`;
    setActionLoadingId(actionKey);
    streamRef.current = "";

    const prompts = {
      rewrite: `Rewrite this response with a different approach and structure:\n\n${msg.content}`,
      expand: `Expand this response with more detail, examples, and depth:\n\n${msg.content}`,
      summarize: `Summarize this response in 2-3 clear, concise sentences:\n\n${msg.content}`,
    };

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompts[action] },
      ],
      temperature: 0.7,
      maxTokens: action === "summarize" ? 200 : 900,
      onChunk: () => {},
    });

    const newContent = result ?? "";
    if (newContent && activeId) {
      setThreads(prev => prev.map(t =>
        t.id === activeId
          ? { ...t, messages: t.messages.map(m => m.id === msgId ? { ...m, content: newContent } : m) }
          : t
      ));
    }
    setActionLoadingId(null);
  }, [isGenerating, isReady, displayMessages, activeId, generateRaw]);

  const copyMessage = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xl" style={{ height: "calc(100vh - 140px)", minHeight: "560px" }}>

      {/* ── Sidebar ── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden"
          >
            {/* Sidebar header */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <button data-testid="button-new-chat" onClick={createNewThread}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                <Plus className="w-4 h-4" /> New Chat
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pt-2.5 pb-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input data-testid="input-search-threads" type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search chats…"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-purple-300 transition-all" />
              </div>
            </div>

            {/* Thread list */}
            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
              {filteredPinned.length > 0 && (
                <>
                  <p className="px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pinned</p>
                  {filteredPinned.map(t => (
                    <ThreadItem key={t.id} thread={t} isActive={t.id === activeId}
                      onSelect={() => setActiveId(t.id)}
                      onDelete={() => deleteThread(t.id)}
                      onPin={() => pinThread(t.id)} />
                  ))}
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                </>
              )}
              {filteredRecent.length > 0 && (
                <>
                  {filteredPinned.length > 0 && <p className="px-2 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recent</p>}
                  {filteredRecent.map(t => (
                    <ThreadItem key={t.id} thread={t} isActive={t.id === activeId}
                      onSelect={() => setActiveId(t.id)}
                      onDelete={() => deleteThread(t.id)}
                      onPin={() => pinThread(t.id)} />
                  ))}
                </>
              )}
              {filteredPinned.length === 0 && filteredRecent.length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-600">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">{search ? "No matching chats" : "No chats yet"}</p>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button data-testid="button-toggle-sidebar" onClick={() => setSidebarOpen(p => !p)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {activeThread?.title ?? "New Chat"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {isModelLoading && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{progress.text}</p>
              </div>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40">
              <Lock className="w-3 h-3 text-emerald-500" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Private Mode ON</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/50" data-testid="chat-messages">
          {displayMessages.length === 0 && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">How can I help you today?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                Your conversations are 100% private — everything runs locally on your device.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full">
                {PROMPT_SUGGESTIONS.slice(0, 4).map(s => (
                  <button key={s} data-testid={`button-starter-${s.slice(0, 16).replace(/\s+/g, "-")}`}
                    onClick={() => send(s)}
                    disabled={!isReady}
                    className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 text-sm text-slate-600 dark:text-slate-300 transition-all disabled:opacity-50">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayMessages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onCopy={copyMessage}
              onAction={performAction}
              isCopied={copiedId === msg.id}
              isActionLoading={actionLoadingId}
              copiedId={copiedId}
            />
          ))}

          {/* Streaming ghost */}
          {isGenerating && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-200" data-testid="msg-streaming">
                {streamText
                  ? <><MsgContent text={streamText} /><span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 align-middle animate-pulse" /></>
                  : <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                }
              </div>
            </div>
          )}
        </div>

        {/* Prompt suggestions bar */}
        <div className="px-4 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {PROMPT_SUGGESTIONS.map((s) => (
              <button key={s} data-testid={`button-suggestion-full-${s.slice(0, 12).replace(/\s+/g, "-")}`}
                onClick={() => send(s)}
                disabled={!isReady || isGenerating}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-purple-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 pt-2 pb-4 bg-white dark:bg-slate-900 shrink-0">
          {llmError && (
            <p className="text-xs text-red-500 dark:text-red-400 mb-2 px-1">{llmError}</p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              data-testid="input-chat-message"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message AI… (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none transition-all"
            />
            <button
              data-testid="button-send-message"
              onClick={() => send()}
              disabled={!input.trim() || !isReady || isGenerating}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 shrink-0">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
            <Lock className="w-3 h-3 inline mr-1 text-emerald-500" />
            All conversations stay on your device — never sent to any server
          </p>
        </div>
      </div>
    </div>
  );
}
