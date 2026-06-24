"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore, type TodoCategory, type DayOfWeek } from "@/stores/useTodoStore";

const categories: { value: TodoCategory; label: string; emoji: string }[] = [
  { value: "self-care", label: "셀프케어", emoji: "🧴" },
  { value: "chore", label: "집안일", emoji: "🧹" },
  { value: "work", label: "일/공부", emoji: "💼" },
  { value: "social", label: "소셜", emoji: "💬" },
  { value: "health", label: "건강", emoji: "💪" },
  { value: "fun", label: "취미", emoji: "🎮" },
];

const categoryEmojis: Record<TodoCategory, string[]> = {
  "self-care": ["🧴", "🛁", "🧘", "💅", "🪥", "😴"],
  chore: ["🧹", "🧺", "🍳", "🗑️", "🧽", "📦"],
  work: ["💼", "📝", "💻", "📚", "✏️", "📊"],
  social: ["💬", "📱", "💌", "🤝", "☎️", "👋"],
  health: ["💪", "🏃", "🥗", "💧", "🧘", "🚶"],
  fun: ["🎮", "🎨", "🎵", "📖", "🎬", "🎲"],
};

const difficulties = [
  { value: 1 as const, label: "쉬움", emoji: "🌱" },
  { value: 2 as const, label: "보통", emoji: "🌿" },
  { value: 3 as const, label: "어려움", emoji: "🌳" },
];

const timeOptions = [
  { value: 1, label: "1분" },
  { value: 3, label: "3분" },
  { value: 5, label: "5분" },
  { value: 10, label: "10분" },
  { value: 15, label: "15분" },
  { value: 25, label: "25분" },
];

interface AddTodoFormProps {
  onAdded?: (todoId: string) => void;
}

export default function AddTodoForm({ onAdded }: AddTodoFormProps) {
  const addTodo = useTodoStore((s) => s.addTodo);

  const [title, setTitle] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [category, setCategory] = useState<TodoCategory>("work");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [routineType, setRoutineType] = useState<"none" | "daily" | "weekly">("none");
  const [routineDays, setRoutineDays] = useState<DayOfWeek[]>([]);

  const coinReward = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;
  const emoji = selectedEmoji || categories.find((c) => c.value === category)?.emoji || "📝";

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    addTodo({
      title: trimmed,
      emoji,
      category,
      difficulty,
      coinReward,
      estimatedMinutes,
      isCustom: true,
      isRoutine: routineType !== "none",
      routineDays: routineType === "weekly" ? routineDays : null,
    });

    // 방금 추가된 todo의 id 찾기
    const todos = useTodoStore.getState().todos;
    const added = todos[todos.length - 1];
    if (added && onAdded) {
      onAdded(added.id);
    }

    // 폼 초기화
    setTitle("");
    setShowDetail(false);
    setCategory("work");
    setDifficulty(2);
    setEstimatedMinutes(5);
    setSelectedEmoji("");
    setRoutineType("none");
    setRoutineDays([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      {/* 간단 입력 */}
      <div className="flex items-center gap-2 p-3">
        <span className="text-xl">{emoji}</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="새 할일 추가..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-700"
          maxLength={30}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            title.trim()
              ? "bg-lavender-400 text-white"
              : "bg-gray-100 text-gray-300"
          }`}
        >
          +추가
        </motion.button>
      </div>

      {/* 상세 설정 토글 */}
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-500 border-t border-gray-50 flex items-center justify-center gap-1 transition-colors"
      >
        <motion.span
          animate={{ rotate: showDetail ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
        상세 설정
      </button>

      {/* 상세 설정 패널 */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* 카테고리 */}
              <div>
                <p className="text-xs text-gray-400 mb-2">카테고리</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCategory(cat.value);
                        setSelectedEmoji("");
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        category === cat.value
                          ? "bg-lavender-100 text-lavender-500 ring-1 ring-lavender-300"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 난이도 */}
              <div>
                <p className="text-xs text-gray-400 mb-2">난이도 (코인: {coinReward})</p>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <motion.button
                      key={d.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                        difficulty === d.value
                          ? "bg-lavender-100 text-lavender-500 ring-1 ring-lavender-300"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {d.emoji} {d.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 예상 시간 */}
              <div>
                <p className="text-xs text-gray-400 mb-2">예상 시간</p>
                <div className="flex flex-wrap gap-1.5">
                  {timeOptions.map((t) => (
                    <motion.button
                      key={t.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEstimatedMinutes(t.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        estimatedMinutes === t.value
                          ? "bg-lavender-100 text-lavender-500 ring-1 ring-lavender-300"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 이모지 */}
              <div>
                <p className="text-xs text-gray-400 mb-2">이모지</p>
                <div className="flex flex-wrap gap-2">
                  {categoryEmojis[category].map((e) => (
                    <motion.button
                      key={e}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedEmoji(e === emoji ? "" : e)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-colors ${
                        (selectedEmoji === e || (!selectedEmoji && e === categories.find((c) => c.value === category)?.emoji))
                          ? "bg-lavender-100 ring-1 ring-lavender-300"
                          : "bg-gray-50"
                      }`}
                    >
                      {e}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 반복 설정 */}
              <div>
                <p className="text-xs text-gray-400 mb-2">반복 설정</p>
                <div className="flex gap-1.5">
                  {([
                    { value: "none" as const, label: "안 함" },
                    { value: "daily" as const, label: "매일" },
                    { value: "weekly" as const, label: "요일 선택" },
                  ]).map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRoutineType(opt.value)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                        routineType === opt.value
                          ? "bg-mint-100 text-mint-500 ring-1 ring-mint-300"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {opt.value !== "none" && "🔄 "}{opt.label}
                    </motion.button>
                  ))}
                </div>

                {/* 요일 선택 */}
                <AnimatePresence>
                  {routineType === "weekly" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-1 mt-2">
                        {(["일", "월", "화", "수", "목", "금", "토"] as const).map((dayLabel, i) => {
                          const day = i as DayOfWeek;
                          const selected = routineDays.includes(day);
                          return (
                            <motion.button
                              key={day}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                setRoutineDays(
                                  selected
                                    ? routineDays.filter((d) => d !== day)
                                    : [...routineDays, day]
                                )
                              }
                              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                                selected
                                  ? "bg-mint-200 text-mint-600 ring-1 ring-mint-300"
                                  : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              {dayLabel}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
