import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/context/StoreContext";
import { Terminal, Heart } from "lucide-react";

const MEMORY_LINES = [
  "start memory discovery 0x0000000000000000",
  "CPU0 starting cell relocation",
  "relocation# 0x00000A",
  "CPU0 launch EFI# 0x00000A",
  "1 0 0x00000A 0x0000000000000000",
  "0x0000000000000000 1 0 0x00000A 0x0000000000000000",
  "discovery# 0x00000A 0x0000000000000000",
  "start memory discovery 0x0000000000000000",
  "1 0 0x00000A",
  "0x0000000000000000 CPU0 starting EFI# 0x00000A",
];

const FULL_CODE_SEQUENCE = Array.from({length: 80}, () => MEMORY_LINES.join('\n')).join('\n');

export function RestoreTransition() {
  const { state } = useStore();
  const [phase, setPhase] = useState<'scrolling' | 'info' | 'logo' | 'rays' | 'fill' | 'loading'>('scrolling');
  const [typedCode, setTypedCode] = useState('');
  const [typedInfo, setTypedInfo] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const infoText = `**************** MOOD-OS(R) V1.0.0 ****************\n\nCOPYRIGHT 2026 MOODERIA(R)\nLOADER V1.1\nEXEC VERSION 41.10\n64K RAM SYSTEM\n38911 BYTES FREE\n\nCITIZEN: ${state.userProfile?.name?.toUpperCase() || "UNKNOWN"}\nPASSPORT: ${state.userProfile?.passportNumber || "0000-0000"}\nCITY LEVEL: ${state.cityLevel}\nINTELLECT: ${state.userProfile?.intellect || 0}\n\nUNLOAD ROM(1): CODE_MOODERIA`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [typedCode]);

  useEffect(() => {
    if (phase === 'scrolling') {
      let i = 0;
      const interval = setInterval(() => {
        setTypedCode(FULL_CODE_SEQUENCE.slice(0, i));
        i += 15;
      }, 5);

      const timer = setTimeout(() => {
        clearInterval(interval);
        setPhase('info');
      }, 1500); // Reduced from 2000

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (phase === 'info') {
      let i = 0;
      const interval = setInterval(() => {
        setTypedInfo(infoText.slice(0, i));
        i += 3;
        if (i > infoText.length) clearInterval(interval);
      }, 20);

      const timer = setTimeout(() => setPhase('logo'), 2000); // Reduced from 2500
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (phase === 'logo') {
      const timer = setTimeout(() => setPhase('rays'), 1500);
      return () => clearTimeout(timer);
    } else if (phase === 'rays') {
      const t1 = setTimeout(() => setPhase('fill'), 1000); // Reduced from 1500
      const t2 = setTimeout(() => setPhase('loading'), 1500); // Reduced from 2500
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase, infoText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black text-red-500 font-mono p-4 sm:p-8 overflow-hidden flex flex-col pointer-events-none"
    >
      {phase === 'scrolling' && (
        <div ref={scrollRef} className="flex flex-col text-xs sm:text-sm leading-tight opacity-80 h-full overflow-hidden whitespace-pre-wrap break-words">
          {typedCode}
          <span className="animate-pulse">_</span>
        </div>
      )}

      {phase === 'info' && (
        <div className="flex flex-col text-sm sm:text-base leading-tight mt-4 whitespace-pre-wrap">
          {typedInfo}
          <motion.div 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-3 h-5 bg-red-500 inline-block align-middle ml-1"
          />
        </div>
      )}

      {phase === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Terminal className="w-24 h-24 mb-6" />
          <div className="text-2xl sm:text-4xl font-black tracking-widest uppercase">
            Code Mooderia
          </div>
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-4 text-sm sm:text-base tracking-widest"
          >
            SHUTTING DOWN...
          </motion.div>
        </div>
      )}

      {/* Rays phase */}
      <AnimatePresence>
        {phase === 'rays' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden z-0"
          >
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
            className="absolute inset-0 bg-[#46178f] z-10"
          />
        )}
      </AnimatePresence>

      {/* Loading phase */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white"
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
