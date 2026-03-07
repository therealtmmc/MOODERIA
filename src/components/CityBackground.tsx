import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function CityBackground({ isNight }: { isNight: boolean }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Sky */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-1000",
        isNight ? "bg-indigo-950" : "bg-sky-300"
      )} />

      {/* Moving Clouds */}
      <motion.div
        className="absolute top-20 left-0 text-9xl opacity-40"
        animate={{ x: [-200, 1000] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        ☁️☁️☁️
      </motion.div>

      {/* Sun/Moon - Cartoon style */}
      <motion.div
        className={cn(
          "absolute top-16 right-16 w-32 h-32 rounded-full",
          isNight 
            ? "bg-yellow-100 shadow-[0_0_30px_rgba(254,252,232,0.8)]" 
            : "bg-yellow-300 shadow-[0_0_50px_rgba(253,224,71,0.8)] border-4 border-yellow-400"
        )}
        animate={{ y: isNight ? 0 : 10 }}
      />

      {/* Cartoon City Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-72 flex items-end justify-around px-2">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-t-2xl border-t-4 border-x-4",
              isNight 
                ? "bg-indigo-800 border-indigo-900" 
                : "bg-sky-600 border-sky-700"
            )}
            style={{
              width: `${Math.random() * 10 + 8}%`,
              height: `${Math.random() * 50 + 20}%`,
            }}
          >
            {/* Windows */}
            <div className="grid grid-cols-2 gap-2 p-2">
                {[...Array(4)].map((_, j) => (
                    <motion.div 
                        key={j} 
                        className={cn("w-full h-4 rounded-sm", isNight ? "bg-yellow-500" : "bg-sky-400")}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 + Math.random() * 2 }}
                    />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
