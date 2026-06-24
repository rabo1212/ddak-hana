"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

interface TodoListSheetProps {
  onClose: () => void;
  onStartTimer: (todo: Todo) => void;
  onAddTodo: () => void;
}

function TodoListItem({
  todo,
  completed,
  onTap,
  onDelete,
}: {
  todo: Todo;
  completed?: boolean;
  onTap?: () => void;
  onDelete?: () => void;
}) {
  const routineLabel = todo.isRoutine
    ? todo.routineDays === null
      ? "매일"
      : todo.routineDays.map((d) => dayNames[d]).join("·")
    : null;

  return (
    <motion.div
      whileTap={completed ? {} : { scale: 0.98 }}
      onClick={completed ? undefined : onTap}
      className={`flex items-center gap-3 py-3 px-2 rounded-xl mb-1 ${
        completed ? "opacity-40" : "active:bg-lavender-50 cursor-pointer"
      }`}
    >
      <span className="text-xl flex-shrink-0">{todo.emoji}</span>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            completed ? "line-through text-gray-300" : "text-gray-700"
          }`}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-gray-400">
            ~{todo.estimatedMinutes}분
          </span>
          <span className="text-[10px] text-gray-400">
            +{todo.coinReward}🪙
          </span>
          {routineLabel && (
            <span className="text-[9px] bg-mint-100 text-mint-400 px-1.5 py-0.5 rounded-full">
              🔄 {routineLabel}
            </span>
          )}
        </div>
      </div>

      {/* 난이도 점 */}
      <div className="flex gap-0.5 flex-shrink-0">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`w-1.5 h-1.5 rounded-full ${
              level <= todo.difficulty ? "bg-lavender-300" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* 삭제 버튼 (커스텀 할일만) */}
      {!completed && todo.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-300 text-xs p-1 flex-shrink-0 hover:text-red-300 transition-colors"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}

export default function TodoListSheet({
  onClose,
  onStartTimer,
  onAddTodo,
}: TodoListSheetProps) {
  const getTodayTodos = useTodoStore((s) => s.getTodayTodos);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const todayTodos = getTodayTodos();

  const uncompleted = todayTodos.filter((t) => !t.completedAt);
  const completed = todayTodos.filter((t) => t.completedAt);

  return (
    <AnimatePresence>
      {/* 오버레이 */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-md mx-auto"
        style={{ maxHeight: "85vh" }}
      >
        {/* 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-base font-bold text-gray-700">오늘의 할일</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {completed.length}/{todayTodos.length} 완료
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onAddTodo}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lavender-100 text-lavender-500 text-sm font-bold"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* 할일 리스트 */}
        <div
          className="overflow-y-auto px-4 pb-8"
          style={{ maxHeight: "calc(85vh - 80px)" }}
        >
          {todayTodos.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl">📝</span>
              <p className="text-sm text-gray-400 mt-3">할일이 없어요</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAddTodo}
                className="mt-3 px-4 py-2 bg-lavender-100 text-lavender-500 rounded-xl text-sm font-medium"
              >
                + 할일 추가하기
              </motion.button>
            </div>
          )}

          {/* 미완료 */}
          {uncompleted.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onTap={() => {
                onStartTimer(todo);
                onClose();
              }}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}

          {/* 완료됨 */}
          {completed.length > 0 && (
            <>
              <p className="text-xs text-gray-300 mt-4 mb-2 px-1">
                완료됨 ({completed.length})
              </p>
              {completed.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} completed />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
