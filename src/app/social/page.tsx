"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHydration } from "@/lib/useHydration";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useUserStore } from "@/stores/useUserStore";
import AddFriend from "@/components/social/AddFriend";
import FriendFeed from "@/components/social/FriendFeed";
import CoinDisplay from "@/components/ui/CoinDisplay";
import PageTransition from "@/components/ui/PageTransition";
import BottomTabBar from "@/components/layout/BottomTabBar";

export default function SocialPage() {
  const hydrated = useHydration();
  const nickname = useUserStore((s) => s.nickname);
  const friendCode = useUserStore((s) => s.friendCode);
  const isRegistered = useUserStore((s) => s.isRegistered);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!hydrated) return null;

  const configured = isSupabaseConfigured();

  const handleCopyCode = async () => {
    if (!friendCode) return;
    try {
      await navigator.clipboard.writeText(friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 실패 시 무시
    }
  };

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6 pb-24">
        <PageTransition>
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/"
              className="text-2xl font-bold text-lavender-500 hover:opacity-80 transition-opacity"
            >
              딱 하나 🎯
            </Link>
            <CoinDisplay />
          </div>

          {!configured ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">🔧</div>
              <p className="text-sm text-gray-500">
                소셜 기능을 사용하려면 Supabase 설정이 필요해요
              </p>
              <p className="text-xs text-gray-300 mt-2">
                .env.local에 NEXT_PUBLIC_SUPABASE_URL과
                NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요
              </p>
            </div>
          ) : !isRegistered() ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">👋</div>
              <p className="text-sm text-gray-500">
                먼저 홈에서 닉네임을 설정해주세요!
              </p>
              <Link
                href="/"
                className="inline-block mt-3 px-4 py-2 bg-lavender-400 text-white rounded-xl text-sm"
              >
                홈으로 가기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 내 프로필 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lavender-100 flex items-center justify-center text-2xl">
                    🧑
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{nickname}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">내 코드:</span>
                      <span className="font-mono text-sm font-bold text-lavender-500 tracking-wider">
                        {friendCode}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopyCode}
                        className="text-xs px-2 py-0.5 rounded-lg bg-lavender-50 text-lavender-400"
                      >
                        {copied ? "복사됨!" : "복사"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 친구 추가 */}
              <AddFriend onAdded={() => setRefreshKey((k) => k + 1)} />

              {/* 친구 목록 */}
              <FriendFeed refreshKey={refreshKey} />
            </div>
          )}
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
