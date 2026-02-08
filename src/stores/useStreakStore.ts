import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToday } from "@/lib/utils";

interface StreakMilestone {
  days: number;
  bonus: number;
  message: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, bonus: 15, message: "3일 연속! 습관이 시작됐어!" },
  { days: 7, bonus: 30, message: "일주일 연속! 대단해!" },
  { days: 14, bonus: 50, message: "2주 연속! 멈출 수 없어!" },
  { days: 30, bonus: 100, message: "한 달 연속! 전설이야!" },
  { days: 100, bonus: 300, message: "100일! 진정한 마스터!" },
];

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;

  checkAndUpdateStreak: () => {
    streak: number;
    milestone: StreakMilestone | null;
    broken: boolean;
  };
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,

      checkAndUpdateStreak: () => {
        const { currentStreak, longestStreak, lastCompletionDate } = get();
        const today = getToday();
        const yesterday = getYesterday();

        // 이미 오늘 카운트 됨
        if (lastCompletionDate === today) {
          return { streak: currentStreak, milestone: null, broken: false };
        }

        let newStreak: number;
        let broken = false;

        if (lastCompletionDate === yesterday) {
          // 어제도 했음 → 연속!
          newStreak = currentStreak + 1;
        } else {
          // 어제 안 했음 → 리셋 (첫 시작 또는 끊김)
          broken = currentStreak > 1 && lastCompletionDate !== null;
          newStreak = 1;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        // 마일스톤 체크
        const milestone =
          STREAK_MILESTONES.find((m) => m.days === newStreak) || null;

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletionDate: today,
        });

        return { streak: newStreak, milestone, broken };
      },
    }),
    { name: "ddak-hana-streak" }
  )
);
