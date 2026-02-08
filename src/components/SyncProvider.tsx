"use client";

import { useEffect } from "react";
import { initRoomSync } from "@/lib/syncRoom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { pickRandom } from "@/lib/utils";

const notificationMessages = [
  "오늘 딱 하나만 해볼까?",
  "작은 한 걸음이 큰 변화를 만들어!",
  "오늘의 할일이 기다리고 있어!",
  "딱 하나만! 넌 할 수 있어!",
  "오늘도 한 걸음 가볼까?",
];

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initRoomSync();
  }, []);

  // 알림 스케줄러
  useEffect(() => {
    const interval = setInterval(() => {
      const { shouldNotify, markNotified } = useNotificationStore.getState();

      if (shouldNotify()) {
        markNotified();
        sendNotification();
      }
    }, 60_000); // 매 60초 체크

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}

function sendNotification() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  const message = pickRandom(notificationMessages);

  // Service Worker가 있으면 그쪽으로
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification("딱 하나 🎯", {
        body: message,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: "ddak-hana-reminder",
      });
    });
  } else {
    // 폴백: 일반 Notification API
    new Notification("딱 하나 🎯", {
      body: message,
      icon: "/icons/icon-192x192.png",
    });
  }
}
