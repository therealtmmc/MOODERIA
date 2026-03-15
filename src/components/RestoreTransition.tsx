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
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 2.5, ease: "easeIn" }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Rotating Rays */}
            <motion.div 
              initial={{ x: "-50%", y: "-50%", rotate: 0 }}
              animate={{ x: "-50%", y: "-50%", rotate: 360 }}
              transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" } }}
              className="absolute top-0 left-1/2 w-[250vw] h-[250vw] opacity-80 origin-center"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, #8b5cf6 45deg, transparent 90deg, #8b5cf6 135deg, transparent 180deg, #8b5cf6 225deg, transparent 270deg, #8b5cf6 315deg, transparent 360deg)'
              }}
            />
            {/* Bright glow at the source */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white rounded-full blur-[100px] opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fill phase */}
      <AnimatePresence>
        {(phase === 'fill' || phase === 'loading') && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
