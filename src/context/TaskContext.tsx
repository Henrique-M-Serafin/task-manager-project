// src/context/TasksContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

import type { Task, TaskStatus } from "@/types";

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTaskStatus: (index: number, status: TaskStatus) => void;
  deleteTask: (index: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
  const stored = localStorage.getItem("tasks");
    if (stored) {
        try {
        return JSON.parse(stored).map((t: Task) => ({
            ...t,
            createdAt: new Date(t.createdAt)
        }));
        } catch {
        return [];
        }
    }
    return [];
    });

  // Carregar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed: Task[] = JSON.parse(stored);
        const withDates = parsed.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt), // reconvertendo string -> Date
        }));
        setTasks(withDates);
      } catch (err) {
        console.error("Erro ao carregar tasks:", err);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  // Salvar no localStorage sempre que tasks mudar
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string) => {
    setTasks((prev) => [
      ...prev,
      {
        title,
        description,
        createdAt: new Date(),
        status: "pending",
      },
    ]);
  };

  const updateTaskStatus = (index: number, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index
          ? { ...task, status }
          : task
      )
    );
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, updateTaskStatus, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks deve ser usado dentro de um TasksProvider");
  }
  return context;
}