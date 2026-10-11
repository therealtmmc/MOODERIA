import React, { useMemo, useState, useEffect } from 'react';
import { User, RoutineItem } from '../types';
import { FAMOUS_WISDOM, getFlameConfig, toRomanNumeral, t } from '../constants';
import { Sparkles, Building2, Flame, Clock, Calendar, CheckCircle2, Circle, ArrowRight, Zap, Target, Crown } from 'lucide-react';
import HomescreenWidgets from '../components/HomescreenWidgets';

interface HomeSectionProps {
  user: User;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
  onUpdate?: (updates: Partial<User>) => void;
  onNavigate?: (section: any) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ user, isDarkMode, language, onUpdate, onNavigate }) => {
  // Live ticking clock for countdown
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's date info
  const today = new Date();
  const todayDateStr = today.toISOString().slice(0, 10);
  const todayDayOfWeek = today.getDay(); // 0-6

  // Famous Quote of the Day
  const dailyWisdom = useMemo(() => {
    const todayStr = today.toDateString();
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) seed += todayStr.charCodeAt(i);
    return FAMOUS_WISDOM[seed % FAMOUS_WISDOM.length];
  }, [today]);

  // Flame Streak Configuration
  const flame = getFlameConfig(user.moodStreak || 0);

  // Next Upcoming Event for Countdown Banner
  const nextEvent = useMemo(() => {
    const upcoming = (user.schedule || [])
      .filter(item => {
        const itemTs = item.timestamp || new Date(`${item.date}T${item.time}`).getTime();
        return itemTs > nowTimestamp;
      })
      .sort((a, b) => {
        const tsA = a.timestamp || new Date(`${a.date}T${a.time}`).getTime();
        const tsB = b.timestamp || new Date(`${b.date}T${b.time}`).getTime();
        return tsA - tsB;
      });
    return upcoming[0] || null;
  }, [user.schedule, nowTimestamp]);

  const countdownText = useMemo(() => {
    if (!nextEvent) return null;
    const eventTs = nextEvent.timestamp || new Date(`${nextEvent.date}T${nextEvent.time}`).getTime();
    const diff = Math.max(0, eventTs - nowTimestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }, [nextEvent, nowTimestamp]);

  // Today's routines
  const todayRoutines = useMemo(() => {
    return (user.routines || [])
      .filter(r => r.days.includes(todayDayOfWeek))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [user.routines, todayDayOfWeek]);

  const completedTodayCount = useMemo(() => {
    return todayRoutines.filter(r => (r.completedDates || []).includes(todayDateStr)).length;
  }, [todayRoutines, todayDateStr]);

  const handleToggleTask = (routineId: string) => {
    if (!onUpdate) return;
    let nowDone = false;
    const updated = (user.routines || []).map(r => {
      if (r.id === routineId) {
        const isDone = (r.completedDates || []).includes(todayDateStr);
        const newDates = isDone 
          ? (r.completedDates || []).filter(d => d !== todayDateStr)
          : [...(r.completedDates || []), todayDateStr];
        nowDone = !isDone;
        return { ...r, completedDates: newDates };
      }
      return r;
    });

    const newTasksCount = (user.tasksFinishedCount || 0) + (nowDone ? 1 : -1);
    
    // Check if all routines completed
    const dayRoutines = updated.filter(r => r.days.includes(todayDayOfWeek));
    const allDone = dayRoutines.length > 0 && dayRoutines.every(r => (r.completedDates || []).includes(todayDateStr));
    let newStreak = user.moodStreak || 0;
    if (allDone && nowDone) {
      newStreak += 1;
    }

    onUpdate({
      routines: updated,
      tasksFinishedCount: Math.max(0, newTasksCount),
      moodStreak: newStreak,
      previousStreak: newStreak > 0 ? newStreak : user.previousStreak
    });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Welcome & Dynamic Flame Streak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t('welcome', language)}
          </h2>
           <p className="text-slate-600 dark:text-slate-300 font-black uppercase tracking-[0.2em] text-xs">
            {language === 'English' ? 'Home of the Vibrant Metropolis' : 'Tahanan ng Masiglang Lungsod'}
          </p>
        </div>

        {/* Top Badges: Roman Rank & Flame Streak */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-5 py-4 rounded-[2rem] shadow-xl flex items-center gap-2 border-b-8 border-amber-700">
            <Crown size={22} className="fill-slate-950" />
            <div>
              <p className="text-xl font-black leading-none">Rank {toRomanNumeral(user.petLevel || 1)}</p>
              <p className="text-[9px] font-black uppercase text-slate-900 mt-0.5">
                {(user.petLevel || 1) >= 100 ? 'Max Rank' : `Day ${user.moodStreak || 0}/10`}
              </p>
            </div>
          </div>

          <div 
            className={`px-5 py-4 rounded-[2rem] shadow-xl flex items-center gap-3 border-b-8 transition-all ${flame.color === '#eab308' ? 'text-slate-950 font-black' : 'text-white'}`}
            style={{ 
              backgroundColor: flame.color, 
              borderColor: flame.borderClass ? undefined : '#000',
              boxShadow: (user.moodStreak || 0) > 0 ? flame.glow : 'none'
            }}
          >
            <Flame size={24} className={(user.moodStreak || 0) > 0 ? 'animate-pulse' : 'opacity-60'} />
            <div>
              <p className="text-xl font-black leading-none">{user.moodStreak || 0}</p>
              <p className={`text-[9px] font-black uppercase ${flame.color === '#eab308' ? 'text-slate-900' : 'text-white/90'} mt-0.5`}>{t('streak', language)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CLEAN METROPOLIS GUIDE HERO BANNER */}
      <div className="p-8 md:p-12 rounded-[3.5rem] bg-gradient-to-br from-[#1e0842] via-[#2d0f5e] to-[#0f0521] text-white shadow-2xl relative overflow-hidden border-4 border-purple-500/20">
        {/* Subtle clean ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest text-purple-200 border border-white/10">
            <Sparkles size={12} />
            <span>MOODERIA METROPOLIS</span>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black italic leading-tight uppercase tracking-tighter">
            {language === 'English' 
              ? "The emotional metropolis where your consistency shapes the city."
              : "Ang lungsod kung saan ang iyong katatagan ang humuhubog sa paligid."}
          </h3>

          <p className="text-sm md:text-base font-bold text-white/90 leading-relaxed">
            {language === 'English'
              ? "Track your daily frequency, conquer your habits to elevate your guardian pet, and stay in rhythm with your slated calendar."
              : "Subaybayan ang iyong damdamin, tapusin ang mga gawain para palakasin ang iyong alaga, at manatiling nakaayon sa iskedyul."}
          </p>
        </div>
      </div>

      {/* DYNAMIC HOMESCREEN ADJUSTABLE WIDGETS (4x2 & 2x2) */}
      {onUpdate && (
        <HomescreenWidgets
          user={user}
          onUpdate={onUpdate}
          onNavigate={onNavigate}
          isDarkMode={isDarkMode}
          language={language}
        />
      )}

      {/* BIG COUNTDOWN HIGHLIGHT BANNER (If nearest event exists) */}
      {nextEvent && countdownText && (
        <div className="p-8 rounded-[3rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border-4 border-blue-400/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm mb-3">
                <Clock size={12} className="animate-spin" />
                <span>{t('upcomingEvent', language)}</span>
              </div>
              <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight">{nextEvent.title}</h4>
              <p className="text-xs font-bold text-white/90 mt-1">
                {nextEvent.date} @ {nextEvent.time} {nextEvent.description ? `• ${nextEvent.description}` : ''}
              </p>
            </div>

            <div className="text-left md:text-right bg-black/25 p-4 px-6 rounded-2xl backdrop-blur-md border border-white/20">
              <p className="text-[9px] font-black uppercase text-white/80 tracking-widest mb-1">{t('countdown', language)}</p>
              <p className="text-3xl md:text-4xl font-mono font-black tracking-tight text-amber-300 drop-shadow-md">
                {countdownText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S CURRENT ROUTINE TASK HIGHLIGHT */}
      <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'} border-4 border-black/5 shadow-xl space-y-5`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Target className="text-purple-500" size={28} />
            <div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter">
                {t('todayRoutine', language)}
              </h4>
              <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">
                {completedTodayCount} / {todayRoutines.length} {t('complete', language)}
              </p>
            </div>
          </div>

          {onNavigate && (
            <button 
              onClick={() => onNavigate('CityHall')} 
              title={t('schedule', language)}
              aria-label={t('schedule', language)}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
            >
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {todayRoutines.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 font-black italic uppercase py-6">
            {t('noRoutineToday', language)}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayRoutines.map(routine => {
              const isDone = (routine.completedDates || []).includes(todayDateStr);
              return (
                <div 
                  key={routine.id} 
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${isDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/5 dark:bg-white/5 border-black/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleTask(routine.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      ) : (
                        <Circle className="text-slate-400 dark:text-slate-500" size={24} />
                      )}
                    </button>
                    <div>
                      <p className={`font-black uppercase text-sm ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {routine.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Clock size={10} /> {routine.startTime} {routine.startPeriod}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${isDone ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CLOUD WISDOM BANNER (FAMOUS MOTIVATIONAL QUOTE) */}
      <div className={`p-8 md:p-10 rounded-[3rem] border-l-[16px] border-yellow-500 ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-900'} shadow-2xl relative group overflow-hidden`}>
        <Sparkles className="absolute top-6 right-6 text-yellow-500 opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-3">
          {t('wisdom', language)}
        </p>
        <p className="italic font-bold text-xl md:text-3xl leading-snug">
          "{dailyWisdom.quote}"
        </p>
        <p className="text-xs md:text-sm font-black uppercase tracking-wider text-amber-500 mt-3">
          — {dailyWisdom.author}
        </p>
      </div>
      
      {/* STATS TILES: MOOD LOGS, TASKS SLATED, TASKS FINISHED (REPLACING COINS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Mood Logs', val: (user.moodHistory || []).length, color: 'text-green-500' },
          { label: 'Events Slated', val: (user.schedule || []).length, color: 'text-blue-500' },
          { label: t('tasksFinished', language), val: user.tasksFinishedCount || 0, color: 'text-amber-500' }
        ].map(stat => (
          <div key={stat.label} className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'} border-4 border-black/5 shadow-xl`}>
             <p className={`text-4xl font-black italic ${stat.color}`}>{stat.val}</p>
             <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 mt-2 tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
