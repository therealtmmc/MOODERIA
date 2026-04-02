import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Smile, HelpCircle, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/Calendar";
import { motion, AnimatePresence } from "motion/react";

const MOOD_COLORS: Record<string, string> = {
  Happy: "bg-yellow-400",
  Sad: "bg-blue-400",
  Neutral: "bg-gray-400",
  Loved: "bg-pink-400",
  Angry: "bg-red-500",
  Energetic: "bg-orange-400",
  Tired: "bg-brown-400",
  Calm: "bg-indigo-400",
};

const QUOTES = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "You are enough just as you are.",
  "Every day is a fresh start.",
  "Keep going. Everything you need will come to you at the perfect time.",
  "You are capable of amazing things.",
  "Don't watch the clock; do what it does. Keep going.",
  "Happiness is not by chance, but by choice.",
  "Your potential is endless.",
  "Dream big and dare to fail.",
  "Be the change that you wish to see in the world.",
  "It always seems impossible until it's done.",
  "Start where you are. Use what you have. Do what you can.",
  "The best way to predict the future is to create it.",
  "You are stronger than you seem, braver than you believe, and smarter than you think.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "Act as if what you do makes a difference. It does.",
  "Limit your 'always' and your 'nevers'.",
  "Spread love everywhere you go.",
  "You do not find the happy life. You make it.",
  "The most wasted of days is one without laughter.",
  "Stay close to anything that makes you glad you are alive.",
  "Make each day your masterpiece.",
  "Wherever you go, go with all your heart.",
  "Turn your wounds into wisdom.",
  "Everything you can imagine is real.",
  "Do what you can, with what you have, where you are.",
  "Hope is the heartbeat of the soul.",
  "Life is 10% what happens to you and 90% how you react to it."
];

export default function MoodPage() {
  const { state } = useStore();
  const [showOracle, setShowOracle] = useState(false);
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const dayOfMonth = new Date().getDate();
  const dailyQuote = QUOTES[(dayOfMonth - 1) % QUOTES.length];

  const askOracle = () => {
    const answers = ["Yes", "No", "Maybe", "I don't know", "Ask again later", "Definitely", "Unlikely"];
    const random = answers[Math.floor(Math.random() * answers.length)];
    setOracleAnswer(random);
  };

  const calendarEvents = state.moods.map((m) => ({
    date: m.date,
    color: MOOD_COLORS[m.mood] || "bg-gray-200",
  }));

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#eb6123]">Mood Station</h1>
        <p className="text-gray-500 font-bold">Daily Check-in</p>
      </header>

      {/* Streak Display */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 clay-card text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <Flame className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase opacity-80 mb-1 tracking-widest">Current Streak</p>
            <h2 className="text-5xl font-black">{state.streak} <span className="text-2xl font-bold opacity-80">Days</span></h2>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
             <Flame className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 clay-card">
        <h2 className="text-xl font-black text-gray-700 mb-4 flex items-center gap-2">
          <Smile className="w-6 h-6 text-[#eb6123]" />
          Mood Calendar
        </h2>
        <Calendar events={calendarEvents} />
      </div>

      {/* Oracle Button - Full Width */}
      <button
        onClick={() => {
          setOracleAnswer(null);
          setShowOracle(true);
        }}
        className="w-full bg-[#26890c] text-white p-8 rounded-3xl shadow-xl border-b-8 border-[#1a5e08] active:translate-y-2 active:border-b-0 transition-all flex flex-row items-center justify-center gap-4"
      >
        <HelpCircle className="w-12 h-12" />
        <span className="font-black text-3xl tracking-wide">ASK THE ORACLE</span>
      </button>

      {/* Daily Motivation */}
      <div className="bg-white p-6 clay-card">
        <h3 className="font-black text-[#46178f] text-sm uppercase tracking-widest mb-2">Daily Wisdom</h3>
        <p className="text-gray-700 font-bold text-lg italic leading-relaxed">
          "{dailyQuote}"
        </p>
      </div>

      {/* Oracle Modal */}
      <AnimatePresence>
        {showOracle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c]"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">The Oracle</h3>
                <button onClick={() => setShowOracle(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-8 border-gray-200 shadow-inner">
                  {oracleAnswer ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-[#26890c] px-2"
                    >
                      {oracleAnswer}
                    </motion.span>
                  ) : (
                    <span className="text-6xl animate-pulse">🔮</span>
                  )}
                </div>
                <p className="font-bold text-gray-500 text-lg">
                  Focus on your question...
                </p>
                <button
                  onClick={askOracle}
                  className="w-full bg-[#26890c] text-white py-4 rounded-2xl font-black text-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#1a5e08] active:border-b-0 active:translate-y-1"
                >
                  Reveal Answer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
