import { useStore } from"@/context/StoreContext";
import { motion } from"motion/react";
import { cn } from"@/lib/utils";
import { TerminalInterface } from "@/components/code-mooderia/TerminalInterface";
import { ContrabandMarket } from "@/components/code-mooderia/ContrabandMarket";
import { SurveillanceGrid } from "@/components/code-mooderia/SurveillanceGrid";
import { useState } from"react";
import { Navigate } from"react-router-dom";

export default function CitizenHome() {
 const { state } = useStore();
 const [activeDystopianView, setActiveDystopianView] = useState<'terminal' |'market' |'surveillance'>('terminal');

 if (!state.isStarkTheme) {
 return <Navigate to="/" replace />;
 }

 return (
 <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
 <motion.h1 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="text-2xl sm:text-4xl font-black uppercase tracking-widest text-[#00ff41] mb-4 font-mono"
 >
 [ ROOT_ACCESS ]
 </motion.h1>

 <div className="bg-black/90 p-1 shadow-[0_0_20px_rgba(0,255,65,0.2)] rounded-none relative overflow-hidden">
 {/* Scanline effect */}
 <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>
 
 <div className="p-4 sm:p-6 min-h-[60vh]">
 {activeDystopianView ==='terminal' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <TerminalInterface 
 onOpenMarket={() => setActiveDystopianView('market')} 
 onOpenSurveillance={() => setActiveDystopianView('surveillance')} 
 />
 </motion.div>
 )}

 {activeDystopianView ==='market' && (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
 <ContrabandMarket onClose={() => setActiveDystopianView('terminal')} />
 </motion.div>
 )}

 {activeDystopianView ==='surveillance' && (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
 <SurveillanceGrid onClose={() => setActiveDystopianView('terminal')} />
 </motion.div>
 )}
 </div>
 </div>
 </div>
 );
}
