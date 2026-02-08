"use client";

import { useEffect, useState } from "react";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";
import { useCoinStore } from "@/stores/useCoinStore";
import { useHydration } from "@/lib/useHydration";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useUserStore } from "@/stores/useUserStore";
import { defaultTodos } from "@/data/defaultTodos";
import ConditionSelect from "@/components/home/ConditionSelect";
import TaskCard from "@/components/home/TaskCard";
import Timer from "@/components/home/Timer";
import CoinDisplay from "@/components/ui/CoinDisplay";
import EncouragementMessage from "@/components/ui/EncouragementMessage";
import PageTransition from "@/components/ui/PageTransition";
import AddTodoForm from "@/components/home/AddTodoForm";
import NicknameSetup from "@/components/social/NicknameSetup";
import BottomTabBar from "@/components/layout/BottomTabBar";

export default function HomePage() {
  const hydrated = useHydration();
  const todos = useTodoStore((s) => s.todos);
  const currentTodoId = useTodoStore((s) => s.currentTodoId);
  const todayCondition = useTodoStore((s) => s.todayCondition);
  const needsConditionCheck = useTodoStore((s) => s.needsConditionCheck);
  const completeTodo = useTodoStore((s) => s.completeTodo);
  const recommendNext = useTodoStore((s) => s.recommendNext);
  const getTodayCompleted = useTodoStore((s) => s.getTodayCompleted);
  const earnCoins = useCoinStore((s) => s.earnCoins);
  const addConsecutive = useCoinStore((s) => s.addConsecutive);
  const isRegistered = useUserStore((s) => s.isRegistered);
  const userId = useUserStore((s) => s.userId);

  // 타이머 모드 상태
  const [timerTodo, setTimerTodo] = useState<Todo | null>(null);

  // 첫 실행 시 기본 할일 시드
  useEffect(() => {
    if (hydrated && todos.length === 0) {
      const addTodo = useTodoStore.getState().addTodo;
      defaultTodos.forEach((todo) => addTodo(todo));
    }
  }, [hydrated, todos.length]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <div className="text-5xl animate-bounce-slow">🎯</div>
          <p className="mt-4 text-lavender-400 font-medium">딱 하나</p>
          <p className="mt-1 text-gray-300 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  const showConditionSelect = needsConditionCheck();
  const currentTodo = todos.find((t) => t.id === currentTodoId) || null;

  // "할래!" 클릭 → 타이머 모드 진입
  const handleStartTimer = (todo: Todo) => {
    setTimerTodo(todo);
  };

  // 타이머 완료 → 코인 획득 + 할일 완료 처리
  const handleTimerComplete = () => {
    if (!timerTodo) return;

    completeTodo(timerTodo.id);

    // 코인 계산
    let coins = timerTodo.coinReward;
    const consecutive = addConsecutive();
    const todayDone = getTodayCompleted();

    // 첫 시작 보너스
    if (todayDone.length === 0) {
      coins += 10;
    }

    // 3개 연속 보너스
    if (consecutive > 0 && consecutive % 3 === 0) {
      coins += 5;
    }

    earnCoins(coins, `할일 완료: ${timerTodo.title}`);

    // Supabase에 완료 기록
    if (isSupabaseConfigured() && userId) {
      supabase.from("completed_tasks").insert({
        user_id: userId,
        title: timerTodo.title,
        emoji: timerTodo.emoji,
      }).then(() => {});
    }

    setTimerTodo(null);
    recommendNext();
  };

  // 타이머 취소 → 카드로 복귀
  const handleTimerCancel = () => {
    setTimerTodo(null);
  };

  const showNicknameSetup = isSupabaseConfigured() && !isRegistered();

  return (
    <>
      {showNicknameSetup && <NicknameSetup />}
      <main className="min-h-screen bg-cream-100 px-4 pt-6">
        <PageTransition>
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (timerTodo) {
                  if (confirm("타이머를 중단하고 돌아갈까요?")) {
                    setTimerTodo(null);
                  }
                } else {
                  setTimerTodo(null);
                }
              }}
              className="text-2xl font-bold text-lavender-500 hover:opacity-80 transition-opacity"
            >
              딱 하나 🎯
            </button>
            <CoinDisplay />
          </div>

          {/* 3단계 분기: 컨디션선택 / 타이머 / 태스크카드 */}
          {showConditionSelect ? (
            <ConditionSelect />
          ) : timerTodo ? (
            <Timer
              todo={timerTodo}
              onComplete={handleTimerComplete}
              onCancel={handleTimerCancel}
            />
          ) : (
            <>
              <EncouragementMessage
                context="onConditionSelect"
                subContext={todayCondition || "okay"}
              />
              <div className="mt-4">
                <TaskCard
                  todo={currentTodo}
                  onStartTimer={handleStartTimer}
                />
              </div>
              <div className="mt-3 pb-24">
                <AddTodoForm
                  onAdded={(todoId) => {
                    useTodoStore.setState({ currentTodoId: todoId });
                  }}
                />
              </div>
            </>
          )}
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
