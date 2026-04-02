import { motion, AnimatePresence } from"motion/react";
import { X, Wind } from"lucide-react";
import { useState, useEffect } from"react";

export function BreathingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
 const [phase, setPhase] = useState<"Inhale" |"Hold" |"Exhale">("Inhale");

 useEffect(() => {
 if (!isOpen) return;

 const cycle = async () => {
 while (isOpen) {
 setPhase("Inhale");
 await new Promise((r) => setTimeout(r, 4000));
 if (!isOpen) break;
 setPhase("Hold");
 await new Promise((r) => setTimeout(r, 4000)); // Reduced hold for simplicity/comfort
 if (!isOpen) break;
 setPhase("Exhale");
 await new Promise((r) => setTimeout(r, 4000)); // Reduced exhale for simplicity
 }
 };
 cycle();
 }, [isOpen]);

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white"
 >
 <button
 onClick={onClose}
 className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
 >
 <X className="w-6 h-6" />
 </button>

 <div className="relative flex items-center justify-center mb-12">
 {/* Outer Glow */}
 <motion.div
 animate={{
 scale: phase ==="Inhale" ? 1.5 : phase ==="Hold" ? 1.5 : 1,
 opacity: phase ==="Inhale" ? 0.5 : phase ==="Hold" ? 0.8 : 0.2,
 }}
 transition={{ duration: 4, ease:"easeInOut" }}
 className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl"
 />
 
 {/* Main Circle */}
 <motion.div
 animate={{
 scale: phase ==="Inhale" ? 1.2 : phase ==="Hold" ? 1.2 : 0.8,
 }}
 transition={{ duration: 4, ease:"easeInOut" }}
 className="w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative z-10"
 >
 <Wind className="w-16 h-16 text-white/80" />
 </motion.div>
 </div>

 <motion.h2
 key={phase}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="text-4xl font-black tracking-wide uppercase"
 >
 {phase}
 </motion.h2>
 
 <p className="mt-4 text-white/50 text-sm font-medium">Focus on your breath</p>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
