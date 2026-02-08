"use client";

import { pixelItems } from "@/data/pixelItems";
import PixelArt from "@/components/room/PixelArt";
import type { PlacedItem } from "@/stores/useRoomStore";

const CELL_SIZE = 44;
const GRID_COLS = 8;
const GRID_ROWS = 6;

interface FriendRoomViewProps {
  placedItems: PlacedItem[];
  wallColor: string;
  floorColor: string;
  roomLevel: number;
  nickname: string;
}

export default function FriendRoomView({
  placedItems,
  roomLevel,
  nickname,
}: FriendRoomViewProps) {
  // placedItems에서 grid 재구성
  const grid: (string | null)[][] = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(null)
  );
  placedItems.forEach((item) => {
    if (item.gridY >= 0 && item.gridY < GRID_ROWS && item.gridX >= 0 && item.gridX < GRID_COLS) {
      grid[item.gridY][item.gridX] = item.itemId;
    }
  });

  const levelNames = ["", "빈 방", "시작", "아늑한", "활기찬", "멋진", "전설의"];

  const renderCell = (cell: string | null, x: number, y: number, isWall: boolean) => {
    const item = cell ? pixelItems.find((p) => p.id === cell) : null;

    return (
      <div
        key={`${x}-${y}`}
        className={`relative flex items-center justify-center ${
          isWall
            ? "border border-dashed border-lavender-100/50"
            : "border border-dashed border-gold-200/30"
        }`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
      >
        {item && (
          <div className="z-10">
            <PixelArt itemId={cell!} size={CELL_SIZE - 8} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">
          {nickname}의 {levelNames[roomLevel] || ""} 방
        </span>
        <span className="text-lg font-bold text-lavender-400">
          Lv.{roomLevel}
        </span>
        <span className="text-xs text-gray-400">
          ({placedItems.length}개 아이템)
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-lavender-200">
        {/* 벽 */}
        <div
          style={{
            background: "linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)",
          }}
        >
          {grid.slice(0, 3).map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => renderCell(cell, x, y, true))}
            </div>
          ))}
        </div>

        <div className="h-0.5 bg-lavender-200/50" />

        {/* 바닥 */}
        <div
          style={{
            background: "linear-gradient(180deg, #FFF0DE 0%, #FDE68A33 100%)",
          }}
        >
          {grid.slice(3, 6).map((row, y) => (
            <div key={y + 3} className="flex">
              {row.map((cell, x) => renderCell(cell, x, y + 3, false))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
