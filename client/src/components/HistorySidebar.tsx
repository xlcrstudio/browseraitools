import { motion, AnimatePresence } from "framer-motion";
import { History, X, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useHookStorage } from "@/hooks/use-hook-storage";
import { formatDate } from "@/lib/utils";
import type { GeneratedHook } from "@shared/schema";

export function HistoryPanel() {
  const { hooks, stats, deleteHook } = useHookStorage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        data-testid="button-history-open"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40 bg-white border border-slate-200 text-slate-700 shadow-xl rounded-full p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 font-semibold"
      >
        <History className="w-5 h-5 text-purple-600" />
        <span className="hidden md:inline">History ({hooks.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="font-display font-bold text-xl flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" /> Hook History
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Generated today: <span data-testid="text-generations-today" className="font-bold text-purple-600">{stats.generationsToday}</span></p>
                </div>
                <button 
                  data-testid="button-history-close"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {hooks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <History className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No hooks generated yet.</p>
                  </div>
                ) : (
                  hooks.map(hook => (
                    <HistoryItem key={hook.id} hook={hook} onDelete={() => deleteHook(hook.id)} />
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function HistoryItem({ hook, onDelete }: { hook: GeneratedHook, onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-purple-200 hover:bg-white transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {hook.type}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {hook.tone}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {formatDate(new Date(hook.createdAt))}
        </span>
      </div>
      
      <p data-testid={`text-history-hook-${hook.id}`} className="text-sm font-medium text-slate-700 mb-3 line-clamp-3">
        {hook.content}
      </p>

      <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs text-slate-500 truncate pr-4 max-w-[200px]">
          Topic: {hook.topic}
        </div>
        <div className="flex gap-1 shrink-0">
          <button 
            data-testid={`button-copy-history-${hook.id}`}
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-purple-100 text-slate-500 hover:text-purple-600 transition-colors"
            title="Copy"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            data-testid={`button-delete-history-${hook.id}`}
            onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
