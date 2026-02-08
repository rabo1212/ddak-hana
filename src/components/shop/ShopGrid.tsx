"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pixelItems, shopCategories } from "@/data/pixelItems";
import { useShopStore } from "@/stores/useShopStore";
import { useCoinStore } from "@/stores/useCoinStore";
import { useRoomStore } from "@/stores/useRoomStore";
import PixelArt from "@/components/room/PixelArt";

export default function ShopGrid() {
  const { purchasedItemIds, selectedCategory, purchaseItem, hasPurchased, setCategory } = useShopStore();
  const balance = useCoinStore((s) => s.balance);
  const spendCoins = useCoinStore((s) => s.spendCoins);
  const grid = useRoomStore((s) => s.grid);
  const placeItem = useRoomStore((s) => s.placeItem);

  const [justBought, setJustBought] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === "all"
      ? pixelItems
      : pixelItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = (item: typeof pixelItems[0]) => {
    if (hasPurchased(item.id)) return;
    if (!spendCoins(item.price, `아이템 구매: ${item.name}`)) {
      return;
    }
    purchaseItem(item.id);
    setJustBought(item.id);
    setTimeout(() => setJustBought(null), 1500);

    // 빈 자리에 자동 배치
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 8; x++) {
        if (grid[y][x] === null) {
          placeItem(item.id, x, y);
          return;
        }
      }
    }
  };

  const rarityStyle: Record<string, { border: string; bg: string; badge: string }> = {
    common: { border: "border-gray-200", bg: "bg-white", badge: "" },
    rare: { border: "border-lavender-300", bg: "bg-lavender-50", badge: "💎" },
    legendary: { border: "border-gold-300", bg: "bg-gold-50", badge: "👑" },
  };

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        {shopCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-lavender-300 text-white shadow-md"
                : "bg-white text-gray-500 shadow-sm"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </motion.button>
        ))}
      </div>

      {/* 아이템 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const owned = hasPurchased(item.id);
            const canAfford = balance >= item.price;
            const style = rarityStyle[item.rarity];
            const wasBought = justBought === item.id;

            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: wasBought ? [1, 1.1, 1] : 1,
                }}
                whileHover={{ scale: owned ? 1 : 1.03 }}
                whileTap={{ scale: owned ? 1 : 0.97 }}
                onClick={() => handlePurchase(item)}
                disabled={owned || !canAfford}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 ${style.border} ${style.bg} ${
                  owned ? "opacity-60" : !canAfford ? "opacity-40" : ""
                } transition-all relative`}
              >
                {/* 레어도 배지 */}
                {style.badge && (
                  <span className="absolute top-1 right-1 text-xs">{style.badge}</span>
                )}

                <div className="mb-1 flex items-center justify-center" style={{ width: 48, height: 48 }}>
                  {canAfford || owned ? (
                    <PixelArt itemId={item.id} size={48} />
                  ) : (
                    <span className="text-3xl">🔒</span>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 truncate w-full text-center">
                  {item.name}
                </span>
                <span
                  className={`text-xs mt-1 font-medium ${
                    owned
                      ? "text-mint-400"
                      : canAfford
                      ? "text-gold-400"
                      : "text-gray-300"
                  }`}
                >
                  {owned ? "✅ 보유" : `🪙 ${item.price}`}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 보유 아이템 수 */}
      <p className="text-center text-xs text-gray-400 mt-6">
        보유 아이템: {purchasedItemIds.length} / {pixelItems.length}개
      </p>
    </div>
  );
}
