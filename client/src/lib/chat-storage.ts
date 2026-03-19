export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

const KEY = "bat_chat_threads";
const MAX_THREADS = 60;

export function genId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function loadThreads(): ChatThread[] {
  try {
    const data = localStorage.getItem(KEY);
    return data ? (JSON.parse(data) as ChatThread[]) : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]): void {
  try {
    const pruned = threads.slice(0, MAX_THREADS);
    localStorage.setItem(KEY, JSON.stringify(pruned));
  } catch {}
}

export function makeTitle(userInput: string): string {
  const clean = userInput.replace(/\s+/g, " ").trim();
  return clean.length > 48 ? clean.slice(0, 48).trimEnd() + "…" : clean;
}
