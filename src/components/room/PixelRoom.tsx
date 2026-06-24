"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useRoomStore } from "@/stores/useRoomStore";
import { useCharacterStore, type CharacterMood } from "@/stores/useCharacterStore";
import CharacterAvatar from "@/components/character/CharacterAvatar";
import { roomSpeeches, clickSpeeches, pickRandom } from "@/data/speeches";

// Spline 컴포넌트 (SSR 비활성화)
const Spline = dynamic(
  () => import("@splinetool/react-spline"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square bg-lavender-50 rounded-3xl animate-pulse flex items-center justify-center">
        <span className="text-lavender-300 text-sm">3D 방 로딩 중...</span>
      </div>
    ),
  }
);

const SPLINE_SCENE = "https://prod.spline.design/Edyl0frhSoohhc-y/scene.splinecode";

// 캐릭터 이동 가능 영역 (% 기준, 방 바닥 범위)
const FLOOR_BOUNDS = {
  minX: 10,  maxX: 85,  // 좌우 벽
  minY: 55,  maxY: 82,  // 바닥 앞뒤 (위=먼곳, 아래=가까운곳)
};

interface PixelRoomProps {
  fullScreen?: boolean;
  hideSpeech?: boolean;
}

export default function PixelRoom({ fullScreen = false, hideSpeech = false }: PixelRoomProps) {
  const roomLevel = useRoomStore((s) => s.roomLevel);
  const placedItems = useRoomStore((s) => s.placedItems);

  const selectedCharacter = useCharacterStore((s) => s.selectedCharacter);
  const characterMood = useCharacterStore((s) => s.characterMood);

  // 말풍선 상태
  const [speech, setSpeech] = useState<string | null>(null);
  const [showSpeech, setShowSpeech] = useState(false);
  const [charMoodOverride, setCharMoodOverride] = useState<CharacterMood | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);

  // 캐릭터 이동 상태
  const [charPos, setCharPos] = useState({ x: 50, y: 72 }); // % 기준 (방 중앙 바닥)
  const [isWalking, setIsWalking] = useState(false);
  const [walkDuration, setWalkDuration] = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 8~15초마다 랜덤 대사 표시
  useEffect(() => {
    if (!selectedCharacter) return;

    const showRandomSpeech = () => {
      setSpeech(pickRandom(roomSpeeches));
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), 3000);
    };

    const firstTimer = setTimeout(showRandomSpeech, 1000);
    const interval = setInterval(() => {
      showRandomSpeech();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [selectedCharacter]);

  // 캐릭터 클릭 → 새 대사 + 기분 변화
  const handleCharacterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeech(pickRandom(clickSpeeches));
    setShowSpeech(true);
    setCharMoodOverride("happy");

    setTimeout(() => setShowSpeech(false), 2500);
    setTimeout(() => setCharMoodOverride(null), 2000);
  }, []);

  // 방 바닥 탭 → 캐릭터 이동
  const handleRoomClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!roomRef.current || !selectedCharacter || !splineLoaded) return;

    const rect = roomRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // 바닥 영역 클램핑
    const targetX = Math.max(FLOOR_BOUNDS.minX, Math.min(FLOOR_BOUNDS.maxX, clickX));
    const targetY = Math.max(FLOOR_BOUNDS.minY, Math.min(FLOOR_BOUNDS.maxY, clickY));

    // 바닥 영역 밖이면 무시
    if (clickY < FLOOR_BOUNDS.minY - 10) return;

    // 방향 결정
    setFacingLeft(targetX < charPos.x);

    // 이동 거리 기반 시간 계산
    const dist = Math.sqrt((targetX - charPos.x) ** 2 + (targetY - charPos.y) ** 2);
    const duration = Math.max(0.5, Math.min(2.5, dist / 30));

    // 걷기 시작
    if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    setWalkDuration(duration);
    setIsWalking(true);

    // 위치 업데이트
    setCharPos({ x: targetX, y: targetY });

    // 이동 완료 후 걷기 중지
    walkTimeoutRef.current = setTimeout(() => {
      setIsWalking(false);
    }, duration * 1000 + 100);
  }, [charPos, selectedCharacter, splineLoaded]);

  // cleanup
  useEffect(() => {
    return () => {
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    };
  }, []);

  const levelNames = ["", "빈 방", "시작", "아늑한", "활기찬", "멋진", "전설의"];

  // 깊이감: Y가 클수록(아래쪽) 캐릭터가 크게
  const depthScale = 0.7 + ((charPos.y - FLOOR_BOUNDS.minY) / (FLOOR_BOUNDS.maxY - FLOOR_BOUNDS.minY)) * 0.5;

  return (
    <div className={fullScreen ? "w-full h-full" : "flex flex-col items-center"}>
      {/* 방 레벨 (풀스크린 아닐 때만) */}
      {!fullScreen && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">
            {levelNames[roomLevel]} 방
          </span>
          <span className="text-lg font-bold text-lavender-400">
            Lv.{roomLevel}
          </span>
          <span className="text-xs text-gray-400">
            ({placedItems.length}개)
          </span>
        </div>
      )}

      {/* 3D 방 + 캐릭터 오버레이 */}
      <div
        ref={roomRef}
        className={fullScreen
          ? "relative w-full h-full"
          : "relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-xl border-2 border-lavender-100"
        }
        style={fullScreen ? {} : { clipPath: "inset(0 0 0 0 round 1.5rem)" }}
      >
        {/* Spline 3D 방 */}
        <Spline
          scene={SPLINE_SCENE}
          onLoad={() => setSplineLoaded(true)}
          style={{ width: "100%", height: "100%" }}
        />

        {/* 투명 클릭 레이어 (Spline 위, 캐릭터 아래) - 탭으로 이동 */}
        {fullScreen && (
          <div
            className="absolute inset-0 z-[8] cursor-pointer"
            onClick={handleRoomClick}
          />
        )}

        {/* 캐릭터 오버레이 (3D 방 위에 표시) */}
        {selectedCharacter && splineLoaded && (
          <motion.div
            className="absolute z-10"
            initial={false}
            animate={{
              left: `${charPos.x}%`,
              top: `${charPos.y}%`,
            }}
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: isWalking ? walkDuration : 0,
            }}
            style={{
              translateX: "-50%",
              translateY: "-100%",
            }}
          >
            {/* 말풍선 (hideSpeech면 숨김) */}
            <AnimatePresence>
              {!hideSpeech && showSpeech && speech && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.8 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg whitespace-nowrap"
                  style={{ zIndex: 200 }}
                >
                  <p className="text-xs text-gray-600 text-center">{speech}</p>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/90" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 캐릭터 본체 */}
            <motion.div
              className="cursor-pointer relative z-20"
              onClick={handleCharacterClick}
              whileTap={{ scale: 0.9 }}
              animate={isWalking
                ? { y: [0, -8, 0], rotate: [0, -4, 0, 4, 0] }
                : { y: [0, -5, 0] }
              }
              transition={isWalking
                ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                scale: depthScale,
                scaleX: facingLeft ? -depthScale : depthScale,
              }}
            >
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/20"
                animate={{
                  width: isWalking ? [36, 28, 36] : [40, 36, 40],
                  height: isWalking ? [8, 4, 8] : [10, 8, 10],
                }}
                transition={{
                  duration: isWalking ? 0.3 : 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <CharacterAvatar
                size={64}
                mood={charMoodOverride || characterMood}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {!fullScreen && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          캐릭터를 탭해봐! · 3D 방을 드래그해서 둘러봐!
        </p>
      )}
    </div>
  );
}
