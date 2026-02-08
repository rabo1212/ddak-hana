"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import CoinDisplay from "@/components/ui/CoinDisplay";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { useHydration } from "@/lib/useHydration";
import { useCoinStore } from "@/stores/useCoinStore";
import { useTodoStore } from "@/stores/useTodoStore";
import { useRoomStore } from "@/stores/useRoomStore";

export default function SettingsPage() {
  const hydrated = useHydration();
  const totalEarned = useCoinStore((s) => s.totalEarned);
  const totalSpent = useCoinStore((s) => s.totalSpent);
  const todos = useTodoStore((s) => s.todos);
  const placedItems = useRoomStore((s) => s.placedItems);
  const roomLevel = useRoomStore((s) => s.roomLevel);

  if (!hydrated) return null;

  const completedCount = todos.filter((t) => t.completedAt).length;

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-lavender-500">설정 ⚙️</h1>
            <CoinDisplay />
          </div>

          <div className="space-y-4">
            {/* 통계 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3">나의 기록 📊</h2>
              <div className="grid grid-cols-2 gap-3">
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
              </div>
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
              <p className="text-sm text-gray-400">딱 하나 v0.1.0</p>
              <p className="text-sm text-gray-400 mt-1">ADHD 친화 할일 + 방꾸미기 앱</p>
              <p className="text-xs text-gray-300 mt-2">
                스트릭 없음 · 패널티 없음 · 오늘 다시 시작한 게 대단해 💜
              </p>
            </div>
          </div>
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
