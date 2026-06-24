"use client";

import { motion } from "framer-motion";
import { useTodoStore, type ConditionLevel } from "@/stores/useTodoStore";
import { useCharacterStore, type CharacterMood } from "@/stores/useCharacterStore";

const conditions: { level: ConditionLevel; emoji: string; label: string; color: string }[] = [
  { level: "great", emoji: "😊", label: "좋아!", color: "bg-mint-100 border-mint-300" },
  { level: "okay", emoji: "🙂", label: "보통", color: "bg-lavender-50 border-lavender-200" },
  { level: "tired", emoji: "😴", label: "피곤해", color: "bg-gold-50 border-gold-200" },
  { level: "struggling", emoji: "😢", label: "힘들어", color: "bg-softpink-50 border-softpink-200" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const conditionToMood: Record<ConditionLevel, CharacterMood> = {
  great: "happy",
  okay: "normal",
  tired: "tired",
  struggling: "sleepy",
};

export default function ConditionSelect() {
  const setCondition = useTodoStore((s) => s.setCondition);
  const setCharacterMood = useCharacterStore((s) => s.setMood);

  const handleSelect = (level: ConditionLevel) => {
    setCondition(level);
    setCharacterMood(conditionToMood[level]);
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-6xl mb-6"
      >
        🌤️
      </motion.div>

      <h2 className="text-xl font-bold text-gray-700 mb-2">오늘 기분이 어때?</h2>
      <p className="text-sm text-gray-400 mb-8">
        솔직하게 골라줘. 정답은 없어!
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 w-full max-w-xs"
      >
        {conditions.map((cond) => (
          <motion.button
            key={cond.level}
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(cond.level)}
            className={`flex flex-col items-center py-5 rounded-2xl border-2 ${cond.color} transition-all`}
          >
            <span className="text-4xl mb-2">{cond.emoji}</span>
            <span className="text-sm font-medium text-gray-600">{cond.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
