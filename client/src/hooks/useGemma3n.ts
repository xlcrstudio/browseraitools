import { useState, useRef, useCallback } from "react";

export type Gemma3nState =
  | "idle"
  | "checking-cache"
  | "downloading"
  | "loading"
  | "ready"
  | "generating"
  | "error";

const MODEL_URL =
  "https://huggingface.co/google/gemma-3n-E4B-it-litert-lm/resolve/main/gemma-3n-E4B-it-int4-Web.litertlm";
const OPFS_FILENAME = "gemma-3n-e4b-int4-web.litertlm";
const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@0.10.22/wasm";

export interface Gemma3nHook {
  state: Gemma3nState;
  progress: string;
  downloadPct: number;
  error: string | null;
  isCached: boolean;
  initialize: () => Promise<void>;
  analyzeImage: (imgEl: HTMLImageElement, prompt: string) => Promise<string>;
}

async function checkOpfsCache(): Promise<boolean> {
  try {
    const root = await navigator.storage.getDirectory();
    await root.getFileHandle(OPFS_FILENAME);
    return true;
  } catch {
    return false;
  }
}

async function streamModelWithProgress(
  onProgress: (pct: number, msg: string) => void
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const root = await navigator.storage.getDirectory();

  const cached = await checkOpfsCache();
  if (cached) {
    onProgress(100, "Loading from cache…");
    const fileHandle = await root.getFileHandle(OPFS_FILENAME);
    const file = await fileHandle.getFile();
    const reader = file.stream().getReader() as ReadableStreamDefaultReader<Uint8Array>;
    return reader;
  }

  onProgress(0, "Starting download…");
  const response = await fetch(MODEL_URL);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength) : 4_500_000_000;

  const fileHandle = await root.getFileHandle(OPFS_FILENAME, { create: true });
  const writable = await fileHandle.createWritable();

  const srcReader = response.body!.getReader();
  let received = 0;

  const passthrough = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await srcReader.read();
          if (done) {
            await writable.close();
            controller.close();
            break;
          }
          await writable.write(value);
          controller.enqueue(value);
          received += value.length;
          const pct = Math.min(99, Math.round((received / total) * 100));
          const gb = (received / 1_073_741_824).toFixed(2);
          const totalGb = (total / 1_073_741_824).toFixed(1);
          onProgress(pct, `Downloading… ${pct}% · ${gb} / ${totalGb} GB`);
        }
      } catch (err) {
        await writable.abort();
        try {
          const root2 = await navigator.storage.getDirectory();
          await root2.removeEntry(OPFS_FILENAME);
        } catch {}
        controller.error(err);
      }
    },
  });

  return passthrough.getReader() as ReadableStreamDefaultReader<Uint8Array>;
}

export function useGemma3n(): Gemma3nHook {
  const [state, setState] = useState<Gemma3nState>("idle");
  const [progress, setProgress] = useState("");
  const [downloadPct, setDownloadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const engineRef = useRef<any>(null);
  const initStarted = useRef(false);

  const initialize = useCallback(async () => {
    if (engineRef.current || initStarted.current) return;
    initStarted.current = true;
    setError(null);

    try {
      setState("checking-cache");
      setProgress("Checking for cached model…");
      const cached = await checkOpfsCache();
      setIsCached(cached);

      setState("downloading");
      const modelReader = await streamModelWithProgress((pct, msg) => {
        setDownloadPct(pct);
        setProgress(msg);
      });

      setState("loading");
      setProgress("Initializing Gemma 3n…");

      const { FilesetResolver, LlmInference } = await import("@mediapipe/tasks-genai");
      const genai = await FilesetResolver.forGenAiTasks(WASM_CDN);

      engineRef.current = await LlmInference.createFromOptions(genai, {
        baseOptions: { modelAssetBuffer: modelReader as any },
        maxTokens: 1024,
        topK: 40,
        temperature: 0.7,
        randomSeed: 42,
        maxNumImages: 1,
      });

      setIsCached(true);
      setState("ready");
      setProgress("");
      setDownloadPct(100);
    } catch (err: any) {
      initStarted.current = false;
      engineRef.current = null;
      setState("error");
      const msg = err.message || "Failed to load model";
      setError(msg.includes("fetch") || msg.includes("Download")
        ? "Could not download the model. Check your connection and try again."
        : msg.includes("memory") || msg.includes("Memory")
        ? "Not enough memory. Try closing other tabs and reload."
        : msg);
    }
  }, []);

  const analyzeImage = useCallback(
    async (imgEl: HTMLImageElement, prompt: string): Promise<string> => {
      if (!engineRef.current) throw new Error("Model not loaded");
      setState("generating");
      try {
        const result = await engineRef.current.generateResponse([
          "<start_of_turn>user\n",
          prompt + " ",
          { imageSource: imgEl },
          "<end_of_turn>\n<start_of_turn>model\n",
        ]);
        setState("ready");
        return result as string;
      } catch (err: any) {
        setState("ready");
        throw err;
      }
    },
    []
  );

  return { state, progress, downloadPct, error, isCached, initialize, analyzeImage };
}
