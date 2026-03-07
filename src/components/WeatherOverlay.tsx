import { motion } from "motion/react";
import { useStore } from "@/context/StoreContext";

export function WeatherOverlay() {
  const { state } = useStore();
  const lastMood = state.moods[state.moods.length - 1]?.mood || "Neutral";

  const getWeatherEffect = (mood: string) => {
    switch (mood) {
      case "Sad": return "🌧️"; // Rain
      case "Energetic": return "☀️"; // Sun
      default: return "";
    }
  };

  const effect = getWeatherEffect(lastMood);

  return (
    <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
      {effect && (
        <motion.div
          className="text-9xl opacity-30"
          initial={{ y: -100 }}
          animate={{ y: "100vh" }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        >
          {effect}
        </motion.div>
      )}
    </div>
  );
}
