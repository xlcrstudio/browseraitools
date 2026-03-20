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

export function useVisionModel(): VisionModelHook {
  const [state, setState] = useState<VisionModelState>("idle");
  const [progress, setProgress] = useState("");
  const [downloadPct, setDownloadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const processorRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const initStarted = useRef(false);

  const initialize = useCallback(async () => {
    if (processorRef.current || initStarted.current) return;
    initStarted.current = true;
    setError(null);
    setState("downloading");
    setDownloadPct(0);

    const onProgress = (data: any) => {
      if (data.status === "progress") {
        const pct = Math.round(data.progress ?? 0);
        setDownloadPct(pct);
        const name = data.file ? data.file.split("/").pop() : "model";
        setProgress(`Downloading ${name}… ${pct}%`);
      } else if (data.status === "initiate") {
        const name = data.file ? data.file.split("/").pop() : "model";
        setProgress(`Preparing ${name}…`);
      } else if (data.status === "loading" || data.status === "loaded") {
        setProgress("Loading model into memory…");
      }
    };

    try {
      setProgress("Initializing…");
      const { AutoProcessor, AutoModelForVision2Seq, env } = await import(
        "@huggingface/transformers"
      );

      env.allowRemoteModels = true;
      env.useBrowserCache = true;

      setProgress("Loading image processor…");
      processorRef.current = await AutoProcessor.from_pretrained(MODEL_ID, {
        progress_callback: onProgress,
      });

      setProgress("Loading vision model…");
      modelRef.current = await AutoModelForVision2Seq.from_pretrained(MODEL_ID, {
        dtype: "q4",
        device: "webgpu",
        progress_callback: onProgress,
      });

      setState("ready");
      setProgress("");
      setDownloadPct(100);
    } catch (err: any) {
      initStarted.current = false;
      processorRef.current = null;
      modelRef.current = null;
      setState("error");
      const msg: string = err?.message ?? "Unknown error";
      if (msg.includes("WebGPU") || msg.includes("webgpu") || msg.includes("GPU")) {
        setError(
          "Your browser doesn't support WebGPU. Try Chrome 113+ or Edge 113+ on a desktop."
        );
      } else if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch")) {
        setError("Could not download the model. Check your internet connection and try again.");
      } else if (msg.includes("memory") || msg.includes("Memory")) {
        setError("Not enough memory. Try closing other tabs or browser windows, then retry.");
      } else {
        setError(msg.slice(0, 200));
      }
    }
  }, []);

  const analyzeImage = useCallback(
    async (imgEl: HTMLImageElement, prompt: string): Promise<string> => {
      if (!processorRef.current || !modelRef.current) {
        throw new Error("Model not loaded");
      }
      setState("generating");
      try {
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

        setState("ready");
        return decoded[0]?.trim() ?? "";
      } catch (err: any) {
        setState("ready");
        throw err;
      }
    },
    []
  );

  return { state, progress, downloadPct, error, initialize, analyzeImage };
}
