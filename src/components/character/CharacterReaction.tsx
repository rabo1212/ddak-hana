"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacterStore } from "@/stores/useCharacterStore";
import CharacterAvatar from "./CharacterAvatar";

type ReactionType = "condition" | "complete" | "streak" | "idle";

interface CharacterReactionProps {
  reaction?: ReactionType;
  conditionType?: string;
  streakDays?: number;
}

const conditionMessages: Record<string, string[]> = {
  great: [
    "오늘 기분 좋구나! 같이 힘내자~",
    "좋은 에너지가 느껴져!",
    "오늘은 뭐든 할 수 있어!",
  ],
  okay: [
    "괜찮아, 하나만 하면 돼!",
    "천천히 가도 괜찮아~",
    "오늘도 충분히 잘하고 있어!",
  ],
  tired: [
    "쉬엄쉬엄 하자...",
    "조금만 하고 쉬자!",
    "피곤할 땐 작은 것부터~",
  ],
  bad: [
    "내가 옆에 있을게...",
    "힘든 날도 있는 거야...",
    "그냥 여기 있어도 돼~",
  ],
};

const completeMessages = [
  "대단해! 해냈어!",
  "역시 멋져!",
  "한 걸음 더 성장했어!",
  "최고야, 계속 가자!",
];

const streakMessages: Record<number, string> = {
  3: "3일 연속! 습관이 되어가고 있어!",
  7: "일주일 연속! 정말 대단해!",
  14: "2주 연속! 넌 진짜 끈기왕!",
  30: "한 달 연속! 전설이 되었어!",
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CharacterReaction({
  reaction = "idle",
  conditionType,
  streakDays,
}: CharacterReactionProps) {
  const selectedCharacter = useCharacterStore((s) => s.selectedCharacter);
  const [message, setMessage] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (reaction === "idle") {
      setShowBubble(false);
      return;
    }

    let msg = "";
    if (reaction === "condition" && conditionType) {
      msg = pickRandom(conditionMessages[conditionType] || conditionMessages.okay);
    } else if (reaction === "complete") {
      msg = pickRandom(completeMessages);
    } else if (reaction === "streak" && streakDays) {
      msg = streakMessages[streakDays] || `${streakDays}일 연속! 꾸준하구나!`;
    }

    if (msg) {
      setMessage(msg);
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [reaction, conditionType, streakDays]);

  if (!selectedCharacter) return null;

  const moodFromCondition =
    conditionType === "great" ? "happy" :
    conditionType === "tired" ? "tired" :
    conditionType === "bad" ? "sleepy" :
    reaction === "complete" ? "happy" :
    "normal";

  return (
    <div className="flex flex-col items-center relative">
      {/* 말풍선 */}
      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="relative bg-white rounded-2xl px-4 py-2 shadow-md mb-2 max-w-[220px]"
          >
            <p className="text-sm text-gray-600 text-center leading-tight">{message}</p>
            {/* 말풍선 꼬리 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 캐릭터 */}
      <CharacterAvatar
        size={80}
        mood={moodFromCondition}
        showLevel
      />

      {/* 완료 시 축하 파티클 */}
      <AnimatePresence>
        {reaction === "complete" && (
          <>
            {["✨", "⭐", "🎉"].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-lg pointer-events-none"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: (i - 1) * 30,
                  y: -40 - i * 10,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                {emoji}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
