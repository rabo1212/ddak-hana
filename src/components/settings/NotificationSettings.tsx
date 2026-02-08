"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNotificationStore } from "@/stores/useNotificationStore";

export default function NotificationSettings() {
  const enabled = useNotificationStore((s) => s.enabled);
  const reminderHour = useNotificationStore((s) => s.reminderHour);
  const reminderMinute = useNotificationStore((s) => s.reminderMinute);
  const setEnabled = useNotificationStore((s) => s.setEnabled);
  const setReminderTime = useNotificationStore((s) => s.setReminderTime);

  const [permissionState, setPermissionState] = useState<string>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const requestPermission = async () => {
    if (typeof Notification === "undefined") {
      alert("이 브라우저는 알림을 지원하지 않아요.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermissionState(result);
    if (result === "granted") {
      setEnabled(true);
    }
  };

  const handleToggle = () => {
    if (!enabled && permissionState !== "granted") {
      requestPermission();
      return;
    }
    setEnabled(!enabled);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="space-y-3">
      {/* ON/OFF 토글 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">알림 받기</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`w-12 h-7 rounded-full relative transition-colors ${
            enabled ? "bg-lavender-400" : "bg-gray-200"
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm"
            animate={{ left: enabled ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* 시간 설정 */}
      {enabled && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-gray-500">매일</span>
          <select
            value={reminderHour}
            onChange={(e) =>
              setReminderTime(Number(e.target.value), reminderMinute)
            }
            className="bg-lavender-50 text-lavender-500 text-sm font-medium px-2 py-1.5 rounded-lg border-0 outline-none"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h.toString().padStart(2, "0")}시
              </option>
            ))}
          </select>
          <select
            value={reminderMinute}
            onChange={(e) =>
              setReminderTime(reminderHour, Number(e.target.value))
            }
            className="bg-lavender-50 text-lavender-500 text-sm font-medium px-2 py-1.5 rounded-lg border-0 outline-none"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}분
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">에 알림</span>
        </motion.div>
      )}

      {/* 권한 상태 */}
      {permissionState === "denied" && (
        <p className="text-xs text-softpink-400">
          알림이 차단되어 있어요. 브라우저 설정에서 허용해주세요.
        </p>
      )}
    </div>
  );
}
