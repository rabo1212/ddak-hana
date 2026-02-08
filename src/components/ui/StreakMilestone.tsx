"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StreakMilestoneProps {
  show: boolean;
  days: number;
  bonus: number;
  message: string;
  onClose: () => void;
}

export default function StreakMilestone({
  show,
  days,
  bonus,
  message,
  onClose,
}: StreakMilestoneProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* 모달 */}
          <motion.div
            className="relative bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-xl"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-6xl mb-3"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              🔥
            </motion.div>

            <h2 className="text-xl font-bold text-orange-500 mb-1">
              {days}일 연속 달성!
            </h2>

            <p className="text-sm text-gray-500 mb-4">{message}</p>

            <motion.div
              className="inline-flex items-center gap-1 bg-gold-100 px-4 py-2 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <span className="text-lg">🪙</span>
              <span className="text-lg font-bold text-gold-400">
                +{bonus}
              </span>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="block w-full py-3 bg-orange-400 text-white rounded-2xl font-semibold text-sm"
            >
              계속 달려가자!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
