import { useState, useEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DailyMoodPopup } from "./DailyMoodPopup";
import { LoadingScreen } from "./LoadingScreen";
import { RankUpModal } from "./RankUpModal";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CityBackground } from "./CityBackground";
import { WeatherOverlay } from "./WeatherOverlay";
import { motion, AnimatePresence } from "motion/react";
import { DISTRICTS } from "@/constants/districts";
import { HackingTransition } from "./HackingTransition";
import { RestoreTransition } from "./RestoreTransition";

export function Layout() {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevThemeRef = useRef(state.isStarkTheme);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (state.isLoaded) {
      if (!initializedRef.current) {
        prevThemeRef.current = state.isStarkTheme;
        initializedRef.current = true;
        return;
      }
      
      if (state.isStarkTheme !== prevThemeRef.current) {
        setIsTransitioning(true);
        prevThemeRef.current = state.isStarkTheme;
        const duration = state.isStarkTheme ? 6000 : 10000; // 6s for boot, 10s for restore
        const timer = setTimeout(() => setIsTransitioning(false), duration);
        return () => clearTimeout(timer);
      }
    }
  }, [state.isStarkTheme, state.isLoaded]);

  // Determine current theme based on district
  const district = useMemo(() => DISTRICTS[location.pathname], [location.pathname]);
  const moodTheme = district ? district.bgColor : "bg-[#f2f2f2]";
  
  // Determine if it's day or night
  const isNightTime = useMemo(() => {
    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour >= 18;
  }, []); // Only calculate once on mount or when state changes if needed
  
  // Override with Night Mode if active, or use time-based theme
  const currentTheme = useMemo(() => {
    if (state.isStarkTheme) {
      return "bg-black text-green-400 font-mono";
    }
    return state.isNightMode || isNightTime
      ? "bg-slate-950 text-slate-100" 
      : moodTheme;
  }, [state.isStarkTheme, state.isNightMode, isNightTime, moodTheme]);

  // Determine weather based on last mood
  const weather = useMemo(() => {
    const lastMood = state.moods[state.moods.length - 1]?.mood || "Neutral";
    return lastMood === "Sad" ? "Rainy" : lastMood === "Energetic" ? "Sunny" : "Cloudy";
  }, [state.moods]);

  // Redirect to Onboarding if no profile
  useEffect(() => {
    if (!loading && !state.userProfile && location.pathname !== "/onboarding") {
      navigate("/onboarding");
    }
  }, [loading, state.userProfile, navigate, location.pathname]);

  // Request Notification Permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Check for routine alarms every minute
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const currentDay = format(now, "EEE"); // Mon, Tue, etc.

      state.routines.forEach((routine) => {
        // Check if routine is active, time matches, and day matches
        if (
          routine.active &&
          routine.startTime === currentTime && // Changed from routine.time to routine.startTime based on type definition
          routine.days.includes(currentDay)
        ) {
          if (Notification.permission === "granted") {
            new Notification(`Time for ${routine.name}!`, {
              body: `It's ${routine.startTime}. Let's do this!`,
            });
          }
        }
      });
    };

    // Check immediately on load, then every minute
    checkAlarms();
    const interval = setInterval(checkAlarms, 60000); 
    return () => clearInterval(interval);
  }, [state.routines]);

  // Simulate loading screen on first visit
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const toggleSidebar = useMemo(() => () => setIsSidebarOpen(true), []);

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={cn("min-h-screen overflow-x-hidden transition-colors duration-[3000ms]", 
      state.isStarkTheme ? "stark-theme" : "font-sans text-gray-800",
      currentTheme
    )}>
      <AnimatePresence>
        {!state.isStarkTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <CityBackground isNight={state.isNightMode || isNightTime} district={district} weather={weather} cityLevel={state.cityLevel} />
            {state.userProfile && location.pathname !== "/onboarding" && <WeatherOverlay weather={weather} />}
          </motion.div>
        )}
      </AnimatePresence>
      {state.userProfile && location.pathname !== "/onboarding" && <DailyMoodPopup />}
      {state.userProfile && location.pathname !== "/onboarding" && <RankUpModal />}
      
      <main className="max-w-md mx-auto min-h-screen relative pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {state.userProfile && location.pathname !== "/onboarding" && (
              <Header onMenuClick={toggleSidebar} />
            )}
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {state.userProfile && location.pathname !== "/onboarding" && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
      )}

      <AnimatePresence>
        {isTransitioning && (
          state.isStarkTheme ? <HackingTransition /> : <RestoreTransition />
        )}
      </AnimatePresence>
    </div>
  );
}
