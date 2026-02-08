import { create } from "zustand";
import { persist } from "zustand/middleware";
import { achievements, type Achievement } from "@/data/achievements";

export interface AchievementStats {
  totalCompleted: number;
  currentStreak: number;
  totalCoins: number;
  roomLevel: number;
  friendCount: number;
  hasCustomTodo: boolean;
  currentHour: number;
}

interface AchievementState {
  unlockedIds: string[];
  unlockedAt: Record<string, string>;

  checkAchievements: (stats: AchievementStats) => Achievement[];
  isUnlocked: (id: string) => boolean;
}

function checkCondition(
  achievement: Achievement,
  stats: AchievementStats
): boolean {
  const { type, value } = achievement.condition;

  switch (type) {
    case "totalCompleted":
      return stats.totalCompleted >= value;
    case "currentStreak":
      return stats.currentStreak >= value;
    case "totalCoins":
      return stats.totalCoins >= value;
    case "roomLevel":
      return stats.roomLevel >= value;
    case "friendCount":
      return stats.friendCount >= value;
    case "hasCustomTodo":
      return stats.hasCustomTodo;
    case "earlyBird":
      return stats.currentHour < value;
    case "nightOwl":
      return stats.currentHour >= 0 && stats.currentHour < 5;
    default:
      return false;
  }
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      unlockedAt: {},

      checkAchievements: (stats) => {
        const { unlockedIds } = get();
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of achievements) {
          if (unlockedIds.includes(achievement.id)) continue;
          if (checkCondition(achievement, stats)) {
            newlyUnlocked.push(achievement);
          }
        }

        if (newlyUnlocked.length > 0) {
          const now = new Date().toISOString();
          set((state) => ({
            unlockedIds: [
              ...state.unlockedIds,
              ...newlyUnlocked.map((a) => a.id),
            ],
            unlockedAt: {
              ...state.unlockedAt,
              ...Object.fromEntries(newlyUnlocked.map((a) => [a.id, now])),
            },
          }));
        }

        return newlyUnlocked;
      },

      isUnlocked: (id) => get().unlockedIds.includes(id),
    }),
    { name: "ddak-hana-achievements" }
  )
);
