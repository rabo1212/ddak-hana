import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToday } from "@/lib/utils";

interface NotificationState {
  enabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  lastNotifiedDate: string | null;

  setEnabled: (enabled: boolean) => void;
  setReminderTime: (hour: number, minute: number) => void;
  markNotified: () => void;
  shouldNotify: () => boolean;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      enabled: false,
      reminderHour: 9,
      reminderMinute: 0,
      lastNotifiedDate: null,

      setEnabled: (enabled) => set({ enabled }),

      setReminderTime: (hour, minute) =>
        set({ reminderHour: hour, reminderMinute: minute }),

      markNotified: () => set({ lastNotifiedDate: getToday() }),

      shouldNotify: () => {
        const { enabled, reminderHour, reminderMinute, lastNotifiedDate } =
          get();
        if (!enabled) return false;
        if (lastNotifiedDate === getToday()) return false;

        const now = new Date();
        return (
          now.getHours() === reminderHour && now.getMinutes() === reminderMinute
        );
      },
    }),
    { name: "ddak-hana-notification" }
  )
);
