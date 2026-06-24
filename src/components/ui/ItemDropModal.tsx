"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FurnitureImage from "@/components/room/FurnitureImage";
import type { ItemDropResult } from "@/lib/itemDrop";

interface ItemDropModalProps {
  result: ItemDropResult | null;
  onClose: () => void;
}

const rarityStyle = {
  common: {
    bg: "from-gray-100 to-gray-200",
    glow: "rgba(156,163,175,0.4)",
    border: "border-gray-300",
    label: "일반",
    labelColor: "text-gray-500",
    emoji: "📦",
  },
  rare: {
    bg: "from-purple-100 to-purple-200",
    glow: "rgba(167,139,250,0.5)",
    border: "border-purple-300",
    label: "레어",
    labelColor: "text-purple-500",
    emoji: "💜",
  },
  legendary: {
    bg: "from-amber-100 to-yellow-200",
    glow: "rgba(251,191,36,0.6)",
    border: "border-yellow-400",
    label: "전설",
    labelColor: "text-amber-500",
    emoji: "✨",
  },
};

const characterReactions = {
  common: ["괜찮은 거 나왔다!", "오 쓸만해!", "나쁘지 않아~"],
  rare: ["우와 레어다!", "이거 진짜 좋은 거야!", "대박!"],
  legendary: ["전설이다!!! 미쳤어!", "세상에!! 대박 중 대박!", "역대급이야!!!"],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ItemDropModal({ result, onClose }: ItemDropModalProps) {
  const [phase, setPhase] = useState<"box" | "shake" | "reveal">("box");

  useEffect(() => {
    if (!result) {
      setPhase("box");
      return;
    }

    // 상자 → 흔들림 → 공개
    setPhase("box");
    const t1 = setTimeout(() => setPhase("shake"), 600);
    const t2 = setTimeout(() => setPhase("reveal"), 1400);
    const t3 = setTimeout(() => onClose(), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [result, onClose]);

  if (!result) return null;

  const style = rarityStyle[result.rarity];
  const reaction = pickRandom(characterReactions[result.rarity]);
  const isItem = result.type === "item" && result.item;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center"
        >
          {/* Phase 1: 상자 */}
          {phase === "box" && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-7xl"
            >
              📦
            </motion.div>
          )}

          {/* Phase 2: 흔들림 */}
          {phase === "shake" && (
            <motion.div
              animate={{
                rotate: [0, -8, 8, -8, 8, -4, 4, 0],
                scale: [1, 1.05, 1.05, 1.1, 1.05, 1.1, 1.05, 1.15],
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-7xl"
            >
              📦
            </motion.div>
          )}

          {/* Phase 3: 아이템 공개 */}
          {phase === "reveal" && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center gap-3"
            >
              {/* 글로우 배경 */}
              <div
                className={`relative w-32 h-32 rounded-3xl bg-gradient-to-b ${style.bg} ${style.border} border-2 flex items-center justify-center shadow-xl`}
                style={{
                  boxShadow: `0 0 40px ${style.glow}, 0 0 80px ${style.glow}`,
                }}
              >
                {/* 파티클 이펙트 */}
                {result.rarity !== "common" && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/60"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{
                          opacity: 0,
                          scale: 0,
                          x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                          y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                        }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    ))}
                  </>
                )}

                {/* 아이템 또는 코인 아이콘 */}
                {isItem ? (
                  <FurnitureImage itemId={result.item!.id} size={72} />
                ) : (
                  <span className="text-5xl">🪙</span>
                )}
              </div>

              {/* 레어도 뱃지 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1"
              >
                <span className="text-sm">{style.emoji}</span>
                <span className={`text-xs font-bold ${style.labelColor}`}>
                  {style.label}
                </span>
              </motion.div>

              {/* 아이템 이름 or 코인 수량 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold text-gray-700"
              >
                {isItem ? (
                  <>
                    {result.item!.emoji} {result.item!.name}
                  </>
                ) : (
                  <>🪙 +{result.coinAmount} 코인</>
                )}
              </motion.p>

              {/* 캐릭터 반응 대사 */}
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-400 bg-white/60 rounded-xl px-3 py-1"
              >
                &quot;{reaction}&quot;
              </motion.p>

              {/* 탭 안내 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                className="text-xs text-gray-300 mt-2"
              >
                탭해서 닫기
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
