import { pixelItems, type PixelItem } from "@/data/pixelItems";

export interface ItemDropResult {
  type: "item" | "coins";
  item?: PixelItem;
  coinAmount?: number;
  rarity: "common" | "rare" | "legendary";
}

interface RollOptions {
  isStreakBonus: boolean; // 3연속 보너스 여부
  ownedItemIds: string[];
}

const NORMAL_RATES = { common: 0.8, rare: 0.18, legendary: 0.02 };
const STREAK_RATES = { common: 0.4, rare: 0.5, legendary: 0.1 };

const COIN_FALLBACK = { common: 10, rare: 30, legendary: 100 };

function pickRarity(isStreakBonus: boolean): "common" | "rare" | "legendary" {
  const rates = isStreakBonus ? STREAK_RATES : NORMAL_RATES;
  const roll = Math.random();

  if (roll < rates.legendary) return "legendary";
  if (roll < rates.legendary + rates.rare) return "rare";
  return "common";
}

export function rollItemDrop({ isStreakBonus, ownedItemIds }: RollOptions): ItemDropResult {
  const rarity = pickRarity(isStreakBonus);

  // 해당 레어도 미보유 아이템 필터
  const candidates = pixelItems.filter(
    (item) => item.rarity === rarity && !ownedItemIds.includes(item.id)
  );

  // 미보유 아이템이 없으면 코인 보너스
  if (candidates.length === 0) {
    return {
      type: "coins",
      coinAmount: COIN_FALLBACK[rarity],
      rarity,
    };
  }

  // 랜덤 아이템 선택
  const item = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    type: "item",
    item,
    rarity,
  };
}
