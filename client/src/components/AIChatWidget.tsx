import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, ArrowRight, Lock } from "lucide-react";

const SYSTEM = "You are a helpful AI assistant running locally in the user's browser. All conversations are completely private — nothing leaves their device. Give concise, useful responses.";

const SUGGESTIONS = [
  "Write a professional bio for my LinkedIn",
  "Give me 5 viral YouTube hook ideas",
  "Explain machine learning in simple terms",
  "Write a cold email that gets replies",
];

const WELCOME = "Hi! I'm your private AI assistant — running entirely on your device. Nothing you type leaves your browser. What can I help you with?";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function AIChatWidget() {
  const { state, progress, generateRaw } = useWebLLM();
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const streamRef = useRef("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setStreamText(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamText]);

  const send = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || !isReady || isGenerating) return;
    const userMsg: Msg = { role: "user", content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);
    streamRef.current = "";
    setStreamText("");

    const history = [...messages, userMsg].slice(-6);
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM },
        ...history.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      maxTokens: 600,
      onChunk: (t) => { streamRef.current = t; },
    });

    setMessages(prev => [...prev, { role: "assistant", content: result ?? streamRef.current ?? "" }]);
    setIsGenerating(false);
    setStreamText("");
  }, [input, messages, isReady, isGenerating, generateRaw]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-2xl border border-purple-100 dark:border-purple-800/40 bg-white dark:bg-slate-800 shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Private AI Chat</p>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Private Mode ON</p>
              </div>
            </div>
          </div>
          <Link href="/ai-chatbot" data-testid="link-open-full-chatbot"
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Open Full Chatbot <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Model loading banner */}
        <AnimatePresence>
          {isModelLoading && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-700/40">
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Loading AI model… {progress.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div ref={messagesContainerRef} className="h-56 overflow-y-auto p-4 space-y-3" data-testid="chat-widget-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-gradient-primary shadow-sm"
                  : "bg-slate-200 dark:bg-slate-600"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-3.5 h-3.5 text-white" />
                  : <span className="text-xs font-bold text-slate-600 dark:text-slate-300">U</span>
                }
              </div>
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                  : "bg-gradient-primary text-white rounded-tr-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Streaming ghost message */}
          {isGenerating && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-slate-50 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {streamText
                  ? <>{streamText}<span className="inline-block w-0.5 h-3.5 bg-purple-500 ml-0.5 align-middle animate-pulse" /></>
                  : <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                }
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map((s) => (
            <button key={s} data-testid={`button-suggestion-${s.slice(0, 20).replace(/\s+/g, "-")}`}
              onClick={() => { setInput(s); textareaRef.current?.focus(); }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-700/50 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors whitespace-nowrap">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-end gap-2 p-3 border-t border-slate-100 dark:border-slate-700/60">
          <textarea
            ref={textareaRef}
            data-testid="input-chat-widget"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything…"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none transition-all"
          />
          <button
            data-testid="button-send-widget"
            onClick={() => send()}
            disabled={!input.trim() || !isReady || isGenerating}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 shrink-0">
            {isGenerating
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
        Your conversations stay on your device.{" "}
        <Link href="/ai-chatbot" className="underline hover:text-purple-500 transition-colors">
          Open full chatbot with history
        </Link>
      </p>
    </motion.div>
  );
}
