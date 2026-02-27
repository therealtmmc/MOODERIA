import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { MobileGuard } from "./MobileGuard";
import { InstallGuard } from "./InstallGuard";
import { DailyMoodPopup } from "./DailyMoodPopup";
import { LoadingScreen } from "./LoadingScreen";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";

export function Layout() {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

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
          routine.time === currentTime &&
          routine.days.includes(currentDay)
        ) {
          // Check if we already alerted for this routine today/time (simple debounce)
          // For MVP, just alert. In production, track alerted IDs.
          if (Notification.permission === "granted") {
            new Notification(`Time for ${routine.name}!`, {
              body: `It's ${routine.time}. Let's do this!`,
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
        <div className="min-h-screen bg-[#f2f2f2] pb-24 font-sans text-gray-800 overflow-x-hidden">
          {state.userProfile && location.pathname !== "/onboarding" && <DailyMoodPopup />}
          <main className="max-w-md mx-auto min-h-screen relative">
            <Outlet />
          </main>
          {state.userProfile && location.pathname !== "/onboarding" && <BottomNav />}
        </div>
      </MobileGuard>
    </InstallGuard>
  );
}
