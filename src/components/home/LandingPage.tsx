"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface Props {
  onStart: () => void;
}

const features = [
  {
    emoji: "🎯",
    title: "딱 하나만 추천",
    desc: "오늘 컨디션에 맞는\n할일 하나를 골라줘요",
    bg: "bg-lavender-50",
  },
  {
    emoji: "🪙",
    title: "코인 보상",
    desc: "완료할 때마다\n코인이 쌓여요",
    bg: "bg-gold-50",
  },
  {
    emoji: "🔥",
    title: "연속 스트릭",
    desc: "매일 하나씩 해내면\n불꽃이 자라요",
    bg: "bg-softpink-50",
  },
  {
    emoji: "🏠",
    title: "나만의 방",
    desc: "코인으로 픽셀 방을\n예쁘게 꾸며봐요",
    bg: "bg-mint-50",
  },
];

const steps = [
  { num: "1", emoji: "☀️", title: "컨디션 체크", desc: "오늘 기분이 어때요?" },
  { num: "2", emoji: "⏱️", title: "딱 하나 시작", desc: "타이머와 함께 집중!" },
  { num: "3", emoji: "🎉", title: "보상 획득", desc: "코인과 스트릭 GET!" },
];

export default function LandingPage({ onStart }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-cream-100 overflow-y-auto">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="text-7xl mb-6"
        >
          🎯
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-extrabold text-gray-800 text-center"
        >
          하루에 <span className="text-lavender-500">딱 하나</span>만
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-gray-500 text-center text-sm leading-relaxed"
        >
          오늘 컨디션에 맞는 할일 하나를 추천해드려요.
          <br />
          하나만 하면, 그걸로 충분해요.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="mt-8 px-10 py-4 bg-lavender-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-lavender-200/50"
        >
          시작하기
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-300 text-sm text-center"
          >
            <p className="text-xs mb-1">아래로 스크롤</p>
            <span>↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={sectionRef} className="px-5 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-gray-800 text-center mb-8"
        >
          이런 기능이 있어요
        </motion.h2>

        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${f.bg} rounded-2xl p-4 text-center`}
            >
              <div className="text-3xl mb-2">{f.emoji}</div>
              <h3 className="font-bold text-gray-700 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12 bg-white/50">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-gray-800 text-center mb-8"
        >
          이렇게 사용해요
        </motion.h2>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-lavender-50 flex items-center justify-center text-2xl shrink-0">
                {s.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-lavender-400 font-bold">
                    STEP {s.num}
                  </span>
                  <h3 className="font-bold text-gray-700">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 mb-2 text-sm">
            오늘도 많은 게 쌓여있나요?
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            딱 하나만 해봐요.
            <br />
            그게 시작이에요.
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-4 bg-lavender-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-lavender-200/50"
          >
            지금 시작하기 🎯
          </motion.button>
        </motion.div>

        <p className="mt-12 text-xs text-gray-300">
          딱 하나 &copy; 2025 &middot; 하루에 하나면 충분해
        </p>
      </section>
    </div>
  );
}
