import { useStore } from "@/context/StoreContext";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TaskComponent } from "@/components/TaskComponent";

export default function CitizenHome() {
  const { state } = useStore();

  return (
    <div className="p-6">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black uppercase tracking-tighter mb-8 text-gray-900 drop-shadow-sm"
      >
        Citizen Home
      </motion.h1>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.01, rotate: -1 }}
        className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-8 border-4 border-black/5 mb-8 transition-transform"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "w-16 h-16 bg-purple-100 rounded-2xl border-4 flex items-center justify-center text-3xl shadow-inner rotate-3 overflow-hidden",
            state.profileBorder === "border_gold" ? "border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)]" :
            state.profileBorder === "border_diamond" ? "border-[#b9f2ff] shadow-[0_0_15px_rgba(185,242,255,0.8)]" :
            "border-purple-200"
          )}>
            {state.userProfile?.photo ? (
              <img src={state.userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-800">Welcome, {state.userProfile?.name}</h2>
            <p className="text-gray-500 font-bold text-sm">This is your personal space in Mooderia.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-indigo-50 p-6 rounded-[2rem] border-4 border-indigo-100 shadow-sm"
          >
            <h3 className="font-black text-indigo-900 uppercase tracking-widest text-xs mb-2">City Level</h3>
            <p className="text-5xl font-black text-indigo-600">{state.cityLevel}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-orange-50 p-6 rounded-[2rem] border-4 border-orange-100 shadow-sm"
          >
            <h3 className="font-black text-orange-900 uppercase tracking-widest text-xs mb-2">Streak</h3>
            <p className="text-5xl font-black text-orange-600">{state.streak} <span className="text-3xl">🔥</span></p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-blue-50 p-6 rounded-[2rem] border-4 border-blue-100 shadow-sm"
          >
            <h3 className="font-black text-blue-900 uppercase tracking-widest text-xs mb-2">Intellect</h3>
            <p className="text-5xl font-black text-blue-600">{state.userProfile?.intellect || 0} <span className="text-3xl">🧠</span></p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TaskComponent />
      </motion.div>
    </div>
  );
}
