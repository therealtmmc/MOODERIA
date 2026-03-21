import { useStore } from "@/context/StoreContext";
import { User, Globe, Calendar, Hash, Trophy, Star, Lock, Book, Briefcase, Dumbbell, Check, Flame, Sword, Brain, Heart, Zap, Shield, Crown, DollarSign, Database, Key, Palette, UserCircle, ArrowUpCircle, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { useState } from "react";
import { DataTransferModal } from "@/components/DataTransferModal";
import { isThisWeek, eachDayOfInterval, startOfWeek, endOfWeek, format, isSameDay } from "date-fns";

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
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

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

  const getPhotoUrl = (p: string | Blob | undefined) => {
    if (!p) return null;
    if (p instanceof Blob) return URL.createObjectURL(p);
    return p;
  };

  const assets = [];

  if (state.streakSavers > 0) {
    assets.push({
      id: 'streak_saver',
      name: 'Streak Saver',
      icon: Flame,
      count: state.streakSavers,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200'
    });
  }

  if (state.terminalTheme && state.terminalTheme !== 'green') {
    assets.push({
      id: `theme_${state.terminalTheme}`,
      name: `${state.terminalTheme.charAt(0).toUpperCase() + state.terminalTheme.slice(1)} Terminal`,
      icon: Palette,
      color: state.terminalTheme === 'amber' ? 'text-amber-500' : 'text-cyan-500',
      bg: state.terminalTheme === 'amber' ? 'bg-amber-50' : 'bg-cyan-50',
      border: state.terminalTheme === 'amber' ? 'border-amber-200' : 'border-cyan-200'
    });
  }

  if (state.profileBorder) {
    const isGold = state.profileBorder === 'border_gold';
    assets.push({
      id: state.profileBorder,
      name: isGold ? 'Gold Border' : 'Diamond Border',
      icon: Crown,
      color: isGold ? 'text-yellow-600' : 'text-cyan-500',
      bg: isGold ? 'bg-yellow-50' : 'bg-cyan-50',
      border: isGold ? 'border-yellow-200' : 'border-cyan-200'
    });
  }

  state.inventory.forEach(item => {
    let Icon = Zap;
    if (item.icon === "Key") Icon = Key;
    if (item.icon === "Palette") Icon = Palette;
    if (item.icon === "UserCircle") Icon = UserCircle;
    if (item.icon === "ArrowUpCircle") Icon = ArrowUpCircle;

    assets.push({
      id: item.id,
      name: item.name,
      icon: Icon,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    });
  });

  const totalSlots = Math.max(4, assets.length + (4 - (assets.length % 4)) % 4);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const thisWeekData = days.map(day => {
    const works = state.workTasks.filter(t => t.completed && t.dateCompleted && isSameDay(new Date(t.dateCompleted), day)).length;
    const hospital = state.workouts.filter(w => isSameDay(new Date(w.date), day)).length;
    const reviewing = state.schoolFiles.filter(f => isSameDay(new Date(f.createdAt), day)).length + (state.flashcardDecks || []).filter(f => isSameDay(new Date(f.createdAt), day)).length;
    const market = state.transactions.filter(t => t.type === 'expense' && (t.category === 'Food' || t.note?.includes('Market') || t.note?.includes('Shop')) && isSameDay(new Date(t.date), day)).reduce((acc, t) => acc + t.amount, 0);
    const savings = state.transactions.filter(t => t.type === 'expense' && t.category === 'Savings Deposit' && isSameDay(new Date(t.date), day)).reduce((acc, t) => acc + t.amount, 0);
    const expenses = state.transactions.filter(t => t.type === 'expense' && t.category !== 'Savings Deposit' && isSameDay(new Date(t.date), day)).reduce((acc, t) => acc + t.amount, 0);

    return {
      date: day,
      works,
      hospital,
      reviewing,
      market,
      savings,
      expenses
    };
  });

  return (
    <div className={cn("p-4 pt-8 pb-24 space-y-6 transition-colors duration-500", state.isStarkTheme && "stark-theme")}>
      <header>
        <h1 className={cn("text-3xl font-black", state.isStarkTheme ? "text-green-500 font-mono uppercase tracking-tighter" : "text-[#46178f]")}>
          {state.isStarkTheme ? "USER.PROFILE" : "Citizen ID"}
        </h1>
        <p className={cn("font-bold", state.isStarkTheme ? "text-green-600/70 font-mono text-xs uppercase tracking-widest" : "text-gray-500")}>
          {state.isStarkTheme ? "SYSTEM.RECORDS.READ()" : "Official Mooderia Records"}
        </p>
      </header>

      {/* Merged Rank & Passport Card */}
      <div className={cn(
        "relative p-6 space-y-6 overflow-hidden",
        state.isStarkTheme 
          ? "bg-black/90 backdrop-blur-md rounded-none border border-green-500/30 shadow-[0_0_20px_rgba(0,255,65,0.1)] font-mono"
          : cn("bg-white rounded-[2.5rem] shadow-xl border-4", currentRankData.border || "border-[#46178f]")
      )}>
        {/* Background Gradient */}
        {!state.isStarkTheme && (
          <div className={cn("absolute top-0 left-0 w-full h-32 bg-gradient-to-b opacity-20 pointer-events-none", currentRankData.bg.replace("bg-", "from-").replace("100", "500"), "to-transparent")} />
        )}
        {state.isStarkTheme && (
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10"></div>
        )}
        
        {/* Top Section: User Info & Rank Icon */}
        <div className="flex justify-between items-start relative z-20">
          <div className="flex gap-4 items-center">
            {/* User Photo */}
            <div className={cn(
              "w-24 h-24 rounded-3xl border-4 shadow-md overflow-hidden shrink-0 relative",
              state.isStarkTheme ? "bg-black border-green-500/50 rounded-none shadow-[0_0_15px_rgba(0,255,65,0.2)]" : "bg-gray-200",
              !state.isStarkTheme && state.profileBorder === "border_gold" ? "border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)]" :
              !state.isStarkTheme && state.profileBorder === "border_diamond" ? "border-[#b9f2ff] shadow-[0_0_15px_rgba(185,242,255,0.8)]" :
              !state.isStarkTheme ? "border-white" : ""
            )}>
               {userProfile.photo ? (
                 <img src={getPhotoUrl(userProfile.photo)!} alt="Profile" className={cn("w-full h-full object-cover", state.isStarkTheme && "opacity-80 grayscale contrast-150")} />
               ) : (
                 <div className={cn("w-full h-full flex items-center justify-center", state.isStarkTheme ? "bg-black" : "bg-gray-100")}>
                    <User className={cn("w-10 h-10", state.isStarkTheme ? "text-green-500/50" : "text-gray-400")} />
                 </div>
               )}
               <div className="absolute -bottom-2 -right-2 bg-transparent rounded-full p-1 shadow-sm">
                 <div className={cn("text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1", state.isStarkTheme ? "bg-black border border-green-500 text-green-400 rounded-none" : "bg-orange-500 text-white")}>
                   <Flame className={cn("w-3 h-3", state.isStarkTheme ? "text-green-400" : "fill-white")} /> {streak}
                 </div>
               </div>
            </div>
            
            {/* User Details */}
            <div>
              <h2 className={cn("font-black text-2xl leading-tight", state.isStarkTheme ? "text-green-400 tracking-widest" : "text-gray-800")}>{userProfile.name}</h2>
              <div className={cn("flex items-center gap-1 font-bold text-xs uppercase mt-1", state.isStarkTheme ? "text-green-500/70" : "text-gray-500")}>
                <Globe className="w-3 h-3" />
                {userProfile.citizenship}
              </div>
              <div className="flex gap-2 mt-2">
                 <span className={cn("px-2 py-1 text-[10px] font-black uppercase border", state.isStarkTheme ? "bg-green-900/20 text-green-400 border-green-500/30 rounded-none" : "bg-blue-100 text-blue-600 rounded-lg border-blue-200")}>
                    Lvl {Math.floor(totalTasks / 10) + 1}
                 </span>
                 <span className={cn("px-2 py-1 text-[10px] font-black uppercase border", state.isStarkTheme ? "bg-green-900/20 text-green-400 border-green-500/30 rounded-none" : "bg-purple-100 text-purple-600 rounded-lg border-purple-200")}>
                    {state.isStarkTheme ? `CLASS_${currentRank + 1}` : currentRankData.name}
                 </span>
              </div>
            </div>
          </div>

          {/* Rank Icon */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={cn("w-20 h-20 flex items-center justify-center text-4xl shadow-lg border-4 relative z-10", state.isStarkTheme ? "bg-black border-green-500/50 rounded-none" : cn("rounded-full border-white bg-white", currentRankData.bg))}
            >
              {state.isStarkTheme ? <Terminal className="w-8 h-8 text-green-500" /> : currentRankData.icon}
              <div className={cn("absolute -bottom-2 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider border-2", state.isStarkTheme ? "bg-black text-green-400 border-green-500 rounded-none" : "bg-black text-white rounded-full border-white")}>
                Rank {currentRank + 1}
              </div>
            </motion.div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative z-20 pt-4">
          <div className="flex justify-between items-end mb-1">
            <p className={cn("text-[10px] font-black uppercase tracking-wider", state.isStarkTheme ? "text-green-500/70" : "text-gray-400")}>{state.isStarkTheme ? "DATA.COLLECTED" : "Experience Points"}</p>
            <p className={cn("font-black text-sm", state.isStarkTheme ? "text-green-400" : "text-[#46178f]")}>{totalTasks} <span className={state.isStarkTheme ? "text-green-500/50" : "text-gray-300"}>/ {nextRankData ? nextRankData.threshold : "MAX"} {state.isStarkTheme ? "BYTES" : "XP"}</span></p>
          </div>
          
          <div className={cn("h-6 w-full overflow-hidden border-2 relative", state.isStarkTheme ? "bg-black border-green-500/30 rounded-none" : "bg-gray-100 rounded-full border-gray-200 shadow-inner")}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full relative overflow-hidden flex items-center justify-end pr-2", state.isStarkTheme ? "bg-green-500 rounded-none" : cn("rounded-full", currentRankData.bg.replace('bg-', 'bg-').replace('100', '500')))}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]" />
              <span className={cn("text-[9px] font-black drop-shadow-md", state.isStarkTheme ? "text-black" : "text-white")}>{Math.round(progress)}%</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Radar Chart */}
      <div className={cn(
        "relative overflow-hidden p-6",
        state.isStarkTheme 
          ? "bg-black/90 backdrop-blur-md rounded-none border border-green-500/30 shadow-[0_0_20px_rgba(0,255,65,0.1)] font-mono"
          : "bg-white rounded-[2.5rem] shadow-lg border-4 border-gray-100"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown className={cn("w-32 h-32", state.isStarkTheme ? "text-green-500" : "text-gray-900")} />
        </div>
        
        <h3 className={cn("font-black text-lg mb-4 flex items-center gap-2 relative z-10", state.isStarkTheme ? "text-green-400 tracking-widest uppercase" : "text-gray-800")}>
          <Zap className={cn("w-5 h-5", state.isStarkTheme ? "text-green-500 fill-green-500" : "text-yellow-500 fill-yellow-500")} /> 
          {state.isStarkTheme ? "SYSTEM.METRICS" : "Ability Scores"}
        </h3>

        <div className="h-64 w-full relative z-10 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
              <PolarGrid stroke={state.isStarkTheme ? "#22c55e40" : "#e5e7eb"} strokeWidth={2} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: state.isStarkTheme ? '#22c55e' : '#9ca3af', fontSize: 10, fontWeight: 900, fontFamily: state.isStarkTheme ? 'monospace' : 'inherit' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Stats"
                dataKey="A"
                stroke={state.isStarkTheme ? "#22c55e" : "#46178f"}
                strokeWidth={3}
                fill={state.isStarkTheme ? "#22c55e" : "#8b5cf6"}
                fillOpacity={0.5}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: state.isStarkTheme ? '0px' : '12px', 
                  border: state.isStarkTheme ? '1px solid #22c55e' : 'none', 
                  backgroundColor: state.isStarkTheme ? '#000' : '#fff',
                  boxShadow: state.isStarkTheme ? '0 0 10px rgba(34,197,94,0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ color: state.isStarkTheme ? '#22c55e' : '#46178f', fontWeight: 'bold', fontSize: '12px', fontFamily: state.isStarkTheme ? 'monospace' : 'inherit' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat Breakdown */}
        <div className="grid grid-cols-2 gap-3 mt-2 relative z-10">
           <div className={cn("p-3 flex items-center gap-3", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30 rounded-none" : "bg-red-50 rounded-2xl border border-red-100")}>
              <div className={cn("p-2", state.isStarkTheme ? "bg-black border border-green-500/50 text-green-500 rounded-none" : "bg-red-100 rounded-xl text-red-600")}><Sword className="w-4 h-4" /></div>
              <div>
                <p className={cn("text-[10px] font-bold uppercase", state.isStarkTheme ? "text-green-500/70" : "text-red-400")}>Strength</p>
                <p className={cn("font-black text-lg", state.isStarkTheme ? "text-green-400" : "text-red-700")}>{strength}</p>
              </div>
           </div>
           <div className={cn("p-3 flex items-center gap-3", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30 rounded-none" : "bg-blue-50 rounded-2xl border border-blue-100")}>
              <div className={cn("p-2", state.isStarkTheme ? "bg-black border border-green-500/50 text-green-500 rounded-none" : "bg-blue-100 rounded-xl text-blue-600")}><Brain className="w-4 h-4" /></div>
              <div>
                <p className={cn("text-[10px] font-bold uppercase", state.isStarkTheme ? "text-green-500/70" : "text-blue-400")}>Intellect</p>
                <p className={cn("font-black text-lg", state.isStarkTheme ? "text-green-400" : "text-blue-700")}>{intellect}</p>
              </div>
           </div>
           <div className={cn("p-3 flex items-center gap-3", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30 rounded-none" : "bg-green-50 rounded-2xl border border-green-100")}>
              <div className={cn("p-2", state.isStarkTheme ? "bg-black border border-green-500/50 text-green-500 rounded-none" : "bg-green-100 rounded-xl text-green-600")}><Shield className="w-4 h-4" /></div>
              <div>
                <p className={cn("text-[10px] font-bold uppercase", state.isStarkTheme ? "text-green-500/70" : "text-green-400")}>Vitality</p>
                <p className={cn("font-black text-lg", state.isStarkTheme ? "text-green-400" : "text-green-700")}>{vitality}</p>
              </div>
           </div>
           <div className={cn("p-3 flex items-center gap-3", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30 rounded-none" : "bg-orange-50 rounded-2xl border border-orange-100")}>
              <div className={cn("p-2", state.isStarkTheme ? "bg-black border border-green-500/50 text-green-500 rounded-none" : "bg-orange-100 rounded-xl text-orange-600")}><Zap className="w-4 h-4" /></div>
              <div>
                <p className={cn("text-[10px] font-bold uppercase", state.isStarkTheme ? "text-green-500/70" : "text-orange-400")}>Agility</p>
                <p className={cn("font-black text-lg", state.isStarkTheme ? "text-green-400" : "text-orange-700")}>{agility}</p>
              </div>
           </div>
            <div className={cn("p-4 flex items-center justify-between col-span-2", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30 rounded-none" : "bg-emerald-50 rounded-2xl border border-emerald-100")}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2", state.isStarkTheme ? "bg-black border border-green-500/50 text-green-500 rounded-none" : "bg-emerald-100 rounded-xl text-emerald-600")}><DollarSign className="w-5 h-5" /></div>
                <div>
                    <p className={cn("text-[10px] font-bold uppercase", state.isStarkTheme ? "text-green-500/70" : "text-emerald-400")}>Net Worth</p>
                    <p className={cn("font-black text-xl", state.isStarkTheme ? "text-green-400" : "text-emerald-700")}>{userProfile.currency} {totalWealth.toLocaleString()}</p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Statistics */}
      <div className={cn(
        "relative overflow-hidden p-6",
        state.isStarkTheme 
          ? "bg-black/90 backdrop-blur-md rounded-none border border-green-500/30 shadow-[0_0_20px_rgba(0,255,65,0.1)] font-mono"
          : "bg-white rounded-[2.5rem] shadow-lg border-4 border-gray-100"
      )}>
        <h3 className={cn("font-black text-lg mb-4 flex items-center gap-2 relative z-10", state.isStarkTheme ? "text-green-400 tracking-widest uppercase" : "text-gray-800")}>
          <Hash className={cn("w-5 h-5", state.isStarkTheme ? "text-green-500" : "text-blue-500")} /> 
          {state.isStarkTheme ? "SYSTEM.STATS.WEEKLY" : "Weekly Statistics"}
        </h3>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x mt-4 -mx-4 px-4">
          {thisWeekData.map(dayData => (
            <div 
              key={dayData.date.toString()} 
              className={cn(
                "min-w-[240px] p-5 rounded-2xl border-2 snap-center shrink-0 flex flex-col gap-3",
                state.isStarkTheme ? "bg-black border-green-500/30" : "bg-white border-gray-100 shadow-sm"
              )}
            >
              <h4 className={cn(
                "font-bold text-lg border-b pb-2",
                state.isStarkTheme ? "text-green-400 border-green-500/30 font-mono" : "text-gray-800 border-gray-100"
              )}>
                {format(dayData.date, 'EEEE, MMM d')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>Works done</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-green-400" : "text-gray-800")}>{dayData.works}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>General Hospital</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-green-400" : "text-gray-800")}>{dayData.hospital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>Reviewing</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-green-400" : "text-gray-800")}>{dayData.reviewing}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>Market district</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-green-400" : "text-gray-800")}>${dayData.market.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>Savings</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-green-500" : "text-green-600")}>${dayData.savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(state.isStarkTheme ? "text-green-600/70" : "text-gray-500")}>Expenses</span>
                  <span className={cn("font-bold", state.isStarkTheme ? "text-red-500" : "text-red-500")}>${dayData.expenses.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className={cn(
        "relative overflow-hidden p-6",
        state.isStarkTheme 
          ? "bg-black/90 backdrop-blur-md rounded-none border border-green-500/30 shadow-[0_0_20px_rgba(0,255,65,0.1)] font-mono"
          : "bg-white rounded-[2.5rem] shadow-lg border-4 border-gray-100"
      )}>
        <h3 className={cn("font-black text-lg mb-4 flex items-center gap-2 relative z-10", state.isStarkTheme ? "text-green-400 tracking-widest uppercase" : "text-gray-800")}>
          <Trophy className={cn("w-5 h-5", state.isStarkTheme ? "text-green-500" : "text-yellow-500")} /> 
          {state.isStarkTheme ? "ACHIEVEMENTS.LOG" : "Citizen Badges"}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {state.badges?.map((badge) => (
            <div key={badge.id} className={cn("p-3 flex flex-col items-center justify-center text-center gap-2", state.isStarkTheme ? "bg-green-900/20 border border-green-500/30" : "bg-yellow-50 rounded-2xl border border-yellow-100")}>
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <p className={cn("text-[10px] font-black uppercase leading-tight", state.isStarkTheme ? "text-green-400" : "text-yellow-800")}>{badge.name}</p>
                <p className={cn("text-[8px] font-bold mt-1", state.isStarkTheme ? "text-green-500/70" : "text-yellow-600/70")}>{badge.description}</p>
              </div>
            </div>
          ))}
          {(!state.badges || state.badges.length === 0) && (
            <div className="col-span-3 text-center py-4">
              <p className={cn("text-xs font-bold", state.isStarkTheme ? "text-green-500/50 uppercase tracking-widest" : "text-gray-400")}>No badges unlocked yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Data Button */}
      <div className="pt-4">
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className={cn(
            "w-full py-4 font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 active:translate-y-1",
            state.isStarkTheme 
              ? "bg-black text-green-500 border-2 border-green-500 rounded-none hover:bg-green-900/20 shadow-[0_0_15px_rgba(0,255,65,0.2)]" 
              : "bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 border-b-4 border-indigo-800 active:border-b-0"
          )}
        >
          <Database className="w-5 h-5" />
          {state.isStarkTheme ? "EXPORT.DATA()" : "Account Passport"}
        </button>
      </div>

      <DataTransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
      />
    </div>
  );
}
