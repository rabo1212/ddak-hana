import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToday } from "@/lib/utils";

interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

interface CoinState {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: CoinTransaction[];
  todayEarned: number;
  lastEarnDate: string | null;
  consecutiveCompleted: number;

  earnCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => boolean;
  getTodayEarned: () => number;
  addConsecutive: () => number;
  resetConsecutive: () => void;
}

export const useCoinStore = create<CoinState>()(
  persist(
    (set, get) => ({
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      transactions: [],
      todayEarned: 0,
      lastEarnDate: null,
      consecutiveCompleted: 0,

      earnCoins: (amount, reason) => {
        const today = getToday();
        const transaction: CoinTransaction = {
          id: `tx_${Date.now()}`,
          amount,
          reason,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          balance: state.balance + amount,
          totalEarned: state.totalEarned + amount,
          transactions: [transaction, ...state.transactions].slice(0, 100),
          todayEarned:
            state.lastEarnDate === today ? state.todayEarned + amount : amount,
          lastEarnDate: today,
        }));
      },

      spendCoins: (amount, reason) => {
        const { balance } = get();
        if (balance < amount) return false;

        const transaction: CoinTransaction = {
          id: `tx_${Date.now()}`,
          amount: -amount,
          reason,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          balance: state.balance - amount,
          totalSpent: state.totalSpent + amount,
          transactions: [transaction, ...state.transactions].slice(0, 100),
        }));
        return true;
      },

      getTodayEarned: () => {
        const { todayEarned, lastEarnDate } = get();
        return lastEarnDate === getToday() ? todayEarned : 0;
      },

      addConsecutive: () => {
        const next = get().consecutiveCompleted + 1;
        set({ consecutiveCompleted: next });
        return next;
      },

      resetConsecutive: () => {
        set({ consecutiveCompleted: 0 });
      },
    }),
    { name: "ddak-hana-coins" }
  )
);
