import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { StudyTask, TaskCategory } from "@/types/task";

const STORAGE_KEY = "@rotina-em-dia/tasks-v1";

type TasksContextValue = {
  tasks: StudyTask[];
  isLoading: boolean;
  storageError: string | null;
  addTask: (title: string, category: TaskCategory) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function isTaskCategory(value: unknown): value is TaskCategory {
  return value === "Estudo" || value === "Pessoal" || value === "Trabalho";
}

function readTasks(value: unknown): StudyTask[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is StudyTask =>
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      isTaskCategory(item.category) &&
      typeof item.completed === "boolean" &&
      typeof item.createdAt === "string" &&
      (typeof item.completedAt === "string" || item.completedAt === null),
  );
}

export function TasksProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored) {
          try {
            setTasks(readTasks(JSON.parse(stored)));
          } catch {
            setStorageError("Não foi possível ler os dados salvos. A lista começará vazia.");
          }
        }
      })
      .catch(() => {
        if (active) setStorageError("O armazenamento local está indisponível neste dispositivo.");
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
          setIsReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).then(
      () => setStorageError(null),
      () => setStorageError("Não foi possível salvar a lista neste dispositivo agora."),
    );
  }, [isReady, tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading,
      storageError,
      addTask: (title, category) => {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;
        const now = new Date().toISOString();
        setTasks((current) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: cleanTitle,
            category,
            completed: false,
            createdAt: now,
            completedAt: null,
          },
          ...current,
        ]);
      },
      toggleTask: (id) => {
        setTasks((current) =>
          current.map((task) => {
            if (task.id !== id) return task;
            const completed = !task.completed;
            return { ...task, completed, completedAt: completed ? new Date().toISOString() : null };
          }),
        );
      },
      removeTask: (id) => setTasks((current) => current.filter((task) => task.id !== id)),
    }),
    [isLoading, isReady, storageError, tasks],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks precisa ser usado dentro de TasksProvider.");
  return context;
}
