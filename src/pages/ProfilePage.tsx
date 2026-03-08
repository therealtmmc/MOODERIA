import { useStore } from "@/context/StoreContext";
import { User, Globe, Calendar, Hash, Trophy, Star, Lock, Book, Briefcase, Dumbbell, Check, Flame, Sword, Brain, Heart, Zap, Shield, Crown, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";

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

  // RPG Stats Calculation
  // Strength: Workouts (Unchanged)
  // Intellect: Work Tasks + Events
  // Vitality: Diary Entries
  // Agility: Walks
  // Net Worth: Savings + Wallet

  const strength = Math.min(state.workouts.length * 5 + state.workTasks.filter(t => t.title.toLowerCase().includes("workout") || t.title.toLowerCase().includes("gym")).length * 2, 100);
  
  const intellect = Math.min(
    state.workTasks.filter(t => t.completed).length * 2 + 
    state.events.length * 5 +
    (userProfile.intellect || 0), 
    100
  );
  
  const vitality = Math.min(state.moods.length * 5, 100);
  
  const agility = Math.min(state.walks.length * 5, 100);
  
  const totalWealth = (state.walletBalance || 0) + state.savings.reduce((acc, s) => acc + s.currentAmount, 0);
  // Scale: 10000 = 100 points
  const netWorthScore = Math.min(totalWealth / 100, 100); 

  const statsData = [
    { subject: 'STR', A: strength, fullMark: 100 },
    { subject: 'INT', A: intellect, fullMark: 100 },
    { subject: 'VIT', A: vitality, fullMark: 100 },
    { subject: 'AGI', A: agility, fullMark: 100 },
  ];

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#46178f]">Citizen ID</h1>
        <p className="text-gray-500 font-bold">Official Mooderia Records</p>
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
            <div className="w-24 h-24 bg-gray-200 rounded-3xl border-4 border-white shadow-md overflow-hidden shrink-0 relative">
               {userProfile.photo ? (
                 <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-10 h-10 text-gray-400" />
                 </div>
               )}
               <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                 <div className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                   <Flame className="w-3 h-3 fill-white" /> {streak}
                 </div>
               </div>
            </div>
            
            {/* User Details */}
            <div>
              <h2 className="font-black text-2xl text-gray-800 leading-tight">{userProfile.name}</h2>
              <div className="flex items-center gap-1 text-gray-500 font-bold text-xs uppercase mt-1">
                <Globe className="w-3 h-3" />
                {userProfile.citizenship}
              </div>
              <div className="flex gap-2 mt-2">
                 <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-blue-200">
                    Lvl {Math.floor(totalTasks / 10) + 1}
                 </span>
                 <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-purple-200">
                    {currentRankData.name}
                 </span>
              </div>
            </div>
          </div>

          {/* Rank Icon */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={cn("w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white bg-white relative z-10", currentRankData.bg)}
            >
              {currentRankData.icon}
              <div className="absolute -bottom-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border-2 border-white">
                Rank {currentRank + 1}
              </div>
            </motion.div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative z-10 pt-4">
          <div className="flex justify-between items-end mb-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Experience Points</p>
            <p className="font-black text-sm text-[#46178f]">{totalTasks} <span className="text-gray-300">/ {nextRankData ? nextRankData.threshold : "MAX"} XP</span></p>
          </div>
          
          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 relative shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full relative overflow-hidden flex items-center justify-end pr-2", currentRankData.bg.replace('bg-', 'bg-').replace('100', '500'))}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]" />
              <span className="text-[9px] font-black text-white drop-shadow-md">{Math.round(progress)}%</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Radar Chart */}
      <div className="bg-white rounded-[2.5rem] shadow-lg border-4 border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown className="w-32 h-32 text-gray-900" />
        </div>
        
        <h3 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2 relative z-10">
          <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Ability Scores
        </h3>

        <div className="h-64 w-full relative z-10 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
              <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Stats"
                dataKey="A"
                stroke="#46178f"
                strokeWidth={3}
                fill="#8b5cf6"
                fillOpacity={0.5}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#46178f', fontWeight: 'bold', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat Breakdown */}
        <div className="grid grid-cols-2 gap-3 mt-2 relative z-10">
           <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-xl text-red-600"><Sword className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-red-400 uppercase">Strength</p>
                <p className="font-black text-lg text-red-700">{strength}</p>
              </div>
           </div>
           <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Brain className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Intellect</p>
                <p className="font-black text-lg text-blue-700">{intellect}</p>
              </div>
           </div>
           <div className="bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl text-green-600"><Shield className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-green-400 uppercase">Vitality</p>
                <p className="font-black text-lg text-green-700">{vitality}</p>
              </div>
           </div>
           <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Zap className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-orange-400 uppercase">Agility</p>
                <p className="font-black text-lg text-orange-700">{agility}</p>
              </div>
           </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between col-span-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><DollarSign className="w-5 h-5" /></div>
                <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">Net Worth</p>
                    <p className="font-black text-xl text-emerald-700">{userProfile.currency} {totalWealth.toLocaleString()}</p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Inventory / Achievements (Placeholder for future RPG expansion) */}
      <div className="bg-white rounded-[2.5rem] shadow-lg border-4 border-gray-100 p-6">
        <h3 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-600" /> Citizen Assets
        </h3>
        <div className="grid grid-cols-4 gap-2">
           {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-300" />
             </div>
           ))}
           <div className="col-span-4 text-center mt-2">
             <p className="text-xs font-bold text-gray-400">More slots unlock at Level 5</p>
           </div>
        </div>
      </div>
    </div>
  );
}
