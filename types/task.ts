export const TASK_CATEGORIES = ["Estudo", "Pessoal", "Trabalho"] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export type StudyTask = {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
};

export type TaskFilter = "Todas" | "Pendentes" | "Concluídas";
