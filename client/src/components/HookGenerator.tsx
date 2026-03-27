import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, AlertTriangle, CheckCircle2, ChevronDown, RefreshCw, RotateCcw } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useHookStorage } from "@/hooks/use-hook-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const PLATFORMS = ["X / Twitter", "LinkedIn", "YouTube", "TikTok", "Blog Post", "Ad Copy"];
const TONES = ["Curiosity", "Controversial", "Data-Driven", "Storytelling", "FOMO", "Educational", "Humorous"];
const EXAMPLES = ["A new AI tool for developers", "How I lost 20lbs in 3 months", "Why most startups fail in year one"];

export function HookGenerator() {
  const { state, progress, error, generate, initialize } = useWebLLM();
  const { saveHooks } = useHookStorage();
  
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  
  const [streamedContent, setStreamedContent] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setStreamedContent("");
    setIsDone(false);
    
    const finalContent = await generate(platform, tone, topic, (chunk) => {
      setStreamedContent(chunk);
    });

    if (finalContent) {
      setIsDone(true);
      // Parse output into individual hooks
      const generatedLines = finalContent
        .split('\n')
        .map(line => line.replace(/^[-*•\d.\s]+/, '').replace(/^["']|["']$/g, '').trim())
        .filter(line => line.length > 10); // Filter out empty lines or short gibberish

      if (generatedLines.length > 0) {
        const newHooks = generatedLines.map(content => ({
          id: generateId(),
          topic,
          type: platform,
          tone,
          content,
          createdAt: new Date().toISOString(),
        }));
        saveHooks(newHooks);
      }
    }
  };

  const parsedStreamHooks = streamedContent
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Platform</label>
            <div className="relative">
              <select 
                data-testid="select-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
              >
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Vibe & Tone</label>
            <div className="relative">
              <select 
                data-testid="select-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-end mb-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">What is your post about?</label>
            <div className="flex gap-2 text-xs">
              {EXAMPLES.slice(0, 2).map((ex, i) => (
                <button 
                  key={i}
                  data-testid={`button-example-${i}`}
                  onClick={() => setTopic(ex)}
                  className="text-slate-500 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 px-2 py-1 rounded-md transition-colors hidden sm:block"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
          <textarea
            data-testid="input-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., A comprehensive guide to migrating from React to Next.js..."
            className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
            rows={3}
          />
        </div>

        {/* Status / Generate Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full text-sm font-medium">
            {state === 'checking-gpu' && (
              <span className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying hardware...
              </span>
            )}
            {state === 'downloading' && (
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
            {state === 'error' && (
              <span className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
            {state === 'ready' && !error && (
              <span className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI ready to generate
              </span>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!topic.trim() || state === 'generating' || state === 'downloading' || state === 'checking-gpu'}
              className={cn(
                "flex-1 sm:flex-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
                (!topic.trim() || ['generating', 'downloading', 'checking-gpu'].includes(state))
                  ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                  : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
              )}
            >
              {state === 'generating' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="w-5 h-5" /> Generate Hooks</>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={() => {
                setTopic("");
                setPlatform(PLATFORMS[0]);
                setTone(TONES[0]);
                setStreamedContent("");
                setIsDone(false);
              }}
              disabled={state === 'generating'}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <AnimatePresence>
        {(streamedContent || isDone) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Your Hooks
              </h3>
              {state === 'generating' && <span className="text-xs font-semibold text-purple-600 animate-pulse">Thinking...</span>}
            </div>

            <div className="grid gap-4">
              {parsedStreamHooks.map((hook, idx) => (
                <HookCard key={idx} text={hook.replace(/^[-*•\d.\s]+/, '').replace(/^["']|["']$/g, '').trim()} index={idx + 1} isDone={isDone} />
              ))}
            </div>
            
            {isDone && (
              <div className="flex justify-center pt-6">
                <button 
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" /> Generate More Like This
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HookCard({ text, index, isDone }: { text: string, index: number, isDone: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Skip rendering if it's too short during streaming
  if (!isDone && text.length < 5) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-primary rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
          {index}
        </div>
        <p data-testid={`text-hook-${index}`} className="flex-1 text-slate-800 font-medium text-lg leading-relaxed pt-0.5">
          {text}
        </p>
        
        {isDone && (
          <>
            <button
              data-testid={`button-copy-${index}`}
              onClick={handleCopy}
              className={cn(
                "shrink-0 p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 group/btn",
                copied 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
              )}
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
              <span className={cn("text-sm font-semibold hidden md:block", copied ? "block" : "hidden group-hover/btn:block")}>
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            <InlineShareButtons />
          </>
        )}
      </div>
    </motion.div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
