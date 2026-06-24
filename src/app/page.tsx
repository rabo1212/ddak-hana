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
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useShopStore } from "@/stores/useShopStore";
import { defaultTodos } from "@/data/defaultTodos";
import { rollItemDrop, type ItemDropResult } from "@/lib/itemDrop";

import PixelRoom from "@/components/room/PixelRoom";
import TodoMiniCard from "@/components/home/TodoMiniCard";
import TimerOverlay from "@/components/home/TimerOverlay";
import ConditionSheet from "@/components/home/ConditionSheet";
import CoinDisplay from "@/components/ui/CoinDisplay";
import StreakDisplay from "@/components/ui/StreakDisplay";
import StreakMilestone from "@/components/ui/StreakMilestone";
import AchievementToast from "@/components/ui/AchievementToast";
import ItemDropModal from "@/components/ui/ItemDropModal";
import LandingPage from "@/components/home/LandingPage";
import NicknameSetup from "@/components/social/NicknameSetup";
import BottomTabBar from "@/components/layout/BottomTabBar";
import AddTodoForm from "@/components/home/AddTodoForm";
import TodoListSheet from "@/components/home/TodoListSheet";

export default function HomePage() {
  const hydrated = useHydration();
  const todos = useTodoStore((s) => s.todos);
  const currentTodoId = useTodoStore((s) => s.currentTodoId);
  const needsConditionCheck = useTodoStore((s) => s.needsConditionCheck);
  const completeTodo = useTodoStore((s) => s.completeTodo);
  const recommendNext = useTodoStore((s) => s.recommendNext);
  const getTodayCompleted = useTodoStore((s) => s.getTodayCompleted);
  const resetRoutines = useTodoStore((s) => s.resetRoutines);
  const earnCoins = useCoinStore((s) => s.earnCoins);
  const addConsecutive = useCoinStore((s) => s.addConsecutive);
  const checkAndUpdateStreak = useStreakStore((s) => s.checkAndUpdateStreak);
  const checkAchievements = useAchievementStore((s) => s.checkAchievements);
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const isRegistered = useUserStore((s) => s.isRegistered);
  const userId = useUserStore((s) => s.userId);
  const addCharacterExp = useCharacterStore((s) => s.addExp);

  const [showLanding, setShowLanding] = useState(false);
  const [timerTodo, setTimerTodo] = useState<Todo | null>(null);
  const [showConditionSheet, setShowConditionSheet] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false);
  const [itemDropResult, setItemDropResult] = useState<ItemDropResult | null>(null);
  const [milestoneModal, setMilestoneModal] = useState<{
    days: number; bonus: number; message: string;
  } | null>(null);
  const [achievementToast, setAchievementToast] = useState<
    import("@/data/achievements").Achievement | null
  >(null);
  const achievementQueueRef = useRef<import("@/data/achievements").Achievement[]>([]);

  // 기본 할일 시드
  useEffect(() => {
    if (hydrated && todos.length === 0) {
      const saved = localStorage.getItem("ddak-hana-todos");
      if (saved) return;
      const addTodo = useTodoStore.getState().addTodo;
      defaultTodos.forEach((todo) => addTodo(todo));
    }
  }, [hydrated, todos.length]);

  // 첫 방문 랜딩페이지
  useEffect(() => {
    if (hydrated) {
      const visited = localStorage.getItem("ddak-hana-visited");
      if (!visited) setShowLanding(true);
    }
  }, [hydrated]);

  // 루틴 리셋 (매일)
  useEffect(() => {
    if (hydrated) {
      resetRoutines();
    }
  }, [hydrated, resetRoutines]);

  // 컨디션 체크 필요 시 바텀시트 표시 (닉네임 설정 중에는 안 띄움)
  const showNicknameSetup = isSupabaseConfigured() && !isRegistered();
  useEffect(() => {
    if (hydrated && !showNicknameSetup && needsConditionCheck()) {
      setShowConditionSheet(true);
    }
  }, [hydrated, needsConditionCheck, showNicknameSetup]);

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

  const currentTodo = todos.find((t) => t.id === currentTodoId) || null;

  // 할래! → 타이머
  const handleStartTimer = (todo: Todo) => {
    setTimerTodo(todo);
  };

  // 타이머 완료
  const handleTimerComplete = () => {
    if (!timerTodo) return;

    completeTodo(timerTodo.id);

    let coins = timerTodo.coinReward;
    const consecutive = addConsecutive();
    const todayDone = getTodayCompleted();

    if (todayDone.length === 0) coins += 10;
    if (consecutive > 0 && consecutive % 3 === 0) coins += 5;

    earnCoins(coins, `할일 완료: ${timerTodo.title}`);

    // 스트릭
    const streakResult = checkAndUpdateStreak();
    if (streakResult.milestone) {
      earnCoins(streakResult.milestone.bonus, `🔥 ${streakResult.milestone.days}일 연속 보너스`);
      setMilestoneModal(streakResult.milestone);
    }

    // 아이템 드랍
    const isStreakBonus = consecutive > 0 && consecutive % 3 === 0;
    const ownedItemIds = useShopStore.getState().purchasedItemIds;
    const dropResult = rollItemDrop({ isStreakBonus, ownedItemIds });

    if (dropResult.type === "item" && dropResult.item) {
      useShopStore.getState().purchaseItem(dropResult.item.id);
      const { grid } = useRoomStore.getState();
      let placed = false;
      for (let y = 0; y < 6 && !placed; y++) {
        for (let x = 0; x < 8 && !placed; x++) {
          if (grid[y][x] === null) {
            useRoomStore.getState().placeItem(dropResult.item.id, x, y);
            placed = true;
          }
        }
      }
    } else if (dropResult.type === "coins" && dropResult.coinAmount) {
      earnCoins(dropResult.coinAmount, `아이템 대신 코인 보너스`);
    }
    setItemDropResult(dropResult);

    // 업적
    const completedCount = todos.filter((t) => t.completedAt).length + 1;
    const hasCustom = todos.some((t) => t.isCustom);
    const coinBalance = useCoinStore.getState().balance;
    const newAchievements = checkAchievements({
      totalCompleted: completedCount,
      currentStreak: streakResult.streak,
      totalCoins: coinBalance,
      roomLevel,
      friendCount: 0,
      hasCustomTodo: hasCustom,
      currentHour: new Date().getHours(),
    });

    if (newAchievements.length > 0) {
      newAchievements.forEach((a) => {
        earnCoins(a.reward, `🏆 업적: ${a.title}`);
      });
      achievementQueueRef.current = [...achievementQueueRef.current, ...newAchievements];
      if (!achievementToast) {
        setAchievementToast(newAchievements[0]);
      }
    }

    addCharacterExp(10);

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

  const handleAchievementClose = () => {
    setAchievementToast(null);
    achievementQueueRef.current = achievementQueueRef.current.slice(1);
    if (achievementQueueRef.current.length > 0) {
      setTimeout(() => setAchievementToast(achievementQueueRef.current[0]), 300);
    }
  };

  return (
    <>
      {/* 모달 레이어 */}
      <ItemDropModal result={itemDropResult} onClose={() => setItemDropResult(null)} />
      {showNicknameSetup && <NicknameSetup />}
      <AchievementToast achievement={achievementToast} onClose={handleAchievementClose} />
      {milestoneModal && (
        <StreakMilestone
          show={true}
          days={milestoneModal.days}
          bonus={milestoneModal.bonus}
          message={milestoneModal.message}
          onClose={() => setMilestoneModal(null)}
        />
      )}

      {/* 메인: 3D 방 전체화면 */}
      <div className="fixed inset-0 bg-cream-100">
        {/* Spline 3D 방 배경 */}
        <PixelRoom fullScreen hideSpeech />

        {/* 상단 오버레이: 코인 + 스트릭 */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-white/90 drop-shadow-md">
              딱 하나 🎯
            </span>
            <div className="flex items-center gap-2">
              <StreakDisplay />
              <CoinDisplay />
            </div>
          </div>
        </div>

        {/* 캐릭터 옆 미니카드 (오버레이 열려있으면 숨김) */}
        {!showConditionSheet && !showAddForm && !showTodoList && (
          <div className="absolute z-20" style={{ bottom: "22%", right: "8%" }}>
            <TodoMiniCard
              todo={currentTodo}
              onStart={handleStartTimer}
              onAdd={() => setShowAddForm(true)}
              onOpenList={() => setShowTodoList(true)}
            />
          </div>
        )}

      </div>

      {/* 할일 추가 모달 */}
      {showAddForm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setShowAddForm(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl px-4 pt-4 pb-4 max-w-sm w-full shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">새 할일 추가</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-300 text-lg"
                >
                  ✕
                </button>
              </div>
              <AddTodoForm
                onAdded={(todoId) => {
                  useTodoStore.setState({ currentTodoId: todoId });
                  setShowAddForm(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* 할일 목록 바텀시트 */}
      {showTodoList && (
        <TodoListSheet
          onClose={() => setShowTodoList(false)}
          onStartTimer={(todo) => {
            setShowTodoList(false);
            handleStartTimer(todo);
          }}
          onAddTodo={() => {
            setShowTodoList(false);
            setShowAddForm(true);
          }}
        />
      )}

      {/* 컨디션 바텀시트 */}
      <ConditionSheet
        show={showConditionSheet}
        onDone={() => setShowConditionSheet(false)}
      />

      {/* 타이머 오버레이 */}
      {timerTodo && (
        <TimerOverlay
          todo={timerTodo}
          onComplete={handleTimerComplete}
          onCancel={() => setTimerTodo(null)}
        />
      )}

      <BottomTabBar />
    </>
  );
}
