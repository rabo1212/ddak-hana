"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRoomStore } from "@/stores/useRoomStore";
import { pixelItems } from "@/data/pixelItems";
import PixelArt from "./PixelArt";

const CELL_SIZE = 44;
const GRID_COLS = 8;
const GRID_ROWS = 6;

export default function PixelRoom() {
  const grid = useRoomStore((s) => s.grid);
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const placedItems = useRoomStore((s) => s.placedItems);
  const moveItem = useRoomStore((s) => s.moveItem);
  const swapItem = useRoomStore((s) => s.swapItem);
  const removeItem = useRoomStore((s) => s.removeItem);

  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const getItemData = (itemId: string) =>
    pixelItems.find((item) => item.id === itemId);

  const levelNames = ["", "빈 방", "시작", "아늑한", "활기찬", "멋진", "전설의"];

  // 포인터 위치 → 그리드 좌표 계산
  const getGridPos = useCallback((clientX: number, clientY: number) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((clientY - rect.top) / CELL_SIZE);
    if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return null;
    return { x, y };
  }, []);

  // 드래그 시작
  const handleDragStart = (x: number, y: number) => {
    setDragging({ x, y });
  };

  // 드래그 중 — 드롭 타겟 하이라이트
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const pos = getGridPos(e.clientX, e.clientY);
      if (pos && (pos.x !== dragging.x || pos.y !== dragging.y)) {
        setDropTarget(pos);
      } else {
        setDropTarget(null);
      }
    },
    [dragging, getGridPos]
  );

  // 드래그 끝 — 이동 또는 교환
  const handleDragEnd = useCallback(
    (_: never, info: { point: { x: number; y: number } }) => {
      if (!dragging) return;

      const target = getGridPos(info.point.x, info.point.y);

      if (target && (target.x !== dragging.x || target.y !== dragging.y)) {
        const targetCell = grid[target.y]?.[target.x];
        if (targetCell === null) {
          moveItem(dragging.x, dragging.y, target.x, target.y);
        } else {
          swapItem(dragging.x, dragging.y, target.x, target.y);
        }
      }

      setDragging(null);
      setDropTarget(null);
    },
    [dragging, grid, getGridPos, moveItem, swapItem]
  );

  // 롱프레스로 삭제
  const handleLongPress = (x: number, y: number) => {
    const itemId = grid[y]?.[x];
    if (!itemId) return;
    const item = getItemData(itemId);
    if (item && confirm(`${item.name}을(를) 치울까요?`)) {
      removeItem(x, y);
    }
  };

  // 셀 렌더링
  const renderCell = (cell: string | null, x: number, y: number, isWall: boolean) => {
    const item = cell ? getItemData(cell) : null;
    const isDraggingThis = dragging?.x === x && dragging?.y === y;
    const isDropHere = dropTarget?.x === x && dropTarget?.y === y;

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
        {/* 드롭 타겟 하이라이트 */}
        {isDropHere && (
          <motion.div
            className="absolute inset-1 rounded-lg bg-lavender-300/30 border-2 border-dashed border-lavender-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* 아이템 */}
        {item && (
          <motion.div
            className="cursor-grab active:cursor-grabbing z-10 touch-none"
            drag
            dragSnapToOrigin
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => handleDragStart(x, y)}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            style={{ opacity: isDraggingThis ? 0.5 : 1 }}
            onContextMenu={(e) => {
              e.preventDefault();
              handleLongPress(x, y);
            }}
          >
            <PixelArt itemId={cell!} size={CELL_SIZE - 8} />
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center"
      onPointerMove={handlePointerMove}
    >
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
      <div
        ref={gridRef}
        className="rounded-2xl overflow-hidden shadow-lg border-4 border-lavender-200"
      >
        {/* 벽 영역 (상단 3행) */}
        <div
          className="p-0"
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

        {/* 바닥 구분선 */}
        <div className="h-0.5 bg-lavender-200/50" />

        {/* 바닥 영역 (하단 3행) */}
        <div
          className="p-0"
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

      <p className="text-xs text-gray-400 mt-4 text-center">
        {placedItems.length === 0
          ? "상점에서 아이템을 구매하면 방에 배치돼요!"
          : "드래그로 이동 · 우클릭/롱프레스로 치우기"}
      </p>
    </div>
  );
}
