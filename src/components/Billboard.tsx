import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DISTRICTS } from "@/constants/districts";

const MESSAGES = [
  "Welcome to Mooderia!",
  ...Object.values(DISTRICTS).map(d => `${d.name}: ${d.description}`)
];

export function Billboard() {
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 bg-yellow-400 rounded-xl p-2 shadow-inner border-2 border-yellow-600 overflow-hidden">
      <div className="bg-black rounded-lg p-2 h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-yellow-400 font-mono text-xs font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
