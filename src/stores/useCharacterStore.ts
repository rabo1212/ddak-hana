import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CharacterMood = "happy" | "normal" | "tired" | "sleepy";

interface CharacterState {
  selectedCharacter: string | null;
  characterStyle: string;
  characterMood: CharacterMood;
  characterLevel: number;
  characterExp: number;

  selectCharacter: (id: string) => void;
  setStyle: (style: string) => void;
  setMood: (mood: CharacterMood) => void;
  addExp: (amount: number) => void;
}

function calcLevel(exp: number): number {
  if (exp >= 500) return 10;
  if (exp >= 350) return 9;
  if (exp >= 250) return 8;
  if (exp >= 180) return 7;
  if (exp >= 120) return 6;
  if (exp >= 80) return 5;
  if (exp >= 50) return 4;
  if (exp >= 30) return 3;
  if (exp >= 15) return 2;
  return 1;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      selectedCharacter: null,
      characterStyle: "Round",
      characterMood: "normal",
      characterLevel: 1,
      characterExp: 0,

      selectCharacter: (id) => set({ selectedCharacter: id }),

      setStyle: (style) => set({ characterStyle: style }),

      setMood: (mood) => set({ characterMood: mood }),

      addExp: (amount) => {
        const newExp = get().characterExp + amount;
        set({
          characterExp: newExp,
          characterLevel: calcLevel(newExp),
        });
      },
    }),
    { name: "ddak-hana-character" }
  )
);
