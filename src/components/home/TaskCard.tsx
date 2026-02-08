"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";
import EncouragementMessage from "@/components/ui/EncouragementMessage";

interface Props {
  todo: Todo | null;
  onStartTimer?: (todo: Todo) => void;
}

export default function TaskCard({ todo, onStartTimer }: Props) {
  const recommendNext = useTodoStore((s) => s.recommendNext);
  const getTodayCompleted = useTodoStore((s) => s.getTodayCompleted);

  const todayDone = getTodayCompleted();

  // 할일 없을 때
  if (!todo) {
    if (todayDone.length > 0) {
      return (
        <div className="flex flex-col items-center pt-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-lg font-bold text-lavender-500 mb-2">
            오늘 {todayDone.length}개 완료!
          </h2>
          <EncouragementMessage context="onAllDone" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center pt-12">
        <div className="text-5xl mb-4">📝</div>
        <EncouragementMessage context="onNoTask" />
      </div>
    );
  }

  const handleStartTimer = () => {
    if (onStartTimer) {
      onStartTimer(todo);
    }
  };

  const handleSkip = () => {
    recommendNext();
  };

  const difficultyLabel = ["", "쉬움", "보통", "집중필요"];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={todo.id}
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-lg p-5 mx-auto"
      >
        {/* 이모지 + 제목 */}
        <div className="text-center mb-4">
          <motion.div
            className="text-5xl mb-3"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {todo.emoji}
          </motion.div>
          <h2 className="text-lg font-bold text-gray-700">{todo.title}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              ⏱ {todo.estimatedMinutes}분
            </span>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              🪙 {todo.coinReward}
            </span>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {difficultyLabel[todo.difficulty]}
            </span>
          </div>
        </div>

        {/* 난이도 표시 */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-full ${
                level <= todo.difficulty ? "bg-lavender-300" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartTimer}
            className="w-full py-3.5 bg-lavender-300 text-white rounded-xl font-bold text-base shadow-md active:shadow-sm transition-shadow"
          >
            할래! 🚀
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="flex-1 py-2.5 bg-cream-200 text-gray-500 rounded-lg text-sm font-medium"
            >
              다른거 ♻️
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="flex-1 py-2.5 bg-cream-200 text-gray-500 rounded-lg text-sm font-medium"
            >
              오늘은 패스 😴
            </motion.button>
          </div>
        </div>

        {/* 오늘 완료 수 */}
        {todayDone.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            오늘 {todayDone.length}개 완료했어! ✨
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
