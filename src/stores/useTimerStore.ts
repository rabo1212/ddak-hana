import { create } from "zustand";

interface TimerState {
  isTimerActive: boolean;
  setTimerActive: (active: boolean) => void;
}

export const useTimerStore = create<TimerState>()((set) => ({
  isTimerActive: false,
  setTimerActive: (active) => set({ isTimerActive: active }),
}));
