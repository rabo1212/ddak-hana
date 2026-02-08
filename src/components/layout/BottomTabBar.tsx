"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTimerStore } from "@/stores/useTimerStore";

const tabs = [
  { href: "/", label: "홈", icon: "🏠", activeIcon: "🏡" },
  { href: "/room", label: "방", icon: "🪟", activeIcon: "🏘️" },
  { href: "/social", label: "친구", icon: "👥", activeIcon: "🤝" },
  { href: "/shop", label: "상점", icon: "🏪", activeIcon: "🛍️" },
  { href: "/settings", label: "설정", icon: "⚙️", activeIcon: "🔧" },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const isTimerActive = useTimerStore((s) => s.isTimerActive);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-lavender-100">
      <div className="max-w-md mx-auto flex justify-around items-center h-[64px] px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const isLocked = isTimerActive && !isActive;

          if (isLocked) {
            return (
              <div
                key={tab.href}
                className="flex flex-col items-center justify-center flex-1 py-2 relative opacity-30 cursor-not-allowed"
              >
                <span className="text-2xl relative z-10">🔒</span>
                <span className="text-xs mt-1 relative z-10 text-gray-300">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 py-2 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-12 h-12 bg-lavender-100 rounded-2xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="text-2xl relative z-10">
                {isActive ? tab.activeIcon : tab.icon}
              </span>
              <span
                className={`text-xs mt-1 relative z-10 ${
                  isActive
                    ? "text-lavender-500 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 타이머 잠금 안내 */}
      <AnimatePresence>
        {isTimerActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-8 left-0 right-0 text-center"
          >
            <span className="text-[10px] text-lavender-400 bg-lavender-50 px-3 py-1 rounded-full shadow-sm">
              🔒 타이머 종료 후 이동 가능
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
