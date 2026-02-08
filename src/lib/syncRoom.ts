import { supabase, isSupabaseConfigured } from "./supabase";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSyncRoom() {
  if (!isSupabaseConfigured()) return;

  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    const { placedItems, wallColor, floorColor, roomLevel } =
      useRoomStore.getState();

    supabase
      .from("rooms")
      .upsert({
        user_id: userId,
        placed_items: placedItems,
        wall_color: wallColor,
        floor_color: floorColor,
        room_level: roomLevel,
        updated_at: new Date().toISOString(),
      })
      .then(() => {});
  }, 2000);
}

// 이 함수를 한 번 호출하면 방 변경 구독이 시작됨
let subscribed = false;
export function initRoomSync() {
  if (subscribed) return;
  subscribed = true;

  useRoomStore.subscribe((state, prevState) => {
    if (
      state.placedItems !== prevState.placedItems ||
      state.wallColor !== prevState.wallColor ||
      state.floorColor !== prevState.floorColor
    ) {
      debouncedSyncRoom();
    }
  });
}
