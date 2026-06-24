"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore, type ConditionLevel } from "@/stores/useTodoStore";
import { useCharacterStore, type CharacterMood } from "@/stores/useCharacterStore";

interface ConditionSheetProps {
  show: boolean;
  onDone: () => void;
}

const conditions: { level: ConditionLevel; emoji: string; label: string; color: string }[] = [
  { level: "great", emoji: "😊", label: "좋아!", color: "bg-mint-100 border-mint-300" },
  { level: "okay", emoji: "🙂", label: "보통", color: "bg-lavender-50 border-lavender-200" },
  { level: "tired", emoji: "😴", label: "피곤해", color: "bg-gold-50 border-gold-200" },
  { level: "struggling", emoji: "😢", label: "힘들어", color: "bg-softpink-50 border-softpink-200" },
];

const conditionToMood: Record<ConditionLevel, CharacterMood> = {
  great: "happy",
  okay: "normal",
  tired: "tired",
  struggling: "sleepy",
};

export default function ConditionSheet({ show, onDone }: ConditionSheetProps) {
  const setCondition = useTodoStore((s) => s.setCondition);
  const setCharacterMood = useCharacterStore((s) => s.setMood);

  const handleSelect = (level: ConditionLevel) => {
    setCondition(level);
    setCharacterMood(conditionToMood[level]);
    onDone();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 배경 오버레이 - 완전 불투명 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60]"
          />

          {/* 중앙 카드 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          >
            <div className="bg-white rounded-3xl px-6 pt-6 pb-6 max-w-sm w-full shadow-2xl">
              <div className="text-center mb-5">
                <span className="text-4xl">🌤️</span>
                <h2 className="text-lg font-bold text-gray-700 mt-2">오늘 기분이 어때?</h2>
                <p className="text-xs text-gray-400 mt-1">솔직하게 골라줘!</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {conditions.map((cond) => (
                  <motion.button
                    key={cond.level}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(cond.level)}
                    className={`flex flex-col items-center py-4 rounded-2xl border-2 ${cond.color}`}
                  >
                    <span className="text-3xl mb-1">{cond.emoji}</span>
                    <span className="text-sm font-medium text-gray-600">{cond.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
