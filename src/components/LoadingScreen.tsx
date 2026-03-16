import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Smile, Heart, Zap, Star, Cloud, Sun, Moon, Music, Coffee, Book, Sparkles, Flame, Terminal } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const BACKGROUND_ICONS = [
  Smile, Heart, Zap, Star, Cloud, Sun, Moon, Music, Coffee, Book, Sparkles, Flame
];

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const { state } = useStore();
  const isStark = state.isStarkTheme;

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total load time
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 500); // Wait a bit after 100% before unmounting
          }
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isStark) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-[#00ff41] font-mono overflow-hidden">
        <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
          <Terminal className="w-16 h-16 mb-6 animate-pulse" />
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-black tracking-tighter mb-10 text-center"
          >
            CODE MOODERIA
          </motion.h1>

          <div className="w-full h-2 bg-[#00ff41]/20 rounded-none relative overflow-hidden border border-[#00ff41]">
            <motion.div 
              className="h-full bg-[#00ff41]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="mt-3 flex justify-between w-full px-2">
              <span className="text-[10px] font-bold uppercase tracking-widest">LOADING_CORE</span>
              <span className="text-[10px] font-bold font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#46178f] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Tiled Background Pattern */}
      <div className="absolute inset-0 opacity-10 flex flex-wrap justify-center content-center gap-12 transform -rotate-12 scale-150 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => {
          const Icon = BACKGROUND_ICONS[i % BACKGROUND_ICONS.length];
          return (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <Icon className="w-12 h-12" />
            </motion.div>
          );
        })}
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#46178f_100%)] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-black tracking-tighter mb-10 text-center drop-shadow-2xl"
        >
          MOODERIA
        </motion.h1>

        {/* Progress Bar Container */}
        <div className="w-full h-6 bg-black/30 rounded-full p-1 backdrop-blur-md border border-white/10 shadow-inner">
          {/* Filling Bar */}
          <motion.div 
            className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] relative overflow-hidden"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 20, damping: 10 }}
          >
            {/* Shine effect on bar */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>
        
        <div className="mt-3 flex justify-between w-full px-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Loading Assets</span>
            <span className="text-[10px] font-bold text-yellow-400 font-mono">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
