"use client";

import { motion } from "framer-motion";
import { useRoomStore } from "@/stores/useRoomStore";
import { pixelItems } from "@/data/pixelItems";

export default function PixelRoom() {
  const grid = useRoomStore((s) => s.grid);
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const placedItems = useRoomStore((s) => s.placedItems);
  const removeItem = useRoomStore((s) => s.removeItem);

  const getItemData = (itemId: string) =>
    pixelItems.find((item) => item.id === itemId);

  const levelNames = ["", "빈 방", "시작", "아늑한", "활기찬", "멋진", "전설의"];

  return (
    <div className="flex flex-col items-center">
      {/* 방 레벨 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">
          {levelNames[roomLevel]} 방
        </span>
        <span className="text-lg font-bold text-lavender-400">
          Lv.{roomLevel}
        </span>
        <span className="text-xs text-gray-400">
          ({placedItems.length}개 아이템)
        </span>
      </div>

      {/* 픽셀 방 그리드 */}
      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-lavender-200 bg-cream-100">
        {/* 벽 영역 (상단 3행) */}
        <div
          className="p-1"
          style={{
            background: "linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)",
          }}
        >
          {grid.slice(0, 3).map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const item = cell ? getItemData(cell) : null;
                return (
                  <motion.div
                    key={`${x}-${y}`}
                    className="w-10 h-10 border border-dashed border-lavender-100/50 flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(196, 181, 253, 0.1)" }}
                    onClick={() => {
                      if (item) {
                        if (confirm(`${item.name}을(를) 치울까요?`)) {
                          removeItem(x, y);
                        }
                      }
                    }}
                  >
                    {item && (
                      <motion.span
                        className="text-2xl cursor-pointer"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {item.emoji}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 바닥 구분선 */}
        <div className="h-0.5 bg-lavender-200/50" />

        {/* 바닥 영역 (하단 3행) */}
        <div
          className="p-1"
          style={{
            background: "linear-gradient(180deg, #FFF0DE 0%, #FDE68A33 100%)",
          }}
        >
          {grid.slice(3, 6).map((row, y) => (
            <div key={y + 3} className="flex">
              {row.map((cell, x) => {
                const item = cell ? getItemData(cell) : null;
                return (
                  <motion.div
                    key={`${x}-${y + 3}`}
                    className="w-10 h-10 border border-dashed border-gold-200/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(253, 230, 138, 0.1)" }}
                    onClick={() => {
                      if (item) {
                        if (confirm(`${item.name}을(를) 치울까요?`)) {
                          removeItem(x, y + 3);
                        }
                      }
                    }}
                  >
                    {item && (
                      <motion.span
                        className="text-2xl cursor-pointer"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {item.emoji}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        {placedItems.length === 0
          ? "상점에서 아이템을 구매하면 방에 배치돼요!"
          : "아이템을 탭하면 치울 수 있어요"}
      </p>
    </div>
  );
}
