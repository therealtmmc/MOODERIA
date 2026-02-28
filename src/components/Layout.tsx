import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { MobileGuard } from "./MobileGuard";
import { InstallGuard } from "./InstallGuard";
import { DailyMoodPopup } from "./DailyMoodPopup";
import { LoadingScreen } from "./LoadingScreen";
import { BreathingModal } from "./BreathingModal";
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

  // Determine current theme based on last logged mood
  const lastMoodEntry = state.moods.find(m => m.date === state.lastMoodDate);
  const currentTheme = lastMoodEntry ? THEME_COLORS[lastMoodEntry.mood] : "bg-[#f2f2f2]";

  // Simulate loading screen on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5s loading screen
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <InstallGuard>
      <MobileGuard>
        <div className={cn("min-h-screen pb-24 font-sans text-gray-800 overflow-x-hidden transition-colors duration-1000", currentTheme)}>
          {state.userProfile && location.pathname !== "/onboarding" && <DailyMoodPopup />}
          
          <main className="max-w-md mx-auto min-h-screen relative">
            <Outlet />
          </main>
          
          {state.userProfile && location.pathname !== "/onboarding" && (
            <>
              <button
                onClick={() => setIsBreathingOpen(true)}
                className="fixed bottom-24 right-4 z-40 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 text-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
                title="Panic Button (Breathe)"
              >
                <Wind className="w-6 h-6" />
              </button>
              <BottomNav />
            </>
          )}

          <BreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />
        </div>
      </MobileGuard>
    </InstallGuard>
  );
}
