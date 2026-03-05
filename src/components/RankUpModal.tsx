import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

const RANKS = [
  { id: 0, name: "Novice Dreamer", icon: "🌱", color: "text-green-500", bg: "bg-green-100" },
  { id: 1, name: "Casual Achiever", icon: "🍂", color: "text-orange-500", bg: "bg-orange-100" },
  { id: 2, name: "Consistent Doer", icon: "🪵", color: "text-amber-700", bg: "bg-amber-100" },
  { id: 3, name: "Bronze Grinder", icon: "🥉", color: "text-orange-700", bg: "bg-orange-200" },
  { id: 4, name: "Silver Striver", icon: "🥈", color: "text-gray-500", bg: "bg-gray-200" },
  { id: 5, name: "Gold Go-Getter", icon: "🥇", color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: 6, name: "Platinum Pro", icon: "💠", color: "text-cyan-500", bg: "bg-cyan-100" },
  { id: 7, name: "Diamond Dynamo", icon: "💎", color: "text-blue-500", bg: "bg-blue-100" },
  { id: 8, name: "Master of Moods", icon: "👑", color: "text-purple-500", bg: "bg-purple-100" },
  { id: 9, name: "Mooderia Legend", icon: "🌟", color: "text-indigo-500", bg: "bg-indigo-100" },
  { id: 10, name: "Ultimate Being", icon: "🌌", color: "text-violet-600", bg: "bg-violet-100" },
];

export function RankUpModal() {
  const { state, dispatch } = useStore();
  const { showRankUpPopup, currentRank } = state;
  const rank = RANKS[currentRank] || RANKS[RANKS.length - 1];

  useEffect(() => {
    if (showRankUpPopup) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF4500", "#1E90FF"],
      });
    }
  }, [showRankUpPopup]);

  return (
    <AnimatePresence>
      {showRankUpPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-yellow-400 relative"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
            
            <button 
              onClick={() => dispatch({ type: "CLOSE_RANK_POPUP" })}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="p-8 text-center space-y-6 relative z-10">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="uppercase tracking-widest font-black text-yellow-500 text-sm"
              >
                Level Up!
              </motion.div>

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-white ${rank.bg}`}
              >
                {rank.icon}
              </motion.div>

              <div className="space-y-2">
                <motion.h2 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-3xl font-black ${rank.color}`}
                >
                  {rank.name}
                </motion.h2>
                <p className="text-gray-500 font-bold">You've reached Rank {currentRank}!</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-600 font-bold">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Keep grinding!</span>
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: "CLOSE_RANK_POPUP" })}
                className="w-full bg-yellow-400 text-white py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
              >
                Awesome!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
