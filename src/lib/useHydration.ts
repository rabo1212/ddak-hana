"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "@/stores/useTodoStore";
import { useCoinStore } from "@/stores/useCoinStore";
import { useStreakStore } from "@/stores/useStreakStore";

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 모든 핵심 store의 persist hydration 완료를 기다림
    const unsubs = [
      useTodoStore.persist.onFinishHydration(() => check()),
      useCoinStore.persist.onFinishHydration(() => check()),
      useStreakStore.persist.onFinishHydration(() => check()),
    ];

    function check() {
      if (
        useTodoStore.persist.hasHydrated() &&
        useCoinStore.persist.hasHydrated() &&
        useStreakStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    }

    // 이미 hydration 끝났을 수 있으니 바로 체크
    check();

    // 3초 타임아웃: hydration이 안 끝나면 강제 진행
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 3000);

    return () => {
      unsubs.forEach((unsub) => unsub());
      clearTimeout(timeout);
    };
  }, []);

  return hydrated;
}
