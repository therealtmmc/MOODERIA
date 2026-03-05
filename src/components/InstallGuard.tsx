import { useState, useEffect, ReactNode } from "react";
import { Share, MoreVertical, Smartphone, Download, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function InstallGuard({ children }: { children: ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
    };

    // Check if iOS for specific instructions
    const checkPlatform = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    };

    checkStandalone();
    checkPlatform();
    
    window.addEventListener("resize", checkStandalone);
    return () => window.removeEventListener("resize", checkStandalone);
  }, []);

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#8b5cf6] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white rounded-full mix-blend-overlay animate-bounce duration-[3000ms]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[20px] border-white/10 rounded-full" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="relative bg-white p-8 rounded-[3rem] shadow-[0_20px_0_0_rgba(0,0,0,0.2)] border-8 border-black max-w-sm w-full"
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-[#fbbf24] rounded-3xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          >
            <Smartphone className="w-12 h-12 text-black" />
          </motion.div>
        </div>

        <div className="mt-12 space-y-4">
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase transform -rotate-2">
            App Mode Only!
          </h1>
          
          <p className="text-lg font-bold text-gray-600 leading-tight">
            Whoops! Mooderia is too cool for regular browsers.
          </p>

          <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200 text-left space-y-4 relative overflow-hidden">
            <Sparkles className="absolute top-2 right-2 text-blue-300 w-8 h-8 opacity-50" />
            
            <p className="font-black text-blue-500 uppercase text-xs tracking-widest mb-2">How to Unlock</p>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl border-2 border-blue-200 flex items-center justify-center shrink-0 font-black text-blue-500">1</div>
              <p className="font-bold text-gray-700 text-sm leading-tight">
                Tap <Share className="inline w-4 h-4 mx-1" /> or <MoreVertical className="inline w-4 h-4 mx-1" />
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl border-2 border-blue-200 flex items-center justify-center shrink-0 font-black text-blue-500">2</div>
              <p className="font-bold text-gray-700 text-sm leading-tight">
                Choose <span className="text-blue-600">"Add to Home Screen"</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
                Waiting for install...
            </p>
        </div>
      </motion.div>
    </div>
  );
}
