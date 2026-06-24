import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      toggleAdmin: () => set({ isAdmin: !get().isAdmin }),
    }),
    { name: "ddak-hana-admin" }
  )
);
