import { useState, useRef, useCallback } from 'react';
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';

// We use a lighter model for better browser compatibility and speed
const MODEL_ID = "Llama-3.1-8B-Instruct-q4f16_1-MLC";

export type WebLLMState = 'idle' | 'checking-gpu' | 'downloading' | 'ready' | 'generating' | 'error';

export function useWebLLM() {
  const [state, setState] = useState<WebLLMState>('idle');
  const [progress, setProgress] = useState<{ text: string, percent: number }>({ text: '', percent: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const engineRef = useRef<MLCEngine | null>(null);

  const initialize = useCallback(async () => {
    if (engineRef.current) return true;
    
    setState('checking-gpu');
    setError(null);

    // Check WebGPU Support
    if (!(navigator as any).gpu) {
      setState('error');
      setError("Your browser doesn't support WebGPU. Please use a recent version of Chrome, Edge, or enable WebGPU flags in Safari.");
      return false;
    }

    try {
      setState('downloading');
      
      const engine = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report) => {
          // parse progress if available, otherwise just use text
          const match = report.text.match(/\[(\d+)\/(\d+)\]/);
          let percent = 0;
          if (match && match[1] && match[2]) {
            percent = (parseInt(match[1]) / parseInt(match[2])) * 100;
          } else if (report.progress) {
             percent = report.progress * 100;
          }
          
          setProgress({
            text: report.text,
            percent: Math.round(percent)
          });
        }
      });
      
      engineRef.current = engine;
      setState('ready');
      return true;
    } catch (err: any) {
      console.error("WebLLM Init Error:", err);
      setState('error');
      setError(err.message || "Failed to initialize the AI engine.");
      return false;
    }
  }, []);

  const generate = useCallback(async (
    platform: string, 
    tone: string, 
    topic: string, 
    onChunk: (text: string) => void
  ) => {
    if (!engineRef.current && state !== 'ready') {
      const success = await initialize();
      if (!success) return null;
    }

    setState('generating');
    setError(null);

    try {
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

      const chunks = await engineRef.current!.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      });

      let fullText = "";
      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullText += content;
        onChunk(fullText);
      }

      setState('ready');
      return fullText;
    } catch (err: any) {
      console.error("Generation Error:", err);
      setState('error');
      setError(err.message || "Failed to generate hooks.");
      return null;
    }
  }, [initialize, state]);

  return {
    state,
    progress,
    error,
    initialize,
    generate
  };
}
