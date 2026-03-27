import { useState, useMemo } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Color math ───────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function hslToHex(h: number, s: number, l: number): string {
  return rgbToHex(...hslToRgb(h, s, l));
}

// ─── WCAG contrast ────────────────────────────────────────────────────────────

function linearize(c: number): number {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(...hexToRgb(hex1));
  const l2 = relativeLuminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

// ─── Palette generation ───────────────────────────────────────────────────────

function rotateHue(h: number, deg: number): number {
  return ((h + deg) % 360 + 360) % 360;
}

type ColorEntry = { hex: string; name: string; role: string };

function generatePalette(baseHex: string, harmony: HarmonyType): ColorEntry[] {
  const [r, g, b] = hexToRgb(baseHex);
  const [h, s, l] = rgbToHsl(r, g, b);

  const mkColor = (hue: number, sat: number, lum: number, name: string, role: string): ColorEntry => ({
    hex: hslToHex(hue, sat, lum),
    name,
    role,
  });

  switch (harmony) {
    case "monochromatic":
      return [
        mkColor(h, s, Math.min(l + 40, 95), "Lightest", "Backgrounds, large areas"),
        mkColor(h, s, Math.min(l + 25, 85), "Light", "Hover states, subtle fills"),
        mkColor(h, s, l, "Base", "Primary brand color"),
        mkColor(h, s, Math.max(l - 20, 15), "Dark", "Darker variant, pressed states"),
        mkColor(h, s, Math.max(l - 38, 8), "Darkest", "Text, deep shadows"),
      ];
    case "complementary":
      return [
        mkColor(h, s, l, "Primary", "Main brand color"),
        mkColor(h, s, Math.min(l + 20, 90), "Primary Light", "Tinted accent"),
        mkColor(rotateHue(h, 180), s, l, "Complement", "High-contrast accent"),
        mkColor(rotateHue(h, 180), s, Math.min(l + 20, 90), "Complement Light", "Subtle complement"),
        mkColor(h, 10, 92, "Neutral", "Backgrounds, cards"),
      ];
    case "analogous":
      return [
        mkColor(rotateHue(h, -30), s, l, "Analogous −30°", "Left neighbor on color wheel"),
        mkColor(rotateHue(h, -15), s, Math.min(l + 10, 90), "Warm Tint", "Bridging tint"),
        mkColor(h, s, l, "Base", "Primary color"),
        mkColor(rotateHue(h, 15), s, Math.min(l + 10, 90), "Cool Tint", "Bridging tint"),
        mkColor(rotateHue(h, 30), s, l, "Analogous +30°", "Right neighbor on color wheel"),
      ];
    case "triadic":
      return [
        mkColor(h, s, l, "Primary", "First triadic color"),
        mkColor(h, s, Math.min(l + 25, 88), "Primary Tint", "Light variant"),
        mkColor(rotateHue(h, 120), s, l, "Secondary", "Second triadic color"),
        mkColor(rotateHue(h, 240), s, l, "Tertiary", "Third triadic color"),
        mkColor(h, 8, 94, "Neutral", "Backgrounds"),
      ];
    case "split-complementary":
      return [
        mkColor(h, s, l, "Primary", "Base color"),
        mkColor(h, s, Math.min(l + 20, 88), "Primary Tint", "Light variant"),
        mkColor(rotateHue(h, 150), s, l, "Split A", "First split-complement"),
        mkColor(rotateHue(h, 210), s, l, "Split B", "Second split-complement"),
        mkColor(h, 8, 94, "Neutral", "Backgrounds, cards"),
      ];
    case "tetradic":
      return [
        mkColor(h, s, l, "Primary", "First color"),
        mkColor(rotateHue(h, 90), s, l, "Secondary", "Second color (+90°)"),
        mkColor(rotateHue(h, 180), s, l, "Complement", "Third color (+180°)"),
        mkColor(rotateHue(h, 270), s, l, "Accent", "Fourth color (+270°)"),
        mkColor(h, 8, 94, "Neutral", "Backgrounds"),
      ];
    case "shades":
      return [
        mkColor(h, s, 92, "50", "Lightest tint"),
        mkColor(h, s, 82, "100", "Very light tint"),
        mkColor(h, s, 68, "200", "Light tint"),
        mkColor(h, s, 58, "300", "Tint"),
        mkColor(h, s, 48, "400", "Mid tint"),
        mkColor(h, Math.min(s + 5, 100), l < 50 ? l : 42, "500", "Base (closest to input)"),
        mkColor(h, Math.min(s + 8, 100), 34, "600", "Shade"),
        mkColor(h, Math.min(s + 10, 100), 26, "700", "Dark shade"),
        mkColor(h, Math.min(s + 12, 100), 18, "800", "Darker shade"),
        mkColor(h, Math.min(s + 14, 100), 10, "900", "Darkest shade"),
      ];
    default:
      return [];
  }
}

// ─── Harmony names ─────────────────────────────────────────────────────────────

type HarmonyType = "monochromatic" | "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "shades";

const HARMONIES: Array<{ id: HarmonyType; label: string; desc: string }> = [
  { id: "monochromatic", label: "Mono", desc: "One hue, varied lightness" },
  { id: "complementary", label: "Complementary", desc: "Opposite hues, high contrast" },
  { id: "analogous", label: "Analogous", desc: "Adjacent hues, harmonious" },
  { id: "triadic", label: "Triadic", desc: "3 evenly-spaced hues" },
  { id: "split-complementary", label: "Split Comp.", desc: "Softer than complementary" },
  { id: "tetradic", label: "Tetradic", desc: "4 hues, rich & diverse" },
  { id: "shades", label: "Shades 50–900", desc: "Full shade scale" },
];

// ─── Is hex dark? ─────────────────────────────────────────────────────────────

function isDark(hex: string): boolean {
  return relativeLuminance(...hexToRgb(hex)) < 0.35;
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={cn(
        "flex items-center gap-1 text-[10px] font-bold transition-colors px-1.5 py-0.5 rounded",
        copied ? "text-green-500" : "text-slate-400 hover:text-purple-600"
      )}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label ?? text}
    </button>
  );
}

// ─── Color swatch card ────────────────────────────────────────────────────────

function ColorCard({ color }: { color: ColorEntry }) {
  const [copied, setCopied] = useState(false);
  const [r, g, b] = hexToRgb(color.hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const dark = isDark(color.hex);
  const contrastWhite = contrastRatio(color.hex, "#ffffff");
  const contrastBlack = contrastRatio(color.hex, "#000000");

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
      {/* Swatch */}
      <button type="button" onClick={handleCopy}
        className="w-full h-28 flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer relative group"
        style={{ backgroundColor: color.hex }}>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
          dark ? "bg-white/20 text-white" : "bg-black/10 text-black"
        )}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Click to copy"}
        </div>
      </button>

      {/* Info */}
      <div className="bg-white dark:bg-slate-900 px-3 py-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{color.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{color.role}</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 tabular-nums">{color.hex.toUpperCase()}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          <CopyBtn text={color.hex.toUpperCase()} />
          <CopyBtn text={`rgb(${r}, ${g}, ${b})`} />
          <CopyBtn text={`hsl(${h}, ${s}%, ${l}%)`} />
        </div>

        {/* Contrast badges */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { bg: "White", ratio: contrastWhite, bgHex: "#ffffff" },
            { bg: "Black", ratio: contrastBlack, bgHex: "#000000" },
          ].map(({ bg, ratio }) => {
            const passAA = ratio >= 4.5;
            const passAAA = ratio >= 7;
            return (
              <span key={bg} className={cn(
                "text-[9px] font-black px-1.5 py-0.5 rounded",
                passAAA ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : passAA ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              )}>
                on {bg} {ratio}:1 {passAAA ? "AAA" : passAA ? "AA" : "✕"}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Random pleasing color ────────────────────────────────────────────────────

function randomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 30);
  const l = 35 + Math.floor(Math.random() * 25);
  return hslToHex(h, s, l);
}

// ─── Main component ───────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Ocean", hex: "#0077B6" },
  { label: "Forest", hex: "#2D6A4F" },
  { label: "Sunset", hex: "#E63946" },
  { label: "Lavender", hex: "#7B2D8B" },
  { label: "Amber", hex: "#E76F00" },
  { label: "Slate", hex: "#475569" },
];

export function ColorPaletteGenerator() {
  const [baseHex, setBaseHex] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [harmony, setHarmony] = useState<HarmonyType>("complementary");
  const [copied, setCopied] = useState(false);

  const palette = useMemo(() => generatePalette(baseHex, harmony), [baseHex, harmony]);

  const isValidHex = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s);

  const handleHexInput = (val: string) => {
    setHexInput(val);
    const norm = val.startsWith("#") ? val : "#" + val;
    if (isValidHex(norm)) { setBaseHex(norm); }
  };

  const handlePickerChange = (val: string) => {
    setBaseHex(val);
    setHexInput(val);
  };

  const cssVars = palette.map((c, i) => `  --color-${i + 1}: ${c.hex.toUpperCase()}; /* ${c.name} */`).join("\n");
  const cssOutput = `:root {\n${cssVars}\n}`;

  const copyAll = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">

      {/* Picker row */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center gap-4">
        {/* Native color picker */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner">
            <input type="color" value={baseHex} onChange={e => handlePickerChange(e.target.value)}
              data-testid="input-color-picker"
              className="absolute inset-0 w-full h-full cursor-pointer border-none bg-transparent p-0 opacity-0" />
            <div className="w-full h-full rounded-xl" style={{ backgroundColor: baseHex }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-xl cursor-pointer">
              <span className="text-white text-[10px] font-bold">Pick</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hex Code</label>
            <input type="text" value={hexInput}
              onChange={e => handleHexInput(e.target.value)}
              data-testid="input-hex"
              placeholder="#6366f1"
              className={cn(
                "w-28 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-purple-400",
                isValidHex(hexInput) ? "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100" : "border-red-300 text-red-500"
              )} />
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 flex-1">
          {PRESETS.map(p => (
            <button key={p.hex} type="button" title={p.label}
              onClick={() => { setBaseHex(p.hex); setHexInput(p.hex); }}
              className={cn(
                "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110",
                baseHex === p.hex ? "border-purple-500 scale-110" : "border-slate-200 dark:border-slate-700"
              )}
              style={{ backgroundColor: p.hex }} />
          ))}
          <button type="button" onClick={() => { const c = randomColor(); setBaseHex(c); setHexInput(c); }}
            className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-purple-400 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* CSS copy */}
        <button type="button" onClick={copyAll}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
            copied ? "bg-emerald-50 border-emerald-300 text-emerald-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300"
          )}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy as CSS"}
        </button>
      </div>

      {/* Harmony selector */}
      <div className="flex flex-wrap gap-2">
        {HARMONIES.map(h => (
          <button key={h.id} type="button" data-testid={`harmony-${h.id}`}
            onClick={() => setHarmony(h.id)}
            className={cn(
              "flex flex-col items-start px-3.5 py-2.5 rounded-xl border text-left transition-all",
              harmony === h.id
                ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/20"
                : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700"
            )}>
            <span className="text-xs font-black">{h.label}</span>
            <span className={cn("text-[10px] mt-0.5", harmony === h.id ? "text-purple-200" : "text-slate-400")}>{h.desc}</span>
          </button>
        ))}
      </div>

      {/* Palette strip preview */}
      <div className="flex h-14 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        {palette.map((c, i) => (
          <div key={i} className="flex-1 transition-all" style={{ backgroundColor: c.hex }} title={`${c.name} — ${c.hex.toUpperCase()}`} />
        ))}
      </div>

      {/* Color cards */}
      <div className={cn(
        "grid gap-3",
        palette.length <= 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      )}>
        {palette.map((c, i) => <ColorCard key={i} color={c} />)}
      </div>

      {/* CSS output */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">CSS Variables</p>
          <div className="flex items-center gap-2"><InlineShareButtons /><button type="button" onClick={copyAll}
            className={cn("flex items-center gap-1.5 text-xs font-semibold transition-colors", copied ? "text-green-500" : "text-slate-400 hover:text-purple-600")}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button></div>
        </div>
        <pre className="px-4 py-4 text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed overflow-x-auto">
          {cssOutput}
        </pre>
      </div>
    </div>
  );
}
