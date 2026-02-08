"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/useUserStore";

interface AddFriendProps {
  onAdded: () => void;
}

export default function AddFriend({ onAdded }: AddFriendProps) {
  const userId = useUserStore((s) => s.userId);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 6 || !userId) return;

    setLoading(true);
    setMessage("");

    // 친구코드로 유저 찾기
    const { data: friend } = await supabase
      .from("profiles")
      .select("id, nickname")
      .eq("friend_code", trimmed)
      .single();

    if (!friend) {
      setMessage("해당 코드의 유저를 찾을 수 없어요");
      setLoading(false);
      return;
    }

    if (friend.id === userId) {
      setMessage("자기 자신은 추가할 수 없어요!");
      setLoading(false);
      return;
    }

    // 이미 친구인지 확인
    const { data: existing } = await supabase
      .from("friendships")
      .select("user_id")
      .eq("user_id", userId)
      .eq("friend_id", friend.id)
      .single();

    if (existing) {
      setMessage("이미 친구예요!");
      setLoading(false);
      return;
    }

    // 양방향 친구 추가
    await supabase.from("friendships").insert([
      { user_id: userId, friend_id: friend.id },
      { user_id: friend.id, friend_id: userId },
    ]);

    setMessage(`${friend.nickname}님과 친구가 되었어요!`);
    setCode("");
    setLoading(false);
    onAdded();
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">친구 추가</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="친구코드 6자리"
          maxLength={6}
          className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-center text-sm font-mono tracking-widest outline-none placeholder:text-gray-300 text-gray-700 uppercase focus:ring-2 focus:ring-lavender-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={loading || code.trim().length !== 6}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            code.trim().length === 6
              ? "bg-lavender-400 text-white"
              : "bg-gray-100 text-gray-300"
          }`}
        >
          {loading ? "..." : "추가"}
        </motion.button>
      </div>
      {message && (
        <p className={`text-xs mt-2 ${message.includes("되었어요") ? "text-mint-400" : "text-softpink-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
