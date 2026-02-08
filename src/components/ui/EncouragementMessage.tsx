"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { encouragements, type EncouragementContext } from "@/data/encouragements";
import { pickRandom } from "@/lib/utils";

interface Props {
  context: EncouragementContext;
  subContext?: string;
}

export default function EncouragementMessage({ context, subContext }: Props) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messageSet = encouragements[context];
    if (Array.isArray(messageSet)) {
      setMessage(pickRandom(messageSet as readonly string[]));
    } else if (subContext && typeof messageSet === "object") {
      const subMessages = (messageSet as Record<string, readonly string[]>)[subContext];
      if (subMessages) {
        setMessage(pickRandom([...subMessages]));
      }
    }
  }, [context, subContext]);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={message}
        className="text-center text-sm text-gray-500 py-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {message}
      </motion.p>
    </AnimatePresence>
  );
}
