"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/useUserStore";

interface Friend {
  id: string;
  nickname: string;
  roomLevel: number;
  todayCount: number;
}

interface FriendFeedProps {
  refreshKey: number;
}

export default function FriendFeed({ refreshKey }: FriendFeedProps) {
  const userId = useUserStore((s) => s.userId);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function loadFriends() {
      setLoading(true);

      // 친구 목록 가져오기
      const { data: friendships } = await supabase
        .from("friendships")
        .select("friend_id")
        .eq("user_id", userId);

      if (!friendships || friendships.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      const friendIds = friendships.map((f) => f.friend_id);

      // 친구 프로필 + 방 정보
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", friendIds);

      const { data: rooms } = await supabase
        .from("rooms")
        .select("user_id, room_level")
        .in("user_id", friendIds);

      // 오늘 완료한 할일 수
      const today = new Date().toISOString().split("T")[0];
      const { data: tasks } = await supabase
        .from("completed_tasks")
        .select("user_id")
        .in("user_id", friendIds)
        .gte("completed_at", today);

      const taskCounts: Record<string, number> = {};
      tasks?.forEach((t) => {
        taskCounts[t.user_id] = (taskCounts[t.user_id] || 0) + 1;
      });

      const roomMap: Record<string, number> = {};
      rooms?.forEach((r) => {
        roomMap[r.user_id] = r.room_level;
      });

      const friendList: Friend[] = (profiles || []).map((p) => ({
        id: p.id,
        nickname: p.nickname,
        roomLevel: roomMap[p.id] || 1,
        todayCount: taskCounts[p.id] || 0,
      }));

      setFriends(friendList);
      setLoading(false);
    }

    loadFriends();
  }, [userId, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-300">불러오는 중...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <div className="text-4xl mb-2">👥</div>
        <p className="text-sm text-gray-400">아직 친구가 없어요</p>
        <p className="text-xs text-gray-300 mt-1">
          친구코드를 공유해서 친구를 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">
        친구 목록
      </h3>
      <div className="divide-y divide-gray-50">
        {friends.map((friend) => (
          <Link
            key={friend.id}
            href={`/social/room/${friend.id}`}
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-lavender-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {friend.nickname}
                </p>
                <p className="text-xs text-gray-400">
                  Lv.{friend.roomLevel}
                  {friend.todayCount > 0 && (
                    <span className="text-lavender-400 ml-2">
                      오늘 {friend.todayCount}개 완료
                    </span>
                  )}
                </p>
              </div>
              <span className="text-gray-300 text-sm">방 구경 →</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
