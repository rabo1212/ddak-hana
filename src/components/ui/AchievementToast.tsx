"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "@/data/achievements";
import { rarityColors } from "@/data/achievements";

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({
  achievement,
  onClose,
}: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  const colors = achievement ? rarityColors[achievement.rarity] : null;

  return (
    <AnimatePresence>
      {achievement && colors && (
        <motion.div
          className="fixed top-4 left-4 right-4 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div
            className={`${colors.bg} border ${colors.border} rounded-2xl p-4 shadow-lg flex items-center gap-3`}
            onClick={onClose}
          >
            <span className="text-3xl">{achievement.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">
                  업적 달성!
                </span>
                <span className="inline-flex items-center gap-0.5 bg-gold-100 px-1.5 py-0.5 rounded-full">
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-bold text-gold-400">
                    +{achievement.reward}
                  </span>
                </span>
              </div>
              <p className={`text-sm font-bold ${colors.text} truncate`}>
                {achievement.title}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
