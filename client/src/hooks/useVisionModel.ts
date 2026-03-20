import { useState, useRef, useCallback } from "react";

export type VisionModelState =
  | "idle"
  | "downloading"
  | "ready"
  | "generating"
  | "error";

export interface VisionModelHook {
  state: VisionModelState;
  progress: string;
  downloadPct: number;
  error: string | null;
  initialize: () => Promise<void>;
  analyzeImage: (imgEl: HTMLImageElement, prompt: string) => Promise<string>;
}

const MODEL_ID = "HuggingFaceTB/SmolVLM-256M-Instruct";

function isGpuLostError(err: any): boolean {
  const msg: string = err?.message ?? "";
  return (
    msg.includes("Device is lost") ||
    msg.includes("device is lost") ||
    msg.includes("mapAsync") ||
    msg.includes("GPUBuffer") ||
    msg.includes("GPU device") ||
    msg.includes("lost")
  );
}

async function loadModel(
  device: "webgpu" | "wasm",
  onProgress: (d: any) => void
): Promise<{ processor: any; model: any }> {
  const { AutoProcessor, AutoModelForVision2Seq } = await import(
    "@huggingface/transformers"
  );

  const processor = await AutoProcessor.from_pretrained(MODEL_ID, {
    progress_callback: onProgress,
  });

  const model = await AutoModelForVision2Seq.from_pretrained(MODEL_ID, {
    dtype: device === "webgpu" ? "q4" : "q4",
    device,
    progress_callback: onProgress,
  });

  return { processor, model };
}

export function useVisionModel(): VisionModelHook {
  const [state, setState] = useState<VisionModelState>("idle");
  const [progress, setProgress] = useState("");
  const [downloadPct, setDownloadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const processorRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const deviceRef = useRef<"webgpu" | "wasm">("webgpu");
  const initStarted = useRef(false);

  const onProgress = useCallback((data: any) => {
    if (data.status === "progress") {
      const pct = Math.round(data.progress ?? 0);
      setDownloadPct(pct);
      const name = (data.file ?? "").split("/").pop() ?? "model";
      setProgress(`Downloading ${name}… ${pct}%`);
    } else if (data.status === "initiate") {
      const name = (data.file ?? "").split("/").pop() ?? "model";
      setProgress(`Preparing ${name}…`);
    } else if (data.status === "loading" || data.status === "loaded") {
      setProgress("Loading model into memory…");
    }
  }, []);

  const initialize = useCallback(async () => {
    if (processorRef.current || initStarted.current) return;
    initStarted.current = true;
    setError(null);
    setState("downloading");
    setDownloadPct(0);

    try {
      const { env } = await import("@huggingface/transformers");
      env.allowRemoteModels = true;
      env.useBrowserCache = true;

      // Try WebGPU first
      try {
        setProgress("Checking GPU support…");
        const { processor, model } = await loadModel("webgpu", onProgress);
        processorRef.current = processor;
        modelRef.current = model;
        deviceRef.current = "webgpu";
      } catch (gpuErr: any) {
        // WebGPU unavailable or failed — fall back to CPU/WASM
        console.warn("WebGPU failed, falling back to CPU:", gpuErr.message);
        processorRef.current = null;
        modelRef.current = null;
        setProgress("GPU unavailable, loading on CPU…");
        const { processor, model } = await loadModel("wasm", onProgress);
        processorRef.current = processor;
        modelRef.current = model;
        deviceRef.current = "wasm";
      }

      setState("ready");
      setProgress("");
      setDownloadPct(100);
    } catch (err: any) {
      initStarted.current = false;
      processorRef.current = null;
      modelRef.current = null;
      setState("error");
      const msg: string = err?.message ?? "Unknown error";
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch")) {
        setError("Could not download the model. Check your internet connection and try again.");
      } else if (msg.includes("memory") || msg.includes("Memory") || msg.includes("OOM")) {
        setError("Not enough memory. Try closing other tabs or browser windows, then retry.");
      } else {
        setError(msg.slice(0, 250));
      }
    }
  }, [onProgress]);

  const runInference = useCallback(async (imgEl: HTMLImageElement, prompt: string): Promise<string> => {
    const { RawImage } = await import("@huggingface/transformers");
    const image = await RawImage.fromURL(imgEl.src);

    const messages = [
      {
        role: "user",
        content: [
          { type: "image" },
          { type: "text", text: prompt },
        ],
      },
    ];

    const textInput = processorRef.current.apply_chat_template(messages, {
      add_generation_prompt: true,
    });

    const inputs = await processorRef.current(textInput, image, {
      return_tensors: "pt",
    });

    const generatedIds = await modelRef.current.generate({
      ...inputs,
      max_new_tokens: 768,
      do_sample: false,
    });

    const inputLen = inputs.input_ids.dims[1];
    const newTokens = generatedIds.slice(null, [inputLen, null]);
    const decoded: string[] = processorRef.current.batch_decode(newTokens, {
      skip_special_tokens: true,
    });

    return decoded[0]?.trim() ?? "";
  }, []);

  const analyzeImage = useCallback(
    async (imgEl: HTMLImageElement, prompt: string): Promise<string> => {
      if (!processorRef.current || !modelRef.current) {
        throw new Error("Model not loaded");
      }
      setState("generating");
      try {
        const result = await runInference(imgEl, prompt);
        setState("ready");
        return result;
      } catch (err: any) {
        // If GPU device was lost during inference, reload on CPU and retry once
        if (isGpuLostError(err) && deviceRef.current === "webgpu") {
          console.warn("GPU device lost during inference, reloading on CPU…");
          processorRef.current = null;
          modelRef.current = null;
          deviceRef.current = "wasm";
          setState("downloading");
          setProgress("GPU unavailable, switching to CPU…");
          const { processor, model } = await loadModel("wasm", onProgress);
          processorRef.current = processor;
          modelRef.current = model;
          setState("generating");
          const retryResult = await runInference(imgEl, prompt);
          setState("ready");
          return retryResult;
        }
        setState("ready");
        throw err;
      }
    },
    [runInference, onProgress]
  );

  return { state, progress, downloadPct, error, initialize, analyzeImage };
}
