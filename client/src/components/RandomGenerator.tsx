import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Plus, Trash2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Secure random ────────────────────────────────────────────────────────────

function rnd(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / (0xFFFFFFFF + 1);
}
function randomInt(min: number, max: number): number {
  return Math.floor(rnd() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "number" | "list" | "dice" | "coin" | "weighted";

interface HistoryEntry {
  id: string;
  mode: Mode;
  label: string;
  result: string;
}

interface WeightedOption {
  id: string;
  label: string;
  weight: number;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const MODES: Array<{ id: Mode; label: string; emoji: string }> = [
  { id: "number",   label: "Number",   emoji: "🎲" },
  { id: "list",     label: "List",     emoji: "🎯" },
  { id: "dice",     label: "Dice",     emoji: "🎮" },
  { id: "coin",     label: "Coin",     emoji: "🪙" },
  { id: "weighted", label: "Weighted", emoji: "⚖️" },
];

const DICE_FACES = [4, 6, 8, 10, 12, 20, 100];

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={cn("flex items-center gap-1 text-xs transition-colors", copied ? "text-green-500" : "text-slate-400 hover:text-purple-600")}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Big result display ───────────────────────────────────────────────────────

function ResultDisplay({ result, sub }: { result: string; sub?: string }) {
  return (
    <motion.div
      key={result}
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex flex-col items-center justify-center py-6 space-y-1">
      <p className="text-5xl font-black text-slate-900 dark:text-slate-50 tabular-nums text-center break-all px-4">{result}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

// ─── Roll button ──────────────────────────────────────────────────────────────

function RollButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      data-testid="button-roll"
      className={cn(
        "w-full py-4 rounded-2xl font-black text-sm transition-all",
        disabled
          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.97] shadow-sm shadow-purple-500/20"
      )}>
      {label}
    </button>
  );
}

// ─── Number mode ──────────────────────────────────────────────────────────────

function NumberMode({ onResult }: { onResult: (entry: HistoryEntry) => void }) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [qty, setQty] = useState(1);
  const [unique, setUnique] = useState(true);
  const [sort, setSort] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState("");

  const roll = () => {
    if (min >= max) { setError("Minimum must be less than maximum."); return; }
    const range = max - min + 1;
    if (unique && qty > range) { setError(`Can't generate ${qty} unique numbers from range ${min}–${max} (only ${range} possible).`); return; }
    setError("");
    let nums: number[];
    if (unique) {
      const pool = Array.from({ length: range }, (_, i) => i + min);
      nums = shuffle(pool).slice(0, qty);
    } else {
      nums = Array.from({ length: qty }, () => randomInt(min, max));
    }
    if (sort) nums.sort((a, b) => a - b);
    setResult(nums);
    const label = qty === 1 ? `${min}–${max}` : `${qty}× ${min}–${max}`;
    onResult({ id: Date.now().toString(), mode: "number", label, result: nums.join(", ") });
  };

  const display = result ? (result.length === 1 ? result[0].toString() : result.join(", ")) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Minimum", value: min, set: setMin },
          { label: "Maximum", value: max, set: setMax },
        ].map(({ label, value, set }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</label>
            <input type="number" value={value}
              onChange={e => set(parseInt(e.target.value) || 0)}
              data-testid={`input-${label.toLowerCase()}`}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">How Many Numbers</label>
        <input type="number" min={1} max={50} value={qty}
          onChange={e => setQty(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          data-testid="input-qty"
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400" />
      </div>

      {qty > 1 && (
        <div className="flex gap-3">
          {[
            { label: "No duplicates", val: unique, set: setUnique },
            { label: "Sort ascending", val: sort, set: setSort },
          ].map(({ label, val, set }) => (
            <button key={label} type="button" onClick={() => set(!val)}
              className={cn(
                "flex-1 py-2 rounded-xl border text-xs font-bold transition-all",
                val ? "bg-purple-600 border-purple-600 text-white" : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300"
              )}>{label}</button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <RollButton onClick={roll} label={qty === 1 ? "Generate Number" : `Generate ${qty} Numbers`} />

      {display && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <ResultDisplay key={display} result={display}
              sub={qty === 1 ? `Random number from ${min} to ${max}` : `${qty} random numbers from ${min} to ${max}`} />
          </AnimatePresence>
          <div className="px-4 pb-3 flex justify-center">
            <CopyBtn text={display} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── List mode ────────────────────────────────────────────────────────────────

function ListMode({ onResult }: { onResult: (entry: HistoryEntry) => void }) {
  const [raw, setRaw] = useState("");
  const [qty, setQty] = useState(1);
  const [picks, setPicks] = useState<string[] | null>(null);
  const [allItems, setAllItems] = useState<string[]>([]);
  const [error, setError] = useState("");

  const items = raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);

  const pick = () => {
    if (items.length === 0) { setError("Add at least one item to the list."); return; }
    if (qty > items.length) { setError(`Can't pick ${qty} unique items from a list of ${items.length}.`); return; }
    setError("");
    const picked = shuffle([...items]).slice(0, qty);
    setPicks(picked);
    setAllItems([...items]);
    onResult({ id: Date.now().toString(), mode: "list", label: `List of ${items.length}`, result: picked.join(", ") });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Items (one per line or comma-separated)</label>
        <textarea value={raw} onChange={e => { setRaw(e.target.value); setError(""); }}
          data-testid="input-list"
          placeholder={"Alice\nBob\nCarol\nDave\n\nor: Alice, Bob, Carol, Dave"}
          rows={6}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed" />
        {items.length > 0 && <p className="text-[10px] text-slate-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pick How Many</label>
        <input type="number" min={1} max={items.length || 1} value={qty}
          onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          data-testid="input-pick-qty"
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400" />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <RollButton onClick={pick} label={qty === 1 ? "Pick Random Winner" : `Pick ${qty} Random Items`} disabled={items.length === 0} />

      {picks && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {picks.length === 1 ? "Winner" : `Selected (${picks.length})`}
            </p>
          </div>
          <AnimatePresence mode="wait">
            <ResultDisplay key={picks.join(",")} result={picks.join(qty === 1 ? "" : "\n")}
              sub={`Selected from ${allItems.length} items`} />
          </AnimatePresence>
          <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/60 max-h-48 overflow-y-auto">
            {allItems.map((item, i) => {
              const isWinner = picks.includes(item);
              return (
                <div key={i} className={cn("flex items-center gap-3 px-4 py-2", isWinner && "bg-emerald-50 dark:bg-emerald-900/20")}>
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 w-5 text-right">{i + 1}</span>
                  <span className={cn("text-sm flex-1", isWinner ? "font-bold text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400")}>
                    {item}
                  </span>
                  {isWinner && <span className="text-emerald-500 text-xs font-black">PICKED</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dice mode ────────────────────────────────────────────────────────────────

function DiceMode({ onResult }: { onResult: (entry: HistoryEntry) => void }) {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [rolls, setRolls] = useState<number[] | null>(null);

  const roll = () => {
    const newRolls = Array.from({ length: count }, () => randomInt(1, sides));
    setRolls(newRolls);
    const total = newRolls.reduce((a, b) => a + b, 0) + modifier;
    const notation = `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}`;
    onResult({ id: Date.now().toString(), mode: "dice", label: notation, result: total.toString() });
  };

  const total = rolls ? rolls.reduce((a, b) => a + b, 0) + modifier : null;
  const minPossible = count * 1 + modifier;
  const maxPossible = count * sides + modifier;
  const avg = count * ((sides + 1) / 2) + modifier;

  return (
    <div className="space-y-4">
      {/* Dice selector */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Die Type</p>
        <div className="flex flex-wrap gap-2">
          {DICE_FACES.map(d => (
            <button key={d} type="button" data-testid={`die-d${d}`}
              onClick={() => setSides(d)}
              className={cn(
                "w-12 h-12 rounded-xl border font-black text-sm transition-all",
                sides === d
                  ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/30"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300"
              )}>
              d{d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Number of Dice</label>
          <input type="number" min={1} max={20} value={count}
            onChange={e => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            data-testid="input-dice-count"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Modifier (+/-)</label>
          <input type="number" value={modifier}
            onChange={e => setModifier(parseInt(e.target.value) || 0)}
            data-testid="input-modifier"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <span className="font-black text-purple-600 dark:text-purple-400">{count}</span>
        <span>d{sides}</span>
        {modifier !== 0 && <span className="text-purple-600 dark:text-purple-400">{modifier > 0 ? `+${modifier}` : modifier}</span>}
      </div>

      <RollButton onClick={roll} label={`Roll ${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}`} />

      {rolls && total !== null && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <ResultDisplay key={total.toString()} result={total.toString()}
              sub={count > 1 ? `Sum of ${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}` : `d${sides} roll`} />
          </AnimatePresence>
          {count > 1 && (
            <div className="px-4 pb-4 space-y-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {rolls.map((r, i) => (
                  <span key={i} className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-black text-sm flex items-center justify-center">
                    {r}
                  </span>
                ))}
                {modifier !== 0 && (
                  <span className="px-3 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-sm flex items-center">
                    {modifier > 0 ? `+${modifier}` : modifier}
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-slate-400 font-semibold">
                <span>Min: {minPossible}</span>
                <span>Avg: {avg.toFixed(1)}</span>
                <span>Max: {maxPossible}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Coin mode ────────────────────────────────────────────────────────────────

function CoinMode({ onResult }: { onResult: (entry: HistoryEntry) => void }) {
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [flipping, setFlipping] = useState(false);

  const flip = async () => {
    setFlipping(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 500));
    const res: "Heads" | "Tails" = rnd() < 0.5 ? "Heads" : "Tails";
    setResult(res);
    setFlipping(false);
    onResult({ id: Date.now().toString(), mode: "coin", label: "Coin Flip", result: res });
  };

  return (
    <div className="space-y-4">
      <RollButton onClick={flip} label="Flip Coin" disabled={flipping} />
      <AnimatePresence mode="wait">
        {(flipping || result) && (
          <div className="glass-panel rounded-2xl py-8 flex flex-col items-center gap-3">
            {flipping ? (
              <motion.div animate={{ rotateY: [0, 180, 360, 540, 720] }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 dark:from-yellow-400 dark:to-amber-600 flex items-center justify-center text-4xl shadow-lg">
                  🪙
                </div>
              </motion.div>
            ) : result && (
              <motion.div key={result} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <div className={cn(
                  "w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg text-white font-black",
                  result === "Heads" ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gradient-to-br from-slate-400 to-slate-600"
                )}>
                  <span className="text-3xl">{result === "Heads" ? "H" : "T"}</span>
                  <span className="text-xs mt-1">{result}</span>
                </div>
              </motion.div>
            )}
            {result && !flipping && (
              <p className="text-sm text-slate-500 dark:text-slate-400">50/50 random flip</p>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Weighted mode ────────────────────────────────────────────────────────────

function WeightedMode({ onResult }: { onResult: (entry: HistoryEntry) => void }) {
  const [options, setOptions] = useState<WeightedOption[]>([
    { id: "1", label: "Option A", weight: 50 },
    { id: "2", label: "Option B", weight: 30 },
    { id: "3", label: "Option C", weight: 20 },
  ]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const totalWeight = options.reduce((s, o) => s + o.weight, 0);

  const addOption = () => setOptions(prev => [...prev, { id: Date.now().toString(), label: `Option ${prev.length + 1}`, weight: 10 }]);

  const updateOption = (id: string, field: "label" | "weight", value: string | number) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const pick = () => {
    if (options.some(o => o.weight <= 0)) { setError("All weights must be greater than 0."); return; }
    if (totalWeight === 0) { setError("Total weight must be greater than 0."); return; }
    setError("");
    const r = rnd() * totalWeight;
    let cumulative = 0;
    for (const opt of options) {
      cumulative += opt.weight;
      if (r < cumulative) {
        setResult(opt.id);
        onResult({ id: Date.now().toString(), mode: "weighted", label: "Weighted pick", result: opt.label });
        return;
      }
    }
    const last = options[options.length - 1];
    setResult(last.id);
    onResult({ id: Date.now().toString(), mode: "weighted", label: "Weighted pick", result: last.label });
  };

  const winner = options.find(o => o.id === result);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map(opt => (
          <div key={opt.id} className={cn(
            "flex items-center gap-2 p-3 rounded-xl border transition-all",
            result === opt.id
              ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
              : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
          )}>
            <input type="text" value={opt.label}
              onChange={e => updateOption(opt.id, "label", e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none"
              placeholder="Option label"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <input type="number" min={1} max={9999} value={opt.weight}
                onChange={e => updateOption(opt.id, "weight", Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-xs font-mono text-right text-slate-700 dark:text-slate-200 outline-none"
              />
              <span className="text-[10px] text-slate-400 font-bold w-8">
                {totalWeight > 0 ? `${Math.round((opt.weight / totalWeight) * 100)}%` : "0%"}
              </span>
              {result === opt.id && <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">PICKED</span>}
              <button type="button" onClick={() => removeOption(opt.id)}
                disabled={options.length <= 2}
                className="text-slate-300 hover:text-red-400 disabled:opacity-20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addOption}
        className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
        <Plus className="w-3.5 h-3.5" /> Add option
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <RollButton onClick={pick} label="Pick Random (Weighted)" />

      {winner && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <ResultDisplay key={winner.id} result={winner.label}
              sub={`${Math.round((winner.weight / totalWeight) * 100)}% probability · weighted random`} />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────

function History({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Recent Results</p>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
        {entries.slice().reverse().map(e => (
          <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-14 shrink-0">{e.mode}</span>
            <span className="text-xs text-slate-400 flex-1">{e.label}</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{e.result}</span>
            <CopyBtn text={e.result} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RandomGenerator() {
  const [mode, setMode] = useState<Mode>("number");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setHistory(prev => [...prev.slice(-9), entry]);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
        {MODES.map(m => (
          <button key={m.id} type="button" data-testid={`tab-${m.id}`}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              mode === m.id
                ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}>
            <span>{m.emoji}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Active mode */}
      <div className="glass-panel rounded-2xl p-4">
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {mode === "number"   && <NumberMode   onResult={addToHistory} />}
            {mode === "list"     && <ListMode     onResult={addToHistory} />}
            {mode === "dice"     && <DiceMode     onResult={addToHistory} />}
            {mode === "coin"     && <CoinMode     onResult={addToHistory} />}
            {mode === "weighted" && <WeightedMode onResult={addToHistory} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reset history */}
      {history.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setHistory([])}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors">
            <RotateCcw className="w-3 h-3" /> Clear history
          </button>
        </div>
      )}

      <History entries={history} />
    </div>
  );
}
