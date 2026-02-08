"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Todo } from "@/stores/useTodoStore";
import { useTimerStore } from "@/stores/useTimerStore";
import EncouragementMessage from "@/components/ui/EncouragementMessage";

type TimerPhase = "select" | "running" | "paused" | "done";

interface TimerProps {
  todo: Todo;
  onComplete: () => void;
  onCancel: () => void;
}

// 할일 예상시간에 맞게 타이머 옵션 동적 생성
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

// 가재 캐릭터 상태
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReturnBanner, setShowReturnBanner] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setTimerActive = useTimerStore((s) => s.setTimerActive);

  // 할일에 맞는 시간 옵션 생성
  const timeOptions = getTimeOptions(todo.estimatedMinutes);
  const recommendedMinutes = timeOptions[0].minutes;

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

  // ===== 화면 꺼짐 방지 (Wake Lock + iOS 무음 비디오 폴백) =====
  const iosVideoRef = useRef<HTMLVideoElement | null>(null);

  const requestWakeLock = useCallback(async () => {
    // 1) 표준 Wake Lock API (Android Chrome 등)
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        return;
      }
    } catch {
      // 실패 시 폴백으로 진행
    }

    // 2) iOS 폴백: 무음 비디오 루프로 화면 유지
    try {
      if (iosVideoRef.current) return; // 이미 실행 중
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.setAttribute("loop", "");
      video.style.position = "fixed";
      video.style.top = "-1px";
      video.style.left = "-1px";
      video.style.width = "1px";
      video.style.height = "1px";
      video.style.opacity = "0.01";
      // 최소 유효 mp4 (1x1 투명 비디오, 0.1초)
      video.src = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrwYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1NyByMjkzNSBhZTA5YTZlIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAHkGWIhAAz//727L4FNf2f0JcRLMXaSnA+KqSAgHc0wAAAAwAAAwAAFgn0IAAYAAEAAZ4CAAAAHMKZYA8ARMIAAAAHAAH+khkAAAADABhggQAAAAA=";
      video.muted = true;
      document.body.appendChild(video);
      await video.play();
      iosVideoRef.current = video;
    } catch {
      // 비디오 재생도 실패하면 포기 — 타이머 자체는 계속 동작
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    // Wake Lock 해제
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
    // iOS 비디오 정리
    if (iosVideoRef.current) {
      iosVideoRef.current.pause();
      iosVideoRef.current.remove();
      iosVideoRef.current = null;
    }
  }, []);

  // ===== 전체화면 모드 =====
  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // 전체화면 미지원 or 거부 — 무시
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch {
      // 무시
    }
  }, []);

  // 전체화면 상태 감지
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ===== 이탈 감지: Page Visibility API =====
  useEffect(() => {
    if (phase !== "running") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 이탈 — 타이머 일시정지
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("paused");
      } else {
        // 돌아옴 — 배너 표시
        setShowReturnBanner(true);
        setTimeout(() => setShowReturnBanner(false), 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [phase]);

  // 카운트다운 로직
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

  // 가재 캐릭터 상태 변경 (30초마다)
  useEffect(() => {
    if (phase !== "running") return;
    const buddyInterval = setInterval(() => {
      setBuddyIndex((prev) => (prev + 1) % buddyStates.length);
    }, 30000);
    return () => clearInterval(buddyInterval);
  }, [phase]);

  // 시간 선택 → 시작
  const startTimer = async (mins: number) => {
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);

    // 집중 모드 활성화
    setTimerActive(true);
    await requestWakeLock();
    await enterFullscreen();
  };

  // 일시정지
  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("paused");
  };

  // 재개
  const resumeTimer = async () => {
    setPhase("running");
    intervalRef.current = setInterval(tick, 1000);
    await requestWakeLock();
  };

  // 포기
  const giveUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActive(false);
    releaseWakeLock();
    exitFullscreen();
    onCancel();
  };

  // 완료 시 집중 모드 해제
  useEffect(() => {
    if (phase === "done") {
      setTimerActive(false);
      releaseWakeLock();
      exitFullscreen();
    }
  }, [phase, setTimerActive, releaseWakeLock, exitFullscreen]);

  // 클린업
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimerActive(false);
      releaseWakeLock();
    };
  }, [setTimerActive, releaseWakeLock]);

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

        <p className="text-xs text-gray-300 text-center mt-4">
          집중 모드: 화면 꺼짐 방지 + 이탈 감지 🔒
        </p>

        <button
          onClick={onCancel}
          className="w-full mt-2 py-2 text-gray-400 text-sm"
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
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center pt-2"
    >
      {/* 돌아옴 배너 */}
      <AnimatePresence>
        {showReturnBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-50 bg-lavender-300 text-white text-center py-3 px-4 rounded-2xl shadow-lg max-w-sm mx-auto"
          >
            돌아왔네! 다시 집중해보자 💪
          </motion.div>
        )}
      </AnimatePresence>

      {/* 집중 모드 표시 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-lavender-300 bg-lavender-50 px-2 py-0.5 rounded-full">
          {isFullscreen ? "🔒 집중모드" : "📱 일반모드"}
        </span>
        {!isFullscreen && phase === "running" && (
          <button
            onClick={enterFullscreen}
            className="text-[10px] text-gray-400 underline"
          >
            전체화면
          </button>
        )}
      </div>

      {/* 할일 제목 */}
      <div className="text-center mb-4">
        <span className="text-3xl">{todo.emoji}</span>
        <h3 className="text-sm font-medium text-gray-500 mt-1">{todo.title}</h3>
      </div>

      {/* 원형 프로그레스 + 시간 */}
      <div className="relative w-56 h-56 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#EDE9FE"
            strokeWidth="8"
          />
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

      {/* 가재 캐릭터 */}
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

      <p className="text-xs text-gray-300 mt-4">
        그만둬도 괜찮아요. 시작한 것만으로 대단해! 💜
      </p>
    </motion.div>
  );
}
