import { useState, useRef, useCallback, useEffect } from 'react';
import { CreateMLCEngine, MLCEngine, hasModelInCache, deleteModelAllInfoInCache } from '@mlc-ai/web-llm';

const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
const PREV_MODEL_IDS = ["Llama-3.1-8B-Instruct-q4f16_1-MLC"];

export type WebLLMState = 'idle' | 'checking-gpu' | 'downloading' | 'ready' | 'generating' | 'error';

async function clearStaleModelCache() {
  for (const oldId of PREV_MODEL_IDS) {
    try {
      const cached = await hasModelInCache(oldId);
      if (cached) {
        await deleteModelAllInfoInCache(oldId);
        console.log(`Cleared stale cache for ${oldId}`);
      }
    } catch {
    }
  }
}

export function useWebLLM() {
  const [state, setState] = useState<WebLLMState>('checking-gpu');
  const [progress, setProgress] = useState<{ text: string, percent: number }>({ text: 'Preparing AI engine...', percent: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const engineRef = useRef<MLCEngine | null>(null);
  const initStarted = useRef(false);

  const initProgressCallback = useCallback((report: { text: string; progress?: number }) => {
    const match = report.text.match(/\[(\d+)\/(\d+)\]/);
    let percent = 0;
    if (match && match[1] && match[2]) {
      percent = (parseInt(match[1]) / parseInt(match[2])) * 100;
    } else if (report.progress) {
      percent = report.progress * 100;
    }
    setProgress({ text: report.text, percent: Math.round(percent) });
  }, []);

  const initialize = useCallback(async () => {
    if (engineRef.current) return true;
    if (initStarted.current) return false;
    initStarted.current = true;
    
    setState('checking-gpu');
    setError(null);

    if (!(navigator as any).gpu) {
      setState('error');
      setError("Your browser doesn't support WebGPU. Please use a recent version of Chrome, Edge, or enable WebGPU flags in Safari.");
      return false;
    }

    await clearStaleModelCache();

    try {
      setState('downloading');
      
      const engine = await CreateMLCEngine(MODEL_ID, { initProgressCallback });
      
      engineRef.current = engine;
      setState('ready');
      return true;
    } catch (err: any) {
      console.error("WebLLM Init Error:", err);
      if (err.message?.includes("Instance") || err.message?.includes("external")) {
        try {
          console.log("Clearing model cache and retrying...");
          await deleteModelAllInfoInCache(MODEL_ID);
          const engine = await CreateMLCEngine(MODEL_ID, { initProgressCallback });
          engineRef.current = engine;
          setState('ready');
          return true;
        } catch (retryErr: any) {
          console.error("WebLLM Retry Error:", retryErr);
          setState('error');
          setError(retryErr.message || "Failed to initialize the AI engine.");
          return false;
        }
      }
      setState('error');
      setError(err.message || "Failed to initialize the AI engine.");
      return false;
    }
  }, [initProgressCallback]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const generate = useCallback(async (
    platform: string, 
    tone: string, 
    topic: string, 
    onChunk: (text: string) => void
  ) => {
    const prompt = `You are an elite social media strategist and copywriter known for creating viral, scroll-stopping hooks.
Create exactly 5 distinct, high-converting hooks for a ${platform} post about "${topic}".
The tone must be: ${tone}.

CRITICAL RULES:
1. Output ONLY the hooks, exactly one hook per line.
2. DO NOT use numbers (e.g., "1.", "2.").
3. DO NOT use bullet points.
4. DO NOT include any introductory or concluding text.
5. DO NOT wrap the hooks in quotes.
Just 5 lines of text, nothing else.`;

    return generateRaw({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 500,
      onChunk,
    });
  }, []);

  const generateRaw = useCallback(async (opts: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature?: number;
    maxTokens?: number;
    onChunk: (text: string) => void;
  }) => {
    if (!engineRef.current) {
      return null;
    }

    setState('generating');
    setError(null);

    try {
      const chunks = await engineRef.current!.chat.completions.create({
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

      setState('ready');
      return fullText;
    } catch (err: any) {
      console.error("Generation Error:", err);
      setState('error');
      setError(err.message || "Failed to generate content.");
      return null;
    }
  }, []);

  return {
    state,
    progress,
    error,
    initialize,
    generate,
    generateRaw
  };
}
