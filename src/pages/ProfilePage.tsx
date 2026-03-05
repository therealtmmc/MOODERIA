import { useStore } from "@/context/StoreContext";
import { User, Globe, Calendar, Hash, Trophy, Star, Lock, Book, Briefcase, Dumbbell, Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const RANKS = [
  { id: 0, name: "Novice Dreamer", icon: "🌱", color: "text-green-500", bg: "bg-green-100", threshold: 0 },
  { id: 1, name: "Casual Achiever", icon: "🍂", color: "text-orange-500", bg: "bg-orange-100", threshold: 10 },
  { id: 2, name: "Consistent Doer", icon: "🪵", color: "text-amber-700", bg: "bg-amber-100", threshold: 20 },
  { id: 3, name: "Bronze Grinder", icon: "🥉", color: "text-orange-700", bg: "bg-orange-200", threshold: 50 },
  { id: 4, name: "Silver Striver", icon: "🥈", color: "text-gray-500", bg: "bg-gray-200", threshold: 80 },
  { id: 5, name: "Gold Go-Getter", icon: "🥇", color: "text-yellow-500", bg: "bg-yellow-100", threshold: 120 },
  { id: 6, name: "Platinum Pro", icon: "💠", color: "text-cyan-500", bg: "bg-cyan-100", threshold: 160 },
  { id: 7, name: "Diamond Dynamo", icon: "💎", color: "text-blue-500", bg: "bg-blue-100", threshold: 200 },
  { id: 8, name: "Master of Moods", icon: "👑", color: "text-purple-500", bg: "bg-purple-100", threshold: 250 },
  { id: 9, name: "Mooderia Legend", icon: "🌟", color: "text-indigo-500", bg: "bg-indigo-100", threshold: 300 },
  { id: 10, name: "Ultimate Being", icon: "🌌", color: "text-violet-600", bg: "bg-violet-100", threshold: 350 },
];

export default function ProfilePage() {
  const { state } = useStore();
  const { userProfile, currentRank } = state;

  if (!userProfile) return null;

  const totalTasks = 
    state.moods.length + 
    state.workTasks.filter(t => t.completed).length + 
    state.events.length + 
    state.workouts.length;

  const currentRankData = RANKS[currentRank] || RANKS[RANKS.length - 1];
  const nextRankData = RANKS[currentRank + 1];
  
  const progress = nextRankData 
    ? Math.min(((totalTasks - currentRankData.threshold) / (nextRankData.threshold - currentRankData.threshold)) * 100, 100)
    : 100;

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#46178f]">Profile</h1>
      </header>

      {/* Rank Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-[#46178f] relative p-6 text-center space-y-4">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#46178f]/10 to-transparent pointer-events-none" />
        
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white ${currentRankData.bg}`}
          >
            {currentRankData.icon}
          </motion.div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#46178f] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            Rank {currentRank}
          </div>
        </div>

        <div>
          <h2 className={`text-2xl font-black ${currentRankData.color}`}>{currentRankData.name}</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wide mt-1">Total Tasks Completed: {totalTasks}</p>
        </div>

        {/* Progress Bar */}
        {nextRankData ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-400">
              <span>{Math.round(progress)}% to Rank {currentRank + 1}</span>
              <span>{nextRankData.threshold - totalTasks} tasks left</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full rounded-full ${currentRankData.bg.replace('bg-', 'bg-').replace('100', '500')}`}
              />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-xl font-black text-sm shadow-md">
            MAX RANK ACHIEVED! 🏆
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Book className="w-5 h-5" />
          </div>
          <div className="text-center">
            <span className="block font-black text-xl text-gray-800">{state.moods.length}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Diary Entries</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-center">
            <span className="block font-black text-xl text-gray-800">{state.workTasks.filter(t => t.completed).length}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Work Tasks</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-center">
            <span className="block font-black text-xl text-gray-800">{state.events.length}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Events</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="text-center">
            <span className="block font-black text-xl text-gray-800">{state.workouts.length}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Workouts</span>
          </div>
        </div>
      </div>

      {/* Rank List */}
      <div className="bg-white rounded-3xl shadow-lg border-b-4 border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-black text-gray-700 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Rank Ladder
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {RANKS.map((rank) => {
            const isUnlocked = currentRank >= rank.id;
            const isNext = currentRank + 1 === rank.id;
            
            return (
              <div key={rank.id} className={cn("p-4 flex items-center gap-4", !isUnlocked && !isNext && "opacity-40 grayscale")}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-white",
                  rank.bg
                )}>
                  {isUnlocked ? rank.icon : <Lock className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <h4 className={cn("font-black text-sm", isUnlocked ? "text-gray-800" : "text-gray-400")}>{rank.name}</h4>
                  <p className="text-xs font-bold text-gray-400">{rank.threshold} Tasks Required</p>
                </div>
                {isUnlocked && (
                  <div className="bg-green-100 text-green-600 p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#f8f5f2] rounded-3xl shadow-xl overflow-hidden border-2 border-gray-200 relative mt-8">
        {/* Passport Header */}
        <div className="bg-[#46178f] p-4 flex items-center justify-between border-b-4 border-[#eb6123]">
          <div className="flex items-center gap-2">
            <span className="font-black text-white uppercase tracking-widest text-sm">Mooderia Passport</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 relative">
          <div className="flex gap-6">
            <div className="w-24 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 shadow-inner flex items-center justify-center shrink-0 overflow-hidden relative">
               {userProfile.photo ? (
                 <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-gray-400" />
               )}
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</label>
                <p className="font-black text-xl text-gray-800 font-mono uppercase leading-tight">{userProfile.name}</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Citizenship</label>
                <p className="font-black text-lg text-gray-800 font-mono uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#eb6123]" />
                  {userProfile.citizenship}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
