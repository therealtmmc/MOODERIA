import { useEffect, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";

export function NotificationManager() {
  const { state } = useStore();
  const lastCheckedMinute = useRef<string | null>(null);

  useEffect(() => {
    // Request permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkRoutines = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const currentDay = format(now, "EEE"); // Mon, Tue...

      // Avoid double firing in the same minute
      if (lastCheckedMinute.current === currentTime) return;
      lastCheckedMinute.current = currentTime;

      state.routines.forEach((routine) => {
        if (
          routine.active &&
          routine.time === currentTime &&
          routine.days.includes(currentDay)
        ) {
          sendNotification(routine.name);
        }
      });
    };

    const interval = setInterval(checkRoutines, 1000);
    return () => clearInterval(interval);
  }, [state.routines]);

  const sendNotification = (routineName: string) => {
    // Play Sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"); // Simple bell sound
    audio.play().catch((e) => console.log("Audio play failed", e));

    // Show Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Mooderia Routine", {
        body: `It's time for: ${routineName} ✨`,
        icon: "/logo.png",
        requireInteraction: true,
      });
    }
  };

  return null;
}
