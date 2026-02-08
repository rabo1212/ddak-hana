"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";

export default function NicknameSetup() {
  const register = useUserStore((s) => s.register);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("2글자 이상 입력해주세요!");
      return;
    }
    if (trimmed.length > 10) {
      setError("10글자 이내로 입력해주세요!");
      return;
    }

    setLoading(true);
    setError("");

    const success = await register(trimmed);
    if (!success) {
      setError("등록에 실패했어요. 다시 시도해주세요!");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100/95 backdrop-blur-sm px-6"
    >
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-xl font-bold text-lavender-500 mb-2">
          딱 하나에 오신 걸 환영해요!
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          친구들에게 보여줄 닉네임을 정해주세요
        </p>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="닉네임 (2~10자)"
          maxLength={10}
          className="w-full px-4 py-3 rounded-xl bg-lavender-50 text-center text-gray-700 outline-none placeholder:text-gray-300 text-lg font-medium focus:ring-2 focus:ring-lavender-300"
          autoFocus
        />

        {error && (
          <p className="text-softpink-400 text-xs mt-2">{error}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading || !nickname.trim()}
          className={`w-full mt-4 py-3 rounded-xl font-semibold text-white transition-colors ${
            loading || !nickname.trim()
              ? "bg-gray-200"
              : "bg-lavender-400 hover:bg-lavender-500"
          }`}
        >
          {loading ? "등록 중..." : "시작하기!"}
        </motion.button>
      </div>
    </motion.div>
  );
}
