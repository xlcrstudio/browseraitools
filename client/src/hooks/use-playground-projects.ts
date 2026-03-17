import { useState, useEffect, useCallback } from "react";

export interface PlaygroundProject {
  id: string;
  name: string;
  language: string;
  code: string;
  prompt: string;
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = "ai-code-playground";
const STORE_NAME = "projects";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllProjects(): Promise<PlaygroundProject[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result || []).sort((a: PlaygroundProject, b: PlaygroundProject) => b.updatedAt - a.updatedAt));
    req.onerror = () => reject(req.error);
  });
}

async function putProject(project: PlaygroundProject): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(project);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function removeProject(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function usePlaygroundProjects() {
  const [projects, setProjects] = useState<PlaygroundProject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const all = await getAllProjects();
      setProjects(all);
    } catch (e) {
      console.error("Failed to load projects", e);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveProject = useCallback(async (p: Omit<PlaygroundProject, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = Date.now();
    const project: PlaygroundProject = {
      id: p.id || genId(),
      name: p.name,
      language: p.language,
      code: p.code,
      prompt: p.prompt,
      createdAt: p.id ? (projects.find(x => x.id === p.id)?.createdAt || now) : now,
      updatedAt: now,
    };
    await putProject(project);
    await refresh();
    return project.id;
  }, [projects, refresh]);

  const deleteProject = useCallback(async (id: string) => {
    await removeProject(id);
    if (activeId === id) setActiveId(null);
    await refresh();
  }, [activeId, refresh]);

  const active = projects.find(p => p.id === activeId) || null;

  return { projects, active, activeId, setActiveId, saveProject, deleteProject, refresh };
}
