"use client";

import { useCoinStore } from "@/stores/useCoinStore";
import { useHydration } from "@/lib/useHydration";
import { motion, AnimatePresence } from "framer-motion";

export default function CoinDisplay() {
  const balance = useCoinStore((s) => s.balance);
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="flex items-center gap-1 bg-gold-100 px-3 py-1.5 rounded-full">
        <span className="text-lg">🪙</span>
        <span className="text-sm font-bold text-gold-400">---</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-1 bg-gold-100 px-3 py-1.5 rounded-full"
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-lg">🪙</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={balance}
          className="text-sm font-bold text-gold-400"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {balance}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
