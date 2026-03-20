import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Image as ImageIcon, Loader2, Copy, Check, Download,
  Eye, Tag, Type, Smile, Palette, Info, Sparkles, X, RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Analysis {
  description: string;
  objects: string[];
  text_content: string[];
  emotions: { mood: string; indicators: string[] };
  context: string;
  colors: { dominant: string[]; palette_mood: string };
  composition: string;
  insights: string;
  tags: string[];
}

interface ImageData {
  base64: string;
  mediaType: string;
  url: string;
  name: string;
  width: number;
  height: number;
  sizeKB: number;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.35 } }),
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} data-testid="button-copy-text"
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function AnalysisCard({ icon: Icon, title, children, index }: {
  icon: any; title: string; children: React.ReactNode; index: number;
}) {
  return (
    <motion.div custom={index} variants={CARD_VARIANTS} initial="hidden" animate="visible"
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-purple-500" />
        </div>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

const COLOR_NAME_MAP: Record<string, string> = {
  red: "#ef4444", orange: "#f97316", amber: "#f59e0b", yellow: "#eab308",
  lime: "#84cc16", green: "#22c55e", emerald: "#10b981", teal: "#14b8a6",
  cyan: "#06b6d4", sky: "#0ea5e9", blue: "#3b82f6", indigo: "#6366f1",
  violet: "#8b5cf6", purple: "#a855f7", fuchsia: "#d946ef", pink: "#ec4899",
  rose: "#f43f5e", white: "#f8fafc", black: "#1e293b", gray: "#94a3b8",
  grey: "#94a3b8", brown: "#92400e", beige: "#d4c9a8",
};

function colorSwatch(name: string) {
  const lower = name.toLowerCase();
  const match = Object.keys(COLOR_NAME_MAP).find(k => lower.includes(k));
  return match ? COLOR_NAME_MAP[match] : "#94a3b8";
}

async function resizeAndEncode(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1600;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h / w) * MAX); w = MAX; }
          else { w = Math.round((w / h) * MAX); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Conversion failed"));
          const r2 = new FileReader();
          r2.onload = (ev) => {
            const dataUrl = ev.target!.result as string;
            const b64 = dataUrl.split(",")[1];
            resolve({
              base64: b64,
              mediaType: "image/jpeg",
              url: URL.createObjectURL(blob!),
              name: file.name,
              width: w,
              height: h,
              sizeKB: Math.round(blob!.size / 1024),
            });
          };
          r2.readAsDataURL(blob!);
        }, "image/jpeg", 0.88);
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageAnalyzer() {
  const { toast } = useToast();
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/)) {
      toast({ title: "Unsupported format", description: "Please upload JPG, PNG, WebP, or GIF.", variant: "destructive" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum size is 8MB.", variant: "destructive" });
      return;
    }
    setAnalysis(null);
    setLoading(true);
    try {
      const data = await resizeAndEncode(file);
      setImageData(data);
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: data.base64, mediaType: data.mediaType }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Analysis failed");
      const json = await res.json();
      setAnalysis(json.analysis);
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const reset = () => {
    setImageData(null);
    setAnalysis(null);
    setLoading(false);
  };

  const copyAllText = () => {
    if (!analysis) return;
    const parts = [
      `Description: ${analysis.description}`,
      `Objects: ${analysis.objects.join(", ")}`,
      analysis.text_content.length ? `Text found: ${analysis.text_content.join(" | ")}` : null,
      `Mood: ${analysis.emotions.mood}`,
      `Context: ${analysis.context}`,
      `Colors: ${analysis.colors.dominant.join(", ")}`,
      `Insights: ${analysis.insights}`,
      `Tags: ${analysis.tags.map(t => "#" + t).join(" ")}`,
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(parts);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadAnalysis = () => {
    if (!analysis) return;
    const md = `# Image Analysis: ${imageData?.name ?? "image"}

## Description
${analysis.description}

## Objects Detected
${analysis.objects.map(o => `- ${o}`).join("\n")}

${analysis.text_content.length ? `## Text Found\n${analysis.text_content.map(t => `- ${t}`).join("\n")}\n` : ""}
## Mood & Emotions
**Mood:** ${analysis.emotions.mood}
${analysis.emotions.indicators.map(i => `- ${i}`).join("\n")}

## Context
${analysis.context}

## Color Palette
${analysis.colors.dominant.map(c => `- ${c}`).join("\n")}
*Palette mood: ${analysis.colors.palette_mood}*

## Composition
${analysis.composition}

## Insights
${analysis.insights}

## Tags
${analysis.tags.map(t => "#" + t).join(" ")}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "image-analysis.md"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      {!imageData && !loading && (
        <div
          data-testid="dropzone-image"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center gap-4 text-center
            ${dragOver
              ? "border-purple-400 bg-purple-50/60 dark:bg-purple-900/20 scale-[1.01]"
              : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
            }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-sm">
            <Upload className="w-7 h-7 text-purple-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Drop your image here</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">or click to browse — JPG, PNG, WebP, GIF · max 8 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden" onChange={onFileChange} data-testid="input-image-upload" />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 flex flex-col items-center gap-4">
          {imageData && (
            <img src={imageData.url} alt="Uploading" className="max-h-48 rounded-xl object-contain opacity-60" />
          )}
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Analyzing image with AI vision…</p>
          <p className="text-slate-400 text-sm">This takes a few seconds</p>
        </div>
      )}

      {/* Image + results */}
      {imageData && analysis && !loading && (
        <div className="space-y-5">
          {/* Image preview + action bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="relative">
              <img src={imageData.url} alt={imageData.name}
                className="w-full max-h-[420px] object-contain bg-slate-50 dark:bg-slate-900" />
              <button onClick={reset} data-testid="button-reset-image"
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-image-name" className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{imageData.name}</span>
                <span>{imageData.width} × {imageData.height}px</span>
                <span>{imageData.sizeKB} KB</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyAllText} data-testid="button-copy-all"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button onClick={downloadAnalysis} data-testid="button-download-analysis"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button onClick={() => fileRef.current?.click()} data-testid="button-analyze-new"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Analyze New
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden" onChange={onFileChange} />
              </div>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2" data-testid="tags-container">
            {analysis.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-800/40">
                #{tag}
              </span>
            ))}
          </div>

          {/* Analysis cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Description */}
            <AnalysisCard icon={Eye} title="Description" index={0}>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" data-testid="text-description">{analysis.description}</p>
              {analysis.insights && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">{analysis.insights}</p>
              )}
            </AnalysisCard>

            {/* Objects */}
            <AnalysisCard icon={Tag} title="Objects Detected" index={1}>
              <div className="flex flex-wrap gap-1.5" data-testid="objects-container">
                {analysis.objects.map((obj, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-100 dark:border-slate-600">
                    {obj}
                  </span>
                ))}
              </div>
            </AnalysisCard>

            {/* Mood & Context */}
            <AnalysisCard icon={Smile} title="Mood & Context" index={2}>
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-100 dark:border-amber-800/40" data-testid="text-mood">
                  {analysis.emotions.mood}
                </span>
              </div>
              <ul className="space-y-1 mb-3">
                {analysis.emotions.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-purple-400 mt-0.5">•</span>{ind}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-2" data-testid="text-context">{analysis.context}</p>
            </AnalysisCard>

            {/* Color Palette */}
            <AnalysisCard icon={Palette} title="Color Palette" index={3}>
              <div className="space-y-2" data-testid="colors-container">
                {analysis.colors.dominant.map((color, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md shadow-sm border border-white/20 shrink-0"
                      style={{ backgroundColor: colorSwatch(color) }} />
                    <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{color}</span>
                  </div>
                ))}
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-2">{analysis.colors.palette_mood}</p>
              </div>
            </AnalysisCard>

            {/* Text / OCR */}
            {analysis.text_content.length > 0 && (
              <AnalysisCard icon={Type} title="Text Found in Image" index={4}>
                <div className="space-y-1.5" data-testid="text-content-container">
                  {analysis.text_content.map((line, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/60">
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">"{line}"</p>
                      <CopyBtn text={line} />
                    </div>
                  ))}
                </div>
              </AnalysisCard>
            )}

            {/* Composition */}
            <AnalysisCard icon={ImageIcon} title="Composition & Lighting" index={5}>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" data-testid="text-composition">{analysis.composition}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>{imageData.width} × {imageData.height} px · {imageData.sizeKB} KB</span>
              </div>
            </AnalysisCard>
          </div>

          {/* Viral actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Quick Copy</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: "Description", value: analysis.description },
                { label: "Tags", value: analysis.tags.map(t => "#" + t).join(" ") },
                { label: "Mood", value: analysis.emotions.mood },
                { label: "Context", value: analysis.context },
                { label: "Colors", value: analysis.colors.dominant.join(", ") },
                { label: "Objects", value: analysis.objects.join(", ") },
              ].map(({ label, value }) => (
                <QuickCopyBtn key={label} label={label} value={value} />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function QuickCopyBtn({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button onClick={copy} data-testid={`button-quick-copy-${label.toLowerCase()}`}
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
      <span className="truncate">{copied ? "Copied!" : label}</span>
      {copied ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <Copy className="w-3 h-3 shrink-0 text-slate-300" />}
    </button>
  );
}
