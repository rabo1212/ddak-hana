import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlacedItem {
  itemId: string;
  gridX: number;
  gridY: number;
  placedAt: string;
}

interface RoomState {
  grid: (string | null)[][];
  placedItems: PlacedItem[];
  roomLevel: number;
  wallColor: string;
  floorColor: string;

  placeItem: (itemId: string, x: number, y: number) => boolean;
  removeItem: (x: number, y: number) => void;
  moveItem: (fromX: number, fromY: number, toX: number, toY: number) => boolean;
  swapItem: (fromX: number, fromY: number, toX: number, toY: number) => boolean;
  setWallColor: (color: string) => void;
  setFloorColor: (color: string) => void;
}

function createEmptyGrid(): (string | null)[][] {
  return Array.from({ length: 6 }, () => Array(8).fill(null));
}

function calcRoomLevel(itemCount: number): number {
  if (itemCount >= 20) return 6;
  if (itemCount >= 15) return 5;
  if (itemCount >= 10) return 4;
  if (itemCount >= 6) return 3;
  if (itemCount >= 3) return 2;
  return 1;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      grid: createEmptyGrid(),
      placedItems: [],
      roomLevel: 1,
      wallColor: "#FFF8F0",
      floorColor: "#F5F0E8",

      placeItem: (itemId, x, y) => {
        const { grid } = get();
        if (x < 0 || x >= 8 || y < 0 || y >= 6) return false;
        if (grid[y][x] !== null) return false;

        const newGrid = grid.map((row) => [...row]);
        newGrid[y][x] = itemId;

        const newPlacedItem: PlacedItem = {
          itemId,
          gridX: x,
          gridY: y,
          placedAt: new Date().toISOString(),
        };

        set((state) => {
          const newPlacedItems = [...state.placedItems, newPlacedItem];
          return {
            grid: newGrid,
            placedItems: newPlacedItems,
            roomLevel: calcRoomLevel(newPlacedItems.length),
          };
        });
        return true;
      },

      removeItem: (x, y) => {
        const { grid } = get();
        if (grid[y]?.[x] === null) return;

        const newGrid = grid.map((row) => [...row]);
        newGrid[y][x] = null;

        set((state) => {
          const newPlacedItems = state.placedItems.filter(
            (item) => !(item.gridX === x && item.gridY === y)
          );
          return {
            grid: newGrid,
            placedItems: newPlacedItems,
            roomLevel: calcRoomLevel(newPlacedItems.length),
          };
        });
      },

      moveItem: (fromX, fromY, toX, toY) => {
        const { grid } = get();
        const itemId = grid[fromY]?.[fromX];
        if (!itemId) return false;
        if (grid[toY]?.[toX] !== null) return false;

        const newGrid = grid.map((row) => [...row]);
        newGrid[fromY][fromX] = null;
        newGrid[toY][toX] = itemId;

        set((state) => ({
          grid: newGrid,
          placedItems: state.placedItems.map((item) =>
            item.gridX === fromX && item.gridY === fromY
              ? { ...item, gridX: toX, gridY: toY }
              : item
          ),
        }));
        return true;
      },

      swapItem: (fromX, fromY, toX, toY) => {
        const { grid } = get();
        const fromItem = grid[fromY]?.[fromX];
        const toItem = grid[toY]?.[toX];
        if (!fromItem) return false;
        if (toX < 0 || toX >= 8 || toY < 0 || toY >= 6) return false;

        const newGrid = grid.map((row) => [...row]);
        newGrid[fromY][fromX] = toItem;
        newGrid[toY][toX] = fromItem;

        set((state) => ({
          grid: newGrid,
          placedItems: state.placedItems.map((item) => {
            if (item.gridX === fromX && item.gridY === fromY) {
              return { ...item, gridX: toX, gridY: toY };
            }
            if (item.gridX === toX && item.gridY === toY) {
              return { ...item, gridX: fromX, gridY: fromY };
            }
            return item;
          }),
        }));
        return true;
      },

      setWallColor: (color) => set({ wallColor: color }),
      setFloorColor: (color) => set({ floorColor: color }),
    }),
    { name: "ddak-hana-room" }
  )
);
