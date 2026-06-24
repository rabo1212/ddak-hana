"use client";

import { motion } from "framer-motion";

export const ANIMAL_STYLES = [
  { id: "Round", label: "둥글둥글" },
  { id: "Square", label: "네모네모" },
  { id: "Round (outline)", label: "둥글 라인" },
  { id: "Square (outline)", label: "네모 라인" },
  { id: "Round without details", label: "심플 둥글" },
  { id: "Square without details", label: "심플 네모" },
  { id: "Round without details (outline)", label: "심플 둥글 라인" },
  { id: "Square without details (outline)", label: "심플 네모 라인" },
] as const;

interface StyleSelectorProps {
  selected: string;
  onChange: (style: string) => void;
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {ANIMAL_STYLES.map((style) => {
        const isActive = selected === style.id;
        return (
          <motion.button
            key={style.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(style.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? "bg-lavender-400 text-white shadow-sm"
                : "bg-cream-50 text-gray-400 hover:bg-lavender-50"
            }`}
          >
            {style.label}
          </motion.button>
        );
      })}
    </div>
  );
}
