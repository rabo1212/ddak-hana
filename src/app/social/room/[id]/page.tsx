"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useHydration } from "@/lib/useHydration";
import { useUserStore } from "@/stores/useUserStore";
import type { PlacedItem } from "@/stores/useRoomStore";
import FriendRoomView from "@/components/social/FriendRoomView";
import PageTransition from "@/components/ui/PageTransition";
import BottomTabBar from "@/components/layout/BottomTabBar";

interface CompletedTask {
  id: string;
  title: string;
  emoji: string;
  completed_at: string;
  reactions: { emoji: string; count: number }[];
  myReaction: string | null;
}

const reactionEmojis = ["👏", "🎉", "💪", "❤️", "🔥"];

export default function FriendRoomPage() {
  const params = useParams();
  const router = useRouter();
  const hydrated = useHydration();
  const userId = useUserStore((s) => s.userId);
  const friendId = params.id as string;

  const [friendName, setFriendName] = useState("");
  const [roomData, setRoomData] = useState<{
    placedItems: PlacedItem[];
    wallColor: string;
    floorColor: string;
    roomLevel: number;
  } | null>(null);
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !friendId) return;

    async function loadData() {
      setLoading(true);

      // 프로필
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", friendId)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }
      setFriendName(profile.nickname);

      // 방 데이터
      const { data: room } = await supabase
        .from("rooms")
        .select("*")
        .eq("user_id", friendId)
        .single();

      if (room) {
        setRoomData({
          placedItems: (room.placed_items as PlacedItem[]) || [],
          wallColor: room.wall_color || "#FFF8F0",
          floorColor: room.floor_color || "#F5F0E8",
          roomLevel: room.room_level || 1,
        });
      }

      // 최근 완료 할일 (최근 20개)
      const { data: completedTasks } = await supabase
        .from("completed_tasks")
        .select("id, title, emoji, completed_at")
        .eq("user_id", friendId)
        .order("completed_at", { ascending: false })
        .limit(20);

      if (completedTasks && completedTasks.length > 0) {
        const taskIds = completedTasks.map((t) => t.id);

        // 리액션 가져오기
        const { data: allReactions } = await supabase
          .from("reactions")
          .select("task_id, emoji, from_user_id")
          .in("task_id", taskIds);

        const tasksWithReactions: CompletedTask[] = completedTasks.map((t) => {
          const taskReactions = (allReactions || []).filter((r) => r.task_id === t.id);
          const emojiCounts: Record<string, number> = {};
          let myReaction: string | null = null;

          taskReactions.forEach((r) => {
            emojiCounts[r.emoji] = (emojiCounts[r.emoji] || 0) + 1;
            if (r.from_user_id === userId) {
              myReaction = r.emoji;
            }
          });

          return {
            ...t,
            reactions: Object.entries(emojiCounts).map(([emoji, count]) => ({
              emoji,
              count,
            })),
            myReaction,
          };
        });

        setTasks(tasksWithReactions);
      }

      setLoading(false);
    }

    loadData();
  }, [hydrated, friendId, userId]);

  const handleReaction = async (taskId: string, emoji: string) => {
    if (!userId) return;

    // 이미 리액션한 경우 무시
    const task = tasks.find((t) => t.id === taskId);
    if (task?.myReaction) return;

    await supabase.from("reactions").insert({
      from_user_id: userId,
      task_id: taskId,
      emoji,
    });

    // UI 즉시 업데이트
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const existing = t.reactions.find((r) => r.emoji === emoji);
        return {
          ...t,
          myReaction: emoji,
          reactions: existing
            ? t.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              )
            : [...t.reactions, { emoji, count: 1 }],
        };
      })
    );
  };

  if (!hydrated || loading) {
    return (
      <>
        <main className="min-h-screen bg-cream-100 flex items-center justify-center">
          <p className="text-gray-300 text-sm">불러오는 중...</p>
        </main>
        <BottomTabBar />
      </>
    );
  }

  if (!friendName) {
    return (
      <>
        <main className="min-h-screen bg-cream-100 px-4 pt-6 pb-24">
          <div className="text-center mt-20">
            <div className="text-4xl mb-3">😢</div>
            <p className="text-gray-500">유저를 찾을 수 없어요</p>
            <button
              onClick={() => router.push("/social")}
              className="mt-4 px-4 py-2 bg-lavender-400 text-white rounded-xl text-sm"
            >
              돌아가기
            </button>
          </div>
        </main>
        <BottomTabBar />
      </>
    );
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  return (
    <>
      <main className="min-h-screen bg-cream-100 px-4 pt-6 pb-24">
        <PageTransition>
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/social")}
              className="text-xl"
            >
              ←
            </motion.button>
            <h1 className="text-lg font-bold text-lavender-500">
              {friendName}의 방
            </h1>
          </div>

          {/* 방 보기 */}
          {roomData ? (
            <FriendRoomView
              placedItems={roomData.placedItems}
              wallColor={roomData.wallColor}
              floorColor={roomData.floorColor}
              roomLevel={roomData.roomLevel}
              nickname={friendName}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <p className="text-sm text-gray-400">아직 방이 비어있어요</p>
            </div>
          )}

          {/* 최근 완료 할일 */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              최근 완료한 할일
            </h3>
            {tasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-400">아직 완료한 할일이 없어요</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{task.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(task.completed_at)}
                        </p>
                      </div>
                    </div>

                    {/* 리액션 표시 */}
                    {task.reactions.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {task.reactions.map((r) => (
                          <span
                            key={r.emoji}
                            className="text-xs bg-lavender-50 px-2 py-0.5 rounded-full"
                          >
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 리액션 버튼 */}
                    {userId !== friendId && (
                      <div className="flex gap-1.5 mt-2">
                        {reactionEmojis.map((emoji) => (
                          <motion.button
                            key={emoji}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleReaction(task.id, emoji)}
                            disabled={!!task.myReaction}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                              task.myReaction === emoji
                                ? "bg-lavender-200 ring-2 ring-lavender-400"
                                : task.myReaction
                                  ? "bg-gray-50 opacity-30"
                                  : "bg-gray-50 hover:bg-lavender-50 active:bg-lavender-100"
                            }`}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageTransition>
      </main>
      <BottomTabBar />
    </>
  );
}
