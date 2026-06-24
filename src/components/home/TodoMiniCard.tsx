"use client";

import { motion } from "framer-motion";
import type { Todo } from "@/stores/useTodoStore";

interface TodoMiniCardProps {
  todo: Todo | null;
  onStart: (todo: Todo) => void;
  onAdd: () => void;
  onOpenList: () => void;
}

export default function TodoMiniCard({ todo, onStart, onAdd, onOpenList }: TodoMiniCardProps) {
  // 할일 없음 = 오늘 끝!
  if (!todo) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/50 max-w-[170px]"
      >
        <p className="text-xs font-bold text-lavender-500 mb-1">오늘 끝!</p>
        <p className="text-[10px] text-gray-400 mb-2">대단해~ 푹 쉬어!</p>
        <div className="flex gap-1.5">
          <button
            onClick={onAdd}
            className="flex-1 text-[10px] text-lavender-400 bg-lavender-50 rounded-lg py-1.5 font-medium"
          >
            + 추가
          </button>
          <button
            onClick={onOpenList}
            className="text-[10px] text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5 font-medium"
          >
            목록
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/50 max-w-[170px]"
    >
      {/* 상단: 할일 정보 + 버튼들 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-lg">{todo.emoji}</span>
        <p className="text-xs font-bold text-gray-700 truncate flex-1">
          {todo.title}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-lavender-50 text-lavender-400 text-[10px] font-bold flex-shrink-0"
        >
          +
        </button>
      </div>

      {/* 예상 시간 + 루틴 뱃지 */}
      <div className="flex items-center gap-1 mb-2">
        <p className="text-[10px] text-gray-400">
          ~{todo.estimatedMinutes}분 · +{todo.coinReward}🪙
        </p>
        {todo.isRoutine && (
          <span className="text-[8px] bg-mint-100 text-mint-400 px-1 py-0.5 rounded-full">
            🔄
          </span>
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex gap-1.5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart(todo)}
          className="flex-1 bg-lavender-300 text-white text-xs font-bold py-2 rounded-xl shadow-sm"
        >
          할래!
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenList}
          className="bg-white/60 text-gray-400 text-[10px] px-2.5 py-2 rounded-xl font-medium"
        >
          목록
        </motion.button>
      </div>
    </motion.div>
  );
}
