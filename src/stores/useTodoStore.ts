import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToday } from "@/lib/utils";

export type ConditionLevel = "great" | "okay" | "tired" | "struggling";

export type TodoCategory = "self-care" | "chore" | "work" | "social" | "health" | "fun";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 일=0, 월=1, ..., 토=6

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
  isRoutine: boolean;
  routineDays: DayOfWeek[] | null; // null = 매일, [1,3,5] = 월수금
}

interface TodoState {
  todos: Todo[];
  currentTodoId: string | null;
  todayCondition: ConditionLevel | null;
  conditionSetDate: string | null;
  completedToday: string[];
  lastRoutineResetDate: string | null;

  setCondition: (level: ConditionLevel) => void;
  addTodo: (todo: Omit<Todo, "id" | "completedAt" | "createdAt">) => void;
  completeTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  recommendNext: () => void;
  needsConditionCheck: () => boolean;
  getTodayCompleted: () => Todo[];
  resetRoutines: () => void;
  getTodayTodos: () => Todo[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      currentTodoId: null,
      todayCondition: null,
      conditionSetDate: null,
      completedToday: [],
      lastRoutineResetDate: null,

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
          isRoutine: todoData.isRoutine ?? false,
          routineDays: todoData.routineDays ?? null,
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
        const { todayCondition, completedToday } = get();
        const todayTodos = get().getTodayTodos();
        const available = todayTodos.filter(
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

      resetRoutines: () => {
        const today = getToday();
        const { lastRoutineResetDate } = get();
        if (lastRoutineResetDate === today) return;

        set((state) => ({
          lastRoutineResetDate: today,
          todos: state.todos.map((t) => {
            if (!t.isRoutine) return t;
            return { ...t, completedAt: null };
          }),
          completedToday: [],
        }));
      },

      getTodayTodos: () => {
        const { todos } = get();
        const todayDow = new Date().getDay() as DayOfWeek;

        return todos.filter((t) => {
          if (!t.isRoutine) return true;
          if (t.routineDays === null) return true;
          return t.routineDays.includes(todayDow);
        });
      },
    }),
    {
      name: "ddak-hana-todos",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0 || !version) {
          const todos = (state.todos as Todo[]) || [];
          return {
            ...state,
            lastRoutineResetDate: null,
            todos: todos.map((t) => ({
              ...t,
              isRoutine: t.isRoutine ?? false,
              routineDays: t.routineDays ?? null,
            })),
          };
        }
        return persistedState;
      },
    }
  )
);
