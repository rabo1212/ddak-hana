"use client";

import Image from "next/image";
import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useCharacterStore, type CharacterMood } from "@/stores/useCharacterStore";
import { getCharacterImagePath, getCharacter } from "@/data/characters";

interface CharacterAvatarProps {
  size?: number;
  showName?: boolean;
  showLevel?: boolean;
  mood?: CharacterMood;
}

const moodAnimations: Record<CharacterMood, TargetAndTransition> = {
  happy: {
    y: [0, -8, 0],
    scale: [1, 1.08, 1],
    rotate: [0, -3, 3, 0],
  },
  normal: {
    y: [0, -4, 0],
  },
  tired: {
    x: [-2, 2, -2],
    rotate: [-2, 2, -2],
  },
  sleepy: {
    rotate: [0, 5, 5, 0],
    y: [0, 2, 2, 0],
  },
};

const moodTransitions: Record<CharacterMood, Transition> = {
  happy: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  normal: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  tired: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  sleepy: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export default function CharacterAvatar({
  size = 80,
  showName = false,
  showLevel = false,
  mood: moodOverride,
}: CharacterAvatarProps) {
  const selectedCharacter = useCharacterStore((s) => s.selectedCharacter);
  const characterStyle = useCharacterStore((s) => s.characterStyle);
  const characterMood = useCharacterStore((s) => s.characterMood);
  const characterLevel = useCharacterStore((s) => s.characterLevel);

  if (!selectedCharacter) return null;

  const character = getCharacter(selectedCharacter);
  if (!character) return null;

  const currentMood = moodOverride || characterMood;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 그림자 (2.5D 효과) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/10"
          animate={{
            width: currentMood === "happy" ? [size * 0.6, size * 0.5, size * 0.6] : size * 0.6,
            height: [8, 6, 8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: size * 0.6, height: 8 }}
        />

        {/* 캐릭터 이미지 */}
        <motion.div
          animate={moodAnimations[currentMood]}
          transition={moodTransitions[currentMood]}
        >
          <Image
            src={getCharacterImagePath(selectedCharacter, characterStyle)}
            alt={character.name}
            width={size}
            height={size}
            className="drop-shadow-md"
            priority
          />
        </motion.div>

        {/* 졸림 이펙트 */}
        {currentMood === "sleepy" && (
          <motion.span
            className="absolute -top-2 -right-2 text-sm"
            animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💤
          </motion.span>
        )}

        {/* 레벨 뱃지 */}
        {showLevel && (
          <div className="absolute -bottom-1 -right-1 bg-gold-300 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm">
            Lv.{characterLevel}
          </div>
        )}
      </div>

      {showName && (
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {character.emoji} {character.name}
        </p>
      )}
    </div>
  );
}
