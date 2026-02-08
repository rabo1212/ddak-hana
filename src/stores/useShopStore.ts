import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShopState {
  purchasedItemIds: string[];
  selectedCategory: string;

  purchaseItem: (itemId: string) => void;
  hasPurchased: (itemId: string) => boolean;
  setCategory: (category: string) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      purchasedItemIds: [],
      selectedCategory: "all",

      purchaseItem: (itemId) => {
        set((state) => ({
          purchasedItemIds: [...state.purchasedItemIds, itemId],
        }));
      },

      hasPurchased: (itemId) => {
        return get().purchasedItemIds.includes(itemId);
      },

      setCategory: (category) => {
        set({ selectedCategory: category });
      },
    }),
    { name: "ddak-hana-shop" }
  )
);
