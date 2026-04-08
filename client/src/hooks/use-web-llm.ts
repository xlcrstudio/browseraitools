import { useState, useRef, useCallback, useEffect } from "react";
import { getSelectedModelId } from "@/lib/models";

// ── Dynamic WebLLM loader ────────────────────────────────────────────────
let webllm: any = null;

async function getWebLLM() {
  if (!webllm) {
    webllm = await import("@mlc-ai/web-llm");
  }
  return webllm;
}

// ── GPU device-lost suppressor ───────────────────────────────────────────
if (typeof window !== "undefined") {
  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      const msg = String(
        event.reason?.message ?? event.reason ?? "",
      ).toLowerCase();
      if (
        msg.includes("instance dropped") ||
        msg.includes("external instance") ||
        msg.includes("a valid external") ||
        msg.includes("no longer exists") ||
        msg.includes("device was lost") ||
        msg.includes("device lost") ||
        msg.includes("poperrorscope") ||
        msg.includes("mapasync") ||
        msg.includes("webgpu") ||
        msg.includes("gpu")
      ) {
        event.preventDefault();
      }
    },
    true,
  );
}

const STALE_MODEL_IDS = ["Llama-3.1-8B-Instruct-q4f16_1-MLC"];

export type WebLLMState =
  | "idle"
  | "checking-gpu"
  | "downloading"
  | "ready"
  | "generating"
  | "error";

async function clearStaleModelCache() {
  const { hasModelInCache, deleteModelAllInfoInCache } = await getWebLLM();

  for (const oldId of STALE_MODEL_IDS) {
    try {
      const cached = await hasModelInCache(oldId);
      if (cached) {
        await deleteModelAllInfoInCache(oldId);
        console.log(`Cleared stale cache for ${oldId}`);
      }
    } catch {}
  }
}

export function useWebLLM() {
  const [state, setState] = useState<WebLLMState>("checking-gpu");
  const [progress, setProgress] = useState<{ text: string; percent: number }>({
    text: "Preparing AI engine...",
    percent: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const engineRef = useRef<any>(null);
  const initStarted = useRef(false);

  const initProgressCallback = useCallback(
    (report: { text: string; progress?: number }) => {
      const match = report.text.match(/\[(\d+)\/(\d+)\]/);
      let percent = 0;

      if (match && match[1] && match[2]) {
        percent = (parseInt(match[1]) / parseInt(match[2])) * 100;
      } else if (report.progress) {
        percent = report.progress * 100;
      }

      setProgress({ text: report.text, percent: Math.round(percent) });
    },
    [],
  );

  const initialize = useCallback(async () => {
    if (engineRef.current) return true;
    if (initStarted.current) return false;

    initStarted.current = true;

    const modelId = getSelectedModelId();

    setState("checking-gpu");
    setError(null);

    if (!(navigator as any).gpu) {
      setState("error");
      setError("Your browser doesn't support WebGPU. Use Chrome/Edge latest.");
      return false;
    }

    await clearStaleModelCache();

    try {
      setState("downloading");

      const { CreateMLCEngine } = await getWebLLM();

      const engine = await CreateMLCEngine(modelId, {
        initProgressCallback,
      });

      engineRef.current = engine;
      setState("ready");
      return true;
    } catch (err: any) {
      console.error("WebLLM Init Error:", err);

      try {
        const { deleteModelAllInfoInCache, CreateMLCEngine } =
          await getWebLLM();

        console.log("Retrying after clearing cache...");
        await deleteModelAllInfoInCache(modelId);

        const engine = await CreateMLCEngine(modelId, {
          initProgressCallback,
        });

        engineRef.current = engine;
        setState("ready");
        return true;
      } catch (retryErr: any) {
        console.error("Retry failed:", retryErr);
        setState("error");
        setError(retryErr.message || "Failed to initialize AI engine.");
        return false;
      }
    }
  }, [initProgressCallback]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const doGenerate = async (opts: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature?: number;
    maxTokens?: number;
    onChunk: (text: string) => void;
  }) => {
    const chunks = await engineRef.current.chat.completions.create({
      messages: opts.messages,
      stream: true,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 500,
    });

    let fullText = "";

    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      opts.onChunk(fullText);
    }

    return fullText;
  };

  const isDeviceLostError = (err: any): boolean => {
    const msg = String(err?.message || err || "").toLowerCase();
    return (
      msg.includes("device") || msg.includes("instance") || msg.includes("gpu")
    );
  };

  const generateRaw = useCallback(
    async (opts: {
      messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      temperature?: number;
      maxTokens?: number;
      onChunk: (text: string) => void;
    }) => {
      if (!engineRef.current) return null;

      setState("generating");
      setError(null);

      try {
        const result = await doGenerate(opts);
        setState("ready");
        return result;
      } catch (err: any) {
        console.error("Generation Error:", err);

        if (isDeviceLostError(err)) {
          try {
            engineRef.current = null;
            initStarted.current = false;
            setState("downloading");

            const { CreateMLCEngine } = await getWebLLM();

            const engine = await CreateMLCEngine(getSelectedModelId(), {
              initProgressCallback,
            });

            engineRef.current = engine;

            const result = await doGenerate(opts);
            setState("ready");
            return result;
          } catch (retryErr: any) {
            setState("error");
            setError("GPU lost. Refresh and try again.");
            return null;
          }
        }

        setState("error");
        setError(err.message || "Generation failed.");
        return null;
      }
    },
    [initProgressCallback],
  );

  const generate = useCallback(
    async (
      platform: string,
      tone: string,
      topic: string,
      onChunk: (text: string) => void,
    ) => {
      const prompt = `Create 5 viral hooks for a ${platform} post about "${topic}" in a ${tone} tone.

Rules:
- One per line
- No numbering
- No bullets
- No quotes`;

      return generateRaw({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 500,
        onChunk,
      });
    },
    [generateRaw],
  );

  return {
    state,
    progress,
    error,
    initialize,
    generate,
    generateRaw,
  };
}
