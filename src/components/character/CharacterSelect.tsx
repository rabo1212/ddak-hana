"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { characters, getCharacterImagePath } from "@/data/characters";
import { useCharacterStore } from "@/stores/useCharacterStore";
import StyleSelector from "./StyleSelector";

interface CharacterSelectProps {
  onSelect?: (characterId: string) => void;
  showConfirm?: boolean;
  showStyleSelector?: boolean;
}

export default function CharacterSelect({
  onSelect,
  showConfirm = true,
  showStyleSelector = true,
}: CharacterSelectProps) {
  const selectedCharacter = useCharacterStore((s) => s.selectedCharacter);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const characterStyle = useCharacterStore((s) => s.characterStyle);
  const setStyle = useCharacterStore((s) => s.setStyle);
  const [tempSelected, setTempSelected] = useState<string | null>(selectedCharacter);
  const [tempStyle, setTempStyle] = useState(characterStyle);

  const handleSelect = (id: string) => {
    setTempSelected(id);
    if (!showConfirm) {
      selectCharacter(id);
      setStyle(tempStyle);
      onSelect?.(id);
    }
  };

  const handleStyleChange = (style: string) => {
    setTempStyle(style);
    if (!showConfirm) {
      setStyle(style);
    }
  };

  const handleConfirm = () => {
    if (!tempSelected) return;
    selectCharacter(tempSelected);
    setStyle(tempStyle);
    onSelect?.(tempSelected);
  };

  const selected = characters.find((c) => c.id === tempSelected);

  return (
    <div className="flex flex-col items-center w-full">
      {/* 선택된 캐릭터 미리보기 */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={`${selected.id}-${tempStyle}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center mb-3"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src={getCharacterImagePath(selected.id, tempStyle)}
                alt={selected.name}
                width={96}
                height={96}
                className="drop-shadow-lg"
              />
            </motion.div>
            <p className="text-lg font-bold text-lavender-500 mt-2">
              {selected.emoji} {selected.name}
            </p>
            <p className="text-sm text-gray-400">{selected.personality}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center mb-3"
          >
            <div className="w-24 h-24 rounded-full bg-lavender-50 flex items-center justify-center">
              <span className="text-4xl">?</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">나와 함께할 친구를 골라줘!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스타일 선택 */}
      {showStyleSelector && (
        <div className="w-full max-w-sm mb-3">
          <p className="text-xs text-gray-400 mb-1.5 px-2">스타일</p>
          <StyleSelector selected={tempStyle} onChange={handleStyleChange} />
        </div>
      )}

      {/* 동물 그리드 */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm px-2 max-h-[280px] overflow-y-auto">
        {characters.map((char) => {
          const isSelected = tempSelected === char.id;
          return (
            <motion.button
              key={char.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(char.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                isSelected
                  ? "bg-lavender-100 ring-2 ring-lavender-400"
                  : "bg-cream-50 hover:bg-lavender-50"
              }`}
            >
              <Image
                src={getCharacterImagePath(char.id, tempStyle)}
                alt={char.name}
                width={48}
                height={48}
                className={isSelected ? "drop-shadow-md" : "opacity-80"}
              />
              <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">
                {char.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 확인 버튼 */}
      {showConfirm && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={!tempSelected}
          className={`mt-4 px-8 py-3 rounded-2xl font-bold text-white transition-all ${
            tempSelected
              ? "bg-lavender-400 hover:bg-lavender-500 shadow-lg"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          {tempSelected ? "이 친구로 할래!" : "친구를 선택해줘"}
        </motion.button>
      )}
    </div>
  );
}
