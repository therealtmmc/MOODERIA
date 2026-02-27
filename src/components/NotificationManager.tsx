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

    const checkNotifications = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const currentDay = format(now, "EEE"); // Mon, Tue...
      const currentDate = format(now, "yyyy-MM-dd");

      // Avoid double firing in the same minute
      if (lastCheckedMinute.current === currentTime) return;
      lastCheckedMinute.current = currentTime;

      // Check Routines
      state.routines.forEach((routine) => {
        if (
          routine.active &&
          routine.time === currentTime &&
          routine.days.includes(currentDay)
        ) {
          sendNotification("Routine Reminder", `It's time for: ${routine.name} ✨`);
        }
      });

      // Check Events
      state.events.forEach((event) => {
        if (event.date === currentDate && event.time === currentTime) {
          sendNotification("Event Reminder", `Happening now: ${event.title} 📅`);
        }
      });
    };

    const interval = setInterval(checkNotifications, 1000);
    return () => clearInterval(interval);
  }, [state.routines, state.events]);

  const sendNotification = (title: string, body: string) => {
    // Play Sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"); // Simple bell sound
    audio.play().catch((e) => console.log("Audio play failed", e));

    // Show Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/logo.png",
        requireInteraction: true,
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, {
            body: body,
            icon: "/logo.png",
            requireInteraction: true,
          });
        }
      });
    }
  };

  return null;
}
