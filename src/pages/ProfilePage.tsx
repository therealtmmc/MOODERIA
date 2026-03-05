import { useStore } from "@/context/StoreContext";
import { User, Globe, Calendar, Hash, Trophy, Star, Lock, Book, Briefcase, Dumbbell, Check, Flame } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const RANKS = [
  { id: 0, name: "Novice Dreamer", icon: "🌱", color: "text-green-500", bg: "bg-green-100", border: "border-green-500", threshold: 0 },
  { id: 1, name: "Casual Achiever", icon: "🍂", color: "text-orange-500", bg: "bg-orange-100", border: "border-orange-500", threshold: 10 },
  { id: 2, name: "Consistent Doer", icon: "🪵", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-700", threshold: 20 },
  { id: 3, name: "Bronze Grinder", icon: "🥉", color: "text-orange-700", bg: "bg-orange-200", border: "border-orange-700", threshold: 50 },
  { id: 4, name: "Silver Striver", icon: "🥈", color: "text-gray-500", bg: "bg-gray-200", border: "border-gray-500", threshold: 80 },
  { id: 5, name: "Gold Go-Getter", icon: "🥇", color: "text-yellow-500", bg: "bg-yellow-100", border: "border-yellow-500", threshold: 120 },
  { id: 6, name: "Platinum Pro", icon: "💠", color: "text-cyan-500", bg: "bg-cyan-100", border: "border-cyan-500", threshold: 160 },
  { id: 7, name: "Diamond Dynamo", icon: "💎", color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-500", threshold: 200 },
  { id: 8, name: "Master of Moods", icon: "👑", color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-500", threshold: 250 },
  { id: 9, name: "Mooderia Legend", icon: "🌟", color: "text-indigo-500", bg: "bg-indigo-100", border: "border-indigo-500", threshold: 300 },
  { id: 10, name: "Ultimate Being", icon: "🌌", color: "text-violet-600", bg: "bg-violet-100", border: "border-violet-600", threshold: 350 },
];

export default function ProfilePage() {
  const { state } = useStore();
  const { userProfile, currentRank, streak } = state;

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

      {/* Merged Rank & Passport Card */}
      <div className={cn(
        "bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-4 relative p-6 space-y-6",
        currentRankData.border || "border-[#46178f]"
      )}>
        {/* Background Gradient */}
        <div className={cn("absolute top-0 left-0 w-full h-32 bg-gradient-to-b opacity-20 pointer-events-none", currentRankData.bg.replace("bg-", "from-").replace("100", "500"), "to-transparent")} />
        
        {/* Top Section: User Info & Rank Icon */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex gap-4 items-center">
            {/* User Photo */}
            <div className="w-20 h-20 bg-gray-200 rounded-2xl border-4 border-white shadow-md overflow-hidden shrink-0">
               {userProfile.photo ? (
                 <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-8 h-8 text-gray-400" />
                 </div>
               )}
            </div>
            
            {/* User Details */}
            <div>
              <h2 className="font-black text-xl text-gray-800 leading-tight">{userProfile.name}</h2>
              <div className="flex items-center gap-1 text-gray-500 font-bold text-xs uppercase mt-1">
                <Globe className="w-3 h-3" />
                {userProfile.citizenship}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-black border border-orange-200">
                <Flame className="w-3 h-3 fill-orange-500" />
                {streak} Day Streak
              </div>
            </div>
          </div>

          {/* Rank Icon */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={cn("w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md border-4 border-white", currentRankData.bg)}
            >
              {currentRankData.icon}
            </motion.div>
            <span className={cn("text-[10px] font-black uppercase mt-1 text-center max-w-[80px] leading-tight", currentRankData.color)}>
              {currentRankData.name}
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="relative z-10 pt-2">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Next Rank Progress</p>
              <p className="font-black text-2xl text-gray-800">{totalTasks} <span className="text-sm text-gray-400 font-bold">/ {nextRankData ? nextRankData.threshold : "MAX"} XP</span></p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-[#46178f]">{Math.round(progress)}%</p>
            </div>
          </div>
          
          <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full relative overflow-hidden", currentRankData.bg.replace('bg-', 'bg-').replace('100', '500'))}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
          
          {nextRankData && (
             <p className="text-center text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
               {nextRankData.threshold - totalTasks} more tasks to reach <span className={nextRankData.color}>{nextRankData.name}</span>
             </p>
          )}
        </div>
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
    </div>
  );
}
