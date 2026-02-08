import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UserState {
  userId: string | null;
  nickname: string | null;
  friendCode: string | null;

  register: (nickname: string) => Promise<boolean>;
  isRegistered: () => boolean;
}

function generateFriendCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      nickname: null,
      friendCode: null,

      register: async (nickname: string) => {
        if (!isSupabaseConfigured()) return false;

        const friendCode = generateFriendCode();

        const { data, error } = await supabase
          .from("profiles")
          .insert({ nickname, friend_code: friendCode })
          .select("id")
          .single();

        if (error) {
          // friend_code 중복 시 재시도
          if (error.code === "23505") {
            const retry = generateFriendCode();
            const { data: d2, error: e2 } = await supabase
              .from("profiles")
              .insert({ nickname, friend_code: retry })
              .select("id")
              .single();
            if (e2 || !d2) return false;
            set({ userId: d2.id, nickname, friendCode: retry });
            // rooms 테이블에도 초기 데이터 생성
            await supabase.from("rooms").insert({ user_id: d2.id });
            return true;
          }
          return false;
        }

        if (!data) return false;
        set({ userId: data.id, nickname, friendCode });
        // rooms 테이블에 초기 데이터 생성
        await supabase.from("rooms").insert({ user_id: data.id });
        return true;
      },

      isRegistered: () => {
        const { userId, nickname } = get();
        return !!(userId && nickname);
      },
    }),
    { name: "ddak-hana-user" }
  )
);
