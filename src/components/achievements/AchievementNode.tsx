"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { achievements } from "@/data/achievements";
import { useAchievementStore } from "@/stores/useAchievementStore";

const rarityNodeColors = {
  common: {
    unlocked: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-gray-200/50",
    locked: "bg-gray-800/60 border-gray-600",
  },
  rare: {
    unlocked: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 shadow-purple-300/50",
    locked: "bg-gray-800/60 border-gray-600",
  },
  legendary: {
    unlocked: "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-400 shadow-amber-300/50",
    locked: "bg-gray-800/60 border-gray-600",
  },
};

function AchievementNode({ data }: NodeProps) {
  const achievementId = data.label as string;
  const achievement = achievements.find((a) => a.id === achievementId);
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);
  const isUnlocked = unlockedIds.includes(achievementId);

  if (!achievement) return null;

  const colors = rarityNodeColors[achievement.rarity];
  const style = isUnlocked ? colors.unlocked : colors.locked;

  return (
    <div
      className={`relative rounded-2xl border-2 px-4 py-3 min-w-[120px] text-center transition-all ${style}`}
      style={
        isUnlocked
          ? { boxShadow: `0 0 20px ${achievement.rarity === "legendary" ? "rgba(251,191,36,0.4)" : achievement.rarity === "rare" ? "rgba(167,139,250,0.3)" : "rgba(156,163,175,0.2)"}` }
          : {}
      }
    >
      <Handle type="target" position={Position.Left} className="!bg-purple-400 !w-2 !h-2" />

      <div className="text-2xl mb-1">
        {isUnlocked ? achievement.emoji : "🔒"}
      </div>
      <p
        className={`text-xs font-bold leading-tight ${
          isUnlocked ? "text-gray-700" : "text-gray-500"
        }`}
      >
        {achievement.title}
      </p>
      {isUnlocked && (
        <p className="text-[10px] text-gray-400 mt-0.5">
          +{achievement.reward} 🪙
        </p>
      )}

      <Handle type="source" position={Position.Right} className="!bg-purple-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(AchievementNode);
