import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ScheduleItem, RoutineItem, DiaryEntry, Mood, BudgetGoal, BudgetDeposit } from '../types';
import { Clock, X, Calendar, Plus, Trash2, Repeat, BrainCircuit, Book, Edit3, ChevronLeft, ChevronRight, CheckCircle2, Circle, AlertCircle, Quote, Coins, PiggyBank, Pin, Check, RotateCcw, ArrowDownToLine, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FAMOUS_WISDOM, t } from '../constants';

interface CityHallSectionProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
  onReward: () => void;
  triggerAnimation: (type: 'express' | 'schedule' | 'routine' | 'diary' | 'alarm', text?: string) => void;
}

const ROUTINE_COLORS = [
  { name: 'Indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { name: 'Emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500', light: 'bg-amber-50 dark:bg-amber-950/40' },
  { name: 'Rose', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-500', light: 'bg-rose-50 dark:bg-rose-950/40' },
  { name: 'Cyan', bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-500', light: 'bg-cyan-50 dark:bg-cyan-950/40' },
  { name: 'Purple', bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-500', light: 'bg-purple-50 dark:bg-purple-950/40' }
];

const DAYS_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CityHallSection: React.FC<CityHallSectionProps> = ({ user, onUpdate, isDarkMode, language, onReward, triggerAnimation }) => {
  const [subTab, setSubTab] = useState<'Schedule' | 'Routine' | 'Budget' | 'Wisdom'>('Schedule');

  // --- Live Clock for Countdown ---
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Budget Goal States ---
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalName, setGoalName] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });

  // Insert Money States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  // Selected Goal to Maximize
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // --- Schedule States ---
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormDate, setEventFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventFormTime, setEventFormTime] = useState('09:00');
  const [eventFormDesc, setEventFormDesc] = useState('');

  // --- Routine Timeline States ---
  // Offset in days from today (0 = today, -1 = yesterday, +1 = tomorrow)
  const [routineDayOffset, setRoutineDayOffset] = useState<number>(0);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [routineFormTitle, setRoutineFormTitle] = useState('');
  const [routineFormTime, setRoutineFormTime] = useState('08:00');
  const [routineFormDays, setRoutineFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [routineFormColor, setRoutineFormColor] = useState('Indigo');
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // Compute selected routine date object
  const currentRoutineDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + routineDayOffset);
    return d;
  }, [routineDayOffset]);

  const routineDateString = currentRoutineDate.toISOString().slice(0, 10); // YYYY-MM-DD
  const routineDayOfWeek = currentRoutineDate.getDay(); // 0-6

  // Nearest Upcoming Event for Countdown Banner
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

  // Countdown timer string
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

  // Calendar dates generation
  const weekDates = useMemo(() => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay(); // Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.setDate(first + i));
      days.push({
        dateStr: d.toISOString().slice(0, 10),
        dayNum: d.getDate(),
        dayShort: DAYS_SHORT[i],
        isToday: d.toDateString() === new Date().toDateString()
      });
    }
    return days;
  }, []);

  const monthDates = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        dateStr: d.toISOString().slice(0, 10),
        dayNum: i,
        dayShort: DAYS_SHORT[d.getDay()],
        isToday: d.toDateString() === new Date().toDateString()
      });
    }
    return days;
  }, []);

  // --- Save / Edit Event Handler ---
  const handleSaveEvent = () => {
    if (!eventFormTitle.trim() || !eventFormDate || !eventFormTime) return;
    const ts = new Date(`${eventFormDate}T${eventFormTime}`).getTime();
    const period: 'AM' | 'PM' = parseInt(eventFormTime.split(':')[0], 10) >= 12 ? 'PM' : 'AM';

    if (editingEventId) {
      const updated = (user.schedule || []).map(item => {
        if (item.id === editingEventId) {
          return {
            ...item,
            title: eventFormTitle.trim(),
            date: eventFormDate,
            time: eventFormTime,
            period,
            timestamp: ts,
            description: eventFormDesc.trim()
          };
        }
        return item;
      });
      onUpdate({ schedule: updated.sort((a, b) => a.timestamp - b.timestamp) });
    } else {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        title: eventFormTitle.trim(),
        date: eventFormDate,
        time: eventFormTime,
        period,
        timestamp: ts,
        alerted: false,
        description: eventFormDesc.trim()
      };
      onUpdate({ schedule: [...(user.schedule || []), newItem].sort((a, b) => a.timestamp - b.timestamp) });
    }

    setIsEventModalOpen(false);
    setEditingEventId(null);
    setEventFormTitle('');
    setEventFormDesc('');
    triggerAnimation('schedule', 'Event Slated');
  };

  const handleEditEventClick = (event: ScheduleItem) => {
    setEditingEventId(event.id);
    setEventFormTitle(event.title);
    setEventFormDate(event.date);
    setEventFormTime(event.time);
    setEventFormDesc(event.description || '');
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    onUpdate({ schedule: (user.schedule || []).filter(item => item.id !== id) });
  };

  // --- Routine Timeline Handlers ---
  const handleSaveRoutine = () => {
    if (!routineFormTitle.trim() || !routineFormTime || routineFormDays.length === 0) return;
    const period: 'AM' | 'PM' = parseInt(routineFormTime.split(':')[0], 10) >= 12 ? 'PM' : 'AM';

    if (editingRoutineId) {
      const updated = (user.routines || []).map(r => {
        if (r.id === editingRoutineId) {
          return {
            ...r,
            title: routineFormTitle.trim(),
            startTime: routineFormTime,
            startPeriod: period,
            days: routineFormDays,
            color: routineFormColor
          };
        }
        return r;
      });
      onUpdate({ routines: updated });
    } else {
      const newRoutine: RoutineItem = {
        id: Date.now().toString(),
        title: routineFormTitle.trim(),
        icon: '⭐',
        days: routineFormDays,
        startTime: routineFormTime,
        startPeriod: period,
        completedDates: [],
        color: routineFormColor
      };
      onUpdate({ routines: [...(user.routines || []), newRoutine] });
    }

    setIsRoutineModalOpen(false);
    setEditingRoutineId(null);
    setRoutineFormTitle('');
    triggerAnimation('routine', 'Routine Updated');
  };

  const handleEditRoutineClick = (routine: RoutineItem) => {
    setEditingRoutineId(routine.id);
    setRoutineFormTitle(routine.title);
    setRoutineFormTime(routine.startTime);
    setRoutineFormDays(routine.days);
    setRoutineFormColor(routine.color || 'Indigo');
    setIsRoutineModalOpen(true);
  };

  const handleDeleteRoutine = (id: string) => {
    onUpdate({ routines: (user.routines || []).filter(r => r.id !== id) });
  };

  // Toggle routine task complete/incomplete for the selected day
  const handleToggleRoutineCompleted = (routineId: string) => {
    let nowDone = false;
    const updatedRoutines = (user.routines || []).map(r => {
      if (r.id === routineId) {
        const isDone = (r.completedDates || []).includes(routineDateString);
        const newDates = isDone
          ? (r.completedDates || []).filter(d => d !== routineDateString)
          : [...(r.completedDates || []), routineDateString];
        nowDone = !isDone;
        return { ...r, completedDates: newDates };
      }
      return r;
    });

    const newTasksCount = (user.tasksFinishedCount || 0) + (nowDone ? 1 : -1);

    // Check if ALL routines for this day are finished!
    const todayRoutines = updatedRoutines.filter(r => r.days.includes(routineDayOfWeek));
    const allFinished = todayRoutines.length > 0 && todayRoutines.every(r => (r.completedDates || []).includes(routineDateString));

    let newStreak = user.moodStreak || 0;
    if (allFinished && nowDone) {
      newStreak += 1;
      setCelebrationBanner(t('allTasksCompleted', language));
      setTimeout(() => setCelebrationBanner(null), 3500);
    }

    onUpdate({
      routines: updatedRoutines,
      tasksFinishedCount: Math.max(0, newTasksCount),
      moodStreak: newStreak,
      previousStreak: newStreak > 0 ? newStreak : user.previousStreak
    });
  };

  // --- Budget Handlers ---
  const handleSaveGoal = () => {
    if (!goalName.trim() || !goalTargetAmount || !goalTargetDate) return;
    const targetNum = Math.max(1, parseFloat(goalTargetAmount) || 100);

    if (editingGoalId) {
      const updated = (user.budgetGoals || []).map(g => {
        if (g.id === editingGoalId) {
          return {
            ...g,
            name: goalName.trim(),
            targetAmount: targetNum,
            targetDate: goalTargetDate
          };
        }
        return g;
      });
      onUpdate({ budgetGoals: updated });
    } else {
      const newGoal: BudgetGoal = {
        id: Date.now().toString(),
        name: goalName.trim(),
        targetAmount: targetNum,
        currentAmount: 0,
        targetDate: goalTargetDate,
        createdAt: Date.now(),
        deposits: []
      };
      const goals = [...(user.budgetGoals || []), newGoal];
      onUpdate({ 
        budgetGoals: goals,
        pinnedBudgetGoalId: user.pinnedBudgetGoalId || newGoal.id
      });
      setSelectedGoalId(newGoal.id);
    }

    setIsGoalModalOpen(false);
    setEditingGoalId(null);
    setGoalName('');
    setGoalTargetAmount('');
    triggerAnimation('routine', 'Goal Saved');
  };

  const handleEditGoalClick = (goal: BudgetGoal) => {
    setEditingGoalId(goal.id);
    setGoalName(goal.name);
    setGoalTargetAmount(goal.targetAmount.toString());
    setGoalTargetDate(goal.targetDate);
    setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = (user.budgetGoals || []).filter(g => g.id !== goalId);
    onUpdate({ 
      budgetGoals: updated,
      pinnedBudgetGoalId: user.pinnedBudgetGoalId === goalId ? (updated[0]?.id || undefined) : user.pinnedBudgetGoalId
    });
    if (selectedGoalId === goalId) {
      setSelectedGoalId(updated[0]?.id || null);
    }
  };

  const handleOpenDepositModal = (goalId: string) => {
    setDepositGoalId(goalId);
    setDepositAmount('');
    setDepositNote('');
    setIsDepositModalOpen(true);
  };

  const handleInsertMoney = () => {
    if (!depositGoalId || !depositAmount) return;
    const addAmt = parseFloat(depositAmount);
    if (isNaN(addAmt) || addAmt <= 0) return;

    const newDeposit: BudgetDeposit = {
      id: Date.now().toString(),
      amount: addAmt,
      timestamp: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      note: depositNote.trim() || undefined
    };

    const updated = (user.budgetGoals || []).map(g => {
      if (g.id === depositGoalId) {
        return {
          ...g,
          currentAmount: Math.round(((g.currentAmount || 0) + addAmt) * 100) / 100,
          deposits: [newDeposit, ...(g.deposits || [])]
        };
      }
      return g;
    });

    onUpdate({ budgetGoals: updated });
    setIsDepositModalOpen(false);
    setDepositGoalId(null);
    setDepositAmount('');
    setDepositNote('');
    onReward();
    triggerAnimation('schedule', `+${addAmt} Deposited`);
  };

  const handleTogglePinGoal = (goalId: string) => {
    const newPinned = user.pinnedBudgetGoalId === goalId ? undefined : goalId;
    onUpdate({ pinnedBudgetGoalId: newPinned });
  };

  // Filtered routines for current selected day
  const selectedDayRoutines = useMemo(() => {
    return (user.routines || [])
      .filter(r => r.days.includes(routineDayOfWeek))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [user.routines, routineDayOfWeek]);

  // Filtered events for selected calendar date (or all if none selected)
  const filteredEvents = useMemo(() => {
    return (user.schedule || []).filter(item => item.date === selectedCalendarDate);
  }, [user.schedule, selectedCalendarDate]);

  // Currently active budget goal to maximize
  const activeBudgetGoal = useMemo(() => {
    const goals = user.budgetGoals || [];
    if (goals.length === 0) return null;
    if (selectedGoalId) {
      const found = goals.find(g => g.id === selectedGoalId);
      if (found) return found;
    }
    if (user.pinnedBudgetGoalId) {
      const pinned = goals.find(g => g.id === user.pinnedBudgetGoalId);
      if (pinned) return pinned;
    }
    return goals[0];
  }, [user.budgetGoals, selectedGoalId, user.pinnedBudgetGoalId]);

  // Weekly data for active goal
  const weeklyDepositData = useMemo(() => {
    if (!activeBudgetGoal || !activeBudgetGoal.deposits || activeBudgetGoal.deposits.length === 0) {
      return [
        { week: 'W1', amount: 0 },
        { week: 'W2', amount: 0 },
        { week: 'W3', amount: 0 },
        { week: 'W4', amount: 0 }
      ];
    }
    
    // Group deposits by relative week or date
    const deposits = activeBudgetGoal.deposits;
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const weeks: { week: string; amount: number }[] = [
      { week: 'W-3', amount: 0 },
      { week: 'W-2', amount: 0 },
      { week: 'W-1', amount: 0 },
      { week: 'This Wk', amount: 0 }
    ];

    deposits.forEach(d => {
      const age = now - d.timestamp;
      if (age < oneWeekMs) {
        weeks[3].amount += d.amount;
      } else if (age < 2 * oneWeekMs) {
        weeks[2].amount += d.amount;
      } else if (age < 3 * oneWeekMs) {
        weeks[1].amount += d.amount;
      } else if (age < 4 * oneWeekMs) {
        weeks[0].amount += d.amount;
      }
    });

    return weeks;
  }, [activeBudgetGoal]);

  return (
    <div className="flex flex-col h-full space-y-6 pb-20">
      {/* Top Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
        {(['Schedule', 'Routine', 'Budget', 'Wisdom'] as const).map(tabName => (
          <button 
            key={tabName} 
            onClick={() => setSubTab(tabName)} 
            className={`px-6 py-3 rounded-full font-black text-xs uppercase transition-all whitespace-nowrap border-b-4 ${subTab === tabName ? 'bg-indigo-600 text-white shadow-lg translate-y-[-2px]' : isDarkMode ? 'bg-white/5 border-black text-white/40' : 'bg-white border-gray-100 text-slate-500 shadow-sm'}`}
          >
            {tabName === 'Schedule' ? t('schedule', language) : tabName === 'Routine' ? t('routine', language) : tabName === 'Budget' ? t('budgetTab', language) : t('wisdom', language)}
          </button>
        ))}
      </div>

      {/* Celebration Notification */}
      <AnimatePresence>
        {celebrationBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm uppercase text-center shadow-2xl flex items-center justify-center gap-3"
          >
            <CheckCircle2 size={24} />
            <span>{celebrationBanner}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1">
        <AnimatePresence mode="wait">

          {/* ========================================================
              SCHEDULE TAB (Calendar Week/Month + Countdown + CRUD)
             ======================================================== */}
          {subTab === 'Schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              {/* BIG COUNTDOWN BANNER */}
              {nextEvent && countdownText ? (
                <div className="p-8 rounded-[3rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border-4 border-blue-400/30 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm mb-3">
                        <Clock size={12} className="animate-spin" />
                        <span>{t('countdown', language)}</span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight">{nextEvent.title}</h4>
                      <p className="text-xs font-bold opacity-80 mt-1">
                        {nextEvent.date} @ {nextEvent.time} {nextEvent.description ? `• ${nextEvent.description}` : ''}
                      </p>
                    </div>

                    <div className="text-left md:text-right bg-black/20 p-4 px-6 rounded-2xl backdrop-blur-md border border-white/20">
                      <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">{t('eventNear', language)}</p>
                      <p className="text-3xl md:text-4xl font-mono font-black tracking-tight text-amber-300 drop-shadow-md">
                        {countdownText}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[2.5rem] bg-indigo-50 dark:bg-white/5 border-2 border-indigo-200 dark:border-white/10 text-center">
                  <p className="text-xs font-black uppercase opacity-50 tracking-wider">{t('noEventsSoon', language)}</p>
                </div>
              )}

              {/* CALENDAR VIEW TOGGLE & ACTIONS */}
              <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl space-y-6`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                      <Calendar className="text-blue-500" /> {t('schedule', language)}
                    </h3>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">
                      {selectedCalendarDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Week / Month Toggle */}
                    <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-2xl">
                      <button
                        onClick={() => setCalendarView('week')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${calendarView === 'week' ? 'bg-blue-600 text-white shadow-md' : 'opacity-50'}`}
                      >
                        {t('viewWeek', language)}
                      </button>
                      <button
                        onClick={() => setCalendarView('month')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${calendarView === 'month' ? 'bg-blue-600 text-white shadow-md' : 'opacity-50'}`}
                      >
                        {t('viewMonth', language)}
                      </button>
                    </div>

                    {/* Add Event Button (Icon Only) */}
                    <button
                      onClick={() => {
                        setEditingEventId(null);
                        setEventFormTitle('');
                        setEventFormDate(selectedCalendarDate || new Date().toISOString().slice(0, 10));
                        setEventFormTime('09:00');
                        setEventFormDesc('');
                        setIsEventModalOpen(true);
                      }}
                      title={t('addEvent', language)}
                      className="kahoot-button-blue p-3 rounded-2xl text-white shadow-lg flex items-center justify-center ml-auto"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Calendar Days Ribbon / Grid */}
                {calendarView === 'week' ? (
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map(d => {
                      const isSelected = d.dateStr === selectedCalendarDate;
                      const hasEvents = (user.schedule || []).some(s => s.date === d.dateStr);
                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => setSelectedCalendarDate(d.dateStr)}
                          className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : d.isToday ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-80'}`}
                        >
                          <span className="text-[9px] font-black uppercase">{d.dayShort}</span>
                          <span className="text-base font-black">{d.dayNum}</span>
                          {hasEvents && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1.5 max-h-64 overflow-y-auto p-1">
                    {monthDates.map(d => {
                      const isSelected = d.dateStr === selectedCalendarDate;
                      const hasEvents = (user.schedule || []).some(s => s.date === d.dateStr);
                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => setSelectedCalendarDate(d.dateStr)}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md' : d.isToday ? 'border-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-80'}`}
                        >
                          <span className="text-[8px] font-black uppercase opacity-60">{d.dayShort}</span>
                          <span className="text-xs font-black">{d.dayNum}</span>
                          {hasEvents && <div className="w-1 h-1 bg-amber-400 rounded-full mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Event List for Selected Date */}
                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
                  <div className="flex justify-between items-center">
                    <h5 className="font-black text-xs uppercase tracking-widest opacity-60">
                      Events on {selectedCalendarDate} ({filteredEvents.length})
                    </h5>
                    <button 
                      onClick={() => setSelectedCalendarDate('')}
                      title="Show All Events"
                      aria-label="Show All Events"
                      className={`p-1.5 rounded-lg bg-blue-50 dark:bg-white/10 text-blue-600 hover:bg-blue-100 transition-all ${!selectedCalendarDate ? 'hidden' : ''}`}
                    >
                      <Repeat size={14} />
                    </button>
                  </div>

                  {(selectedCalendarDate ? filteredEvents : (user.schedule || [])).length === 0 ? (
                    <div className="py-12 text-center opacity-30 font-black italic uppercase">
                      No events scheduled for this day.
                    </div>
                  ) : (
                    (selectedCalendarDate ? filteredEvents : (user.schedule || [])).map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border-2 border-black/5 shadow-sm group hover:border-blue-500 transition-all"
                      >
                        <div className="space-y-1">
                          <h4 className="font-black uppercase text-base">{item.title}</h4>
                          {item.description && <p className="text-xs font-bold opacity-70">{item.description}</p>}
                          <div className="flex items-center gap-3 text-[10px] font-bold opacity-50">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {item.time} ({item.period})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditEventClick(item)}
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                            title="Edit Event"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(item.id)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Event Modal (Add / Edit) */}
              {isEventModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative`}>
                    <button onClick={() => setIsEventModalOpen(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100"><X size={28}/></button>
                    <h3 className="text-2xl font-black uppercase italic mb-6">
                      {editingEventId ? t('editEvent', language) : t('addEvent', language)}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Event Title</label>
                        <input 
                          value={eventFormTitle} 
                          onChange={e => setEventFormTitle(e.target.value)} 
                          placeholder="e.g. Project Presentation" 
                          className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-blue-500" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Date</label>
                          <input 
                            type="date" 
                            value={eventFormDate} 
                            onChange={e => setEventFormDate(e.target.value)} 
                            className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Time</label>
                          <input 
                            type="time" 
                            value={eventFormTime} 
                            onChange={e => setEventFormTime(e.target.value)} 
                            className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Note (Optional)</label>
                        <input 
                          value={eventFormDesc} 
                          onChange={e => setEventFormDesc(e.target.value)} 
                          placeholder="e.g. Bring notes and slides" 
                          className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none" 
                        />
                      </div>

                      <button 
                        onClick={handleSaveEvent} 
                        disabled={!eventFormTitle.trim()}
                        title={editingEventId ? 'Save Changes' : 'Confirm Event'}
                        className="kahoot-button-blue w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg disabled:opacity-50 mt-4 flex items-center justify-center"
                      >
                        <Check size={22} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================
              ROUTINE TAB (Daily Timeline + Left/Right Day Switch + Complete)
             ======================================================== */}
          {subTab === 'Routine' && (
            <motion.div key="routine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl space-y-6`}>
              
              {/* Header with Title and Add Button (Icon Only) */}
              <div className="flex flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <Repeat className="text-purple-500" /> {t('routine', language)}
                  </h3>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">
                    Daily Habit Timeline
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingRoutineId(null);
                    setRoutineFormTitle('');
                    setRoutineFormTime('08:00');
                    setRoutineFormDays([1, 2, 3, 4, 5]);
                    setRoutineFormColor('Indigo');
                    setIsRoutineModalOpen(true);
                  }}
                  title={t('newRoutine', language)}
                  className="kahoot-button-purple p-3.5 rounded-2xl text-white shadow-lg flex items-center justify-center shrink-0"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Day Switcher with ◀ and ▶ */}
              <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 flex items-center justify-between border-2 border-black/5">
                <button
                  onClick={() => setRoutineDayOffset(prev => prev - 1)}
                  className="p-3 rounded-2xl bg-white dark:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-md"
                  title="Previous Day"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="text-center">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                    {DAYS_NAME[routineDayOfWeek]}
                  </span>
                  <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tight mt-1">
                    {currentRoutineDate.toLocaleDateString(language === 'Filipino' ? 'fil-PH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h4>
                  {routineDayOffset === 0 && (
                    <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Today</span>
                  )}
                </div>

                <button
                  onClick={() => setRoutineDayOffset(prev => prev + 1)}
                  className="p-3 rounded-2xl bg-white dark:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-md"
                  title="Next Day"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Colorful Timeline Blocks */}
              <div className="space-y-4">
                {selectedDayRoutines.length === 0 ? (
                  <div className="py-16 text-center opacity-30 font-black italic uppercase">
                    {t('noRoutineToday', language)}
                  </div>
                ) : (
                  selectedDayRoutines.map(routine => {
                    const isCompleted = (routine.completedDates || []).includes(routineDateString);
                    const colorScheme = ROUTINE_COLORS.find(c => c.name === routine.color) || ROUTINE_COLORS[0];

                    return (
                      <div
                        key={routine.id}
                        className={`p-6 rounded-3xl border-4 transition-all relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isCompleted ? 'bg-black/5 dark:bg-white/5 border-emerald-500/50 opacity-80' : `${colorScheme.light} ${colorScheme.border} shadow-md`}`}
                      >
                        {/* Time & Title */}
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => handleToggleRoutineCompleted(routine.id)}
                            className="p-1 rounded-full hover:scale-110 transition-transform shrink-0"
                            title={isCompleted ? t('markUndone', language) : t('markFinished', language)}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={32} className="text-emerald-500" />
                            ) : (
                              <Circle size={32} className="opacity-30 hover:opacity-80" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${colorScheme.bg} text-white`}>
                                {routine.startTime} {routine.startPeriod}
                              </span>
                              {isCompleted && (
                                <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                                  {t('complete', language)}
                                </span>
                              )}
                            </div>
                            <h4 className={`text-xl font-black uppercase italic tracking-tight mt-1 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                              {routine.title}
                            </h4>
                          </div>
                        </div>

                        {/* Actions: Strictly Icon-Only */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleRoutineCompleted(routine.id)}
                            title={isCompleted ? t('markUndone', language) : t('markFinished', language)}
                            aria-label={isCompleted ? t('markUndone', language) : t('markFinished', language)}
                            className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center ${isCompleted ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-emerald-600 text-white'}`}
                          >
                            {isCompleted ? <RotateCcw size={16} /> : <Check size={16} />}
                          </button>
                          <button
                            onClick={() => handleEditRoutineClick(routine)}
                            className="p-2 rounded-xl bg-black/5 dark:bg-white/10 opacity-70 hover:opacity-100"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoutine(routine.id)}
                            className="p-2 rounded-xl bg-red-100 text-red-600 opacity-70 hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Routine Modal (Add / Edit) */}
              {isRoutineModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative`}>
                    <button onClick={() => setIsRoutineModalOpen(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100"><X size={28}/></button>
                    <h3 className="text-2xl font-black uppercase italic mb-6">
                      {editingRoutineId ? t('editTask', language) : t('newRoutine', language)}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Routine Name</label>
                        <input 
                          value={routineFormTitle} 
                          onChange={e => setRoutineFormTitle(e.target.value)} 
                          placeholder="e.g. Morning Mindfulness & Stretch" 
                          className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-purple-500" 
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Scheduled Time</label>
                        <input 
                          type="time" 
                          value={routineFormTime} 
                          onChange={e => setRoutineFormTime(e.target.value)} 
                          className="w-full mt-1 p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none" 
                        />
                      </div>

                      {/* Day selection */}
                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Repeat on Days</label>
                        <div className="flex justify-between gap-1 mt-2">
                          {DAYS_SHORT.map((d, idx) => {
                            const isSelected = routineFormDays.includes(idx);
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  if (isSelected) setRoutineFormDays(routineFormDays.filter(x => x !== idx));
                                  else setRoutineFormDays([...routineFormDays, idx].sort());
                                }}
                                className={`w-10 h-10 rounded-full font-black text-[10px] uppercase border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'}`}
                              >
                                {d[0]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Color block choice */}
                      <div>
                        <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Block Accent Color</label>
                        <div className="flex gap-2 mt-2">
                          {ROUTINE_COLORS.map(c => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setRoutineFormColor(c.name)}
                              className={`w-9 h-9 rounded-xl ${c.bg} border-4 transition-all ${routineFormColor === c.name ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={handleSaveRoutine} 
                        disabled={!routineFormTitle.trim() || routineFormDays.length === 0}
                        title={editingRoutineId ? 'Save Changes' : 'Initialize Routine'}
                        className="kahoot-button-purple w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg disabled:opacity-50 mt-4 flex items-center justify-center"
                      >
                        <Check size={22} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================
              BUDGET TAB (Money Goals, Fullness Indicator, Weekly Graph)
             ======================================================== */}
          {subTab === 'Budget' && (
            <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              {/* Top Banner & Set Goal Action */}
              <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                      <PiggyBank className="text-emerald-500" size={32} />
                      <span>{t('budget', language)}</span>
                    </h3>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-0.5">
                      {language === 'English' ? 'Targeted Milestones, Visual Fullness & Weekly Growth' : 'Mga Layunin sa Pera, Progreso at Lingguhang Pag-unlad'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingGoalId(null);
                      setGoalName('');
                      setGoalTargetAmount('');
                      const d = new Date();
                      d.setMonth(d.getMonth() + 1);
                      setGoalTargetDate(d.toISOString().slice(0, 10));
                      setIsGoalModalOpen(true);
                    }}
                    title="Set Goal"
                    className="kahoot-button-green px-6 py-3.5 rounded-2xl text-white font-black text-xs uppercase shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={18} />
                    <span>{language === 'English' ? 'Set Goal' : 'Magtakda ng Layunin'}</span>
                  </button>
                </div>

                {/* Multiple Goals Button Switcher */}
                {(user.budgetGoals || []).length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      <span className="text-[10px] font-black uppercase opacity-40 shrink-0 mr-1">
                        {language === 'English' ? 'Your Goals:' : 'Mga Layunin:'}
                      </span>
                      {(user.budgetGoals || []).map(goal => {
                        const isSelected = activeBudgetGoal?.id === goal.id;
                        const pct = Math.min(100, Math.round(((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100));
                        return (
                          <button
                            key={goal.id}
                            onClick={() => setSelectedGoalId(goal.id)}
                            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 shrink-0 border-2 ${isSelected ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' : isDarkMode ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-slate-700 hover:bg-gray-200'}`}
                          >
                            <span className="truncate max-w-[120px]">{goal.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-black/25 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                              {pct}%
                            </span>
                            {user.pinnedBudgetGoalId === goal.id && (
                              <Pin size={12} className="fill-current rotate-45 text-amber-300" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* MAXIMIZED GOAL CARD VIEW */}
                    {activeBudgetGoal && (() => {
                      const goal = activeBudgetGoal;
                      const targetAmt = goal.targetAmount || 1;
                      const currentAmt = goal.currentAmount || 0;
                      const percentage = Math.min(100, Math.round((currentAmt / targetAmt) * 100));
                      const remaining = Math.max(0, Math.round((targetAmt - currentAmt) * 100) / 100);
                      const isFull = currentAmt >= targetAmt;

                      // Countdown to Target Date
                      const targetDateTs = new Date(`${goal.targetDate}T23:59:59`).getTime();
                      const timeDiff = targetDateTs - nowTimestamp;
                      const isPast = timeDiff <= 0;
                      const daysLeft = Math.floor(Math.max(0, timeDiff) / (1000 * 60 * 60 * 24));
                      const hoursLeft = Math.floor((Math.max(0, timeDiff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      const minutesLeft = Math.floor((Math.max(0, timeDiff) % (1000 * 60 * 60)) / (1000 * 60));
                      const secondsLeft = Math.floor((Math.max(0, timeDiff) % (1000 * 60)) / 1000);

                      const countdownString = isPast 
                        ? (language === 'English' ? 'Target Date Reached' : 'Dumating na ang Petsa')
                        : `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

                      const isPinned = user.pinnedBudgetGoalId === goal.id;

                      return (
                        <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-gradient-to-br from-emerald-500/10 via-slate-50 to-indigo-50/20 border-emerald-500/20'} border-4 shadow-2xl space-y-8 relative overflow-hidden`}>
                          
                          {/* Card Header & Action Buttons */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                            <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                <Coins size={14} />
                                <span>{language === 'English' ? 'Active Target Goal' : 'Aktibong Layunin'}</span>
                              </div>
                              <h4 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                                {goal.name}
                              </h4>
                              <p className="text-xs font-bold opacity-60 mt-0.5">
                                {language === 'English' ? 'Target Finish Date:' : 'Target na Petsa:'} {goal.targetDate}
                              </p>
                            </div>

                            {/* Actions: Insert Money, Pin, Edit, Delete */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleOpenDepositModal(goal.id)}
                                title={language === 'English' ? 'Insert Money' : 'Maglagay ng Pera'}
                                className="kahoot-button-green px-5 py-3 rounded-2xl text-white font-black text-xs uppercase shadow-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                              >
                                <ArrowDownToLine size={18} />
                                <span>{language === 'English' ? 'Insert Money' : 'Maglagay'}</span>
                              </button>

                              <button
                                onClick={() => handleTogglePinGoal(goal.id)}
                                title={isPinned ? (language === 'English' ? 'Pinned to Homescreen Widget' : 'Naka-pin sa Widget') : (language === 'English' ? 'Pin to Homescreen Widget' : 'I-pin sa Homescreen')}
                                className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-center ${isPinned ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-105' : 'bg-black/5 dark:bg-white/10 border-transparent opacity-70 hover:opacity-100'}`}
                              >
                                <Pin size={18} className={isPinned ? 'fill-current rotate-45' : ''} />
                              </button>

                              <button
                                onClick={() => handleEditGoalClick(goal)}
                                title="Edit Goal"
                                className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 border-2 border-transparent opacity-70 hover:opacity-100 transition-all flex items-center justify-center"
                              >
                                <Edit3 size={18} />
                              </button>

                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                title="Delete Goal"
                                className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-transparent transition-all flex items-center justify-center"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Countdown & Metrics Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            
                            {/* COUNTDOWN TIMER TO FINISH DATE */}
                            <div className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-black/30' : 'bg-white'} border-2 border-emerald-500/20 shadow-md flex flex-col justify-between`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black uppercase opacity-50 tracking-wider flex items-center gap-1.5">
                                  <Clock size={14} className="text-emerald-500 animate-spin" />
                                  <span>{language === 'English' ? 'Countdown to Target Date' : 'Natitirang Oras'}</span>
                                </span>
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                                  {isPast ? 'Due' : `${daysLeft} Days Left`}
                                </span>
                              </div>
                              <p className="text-2xl md:text-3xl font-mono font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                                {countdownString}
                              </p>
                              <p className="text-[10px] font-bold opacity-40 mt-2">
                                {language === 'English' ? 'Finish milestone marked for' : 'Nakatakdang matapos sa'} {goal.targetDate}
                              </p>
                            </div>

                            {/* CURRENT MONEY & VISUAL BEFORE GOING FULL */}
                            <div className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-black/30' : 'bg-white'} border-2 border-emerald-500/20 shadow-md flex flex-col justify-between`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase opacity-50 tracking-wider">
                                  {language === 'English' ? 'Current vs Targeted Money' : 'Kasalukuyan laban sa Target'}
                                </span>
                                <span className="text-xl font-black text-emerald-600 font-mono">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                                  {currentAmt}
                                </span>
                                <span className="text-xl font-black opacity-40 font-mono">
                                  / {targetAmt}
                                </span>
                              </div>
                              <p className="text-[11px] font-black uppercase tracking-wide mt-2 text-emerald-600 dark:text-emerald-400">
                                {isFull 
                                  ? (language === 'English' ? 'Goal reached & full! 🎉' : 'Nakamit na ang target! 🎉')
                                  : `${remaining} ${language === 'English' ? 'remaining before going full' : 'ang kulang bago mapuno'}`}
                              </p>
                            </div>
                          </div>

                          {/* VISUAL FULLNESS PROGRESS BAR */}
                          <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60 tracking-wider">
                              <span>{language === 'English' ? 'Visual Fullness Gauge' : 'Antas ng Pagkapuno'}</span>
                              <span>{currentAmt} of {targetAmt} ({percentage}%)</span>
                            </div>
                            <div className="h-6 w-full rounded-full bg-black/10 dark:bg-white/10 p-1 relative overflow-hidden border-2 border-emerald-500/20">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 shadow-md relative"
                              >
                                {percentage > 12 && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-white drop-shadow">
                                    {percentage}%
                                  </span>
                                )}
                              </motion.div>
                            </div>
                          </div>

                          {/* GRAPH: MONEY PUT PER WEEK (Pure numbers, no currency) */}
                          <div className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-black/30' : 'bg-white'} border-2 border-emerald-500/20 shadow-md space-y-4 relative z-10`}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="text-emerald-500" size={20} />
                                <h5 className="font-black uppercase italic tracking-tight text-sm">
                                  {language === 'English' ? 'Money Put per Week' : 'Naipong Pera Bawat Linggo'}
                                </h5>
                              </div>
                              <span className="text-[9px] font-black uppercase opacity-40 tracking-wider">
                                {language === 'English' ? 'Numeric Volume' : 'Dami ng Naipasok'}
                              </span>
                            </div>

                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyDepositData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#eee'} />
                                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                  <RechartsTooltip 
                                    formatter={(value: any) => [`${value}`, language === 'English' ? 'Deposited' : 'Naipasok']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold', backgroundColor: isDarkMode ? '#1e293b' : '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} 
                                  />
                                  <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* HISTORY OF PAST PUT MONEY */}
                          <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-center">
                              <h5 className="font-black uppercase italic tracking-tight text-sm flex items-center gap-2">
                                <Clock size={16} className="text-emerald-500" />
                                <span>{language === 'English' ? 'History of Past Put Money' : 'Kasaysayan ng mga Naipasok'}</span>
                              </h5>
                              <span className="text-[9px] font-black uppercase opacity-40">
                                {(goal.deposits || []).length} {language === 'English' ? 'Records' : 'Tala'}
                              </span>
                            </div>

                            {(goal.deposits || []).length > 0 ? (
                              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                                {(goal.deposits || []).map(deposit => (
                                  <div 
                                    key={deposit.id} 
                                    className={`p-3.5 px-5 rounded-2xl flex items-center justify-between transition-all border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'} shadow-sm`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">
                                        +
                                      </div>
                                      <div>
                                        <p className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                                          +{deposit.amount}
                                        </p>
                                        {deposit.note && (
                                          <p className="text-[10px] font-bold opacity-60">{deposit.note}</p>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-black opacity-40 font-mono">
                                      {deposit.date || new Date(deposit.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 opacity-40 font-black uppercase text-xs">
                                {language === 'English' ? 'No money inserted yet. Tap "Insert Money" above!' : 'Wala pang naipapasok na pera. Pindutin ang "Maglagay" sa itaas!'}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                      <PiggyBank size={40} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase italic tracking-tight">
                        {language === 'English' ? 'No Money Goals Yet' : 'Wala Pang Layunin sa Pera'}
                      </h4>
                      <p className="text-xs font-bold opacity-60 mt-1 max-w-sm mx-auto">
                        {language === 'English' ? 'Set a targeted goal to monitor your savings, countdown to your finish date, and track visual fullness.' : 'Magtakda ng layunin upang subaybayan ang iyong ipon at makita ang progreso.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="kahoot-button-green px-8 py-4 rounded-2xl text-white font-black text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                      <Plus size={18} />
                      <span>{language === 'English' ? 'Create First Goal' : 'Gumawa ng Layunin'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* MODAL: SET / EDIT BUDGET GOAL */}
              <AnimatePresence>
                {isGoalModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative space-y-5`}>
                      <button onClick={() => setIsGoalModalOpen(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 p-2"><X size={24}/></button>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                          <PiggyBank size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black uppercase italic">
                            {editingGoalId ? (language === 'English' ? 'Edit Money Goal' : 'I-edit ang Layunin') : (language === 'English' ? 'Set New Money Goal' : 'Magtakda ng Bagong Layunin')}
                          </h3>
                          <p className="text-[10px] font-black uppercase opacity-40 tracking-wider">
                            {language === 'English' ? 'Numeric Target & Countdown Date' : 'Target na Numero at Petsa'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Goal Name</label>
                          <input 
                            value={goalName} 
                            onChange={e => setGoalName(e.target.value)} 
                            placeholder="e.g. Emergency Fund / Gadget Upgrade" 
                            className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-emerald-500" 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Money Targeted (Numbers Only)</label>
                          <input 
                            type="number"
                            min="1"
                            step="any"
                            value={goalTargetAmount} 
                            onChange={e => setGoalTargetAmount(e.target.value)} 
                            placeholder="e.g. 5000" 
                            className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-mono font-black outline-none focus:border-emerald-500" 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Date to Finish</label>
                          <input 
                            type="date"
                            value={goalTargetDate} 
                            onChange={e => setGoalTargetDate(e.target.value)} 
                            className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none focus:border-emerald-500" 
                          />
                        </div>

                        <button 
                          onClick={handleSaveGoal} 
                          disabled={!goalName.trim() || !goalTargetAmount || !goalTargetDate}
                          className="kahoot-button-green w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check size={22} />
                          <span>{editingGoalId ? (language === 'English' ? 'Save Changes' : 'I-save ang Pagbabago') : (language === 'English' ? 'Initialize Goal' : 'Simulan ang Layunin')}</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* MODAL: INSERT MONEY (DEPOSIT) */}
              <AnimatePresence>
                {isDepositModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} w-full max-w-md rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative space-y-5 text-center`}>
                      <button onClick={() => setIsDepositModalOpen(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 p-2"><X size={24}/></button>

                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <ArrowDownToLine size={32} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black uppercase italic">
                          {language === 'English' ? 'Insert Money' : 'Maglagay ng Pera'}
                        </h3>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-wider mt-1">
                          {language === 'English' ? 'Add funds towards your target' : 'Magdagdag ng ipon para sa target'}
                        </p>
                      </div>

                      <div className="space-y-4 text-left">
                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Amount to Put (Number)</label>
                          <input 
                            type="number"
                            min="1"
                            step="any"
                            value={depositAmount} 
                            onChange={e => setDepositAmount(e.target.value)} 
                            placeholder="e.g. 100" 
                            className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-mono font-black text-2xl text-center outline-none focus:border-emerald-500" 
                          />
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="flex gap-2 justify-center">
                          {[50, 100, 200, 500].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setDepositAmount(val.toString())}
                              className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 font-mono font-black text-xs hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              +{val}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Note (Optional)</label>
                          <input 
                            value={depositNote} 
                            onChange={e => setDepositNote(e.target.value)} 
                            placeholder="e.g. Weekly savings / Side gig" 
                            className="w-full mt-1 p-3.5 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none focus:border-emerald-500 text-xs" 
                          />
                        </div>

                        <button 
                          onClick={handleInsertMoney} 
                          disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                          className="kahoot-button-green w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check size={22} />
                          <span>{language === 'English' ? 'Confirm Deposit' : 'Kumpirmahin'}</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* ========================================================
              WISDOM TAB (Famous People Quotes)
             ======================================================== */}
          {subTab === 'Wisdom' && (
            <motion.div key="wisdom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl`}>
              <div className="flex items-center gap-3 mb-8">
                <BrainCircuit className="text-yellow-500" size={32} />
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                    {t('wisdom', language)}
                  </h3>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                    Motivational Insights from Visionaries
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAMOUS_WISDOM.map((w, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border-l-8 border-yellow-500 flex flex-col justify-between shadow-sm hover:border-yellow-400 transition-all">
                    <p className="italic font-bold text-lg md:text-xl leading-snug mb-4">
                      "{w.quote}"
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-500 dark:text-yellow-400">
                      <span>—</span>
                      <span>{w.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CityHallSection;
