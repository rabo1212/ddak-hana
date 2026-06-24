"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Todo } from "@/stores/useTodoStore";
import { useTimerStore } from "@/stores/useTimerStore";
import { pickRandom } from "@/data/speeches";

type TimerPhase = "select" | "running" | "paused" | "done";

interface TimerOverlayProps {
  todo: Todo;
  onComplete: () => void;
  onCancel: () => void;
}

function getTimeOptions(estimatedMinutes: number) {
  const base = estimatedMinutes;
  if (base <= 3) {
    return [
      { minutes: base, emoji: "⚡", label: `${base}분`, desc: "딱 맞게" },
      { minutes: 5, emoji: "☕", label: "5분", desc: "여유있게" },
      { minutes: 10, emoji: "🍅", label: "10분", desc: "넉넉히" },
    ];
  }
  if (base <= 5) {
    return [
      { minutes: base, emoji: "☕", label: `${base}분`, desc: "딱 맞게" },
      { minutes: 10, emoji: "🍅", label: "10분", desc: "여유있게" },
      { minutes: 15, emoji: "🔥", label: "15분", desc: "넉넉히" },
    ];
  }
  if (base <= 10) {
    return [
      { minutes: base, emoji: "🍅", label: `${base}분`, desc: "딱 맞게" },
      { minutes: 15, emoji: "🔥", label: "15분", desc: "여유있게" },
      { minutes: 25, emoji: "💪", label: "25분", desc: "넉넉히" },
    ];
  }
  if (base <= 20) {
    return [
      { minutes: base, emoji: "🔥", label: `${base}분`, desc: "딱 맞게" },
      { minutes: 25, emoji: "💪", label: "25분", desc: "여유있게" },
      { minutes: 30, emoji: "🏆", label: "30분", desc: "넉넉히" },
    ];
  }
  return [
    { minutes: base, emoji: "💪", label: `${base}분`, desc: "딱 맞게" },
    { minutes: 30, emoji: "🔥", label: "30분", desc: "여유있게" },
    { minutes: 45, emoji: "🏆", label: "45분", desc: "넉넉히" },
  ];
}

const encouragements = [
  "같이 집중하는 중...",
  "잘하고 있어!",
  "거의 다 왔어!",
  "열심히 하고 있어~",
  "힘내! 응원해!",
];

export default function TimerOverlay({ todo, onComplete, onCancel }: TimerOverlayProps) {
  const [phase, setPhase] = useState<TimerPhase>("select");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [encouragement, setEncouragement] = useState(encouragements[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const setTimerActive = useTimerStore((s) => s.setTimerActive);

  const timeOptions = getTimeOptions(todo.estimatedMinutes);
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Wake Lock
  const requestWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {}
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // 이탈 감지
  useEffect(() => {
    if (phase !== "running") return;
    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("paused");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase]);

  // 카운트다운
  const tick = useCallback(() => {
    setRemainingSeconds((prev) => {
      if (prev <= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("done");
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  // 응원 메시지 교체 (30초마다)
  useEffect(() => {
    if (phase !== "running") return;
    const interval = setInterval(() => {
      setEncouragement(pickRandom(encouragements));
    }, 30000);
    return () => clearInterval(interval);
  }, [phase]);

  const startTimer = async (mins: number) => {
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);
    setTimerActive(true);
    await requestWakeLock();
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("paused");
  };

  const resumeTimer = async () => {
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);
    await requestWakeLock();
  };

  const giveUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActive(false);
    releaseWakeLock();
    onCancel();
  };

  useEffect(() => {
    if (phase === "done") {
      setTimerActive(false);
      releaseWakeLock();
    }
  }, [phase, setTimerActive, releaseWakeLock]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimerActive(false);
      releaseWakeLock();
    };
  }, [setTimerActive, releaseWakeLock]);

  const isPaused = phase === "paused";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        {/* 시간 선택 */}
        {phase === "select" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl"
          >
            <div className="text-center mb-5">
              <span className="text-4xl">{todo.emoji}</span>
              <h2 className="text-base font-bold text-gray-700 mt-2">{todo.title}</h2>
              <p className="text-xs text-gray-400 mt-1">얼마나 집중할까?</p>
            </div>

            <div className="space-y-2.5">
              {timeOptions.map((opt, i) => (
                <motion.button
                  key={opt.minutes}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startTimer(opt.minutes)}
                  className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-medium ${
                    i === 0
                      ? "bg-lavender-300 text-white shadow-md"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                  <span className="text-xs opacity-70">{opt.desc}</span>
                  {i === 0 && (
                    <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full">추천</span>
                  )}
                </motion.button>
              ))}
            </div>

            <button onClick={onCancel} className="w-full mt-3 py-2 text-gray-400 text-xs">
              돌아가기
            </button>
          </motion.div>
        )}

        {/* 완료 화면 */}
        {phase === "done" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl text-center"
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8 }}
            >
              🎉
            </motion.div>
            <h2 className="text-xl font-bold text-lavender-500 mt-3">해냈다!!</h2>
            <div className="mt-3 bg-gold-100 inline-block px-6 py-2.5 rounded-2xl">
              <span className="text-lg font-bold text-gold-400">+{todo.coinReward} 🪙</span>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onComplete}
              className="mt-6 bg-lavender-300 text-white px-8 py-3 rounded-2xl font-bold shadow-md w-full"
            >
              다음으로!
            </motion.button>
          </motion.div>
        )}

        {/* 카운트다운 */}
        {(phase === "running" || phase === "paused") && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl"
          >
            {/* 할일 정보 */}
            <div className="text-center mb-4">
              <span className="text-2xl">{todo.emoji}</span>
              <p className="text-xs text-gray-500 mt-1">{todo.title}</p>
            </div>

            {/* 원형 프로그레스 */}
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="#EDE9FE" strokeWidth="8" />
                <motion.circle
                  cx="100" cy="100" r={radius} fill="none"
                  stroke={isPaused ? "#FDA4AF" : "#C4B5FD"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-3xl font-bold text-gray-700 tabular-nums"
                  animate={isPaused ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                  transition={isPaused ? { duration: 1, repeat: Infinity } : {}}
                >
                  {timeDisplay}
                </motion.span>
                <span className="text-[10px] text-gray-400 mt-1">
                  {isPaused ? "일시정지" : "집중 중"}
                </span>
              </div>
            </div>

            {/* 응원 메시지 */}
            <p className="text-center text-xs text-gray-400 mb-4">
              {isPaused ? "쉬는 중... 괜찮아!" : encouragement}
            </p>

            {/* 버튼 */}
            <div className="flex gap-3">
              {isPaused ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resumeTimer}
                  className="flex-1 bg-lavender-300 text-white py-3 rounded-2xl font-bold"
                >
                  계속 ▶️
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseTimer}
                  className="flex-1 bg-gold-100 text-gold-400 py-3 rounded-2xl font-medium"
                >
                  잠깐 ⏸️
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={giveUp}
                className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-2xl font-medium"
              >
                그만 🏳️
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
