"use client";

import { useEffect } from "react";
import { initRoomSync } from "@/lib/syncRoom";

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initRoomSync();
  }, []);

  return <>{children}</>;
}
