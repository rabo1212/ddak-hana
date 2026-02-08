import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToday } from "@/lib/utils";

export type ConditionLevel = "great" | "okay" | "tired" | "struggling";

export type TodoCategory = "self-care" | "chore" | "work" | "social" | "health" | "fun";

export interface Todo {
  id: string;
  title: string;
  emoji: string;
  category: TodoCategory;
  difficulty: 1 | 2 | 3;
  coinReward: number;
  estimatedMinutes: number;
  completedAt: string | null;
  createdAt: string;
  isCustom: boolean;
}

interface TodoState {
  todos: Todo[];
  currentTodoId: string | null;
  todayCondition: ConditionLevel | null;
  conditionSetDate: string | null;
  completedToday: string[];

  setCondition: (level: ConditionLevel) => void;
  addTodo: (todo: Omit<Todo, "id" | "completedAt" | "createdAt">) => void;
  completeTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  recommendNext: () => void;
  needsConditionCheck: () => boolean;
  getTodayCompleted: () => Todo[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      currentTodoId: null,
      todayCondition: null,
      conditionSetDate: null,
      completedToday: [],

      setCondition: (level) => {
        const today = getToday();
        set({ todayCondition: level, conditionSetDate: today, completedToday: [] });
        get().recommendNext();
      },

      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          completedAt: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },

      completeTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completedAt: new Date().toISOString() } : t
          ),
          completedToday: [...state.completedToday, id],
          currentTodoId: null,
        }));
      },

      deleteTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo || !todo.isCustom) return;
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
          currentTodoId: state.currentTodoId === id ? null : state.currentTodoId,
        }));
      },

      recommendNext: () => {
        const { todos, todayCondition, completedToday } = get();
        const available = todos.filter(
          (t) => !t.completedAt && !completedToday.includes(t.id)
        );

        if (available.length === 0) {
          set({ currentTodoId: null });
          return;
        }

        let filtered = available;
        if (todayCondition === "struggling") {
          filtered = available.filter((t) => t.difficulty === 1);
        } else if (todayCondition === "tired") {
          filtered = available.filter((t) => t.difficulty <= 2);
        }

        if (filtered.length === 0) filtered = available;

        const pick = filtered[Math.floor(Math.random() * filtered.length)];
        set({ currentTodoId: pick.id });
      },

      needsConditionCheck: () => {
        const { conditionSetDate } = get();
        return conditionSetDate !== getToday();
      },

      getTodayCompleted: () => {
        const { todos } = get();
        const today = getToday();
        return todos.filter(
          (t) => t.completedAt && t.completedAt.startsWith(today)
        );
      },
    }),
    { name: "ddak-hana-todos" }
  )
);
