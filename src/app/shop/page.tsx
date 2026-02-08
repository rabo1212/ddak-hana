"use client";

import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import CoinDisplay from "@/components/ui/CoinDisplay";
import BottomTabBar from "@/components/layout/BottomTabBar";
import ShopGrid from "@/components/shop/ShopGrid";
import { useHydration } from "@/lib/useHydration";

export default function ShopPage() {
  const hydrated = useHydration();

  if (!hydrated) return null;

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-2xl font-bold text-lavender-500 hover:opacity-80 transition-opacity">딱 하나 🎯</Link>
            <CoinDisplay />
          </div>
          <ShopGrid />
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
