import { useState, useEffect } from "react";
import { z } from "zod";

export interface TodoSubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface TodoTask {
  id: string;
  number: number;
  title: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
  difficulty: number;
  dependencies: string;
  description: string;
  steps: string[];
  resources: string[];
  done: boolean;
  subTasks: TodoSubTask[];
}

export interface TodoPhase {
  name: string;
  estimatedTime: string;
  goal: string;
  tasks: TodoTask[];
}

export interface TodoList {
  id: string;
  goal: string;
  timeframe: string;
  totalTasks: number;
  estimatedTotalTime: string;
  phases: TodoPhase[];
  rawText: string;
  createdAt: string;
}

const subTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean(),
});

const taskSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  timeEstimate: z.string(),
  difficulty: z.number(),
  dependencies: z.string(),
  description: z.string(),
  steps: z.array(z.string()),
  resources: z.array(z.string()),
  done: z.boolean(),
  subTasks: z.array(subTaskSchema),
});

const phaseSchema = z.object({
  name: z.string(),
  estimatedTime: z.string(),
  goal: z.string(),
  tasks: z.array(taskSchema),
});

const todoListSchema = z.object({
  id: z.string(),
  goal: z.string(),
  timeframe: z.string(),
  totalTasks: z.number(),
  estimatedTotalTime: z.string(),
  phases: z.array(phaseSchema),
  rawText: z.string(),
  createdAt: z.string(),
});

const STORAGE_KEY = "ai-todo-lists-v1";

export function useTodoStorage() {
  const [history, setHistory] = useState<TodoList[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(todoListSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load todo storage", e);
    }
  }, []);

  const persist = (lists: TodoList[]) => {
    setHistory(lists);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  };

  const saveList = (list: TodoList) => {
    persist([list, ...history].slice(0, 10));
  };

  const deleteList = (id: string) => {
    persist(history.filter((l) => l.id !== id));
  };

  const toggleTask = (listId: string, taskId: string) => {
    const updated = history.map((list) => {
      if (list.id !== listId) return list;
      return {
        ...list,
        phases: list.phases.map((phase) => ({
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task
          ),
        })),
      };
    });
    persist(updated);
    return updated.find((l) => l.id === listId) || null;
  };

  const toggleSubTask = (listId: string, taskId: string, subTaskId: string) => {
    const updated = history.map((list) => {
      if (list.id !== listId) return list;
      return {
        ...list,
        phases: list.phases.map((phase) => ({
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.map((st) =>
                    st.id === subTaskId ? { ...st, done: !st.done } : st
                  ),
                }
              : task
          ),
        })),
      };
    });
    persist(updated);
    return updated.find((l) => l.id === listId) || null;
  };

  return { history, saveList, deleteList, toggleTask, toggleSubTask };
}
