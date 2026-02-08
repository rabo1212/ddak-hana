"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Todo } from "@/stores/useTodoStore";
import EncouragementMessage from "@/components/ui/EncouragementMessage";

type TimerPhase = "select" | "running" | "paused" | "done";

interface TimerProps {
  todo: Todo;
  onComplete: () => void;
  onCancel: () => void;
}

const timeOptions = [
  { minutes: 5, emoji: "☕", label: "5분", desc: "가볍게" },
  { minutes: 15, emoji: "🍅", label: "15분", desc: "적당히" },
  { minutes: 25, emoji: "🔥", label: "25분", desc: "집중!" },
];

// 바디더블링 가재 캐릭터 상태
const buddyStates = [
  { emoji: "🦞", text: "같이 집중하는 중...", animation: "animate-float" },
  { emoji: "🦞", text: "열심히 하고 있어!", animation: "animate-bounce-slow" },
  { emoji: "🦞", text: "잘하고 있어~ 힘내!", animation: "animate-float" },
  { emoji: "🦞", text: "거의 다 왔어!", animation: "animate-bounce-slow" },
];

export default function Timer({ todo, onComplete, onCancel }: TimerProps) {
  const [phase, setPhase] = useState<TimerPhase>("select");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [buddyIndex, setBuddyIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 추천 시간 계산
  const recommendedMinutes =
    todo.estimatedMinutes <= 5 ? 5 : todo.estimatedMinutes <= 15 ? 15 : 25;

  // 타이머 진행률 (0~1)
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;

  // 남은 시간 포맷
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // SVG 원형 프로그레스 바 계산
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // 카운트다운 로직
  const tick = useCallback(() => {
    setRemainingSeconds((prev) => {
      if (prev <= 1) {
        // 타이머 완료!
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("done");
        // 진동
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  // 바디더블링 캐릭터 상태 변경 (30초마다)
  useEffect(() => {
    if (phase !== "running") return;
    const buddyInterval = setInterval(() => {
      setBuddyIndex((prev) => (prev + 1) % buddyStates.length);
    }, 30000);
    return () => clearInterval(buddyInterval);
  }, [phase]);

  // 시간 선택 → 시작
  const startTimer = (mins: number) => {
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);
  };

  // 일시정지
  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("paused");
  };

  // 재개
  const resumeTimer = () => {
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);
  };

  // 포기 (패널티 없음!)
  const giveUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onCancel();
  };

  // 클린업
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ===== 시간 선택 화면 =====
  if (phase === "select") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6 mx-auto max-w-sm"
      >
        <div className="text-center mb-6">
          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {todo.emoji}
          </motion.div>
          <h2 className="text-lg font-bold text-gray-700">{todo.title}</h2>
          <p className="text-sm text-gray-400 mt-1">얼마나 집중할까?</p>
        </div>

        <div className="space-y-3">
          {timeOptions.map((opt) => {
            const isRecommended = opt.minutes === recommendedMinutes;
            return (
              <motion.button
                key={opt.minutes}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTimer(opt.minutes)}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all ${
                  isRecommended
                    ? "bg-lavender-300 text-white shadow-md"
                    : "bg-cream-200 text-gray-600"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-lg">{opt.label}</span>
                <span className="text-sm opacity-70">{opt.desc}</span>
                {isRecommended && (
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
                    추천
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 py-2 text-gray-400 text-sm"
        >
          ← 돌아가기
        </button>
      </motion.div>
    );
  }

  // ===== 완료 화면 =====
  if (phase === "done") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center pt-4"
      >
        {/* Confetti 파티클 */}
        <div className="relative w-full h-40 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  "#C4B5FD", "#FDA4AF", "#86EFAC", "#FDE68A",
                  "#A78BFA", "#FB7185", "#4ADE80", "#FBBF24",
                ][i % 8],
              }}
              initial={{ y: -20, opacity: 1, scale: 1 }}
              animate={{
                y: 200,
                opacity: 0,
                scale: 0,
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="text-7xl -mt-16"
          animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8 }}
        >
          🎉
        </motion.div>

        <h2 className="text-xl font-bold text-lavender-500 mt-4">
          해냈다!!
        </h2>

        <EncouragementMessage context="onTaskComplete" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-4 bg-gold-100 px-8 py-4 rounded-2xl"
        >
          <span className="text-xl font-bold text-gold-400">
            +{todo.coinReward} 🪙
          </span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onComplete}
          className="mt-8 bg-lavender-300 text-white px-8 py-3 rounded-2xl font-bold shadow-md"
        >
          다음으로! →
        </motion.button>
      </motion.div>
    );
  }

  // ===== 카운트다운 화면 (running / paused) =====
  const buddy = buddyStates[buddyIndex];
  const isPaused = phase === "paused";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center pt-2"
    >
      {/* 할일 제목 */}
      <div className="text-center mb-4">
        <span className="text-3xl">{todo.emoji}</span>
        <h3 className="text-sm font-medium text-gray-500 mt-1">{todo.title}</h3>
      </div>

      {/* 원형 프로그레스 + 시간 */}
      <div className="relative w-56 h-56 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* 배경 원 */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#EDE9FE"
            strokeWidth="8"
          />
          {/* 프로그레스 원 */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={isPaused ? "#FDA4AF" : "#C4B5FD"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* 시간 표시 (원 중앙) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-gray-700 tabular-nums"
            animate={isPaused ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={isPaused ? { duration: 1, repeat: Infinity } : {}}
          >
            {timeDisplay}
          </motion.span>
          <span className="text-xs text-gray-400 mt-1">
            {isPaused ? "일시정지" : "집중 중"}
          </span>
        </div>
      </div>

      {/* 바디더블링 가재 */}
      <motion.div
        className="flex flex-col items-center mb-6 bg-cream-200 rounded-2xl px-6 py-3"
        animate={{ y: isPaused ? 0 : [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={`text-4xl ${buddy.animation}`}>
          {buddy.emoji}
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {isPaused ? "쉬는 중... 괜찮아!" : buddy.text}
        </span>
      </motion.div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-4">
        {isPaused ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resumeTimer}
            className="bg-lavender-300 text-white px-8 py-3 rounded-2xl font-bold shadow-md"
          >
            계속하기 ▶️
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={pauseTimer}
            className="bg-gold-100 text-gold-400 px-6 py-3 rounded-2xl font-medium"
          >
            잠깐 ⏸️
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={giveUp}
          className="bg-cream-200 text-gray-400 px-6 py-3 rounded-2xl font-medium"
        >
          그만할래 🏳️
        </motion.button>
      </div>

      {/* 포기해도 괜찮다는 메시지 */}
      <p className="text-xs text-gray-300 mt-4">
        그만둬도 괜찮아요. 시작한 것만으로 대단해! 💜
      </p>
    </motion.div>
  );
}
