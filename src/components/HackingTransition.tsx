import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useStore } from "@/context/StoreContext";
import { Terminal } from "lucide-react";

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

export function HackingTransition() {
  const { state } = useStore();
  const [phase, setPhase] = useState<'scrolling' | 'info' | 'logo'>('scrolling');
  const [typedCode, setTypedCode] = useState('');
  const [typedInfo, setTypedInfo] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const infoText = `**************** MOOD-OS(R) V1.0.0 ****************\n\nCOPYRIGHT 2026 MOODERIA(R)\nLOADER V1.1\nEXEC VERSION 41.10\n64K RAM SYSTEM\n38911 BYTES FREE\n\nCITIZEN: ${state.userProfile?.name?.toUpperCase() || "UNKNOWN"}\nPASSPORT: ${state.userProfile?.passportNumber || "0000-0000"}\nCITY LEVEL: ${state.cityLevel}\nINTELLECT: ${state.userProfile?.intellect || 0}\n\nLOAD ROM(1): CODE_MOODERIA`;

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
        i += 15; // Type fewer characters per tick for smoother "each character" look
      }, 5); // Fastest possible interval

      const timer = setTimeout(() => {
        clearInterval(interval);
        setPhase('info');
      }, 2000); // 2 seconds of coding

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (phase === 'info') {
      let i = 0;
      const interval = setInterval(() => {
        setTypedInfo(infoText.slice(0, i));
        i += 3; // Type 3 characters at a time
        if (i > infoText.length) {
          clearInterval(interval);
        }
      }, 20);

      const timer = setTimeout(() => setPhase('logo'), 2500); // 2.5 seconds of info
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [phase, infoText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black text-[#00ff41] font-mono p-4 sm:p-8 overflow-hidden flex flex-col pointer-events-none"
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
            className="w-3 h-5 bg-[#00ff41] inline-block align-middle ml-1"
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
            BOOTING UP...
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
