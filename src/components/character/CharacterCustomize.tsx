"use client";

import { motion, AnimatePresence } from "framer-motion";
import CharacterSelect from "./CharacterSelect";

interface CharacterCustomizeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterCustomize({ isOpen, onClose }: CharacterCustomizeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl px-4 pt-4 pb-8 max-h-[85vh] overflow-y-auto"
          >
            {/* 핸들바 */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <h2 className="text-lg font-bold text-gray-800 text-center mb-4">
              캐릭터 꾸미기
            </h2>

            <CharacterSelect
              onSelect={onClose}
              showConfirm
              showStyleSelector
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
