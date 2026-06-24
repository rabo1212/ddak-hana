"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import CoinDisplay from "@/components/ui/CoinDisplay";
import BottomTabBar from "@/components/layout/BottomTabBar";
import CharacterAvatar from "@/components/character/CharacterAvatar";
import CharacterCustomize from "@/components/character/CharacterCustomize";
import { useHydration } from "@/lib/useHydration";
import { useCoinStore } from "@/stores/useCoinStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { useTodoStore } from "@/stores/useTodoStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useStreakStore } from "@/stores/useStreakStore";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { achievements } from "@/data/achievements";
import { getCharacter } from "@/data/characters";
import NotificationSettings from "@/components/settings/NotificationSettings";

export default function ProfilePage() {
  const hydrated = useHydration();
  const totalEarned = useCoinStore((s) => s.totalEarned);
  const totalSpent = useCoinStore((s) => s.totalSpent);
  const todos = useTodoStore((s) => s.todos);
  const placedItems = useRoomStore((s) => s.placedItems);
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const unlockedCount = useAchievementStore((s) => s.unlockedIds.length);
  const selectedCharacter = useCharacterStore((s) => s.selectedCharacter);
  const characterLevel = useCharacterStore((s) => s.characterLevel);
  const [showCustomize, setShowCustomize] = useState(false);
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const toggleAdmin = useAdminStore((s) => s.toggleAdmin);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleVersionTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      toggleAdmin();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1500);
    }
  };

  if (!hydrated) return null;

  const completedCount = todos.filter((t) => t.completedAt).length;
  const character = selectedCharacter ? getCharacter(selectedCharacter) : null;

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6 pb-24">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-lavender-500">프로필</h1>
            <CoinDisplay />
          </div>

          <div className="space-y-4">
            {/* 내 캐릭터 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3">내 캐릭터 🐾</h2>
              <div className="flex items-center gap-4">
                <CharacterAvatar size={64} showLevel />
                <div className="flex-1">
                  {character ? (
                    <>
                      <p className="font-bold text-gray-700">
                        {character.emoji} {character.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Lv.{characterLevel} · {character.personality}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">캐릭터를 선택해주세요</p>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCustomize(true)}
                  className="px-4 py-2 bg-lavender-100 text-lavender-500 rounded-xl text-sm font-medium"
                >
                  바꾸기
                </motion.button>
              </div>
            </div>

            {/* 통계 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3">나의 기록 📊</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-lavender-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-lavender-500">{completedCount}</div>
                  <div className="text-xs text-gray-400">완료한 할일</div>
                </div>
                <div className="bg-gold-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gold-400">{totalEarned}</div>
                  <div className="text-xs text-gray-400">총 획득 코인</div>
                </div>
                <div className="bg-softpink-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-softpink-400">{totalSpent}</div>
                  <div className="text-xs text-gray-400">총 사용 코인</div>
                </div>
                <div className="bg-mint-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-mint-400">Lv.{roomLevel}</div>
                  <div className="text-xs text-gray-400">방 레벨 ({placedItems.length}개)</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
                  <div className="text-xs text-gray-400">현재 연속일</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">{longestStreak}</div>
                  <div className="text-xs text-gray-400">최고 연속 기록</div>
                </div>
              </div>
            </div>

            {/* 업적 */}
            <Link href="/profile/achievements" className="block">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold text-gray-700">나의 업적</p>
                    <p className="text-xs text-gray-400">
                      {unlockedCount}/{achievements.length}개 달성
                    </p>
                  </div>
                </div>
                <span className="text-gray-300">→</span>
              </motion.div>
            </Link>

            {/* 알림 설정 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3">알림 설정 ⏰</h2>
              <NotificationSettings />
            </div>

            {/* 데이터 관리 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3">데이터 관리</h2>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-softpink-100 text-softpink-400 rounded-xl text-sm font-medium"
                onClick={() => {
                  if (confirm("정말 모든 데이터를 초기화할까요?\n코인, 아이템, 할일 전부 사라져요!")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                전체 데이터 초기화
              </motion.button>
            </div>

            {/* 앱 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-2">앱 정보</h2>
              <p
                className="text-sm text-gray-400 select-none cursor-default"
                onClick={handleVersionTap}
              >
                딱 하나 v0.1.0
              </p>
              {isAdmin && (
                <p className="text-xs text-lavender-400 mt-2 font-medium">
                  🔧 관리자 모드 활성화됨
                </p>
              )}
              <p className="text-xs text-gray-300 mt-2">
                부담 없이 · 하나씩 · 내 페이스대로 💜
              </p>
            </div>
          </div>
        </PageTransition>
      </main>
      <BottomTabBar />
      <CharacterCustomize
        isOpen={showCustomize}
        onClose={() => setShowCustomize(false)}
      />
    </>
  );
}
