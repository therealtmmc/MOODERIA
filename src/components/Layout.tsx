import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DailyMoodPopup } from "./DailyMoodPopup";
import { LoadingScreen } from "./LoadingScreen";
import { BreathingModal } from "./BreathingModal";
import { RankUpModal } from "./RankUpModal";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { CityBackground } from "./CityBackground";
import { WeatherOverlay } from "./WeatherOverlay";
import { CityEventsComponent } from "./CityEventsComponent";
import { motion, AnimatePresence } from "motion/react";
import { DISTRICTS } from "@/constants/districts";

export function Layout() {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine current theme based on district
  const district = DISTRICTS[location.pathname];
  const moodTheme = district ? district.bgColor : "bg-[#f2f2f2]";
  
  // Determine if it's day or night
  const currentHour = new Date().getHours();
  const isNightTime = currentHour < 6 || currentHour >= 18;
  
  // Override with Night Mode if active, or use time-based theme
  const currentTheme = state.isNightMode || isNightTime
    ? "bg-slate-950 text-slate-100" 
    : moodTheme;

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

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={cn("min-h-screen font-sans text-gray-800 overflow-x-hidden transition-colors duration-1000", currentTheme)}>
      <CityBackground isNight={state.isNightMode || isNightTime} />
      {state.userProfile && location.pathname !== "/onboarding" && <WeatherOverlay />}
      {state.userProfile && location.pathname !== "/onboarding" && <CityEventsComponent />}
      {state.userProfile && location.pathname !== "/onboarding" && <DailyMoodPopup />}
      {state.userProfile && location.pathname !== "/onboarding" && <RankUpModal />}
      
      <main className="max-w-md mx-auto min-h-screen relative pb-24">
        {state.userProfile && location.pathname !== "/onboarding" && (
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {state.userProfile && location.pathname !== "/onboarding" && (
        <>
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="fixed bottom-8 right-4 z-40 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 text-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
            title="Panic Button (Breathe)"
          >
            <Wind className="w-6 h-6" />
          </button>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
      )}

      <BreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />
    </div>
  );
}
