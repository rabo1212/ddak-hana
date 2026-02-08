"use client";

import { useStreakStore } from "@/stores/useStreakStore";
import { useHydration } from "@/lib/useHydration";
import { motion, AnimatePresence } from "framer-motion";

export default function StreakDisplay() {
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const hydrated = useHydration();

  if (!hydrated || currentStreak === 0) return null;

  return (
    <motion.div
      className="flex items-center gap-0.5 bg-orange-100 px-2.5 py-1.5 rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <span className="text-base">🔥</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentStreak}
          className="text-sm font-bold text-orange-500"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentStreak}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
