"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "홈", icon: "🏠", activeIcon: "🏡" },
  { href: "/room", label: "방", icon: "🪟", activeIcon: "🏘️" },
  { href: "/shop", label: "상점", icon: "🏪", activeIcon: "🛍️" },
  { href: "/settings", label: "설정", icon: "⚙️", activeIcon: "🔧" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-lavender-100">
      <div className="max-w-lg mx-auto flex justify-around items-center h-[72px] px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
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
    </nav>
  );
}
