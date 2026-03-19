export const MODEL_STORAGE_KEY = 'browserai-selected-model';
export const DEFAULT_MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 · 0.5B',
    description: 'Fastest · ~400MB',
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 · 1.5B',
    description: 'Fast · ~900MB',
    isDefault: true,
  },
  {
    id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 · 3B',
    description: 'Balanced · ~1.8GB',
  },
  {
    id: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 · 7B',
    description: 'Best quality · ~4GB',
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 · 1B',
    description: 'Fast · ~700MB',
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 · 3B',
    description: 'Balanced · ~1.9GB',
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Phi 3.5 Mini · 3.8B',
    description: 'Balanced · ~2.3GB',
  },
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Gemma 2 · 2B',
    description: 'Fast · ~1.5GB',
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 · 1.7B',
    description: 'Fast · ~1GB',
  },
];

export function getSelectedModelId(): string {
  try {
    return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL_ID;
  } catch {
    return DEFAULT_MODEL_ID;
  }
}

export function setSelectedModelId(id: string): void {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, id);
  } catch {}
}

export function getModelById(id: string): ModelOption | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}
