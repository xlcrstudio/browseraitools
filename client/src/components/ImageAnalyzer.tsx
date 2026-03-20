import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Eye, Tag, Smile, Palette, Copy, Check, Download,
  X, RefreshCw, Loader2, AlertCircle, Sparkles,
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
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

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

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      data-testid="button-copy-text"
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function AnalysisCard({ icon: Icon, title, children, index }: {
  icon: any; title: string; children: React.ReactNode; index: number;
}) {
  return (
    <motion.div
      custom={index} variants={CARD_VARIANTS} initial="hidden" animate="visible"
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm"
    >
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

async function resizeAndEncode(file: File): Promise<{ imageData: ImageData }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1024;
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
            const objectUrl = URL.createObjectURL(blob!);
            resolve({
              imageData: {
                base64: b64,
                mediaType: "image/jpeg",
                url: objectUrl,
                name: file.name,
                width: w,
                height: h,
                sizeKB: Math.round(blob!.size / 1024),
              },
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
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/)) {
      toast({ title: "Unsupported format", description: "Please upload JPG, PNG, WebP, or GIF.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum size is 20 MB.", variant: "destructive" });
      return;
    }

    setAnalysis(null);
    setAnalyzing(true);

    try {
      const { imageData: imgData } = await resizeAndEncode(file);
      setImageData(imgData);

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: imgData.base64, mediaType: imgData.mediaType }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");

      setAnalysis({
        description: json.analysis.description || "",
        objects: Array.isArray(json.analysis.objects) ? json.analysis.objects : [],
        text_content: Array.isArray(json.analysis.text_content) ? json.analysis.text_content : [],
        emotions: {
          mood: json.analysis.emotions?.mood || "neutral",
          indicators: Array.isArray(json.analysis.emotions?.indicators) ? json.analysis.emotions.indicators : [],
        },
        context: json.analysis.context || "",
        colors: {
          dominant: Array.isArray(json.analysis.colors?.dominant) ? json.analysis.colors.dominant : [],
          palette_mood: json.analysis.colors?.palette_mood || "",
        },
        composition: json.analysis.composition || "",
        insights: json.analysis.insights || "",
        tags: Array.isArray(json.analysis.tags) ? json.analysis.tags : [],
      });
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
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
    setAnalyzing(false);
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

${analysis.text_content.length ? `## Text Found\n${analysis.text_content.map(t => `- ${t}`).join("\n")}\n\n` : ""}## Mood & Emotions
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
      <AnimatePresence mode="wait">
        {!imageData && !analyzing && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
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
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">or click to browse — JPG, PNG, WebP, GIF · max 20 MB</p>
              </div>
              <input
                ref={fileRef} type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden" onChange={onFileChange}
                data-testid="input-image-upload"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyzing */}
      {analyzing && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
          {imageData && (
            <img src={imageData.url} alt="Analyzing"
              className="w-full max-h-64 object-contain bg-slate-50 dark:bg-slate-900" />
          )}
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-slate-700 dark:text-slate-200 font-medium">Analyzing your image…</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Powered by Claude Vision · usually takes 2–5 seconds</p>
          </div>
        </div>
      )}

      {/* Results */}
      {imageData && analysis && !analyzing && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="relative">
              <img
                src={imageData.url} alt={imageData.name}
                className="w-full max-h-[420px] object-contain bg-slate-50 dark:bg-slate-900"
              />
              <button
                onClick={reset} data-testid="button-reset-image"
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shadow-sm"
              >
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
                <button
                  onClick={copyAllText} data-testid="button-copy-all"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button
                  onClick={downloadAnalysis} data-testid="button-download-analysis"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button
                  onClick={() => { reset(); setTimeout(() => fileRef.current?.click(), 50); }}
                  data-testid="button-analyze-new"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Analyze New
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFileChange} />
              </div>
            </div>
          </div>

          {analysis.tags.length > 0 && (
            <div className="flex flex-wrap gap-2" data-testid="tags-container">
              {analysis.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-800/40">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCard icon={Eye} title="Description" index={0}>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" data-testid="text-description">
                {analysis.description}
              </p>
              {analysis.insights && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">{analysis.insights}</p>
              )}
            </AnalysisCard>

            {analysis.objects.length > 0 && (
              <AnalysisCard icon={Tag} title="Objects Detected" index={1}>
                <div className="flex flex-wrap gap-1.5" data-testid="objects-container">
                  {analysis.objects.map((obj, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-100 dark:border-slate-600">
                      {obj}
                    </span>
                  ))}
                </div>
              </AnalysisCard>
            )}

            {(analysis.emotions.mood || analysis.context) && (
              <AnalysisCard icon={Smile} title="Mood & Context" index={2}>
                {analysis.emotions.mood && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-100 dark:border-amber-800/40" data-testid="text-mood">
                      {analysis.emotions.mood}
                    </span>
                  </div>
                )}
                {analysis.emotions.indicators.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {analysis.emotions.indicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-purple-400 mt-0.5">•</span>{ind}
                      </li>
                    ))}
                  </ul>
                )}
                {analysis.context && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-2" data-testid="text-context">
                    {analysis.context}
                  </p>
                )}
              </AnalysisCard>
            )}

            {analysis.colors.dominant.length > 0 && (
              <AnalysisCard icon={Palette} title="Color Palette" index={3}>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2" data-testid="colors-container">
                    {analysis.colors.dominant.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm"
                          style={{ backgroundColor: colorSwatch(c) }} />
                        <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{c}</span>
                      </div>
                    ))}
                  </div>
                  {analysis.colors.palette_mood && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">{analysis.colors.palette_mood}</p>
                  )}
                </div>
              </AnalysisCard>
            )}

            {analysis.composition && (
              <AnalysisCard icon={Sparkles} title="Composition" index={4}>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysis.composition}</p>
              </AnalysisCard>
            )}

            {analysis.text_content.length > 0 && (
              <AnalysisCard icon={Eye} title="Text Detected" index={5}>
                <div className="space-y-1" data-testid="text-content-container">
                  {analysis.text_content.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded break-all">{t}</span>
                      <CopyBtn text={t} />
                    </div>
                  ))}
                </div>
              </AnalysisCard>
            )}
          </div>

          {/* Powered by badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-1">
            <AlertCircle className="w-3 h-3" />
            <span>Analyzed by Claude Vision · your image is not stored</span>
          </div>
        </div>
      )}
    </div>
  );
}
