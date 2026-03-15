import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";

export function RestoreTransition() {
  const [phase, setPhase] = useState<'rays' | 'fill' | 'loading'>('rays');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fill'), 2500);
    const t2 = setTimeout(() => setPhase('loading'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center bg-black pointer-events-none"
    >
      {/* Rays phase */}
      <AnimatePresence>
        {phase === 'rays' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* 5 Vertical Light Beams */}
            <div className="absolute inset-0 flex justify-evenly items-start px-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.8 }}
                  transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
                  className="w-[12%] h-[120%] origin-top bg-gradient-to-b from-white via-[#8b5cf6]/80 to-transparent blur-2xl"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fill phase */}
      <AnimatePresence>
        {(phase === 'fill' || phase === 'loading') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#46178f]"
          />
        )}
      </AnimatePresence>

      {/* Loading phase */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center justify-center text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
              <Heart className="w-20 h-20 text-white fill-white relative z-10" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Mooderia</h1>
            <p className="text-white/80 font-medium tracking-wide uppercase text-sm">Restoring Environment...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
