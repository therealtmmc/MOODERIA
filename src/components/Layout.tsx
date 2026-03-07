import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileGuard } from "./MobileGuard";
import { InstallGuard } from "./InstallGuard";
import { DailyMoodPopup } from "./DailyMoodPopup";
import { LoadingScreen } from "./LoadingScreen";
import { BreathingModal } from "./BreathingModal";
import { RankUpModal } from "./RankUpModal";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_COLORS: Record<string, string> = {
  Happy: "bg-yellow-50",
  Sad: "bg-blue-50",
  Neutral: "bg-gray-50",
  Loved: "bg-pink-50",
  Angry: "bg-red-50",
  Energetic: "bg-orange-50",
  Tired: "bg-stone-50",
  Calm: "bg-indigo-50",
};

export function Layout() {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine current theme based on last logged mood
  const lastMoodEntry = state.moods.find(m => m.date === state.lastMoodDate);
  const moodTheme = lastMoodEntry ? THEME_COLORS[lastMoodEntry.mood] : "bg-[#f2f2f2]";
  
  // Override with Night Mode if active
  const currentTheme = state.isNightMode 
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
    <InstallGuard>
      <MobileGuard>
        <div className={cn("min-h-screen font-sans text-gray-800 overflow-x-hidden transition-colors duration-1000", currentTheme)}>
          {state.userProfile && location.pathname !== "/onboarding" && <DailyMoodPopup />}
          {state.userProfile && location.pathname !== "/onboarding" && <RankUpModal />}
          
          <main className="max-w-md mx-auto min-h-screen relative pb-24">
            {state.userProfile && location.pathname !== "/onboarding" && (
              <Header onMenuClick={() => setIsSidebarOpen(true)} />
            )}

            <Outlet />
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
      </MobileGuard>
    </InstallGuard>
  );
}
