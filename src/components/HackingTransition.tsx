import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const HACKING_LINES = [
  "Accessing mainframe...",
  "Bypassing security protocols...",
  "Decrypting user data...",
  "Injecting stark_theme.dll...",
  "Compiling neural net...",
  "Override accepted.",
  "System reboot initiated...",
  "Loading modules: [██████████] 100%",
  "Connection established.",
  "Rerouting power to primary systems...",
  "Initializing CODE MOODERIA environment...",
  "Security clearance: GRANTED",
  "Executing payload...",
  "Overwriting CSS variables...",
  "Disabling safety limits...",
  "Bypassing firewall...",
  "Extracting encrypted keys...",
  "Mounting virtual drives...",
  "Kernel panic averted...",
  "Deploying countermeasures...",
  "Syncing with dark web nodes...",
  "Root access acquired."
];

export function HackingTransition() {
  const [phase, setPhase] = useState<'typing' | 'hacking' | 'done'>('typing');
  const [typedText, setTypedText] = useState('');
  const [logLines, setLogLines] = useState<string[]>([]);

  const targetText = "> execute sys.core.init() --force --override";

  useEffect(() => {
    // Phase 1: Typing (Slower)
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(targetText.slice(0, i));
      i++;
      if (i > targetText.length) {
        clearInterval(typingInterval);
        setTimeout(() => setPhase('hacking'), 800); // longer pause before hacking
      }
    }, 80); // slower typing speed

    return () => clearInterval(typingInterval);
  }, [targetText]);

  useEffect(() => {
    // Phase 2: Hacking (More lines)
    if (phase === 'hacking') {
      let lineIndex = 0;
      const hackingInterval = setInterval(() => {
        const randomHex = Array.from({length: 6}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');
        const randomLine = HACKING_LINES[Math.floor(Math.random() * HACKING_LINES.length)];
        const newLine = `[0x${randomHex}] ${randomLine} ... OK`;
        
        setLogLines(prev => {
          const newLines = [...prev, newLine];
          return newLines.slice(-30); // keep last 30 lines
        });
        
        lineIndex++;
        if (lineIndex > 60) {   // after 60 lines, finish
          clearInterval(hackingInterval);
          setPhase('done');
        }
      }, 35); // fast scrolling

      return () => clearInterval(hackingInterval);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-black text-green-500 font-mono p-6 overflow-hidden flex flex-col justify-end pointer-events-none"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col justify-end h-full pb-20">
        {phase === 'typing' && (
          <div className="text-xl md:text-3xl font-bold mb-4">
            {typedText}<span className="animate-pulse">_</span>
          </div>
        )}
        
        {(phase === 'hacking' || phase === 'done') && (
          <div className="flex flex-col gap-1 text-xs md:text-sm opacity-80">
            <div className="text-xl md:text-3xl font-bold mb-4 opacity-50">
              {targetText}
            </div>
            {logLines.map((line, i) => (
              <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                {line}
              </div>
            ))}
            {phase === 'done' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl md:text-4xl mt-8 text-white stark-theme-glitch font-black text-center"
              >
                SYSTEM OVERRIDE SUCCESSFUL
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
