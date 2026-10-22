
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Section, AppNotification, Mood, Message } from './types';
import Sidebar from './components/Sidebar';
import HomeSection from './sections/HomeSection';
import CityHallSection from './sections/CityHallSection';
import MoodSection from './sections/MoodSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import AuthScreen from './sections/AuthScreen';
import LoadingScreen from './components/LoadingScreen';
import MoodCheckIn from './components/MoodCheckIn';
import RankUpCelebration from './components/RankUpCelebration';
import AlarmOverlay, { ActiveAlarmData } from './components/AlarmOverlay';
import { MOOD_SCORES, getExpNeeded, toRomanNumeral, t } from './constants';
import { syncProfile, getCurrentSessionUser, clearSession, subscribeToUser, resetAllData } from './services/supabaseService';
import { Sparkles, Trophy, Send, Clock, Book, Cog, Heart } from 'lucide-react';

type AnimationType = 'express' | 'schedule' | 'routine' | 'diary' | 'alarm' | null;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAppStarting, setIsAppStarting] = useState(true);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Filipino'>('English');
  const [activeToast, setActiveToast] = useState<{title: string, msg: string, icon?: any} | null>(null);
  
  const [centralAnimation, setCentralAnimation] = useState<{ type: AnimationType, text?: string } | null>(null);
  const [rankUpData, setRankUpData] = useState<{ oldRank: number; newRank: number } | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Overlay Alarm States
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarmData | null>(null);
  const [snoozedAlarms, setSnoozedAlarms] = useState<Record<string, number>>({});
  const alertedRoutinesRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      const savedTheme = localStorage.getItem('mooderia_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
      const savedLang = localStorage.getItem('mooderia_lang');
      if (savedLang === 'Filipino') setLanguage('Filipino');
      
      try {
        const sessionUser = await getCurrentSessionUser();
        if (sessionUser) {
            setCurrentUser(sessionUser);
        }
      } catch (e) {
        console.error("Session fetch failed", e);
      }

      setIsLoaded(true);
      setTimeout(() => setIsAppStarting(false), 2000);

    };
    init();
  }, []);

  // --- SOUND ALERT SYSTEM ---
  const playAlertSound = () => {
    // Simple beep sound encoded to avoid external dependency issues
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); // 500Hz beep
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2); // Play for 0.2s
  };

  const sendInAppAlert = (title: string, body: string) => {
    playAlertSound();
    showToast(title, body, <Clock size={20} className="text-blue-500" />);
  };

  // --- SCHEDULER & MOOD ALERT WATCHER ---
  useEffect(() => {
     if (!currentUser) return;
     
     const interval = setInterval(() => {
        const now = new Date();
        const currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // "14:05"
        const currentDay = now.getDay(); // 0-6

        let userUpdates: Partial<User> = {};
        let needsUpdate = false;

        // 1. Check Schedule Events
        const newSchedule = (currentUser.schedule || []).map(item => {
            const itemDate = new Date(item.date);
            const isToday = itemDate.toDateString() === now.toDateString();
            
            if (isToday && item.time === currentTimeString && !item.alerted) {
                sendInAppAlert("Calendar Alert 📅", `It's time for: ${item.title}`);
                triggerAnimation('alarm', item.title);
                setActiveAlarm({ id: item.id, title: item.title, type: 'event', time: `${item.time} ${item.period}`, date: item.date });
                return { ...item, alerted: true };
            }
            return item;
        });

        if (JSON.stringify(newSchedule) !== JSON.stringify(currentUser.schedule)) {
            userUpdates.schedule = newSchedule;
            needsUpdate = true;
        }

        // 2. Check Routines (Tasks for this day)
        (currentUser.routines || []).forEach(routine => {
            if (routine.days.includes(currentDay) && routine.startTime === currentTimeString) {
                const routineAlertKey = `routine_${routine.id}_${now.toDateString()}_${currentTimeString}`;
                if (!alertedRoutinesRef.current.has(routineAlertKey)) {
                  alertedRoutinesRef.current.add(routineAlertKey);
                  sendInAppAlert("Routine Reminder ⏰", `Habit Time: ${routine.title}`);
                  triggerAnimation('routine', routine.title);
                  setActiveAlarm({ id: routine.id, title: routine.title, type: 'task', time: `${routine.startTime} ${routine.startPeriod}` });
                }
            }
        });

        // 3. Check Snoozed Alarms
        Object.entries(snoozedAlarms).forEach(([id, expireTs]) => {
          if (Date.now() >= expireTs) {
            const ev = (currentUser.schedule || []).find(s => s.id === id);
            if (ev) {
              setActiveAlarm({ id: ev.id, title: ev.title, type: 'event', time: `${ev.time} ${ev.period}`, date: ev.date });
            } else {
              const rt = (currentUser.routines || []).find(r => r.id === id);
              if (rt) {
                setActiveAlarm({ id: rt.id, title: rt.title, type: 'task', time: `${rt.startTime} ${rt.startPeriod}` });
              }
            }
            setSnoozedAlarms(prev => {
              const copy = { ...prev };
              delete copy[id];
              return copy;
            });
          }
        });

        // 4. Daily Mood Check (9AM, 1PM, 8PM)
        const checkInTimes = ["09:00", "13:00", "20:00"];
        if (checkInTimes.includes(currentTimeString) && currentUser.lastMoodDate !== now.toDateString()) {
             sendInAppAlert("Mood Check-In 🌟", "How is your frequency vibrating right now?");
        }

        // 5. Mood Pet Check - Alert if streak is downcast
        const lastPetAlertStr = localStorage.getItem('mooderia_last_pet_alert');
        const timeSincePetAlert = lastPetAlertStr ? Date.now() - parseInt(lastPetAlertStr, 10) : Infinity;
        if (timeSincePetAlert > 2 * 60 * 60 * 1000) { // Every 2 hours
          if ((currentUser.moodStreak || 0) === 0) {
              sendInAppAlert("Guardian Alert 💔", `${currentUser.petName || 'Mood Guardian'} is downcast! Revive your streak to restore its spirits.`);
              localStorage.setItem('mooderia_last_pet_alert', Date.now().toString());
          }
        }

        if (needsUpdate) {
            handleUpdateUser(userUpdates);
        }
     }, 15000); // Check every 15 seconds for precision localtime triggering

     return () => clearInterval(interval);
  }, [currentUser, snoozedAlarms]);

  const handleDismissAlarm = () => {
    setActiveAlarm(null);
  };

  const handleSnoozeAlarm = () => {
    if (!activeAlarm) return;
    const snoozeUntil = Date.now() + 5 * 60 * 1000; // 5 minutes snooze
    setSnoozedAlarms(prev => ({
      ...prev,
      [activeAlarm.id]: snoozeUntil
    }));
    setActiveAlarm(null);
    showToast("Alarm Snoozed", "We'll remind you again in 5 minutes.", <Clock size={20} className="text-yellow-500"/>);
  };

  // --- REALTIME LISTENERS ---
  useEffect(() => {
    if (!currentUser?.citizenCode) return;

    // 1. Listen for Profile Changes (Sync from other devices)
    const unsubscribeUser = subscribeToUser(currentUser.citizenCode, (updatedUser) => {
        setCurrentUser(prev => {
            if (!prev) return updatedUser;
            return { ...prev, ...updatedUser };
        });
    });

    return () => {
        unsubscribeUser();
    };
  }, [currentUser?.citizenCode]); 

  useEffect(() => {
    if (currentUser) {
      const today = new Date().toDateString();
      if (currentUser.lastMoodDate !== today) {
        setShowMoodCheckIn(true);
      } else {
        setShowMoodCheckIn(false);
      }
    }
  }, [currentUser?.citizenCode]); 

  const showToast = (title: string, msg: string, icon?: any) => {
    setActiveToast({ title, msg, icon });
    setTimeout(() => setActiveToast(null), 3000);
  };

  const triggerAnimation = (type: AnimationType, text?: string) => {
    setCentralAnimation({ type, text });
    setTimeout(() => setCentralAnimation(null), 2500);
  };

  const handleGainReward = useCallback((amount: number = 1) => {
    setCurrentUser(prev => {
       if(!prev) return null;
       const updatedUser = {
         ...prev,
         tasksFinishedCount: (prev.tasksFinishedCount || 0) + amount,
       };
       syncProfile(updatedUser);
       return updatedUser;
    });
  }, []);

  const handleUpdateUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
        if (!prev) return null;
        let currentRank = Math.min(100, Math.max(1, prev.petLevel || 1));
        let rankToSet = updates.petLevel !== undefined ? Math.min(100, Math.max(1, updates.petLevel)) : currentRank;
        let streakToSet = updates.moodStreak !== undefined ? updates.moodStreak : (prev.moodStreak || 0);

        // Check if streak reached the 10-day milestone!
        if (updates.moodStreak !== undefined && updates.moodStreak >= 10) {
          if (currentRank < 100) {
            const oldRank = currentRank;
            const nextRank = Math.min(100, currentRank + 1);
            rankToSet = nextRank;
            streakToSet = 1; // Daily streak cycles back to 1!
            setRankUpData({ oldRank, newRank: nextRank });
          } else {
            // Maximum rank is 100: day streak climbs indefinitely above 10 and never resets!
            rankToSet = 100;
            streakToSet = updates.moodStreak;
          }
        }

        const updated = { 
          ...prev, 
          ...updates, 
          petLevel: rankToSet, 
          moodStreak: streakToSet,
          previousStreak: streakToSet > 0 ? streakToSet : prev.previousStreak
        };
        syncProfile(updated);
        return updated;
    });
  };

  const handleMoodSubmit = (mood: Mood) => {
    if (!currentUser) return;
    const today = new Date().toDateString();
    const score = mood ? MOOD_SCORES[mood] : 50;
    
    handleGainReward(1);

    const history = [...currentUser.moodHistory, { date: today, mood, score }];
    let newStreak = currentUser.moodStreak || 0;
    if (currentUser.lastMoodDate) {
       const lastDate = new Date(currentUser.lastMoodDate);
       const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       if (diffDays === 1) newStreak++;
       else if (diffDays > 1) newStreak = 1; // Broken streak returns to day 1; rank is never reset!
    } else {
       newStreak = 1;
    }

    handleUpdateUser({
      moodHistory: history,
      lastMoodDate: today,
      moodStreak: newStreak
    });
    setShowMoodCheckIn(false);
  };

  const renderCentralAnimation = () => {
    if (!centralAnimation) return null;
    const { type, text } = centralAnimation;
    let Icon = Sparkles;
    let color = "text-indigo-600";
    let animationProps = {};

    switch(type) {
        case 'express':
            Icon = Send;
            color = "text-red-500";
            animationProps = { 
                animate: { x: [0, 500], y: [0, -200], opacity: [1, 0] },
                transition: { duration: 1.5, ease: "easeIn" }
            };
            break;
        case 'schedule':
            Icon = Clock;
            color = "text-blue-500";
            animationProps = {
                animate: { rotate: 360, scale: [1, 1.5, 1] },
                transition: { duration: 1, repeat: 1 }
            };
            break;
        case 'routine':
            Icon = Cog;
            color = "text-purple-500";
            animationProps = {
                animate: { rotate: -360 },
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
            };
            break;
        case 'diary':
            Icon = Book;
            color = "text-green-500";
            animationProps = {
                animate: { scale: [1, 1.2, 1], rotateY: [0, 180, 360] },
                transition: { duration: 1.5 }
            };
            break;
        default:
            Icon = Sparkles;
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
            <motion.div {...animationProps} className={`mb-6 ${color}`}>
                <Icon size={120} strokeWidth={3} />
            </motion.div>
            <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="text-center"
            >
                <h2 className="text-3xl font-black italic uppercase text-white tracking-widest drop-shadow-lg">
                    {type?.toUpperCase()} UPDATED
                </h2>
                {text && <p className="text-blue-300 font-bold uppercase mt-2">{text}</p>}
            </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-indigo-500 selection:text-white`}>
       <AnimatePresence>
         {isAppStarting && <LoadingScreen key="loading" />}
         
         {!isAppStarting && !currentUser && (
           <AuthScreen key="auth" onLogin={(u) => { setCurrentUser(u); setIsLoaded(true); }} />
         )}

         {!isAppStarting && currentUser && (
           <div className={`flex flex-col ${(currentUser.taskbarLayout === 'side') ? 'md:flex-row' : (currentUser.taskbarLayout === 'bottom') ? 'flex-col' : 'lg:flex-row'} h-screen`}>
              <Sidebar 
                activeSection={activeSection} 
                onNavigate={setActiveSection} 
                isDarkMode={isDarkMode} 
                user={currentUser}
                unreadMails={notifications.filter(n => !n.read).length}
                language={language}
              />
              
              <main className={`flex-1 h-full overflow-y-auto relative no-scrollbar ${
                currentUser.taskbarLayout === 'bottom'
                  ? 'p-4 pt-18 pb-24 md:p-8 md:pt-20 md:pb-28'
                  : currentUser.taskbarLayout === 'side'
                    ? 'p-4 pt-18 pb-20 md:p-8 md:pt-8 md:pb-8'
                    : 'p-4 pt-18 pb-20 md:p-6 md:pt-20 md:pb-28 lg:p-8 lg:pt-8 lg:pb-8'
              }`}>
                <AnimatePresence mode="wait">
                  {activeSection === 'Home' && (
                    <motion.div key="home" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                      <HomeSection 
                        user={currentUser} 
                        isDarkMode={isDarkMode} 
                        language={language} 
                        onUpdate={handleUpdateUser} 
                        onNavigate={setActiveSection} 
                      />
                    </motion.div>
                  )}
                  {activeSection === 'Mood' && <motion.div key="mood" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="h-full"><MoodSection user={currentUser} onUpdate={handleUpdateUser} isDarkMode={isDarkMode} language={language} onReward={() => handleGainReward(1, 10)} triggerAnimation={triggerAnimation} /></motion.div>}
                  {activeSection === 'CityHall' && <motion.div key="cityhall" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="h-full"><CityHallSection user={currentUser} onUpdate={handleUpdateUser} isDarkMode={isDarkMode} language={language} onReward={() => handleGainReward(1, 20)} triggerAnimation={triggerAnimation} /></motion.div>}
                  {activeSection === 'Profile' && (
                    <motion.div key="profile" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                      <ProfileSection 
                        user={currentUser} 
                        onUpdate={handleUpdateUser} 
                        isDarkMode={isDarkMode} 
                        language={language} 
                      />
                    </motion.div>
                  )}
                  {activeSection === 'Settings' && <motion.div key="settings" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                    <SettingsSection 
                      isDarkMode={isDarkMode} 
                      onToggleDarkMode={() => { setIsDarkMode(!isDarkMode); localStorage.setItem('mooderia_theme', !isDarkMode ? 'dark' : 'light'); }}
                      language={language}
                      onToggleLanguage={() => { setLanguage(l => l === 'English' ? 'Filipino' : 'English'); localStorage.setItem('mooderia_lang', language === 'English' ? 'Filipino' : 'English'); }}
                      user={currentUser}
                      onUpdate={handleUpdateUser}
                      onTriggerTestAlarm={() => setActiveAlarm({ id: 'test_sample', title: 'Daily Focus & Mindfulness', type: 'task', time: '10:00 AM' })}
                      onResetData={() => {
                        resetAllData();
                        setCurrentUser(null);
                        setShowMoodCheckIn(false);
                        setActiveSection('Home');
                        try {
                          window.location.reload();
                        } catch (e) {}
                      }}
                      onImportData={(importedUser) => {
                        setCurrentUser(importedUser);
                      }}
                    />
                  </motion.div>}
                </AnimatePresence>
              </main>

              {/* OVERLAY ALARM FOR TASK & EVENT */}
              <AnimatePresence>
                {activeAlarm && (
                  <AlarmOverlay
                    alarm={activeAlarm}
                    alarmMode={currentUser.alarmMode || 'vibrate_sound'}
                    onDismiss={handleDismissAlarm}
                    onSnooze={handleSnoozeAlarm}
                    isDarkMode={isDarkMode}
                    language={language}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showMoodCheckIn && (
                  <MoodCheckIn onSubmit={handleMoodSubmit} isDarkMode={isDarkMode} />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {renderCentralAnimation()}
              </AnimatePresence>
              <AnimatePresence>
                {rankUpData && (
                  <RankUpCelebration
                    oldRank={rankUpData.oldRank}
                    newRank={rankUpData.newRank}
                    onClose={() => setRankUpData(null)}
                    language={language}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeToast && (
                  <motion.div initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[100] bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border-2 border-black/5 flex items-center gap-4 max-w-sm">
                     <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-xl">{activeToast.icon || <Sparkles className="text-indigo-600" size={20} />}</div>
                     <div><h5 className="font-black uppercase text-xs">{activeToast.title}</h5><p className="text-sm font-bold opacity-70">{activeToast.msg}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default App;
