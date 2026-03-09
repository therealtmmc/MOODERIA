import { motion } from "motion/react";

export function WeatherOverlay({ weather }: { weather: string }) {
  if (weather === "Sunny") {
    return (
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-200/20 to-transparent"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`sun-${i}`}
            className="absolute text-6xl opacity-20"
            initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
            animate={{ y: "-20vh", rotate: 360 }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    );
  }

  if (weather === "Rainy") {
    return (
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-0.5 h-4 bg-blue-400/40 rounded-full"
            initial={{ y: -20, x: Math.random() * window.innerWidth }}
            animate={{ y: "100vh" }}
            transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "linear", delay: Math.random() }}
          />
        ))}
      </div>
    );
  }

  if (weather === "Cloudy") {
    return (
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute text-8xl opacity-10"
            initial={{ x: "-20vw", y: Math.random() * window.innerHeight }}
            animate={{ x: "120vw" }}
            transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
          >
            ☁️
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}
