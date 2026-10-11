import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, RoutineItem, ScheduleItem, BudgetGoal } from '../types';
import { Clock, Calendar, CheckCircle2, Circle, Flame, Crown, PiggyBank, Target, Pin, ArrowRight, Sparkles, ChevronDown, Plus } from 'lucide-react';
import { toRomanNumeral, getFlameConfig, t } from '../constants';

interface HomescreenWidgetsProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  onNavigate?: (section: any) => void;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
}

type WidgetSize = '4x2' | '2x2';

export const HomescreenWidgets: React.FC<HomescreenWidgetsProps> = ({
  user,
  onUpdate,
  onNavigate,
  isDarkMode,
  language
}) => {
  // Live ticking timer for widgets countdown
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const todayDateStr = today.toISOString().slice(0, 10);
  const todayDayOfWeek = today.getDay(); // 0-6

  // Widget Size state with fallback to user preferences
  const widgetSizes = user.widgetSizes || {};
  const countdownSize: WidgetSize = widgetSizes.countdown || '4x2';
  const taskSize: WidgetSize = widgetSizes.task || '4x2';
  const moodPetSize: WidgetSize = widgetSizes.moodPet || '4x2';
  const budgetSize: WidgetSize = widgetSizes.budget || '4x2';

  const setWidgetSize = (widgetKey: 'countdown' | 'task' | 'moodPet' | 'budget', size: WidgetSize) => {
    onUpdate({
      widgetSizes: {
        ...(user.widgetSizes || {}),
        [widgetKey]: size
      }
    });
  };

  // 1. Next upcoming event for Event Countdown
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
      return `${days}d ${hours % 24}h ${minutes}m ${seconds}s`;
    }
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }, [nextEvent, nowTimestamp]);

  // 2. Today's routine tasks
  const todayRoutines = useMemo(() => {
    return (user.routines || [])
      .filter(r => r.days.includes(todayDayOfWeek))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [user.routines, todayDayOfWeek]);

  // Find the active / next pending routine task for today
  const currentTask = useMemo(() => {
    if (todayRoutines.length === 0) return null;
    const pending = todayRoutines.find(r => !(r.completedDates || []).includes(todayDateStr));
    return pending || todayRoutines[0];
  }, [todayRoutines, todayDateStr]);

  const handleToggleTask = (routineId: string) => {
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
    onUpdate({
      routines: updated,
      tasksFinishedCount: Math.max(0, newTasksCount)
    });
  };

  // 3. Mood Pet configuration
  const flame = getFlameConfig(user.moodStreak || 0);
  const currentRank = user.petLevel || 1;
  const currentRankRoman = toRomanNumeral(currentRank);

  // 4. Budget Goal for Homescreen Widget
  const pinnedGoal = useMemo(() => {
    const goals = user.budgetGoals || [];
    if (goals.length === 0) return null;
    if (user.pinnedBudgetGoalId) {
      const found = goals.find(g => g.id === user.pinnedBudgetGoalId);
      if (found) return found;
    }
    return goals[0];
  }, [user.budgetGoals, user.pinnedBudgetGoalId]);

  const goalPercentage = useMemo(() => {
    if (!pinnedGoal) return 0;
    const target = pinnedGoal.targetAmount || 1;
    const current = pinnedGoal.currentAmount || 0;
    return Math.min(100, Math.round((current / target) * 100));
  }, [pinnedGoal]);

  const [showGoalPicker, setShowGoalPicker] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* ========================================================
            WIDGET 1: EVENT COUNTDOWN
           ======================================================== */}
        <div className={`transition-all duration-300 ${countdownSize === '4x2' ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
          <div className={`h-full p-6 md:p-8 rounded-[3rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border-4 border-blue-400/30 flex flex-col justify-between relative overflow-hidden group`}>
            
            {/* Header: Widget Title */}
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                <Clock size={12} className="animate-spin" />
                <span>{language === 'English' ? 'Event Countdown' : 'Kaganapan'}</span>
              </div>
            </div>

            {/* Widget Content */}
            {nextEvent && countdownText ? (
              countdownSize === '4x2' ? (
                // 4x2 Wide Layout
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight">
                      {nextEvent.title}
                    </h4>
                    <p className="text-xs font-bold opacity-80 mt-1">
                      {nextEvent.date} @ {nextEvent.time} {nextEvent.description ? `• ${nextEvent.description}` : ''}
                    </p>
                  </div>

                  <div className="text-left md:text-right bg-black/30 p-4 px-6 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">
                      {t('countdown', language)}
                    </p>
                    <p className="text-3xl md:text-4xl font-mono font-black tracking-tight text-amber-300 drop-shadow-md">
                      {countdownText}
                    </p>
                  </div>
                </div>
              ) : (
                // 2x2 Compact Square Layout
                <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center">
                  <h4 className="text-xl font-black italic uppercase tracking-tight line-clamp-1">
                    {nextEvent.title}
                  </h4>
                  <div className="bg-black/30 p-3.5 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-0.5">
                      {t('countdown', language)}
                    </p>
                    <p className="text-2xl font-mono font-black tracking-tight text-amber-300">
                      {countdownText}
                    </p>
                  </div>
                  <p className="text-[10px] font-bold opacity-70 text-center">
                    {nextEvent.date} @ {nextEvent.time}
                  </p>
                </div>
              )
            ) : (
              <div className="py-6 text-center opacity-40 font-black uppercase text-xs">
                {t('noEventsSoon', language)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            WIDGET 2: TASK THIS DAY (Current Task & Timestamp)
           ======================================================== */}
        <div className={`transition-all duration-300 ${taskSize === '4x2' ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
          <div className={`h-full p-6 md:p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl flex flex-col justify-between relative`}>
            
            {/* Header: Title */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-purple-500" size={20} />
                <h4 className="font-black uppercase italic tracking-tighter text-base">
                  {language === 'English' ? 'Task You Have This Day' : 'Gawain Ngayong Araw'}
                </h4>
              </div>
            </div>

            {/* Task Content */}
            {currentTask ? (() => {
              const isDone = (currentTask.completedDates || []).includes(todayDateStr);
              return taskSize === '4x2' ? (
                // 4x2 Wide Layout
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleTask(currentTask.id)}
                      className="hover:scale-110 active:scale-95 transition-transform"
                    >
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-500" size={32} />
                      ) : (
                        <Circle className="opacity-30" size={32} />
                      )}
                    </button>
                    <div>
                      <p className={`font-black uppercase text-lg ${isDone ? 'line-through opacity-50' : ''}`}>
                        {currentTask.title}
                      </p>
                      <p className="text-xs font-mono font-bold opacity-60 flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} className="text-purple-500" />
                        <span>Timestamp: {currentTask.startTime} {currentTask.startPeriod}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl ${isDone ? 'bg-emerald-500/10 text-emerald-600' : 'bg-purple-500/10 text-purple-600'}`}>
                      {isDone ? 'Finished' : 'Current Task'}
                    </span>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('CityHall')}
                        className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-purple-600 hover:text-white transition-all"
                        title="View Routine"
                      >
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // 2x2 Compact Square Layout
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(currentTask.id)}
                      className="hover:scale-110 active:scale-95 transition-transform shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-500" size={28} />
                      ) : (
                        <Circle className="opacity-30" size={28} />
                      )}
                    </button>
                    <p className={`font-black uppercase text-sm line-clamp-2 ${isDone ? 'line-through opacity-50' : ''}`}>
                      {currentTask.title}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase opacity-40">Timestamp</span>
                    <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                      {currentTask.startTime} {currentTask.startPeriod}
                    </span>
                  </div>
                </div>
              );
            })() : (
              <div className="py-6 text-center opacity-40 font-black uppercase text-xs">
                {t('noRoutineToday', language)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            WIDGET 3: MOOD PET (Streak & Roman Numeral Rank)
           ======================================================== */}
        <div className={`transition-all duration-300 ${moodPetSize === '4x2' ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
          <div className={`h-full p-6 md:p-8 rounded-[3rem] bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 text-slate-950 shadow-2xl border-4 border-amber-300/40 flex flex-col justify-between relative overflow-hidden`}>
            
            {/* Header: Title */}
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                <Crown size={12} className="fill-white" />
                <span>{language === 'English' ? 'Guardian Mood Pet' : 'Tagapag-alaga'}</span>
              </div>
            </div>

            {/* Content */}
            {moodPetSize === '4x2' ? (
              // 4x2 Wide Layout
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-950/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
                    {user.petEmoji || '🐱'}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tight leading-tight">
                      {user.petName || 'Mood Guardian'}
                    </h4>
                    <p className="text-xs font-black uppercase tracking-wider opacity-80 mt-0.5">
                      {currentRank >= 100 ? 'Apex Ascendant' : `Streak Day ${user.moodStreak || 0}/10 to Rank-Up`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Roman Numeral Rank Card */}
                  <div className="bg-slate-950 text-amber-300 px-5 py-3 rounded-2xl shadow-xl text-center border-2 border-amber-400/40">
                    <p className="text-[9px] font-black uppercase opacity-60">Roman Rank</p>
                    <p className="text-2xl font-black font-mono leading-tight">Rank {currentRankRoman}</p>
                  </div>

                  {/* Flame Streak */}
                  <div className="bg-black/25 text-white px-5 py-3 rounded-2xl shadow-md text-center border border-white/20">
                    <p className="text-[9px] font-black uppercase opacity-70">Flame Streak</p>
                    <p className="text-2xl font-black font-mono leading-tight flex items-center justify-center gap-1 text-white">
                      <Flame size={18} className="fill-amber-300 text-amber-300" />
                      <span>{user.moodStreak || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // 2x2 Compact Square Layout
              <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center text-center">
                <div className="text-4xl mb-1">{user.petEmoji || '🐱'}</div>
                <div className="bg-slate-950 text-amber-300 py-2.5 px-3 rounded-2xl shadow-md">
                  <p className="text-[8px] font-black uppercase opacity-60">Rank</p>
                  <p className="text-xl font-black font-mono">Rank {currentRankRoman}</p>
                </div>
                <div className="flex items-center justify-center gap-1 font-mono font-black text-sm">
                  <Flame size={16} className="fill-slate-950" />
                  <span>Streak: {user.moodStreak || 0}d</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            WIDGET 4: BUDGET GOAL (Pinned Goal & Percentage)
           ======================================================== */}
        <div className={`transition-all duration-300 ${budgetSize === '4x2' ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
          <div className={`h-full p-6 md:p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-emerald-500/30 shadow-xl flex flex-col justify-between relative`}>
            
            {/* Header: Title and Pin Goal Selector */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="text-emerald-500" size={20} />
                <h4 className="font-black uppercase italic tracking-tighter text-base">
                  {language === 'English' ? 'Budget Pinned Goal' : 'Naka-pin na Badyet'}
                </h4>
              </div>

              {/* Pin Goal Selector */}
              {(user.budgetGoals || []).length > 1 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowGoalPicker(!showGoalPicker)}
                    className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/10 text-[10px] font-black uppercase flex items-center gap-1 hover:bg-black/10"
                  >
                    <span>Switch</span>
                    <ChevronDown size={12} />
                  </button>
                  {showGoalPicker && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-white/10 shadow-2xl p-2 z-50 space-y-1">
                      {(user.budgetGoals || []).map(g => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            onUpdate({ pinnedBudgetGoalId: g.id });
                            setShowGoalPicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-between ${pinnedGoal?.id === g.id ? 'bg-emerald-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          <span className="truncate">{g.name}</span>
                          <Pin size={10} className={pinnedGoal?.id === g.id ? 'fill-current' : 'opacity-30'} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Budget Content */}
            {pinnedGoal ? (
              budgetSize === '4x2' ? (
                // 4x2 Wide Layout
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        <Pin size={12} className="fill-current rotate-45" />
                        <span>Pinned Homescreen Goal</span>
                      </div>
                      <h4 className="text-2xl font-black uppercase italic tracking-tight">
                        {pinnedGoal.name}
                      </h4>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {goalPercentage}%
                      </p>
                      <p className="text-[10px] font-mono font-bold opacity-50">
                        {pinnedGoal.currentAmount || 0} / {pinnedGoal.targetAmount || 1}
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-5 w-full rounded-full bg-black/5 dark:bg-white/10 p-1 relative overflow-hidden border border-emerald-500/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goalPercentage}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase opacity-50">
                      <span>Target: {pinnedGoal.targetDate}</span>
                      <span>{Math.max(0, (pinnedGoal.targetAmount || 0) - (pinnedGoal.currentAmount || 0))} left before full</span>
                    </div>
                  </div>
                </div>
              ) : (
                // 2x2 Compact Square Layout
                <div className="space-y-3 flex-1 flex flex-col justify-center text-center">
                  <div className="inline-flex items-center justify-center gap-1 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 mx-auto">
                    <Pin size={10} className="fill-current rotate-45" />
                    <span className="truncate max-w-[110px]">{pinnedGoal.name}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[9px] font-black uppercase opacity-60">Progress</p>
                    <p className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {goalPercentage}%
                    </p>
                    <p className="text-[9px] font-mono opacity-60 mt-0.5">
                      {pinnedGoal.currentAmount || 0} / {pinnedGoal.targetAmount || 1}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="py-6 text-center opacity-40 font-black uppercase text-xs">
                No budget goals set yet. Go to City Hall to create one.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomescreenWidgets;
