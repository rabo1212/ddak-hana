"use client";

import PageTransition from "@/components/ui/PageTransition";
import CoinDisplay from "@/components/ui/CoinDisplay";
import BottomTabBar from "@/components/layout/BottomTabBar";
import PixelRoom from "@/components/room/PixelRoom";
import { useHydration } from "@/lib/useHydration";

export default function RoomPage() {
  const hydrated = useHydration();

  if (!hydrated) return null;

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-lavender-500">내 방 🏠</h1>
            <CoinDisplay />
          </div>
          <PixelRoom />
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
