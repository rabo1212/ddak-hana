"use client";

import { useEffect, useState, useRef } from "react";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";
import { useCoinStore } from "@/stores/useCoinStore";
import { useStreakStore } from "@/stores/useStreakStore";
import { useHydration } from "@/lib/useHydration";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useUserStore } from "@/stores/useUserStore";
import { defaultTodos } from "@/data/defaultTodos";
import ConditionSelect from "@/components/home/ConditionSelect";
import TaskCard from "@/components/home/TaskCard";
import Timer from "@/components/home/Timer";
import CoinDisplay from "@/components/ui/CoinDisplay";
import StreakDisplay from "@/components/ui/StreakDisplay";
import StreakMilestone from "@/components/ui/StreakMilestone";
import EncouragementMessage from "@/components/ui/EncouragementMessage";
import AchievementToast from "@/components/ui/AchievementToast";
import PageTransition from "@/components/ui/PageTransition";
import AddTodoForm from "@/components/home/AddTodoForm";
import LandingPage from "@/components/home/LandingPage";
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
  const checkAndUpdateStreak = useStreakStore((s) => s.checkAndUpdateStreak);
  const checkAchievements = useAchievementStore((s) => s.checkAchievements);
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const isRegistered = useUserStore((s) => s.isRegistered);
  const userId = useUserStore((s) => s.userId);

  // 랜딩페이지 표시 여부
  const [showLanding, setShowLanding] = useState(false);
  // 타이머 모드 상태
  const [timerTodo, setTimerTodo] = useState<Todo | null>(null);
  // 마일스톤 모달
  const [milestoneModal, setMilestoneModal] = useState<{
    days: number;
    bonus: number;
    message: string;
  } | null>(null);
  // 업적 토스트 큐
  const [achievementToast, setAchievementToast] = useState<
    import("@/data/achievements").Achievement | null
  >(null);
  const achievementQueueRef = useRef<import("@/data/achievements").Achievement[]>([]);

  // 첫 실행 시 기본 할일 시드 (localStorage에 저장 기록 없을 때만)
  useEffect(() => {
    if (hydrated && todos.length === 0) {
      // localStorage에 이미 저장된 적이 있으면 시드하지 않음
      const saved = localStorage.getItem("ddak-hana-todos");
      if (saved) return; // 이전에 저장된 적 있음 = 유저가 전부 삭제한 것

      const addTodo = useTodoStore.getState().addTodo;
      defaultTodos.forEach((todo) => addTodo(todo));
    }
  }, [hydrated, todos.length]);

  // 첫 방문자 랜딩페이지 체크
  useEffect(() => {
    if (hydrated) {
      const visited = localStorage.getItem("ddak-hana-visited");
      if (!visited) {
        setShowLanding(true);
      }
    }
  }, [hydrated]);

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

  // 첫 방문자 → 랜딩페이지 표시
  if (showLanding) {
    return (
      <LandingPage
        onStart={() => {
          localStorage.setItem("ddak-hana-visited", "true");
          setShowLanding(false);
        }}
      />
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

    // 스트릭 체크
    const streakResult = checkAndUpdateStreak();
    if (streakResult.milestone) {
      earnCoins(streakResult.milestone.bonus, `🔥 ${streakResult.milestone.days}일 연속 보너스`);
      setMilestoneModal(streakResult.milestone);
    }

    // 업적 체크
    const completedCount = todos.filter((t) => t.completedAt).length + 1;
    const hasCustom = todos.some((t) => t.isCustom);
    const coinBalance = useCoinStore.getState().balance;
    const newAchievements = checkAchievements({
      totalCompleted: completedCount,
      currentStreak: streakResult.streak,
      totalCoins: coinBalance,
      roomLevel,
      friendCount: 0, // TODO: 실시간 조회 시 업데이트
      hasCustomTodo: hasCustom,
      currentHour: new Date().getHours(),
    });

    if (newAchievements.length > 0) {
      // 업적 보상 코인 지급
      newAchievements.forEach((a) => {
        earnCoins(a.reward, `🏆 업적: ${a.title}`);
      });
      // 토스트 큐에 추가
      achievementQueueRef.current = [...achievementQueueRef.current, ...newAchievements];
      if (!achievementToast) {
        setAchievementToast(newAchievements[0]);
      }
    }

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

  const handleAchievementClose = () => {
    setAchievementToast(null);
    achievementQueueRef.current = achievementQueueRef.current.slice(1);
    if (achievementQueueRef.current.length > 0) {
      setTimeout(() => setAchievementToast(achievementQueueRef.current[0]), 300);
    }
  };

  const showNicknameSetup = isSupabaseConfigured() && !isRegistered();

  return (
    <>
      {showNicknameSetup && <NicknameSetup />}
      <AchievementToast
        achievement={achievementToast}
        onClose={handleAchievementClose}
      />
      {milestoneModal && (
        <StreakMilestone
          show={true}
          days={milestoneModal.days}
          bonus={milestoneModal.bonus}
          message={milestoneModal.message}
          onClose={() => setMilestoneModal(null)}
        />
      )}
      <main className="min-h-screen bg-cream-100 px-4 pt-4">
        <PageTransition>
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
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
            <div className="flex items-center gap-2">
              <StreakDisplay />
              <CoinDisplay />
            </div>
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
              <div className="mt-3 pb-20">
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
