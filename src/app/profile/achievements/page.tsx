"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useHydration } from "@/lib/useHydration";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { achievements, rarityColors, rarityLabels } from "@/data/achievements";
import PageTransition from "@/components/ui/PageTransition";
import BottomTabBar from "@/components/layout/BottomTabBar";

// 스킬트리 lazy load (SSR 비활성화)
const SkillTree = dynamic(
  () => import("@/components/achievements/SkillTree"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-2xl bg-[#1a1025] flex items-center justify-center animate-pulse">
        <span className="text-purple-400 text-sm">스킬트리 로딩 중...</span>
      </div>
    ),
  }
);

type ViewMode = "tree" | "list";

export default function AchievementsPage() {
  const hydrated = useHydration();
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);
  const unlockedAt = useAchievementStore((s) => s.unlockedAt);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");

  if (!hydrated) return null;

  const unlocked = achievements.filter((a) => unlockedIds.includes(a.id));
  const locked = achievements.filter((a) => !unlockedIds.includes(a.id));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6 pb-24">
        <PageTransition>
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-xl">
                ←
              </Link>
              <h1 className="text-lg font-bold text-lavender-500">
                나의 업적
              </h1>
              <span className="text-sm text-gray-400">
                {unlocked.length}/{achievements.length}
              </span>
            </div>

            {/* 뷰 모드 전환 */}
            <div className="flex bg-gray-100 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "tree"
                    ? "bg-white text-lavender-500 shadow-sm"
                    : "text-gray-400"
                }`}
              >
                지도
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-lavender-500 shadow-sm"
                    : "text-gray-400"
                }`}
              >
                목록
              </button>
            </div>
          </div>

          {/* 스킬트리 뷰 */}
          {viewMode === "tree" && (
            <div className="mb-6">
              <SkillTree />
              <p className="text-[10px] text-gray-300 text-center mt-2">
                드래그해서 이동 · 핀치/스크롤로 확대/축소
              </p>
            </div>
          )}

          {/* 목록 뷰 */}
          {viewMode === "list" && (
            <>
              {/* 달성한 업적 */}
              {unlocked.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-600 mb-3">
                    달성한 업적
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {unlocked.map((a, i) => {
                      const colors = rarityColors[a.rarity];
                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`${colors.bg} border ${colors.border} rounded-2xl p-3 text-center`}
                        >
                          <div className="text-3xl mb-1">{a.emoji}</div>
                          <p className={`text-xs font-bold ${colors.text}`}>
                            {a.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {a.description}
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="text-[10px] text-gray-300">
                              {formatDate(unlockedAt[a.id])}
                            </span>
                            <span className={`text-[10px] ${colors.text}`}>
                              {rarityLabels[a.rarity]}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 미달성 업적 */}
              {locked.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-600 mb-3">
                    도전 과제
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {locked.map((a) => (
                      <div
                        key={a.id}
                        className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center opacity-60"
                      >
                        <div className="text-3xl mb-1 grayscale">🔒</div>
                        <p className="text-xs font-bold text-gray-400">???</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">
                          {a.description}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="text-[10px]">🪙</span>
                          <span className="text-[10px] text-gray-300">
                            +{a.reward}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
