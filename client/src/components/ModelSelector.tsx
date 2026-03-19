import { useState, useRef, useEffect } from "react";
import { Cpu, ChevronDown, Check, RefreshCw } from "lucide-react";
import { AVAILABLE_MODELS, getSelectedModelId, setSelectedModelId } from "@/lib/models";

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [selectedId, setSelectedId] = useState(() => getSelectedModelId());
  const ref = useRef<HTMLDivElement>(null);

  const selected = AVAILABLE_MODELS.find(m => m.id === selectedId) || AVAILABLE_MODELS[1];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(id: string) {
    if (id === selectedId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    setSelectedId(id);
    setSelectedModelId(id);
    setOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  return (
    <div ref={ref} className="relative" data-testid="model-selector">
      <button
        data-testid="button-model-selector"
        onClick={() => !switching && setOpen(o => !o)}
        disabled={switching}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Select AI model"
      >
        {switching ? (
          <RefreshCw className="w-3.5 h-3.5 text-purple-500 animate-spin" />
        ) : (
          <Cpu className="w-3.5 h-3.5 text-purple-500 shrink-0" />
        )}
        <span className="hidden sm:inline max-w-[120px] truncate">
          {switching ? "Switching…" : selected.name}
        </span>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI Model
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Larger models are slower to load but produce better output
            </p>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {AVAILABLE_MODELS.map(model => (
              <button
                key={model.id}
                data-testid={`model-option-${model.id}`}
                onClick={() => handleSelect(model.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  model.id === selectedId
                    ? "border-purple-500 bg-purple-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}>
                  {model.id === selectedId && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {model.name}
                    </span>
                    {model.isDefault && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {model.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
