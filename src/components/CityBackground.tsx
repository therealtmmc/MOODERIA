import { useMemo, memo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DistrictTheme } from "@/constants/districts";

export const CityBackground = memo(function CityBackground({ isNight, district, weather, cityLevel = 1 }: { isNight: boolean, district?: DistrictTheme, weather: string, cityLevel?: number }) {
  const sunMoonPos = () => {
    const d = new Date();
    const hour = d.getHours() + d.getMinutes() / 60;
    
    if (hour >= 6 && hour < 18) {
      // Day cycle: 6am to 6pm
      return ((hour - 6) / 12) * 100;
    } else {
      // Night cycle: 6pm to 6am
      let nightHour = hour >= 18 ? hour - 18 : hour + 6;
      return (nightHour / 12) * 100;
    }
  };

  const sunMoonVerticalPos = () => {
    const x = sunMoonPos();
    // Parabola effect: peak at 50% (middle of the day/night)
    const peak = Math.sin((x * Math.PI) / 100);
    // Highest point is 10%, lowest is 60%
    return 60 - (peak * 50);
  };

  const getAtmosphere = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "from-orange-100 to-blue-200"; // Sunrise
    if (hour >= 10 && hour < 17) {
      if (weather === 'Rainy') return "from-slate-400 to-slate-600";
      if (weather === 'Cloudy') return "from-gray-300 to-gray-400";
      return "from-blue-100 to-emerald-100"; // Day
    }
    if (hour >= 17 && hour < 20) return "from-orange-200 to-purple-300"; // Sunset
    return "from-indigo-900 via-purple-900 to-black"; // Night
  };

  // Generate buildings based on city level
  const buildings = useMemo(() => {
    const bList = [];
    const count = Math.min(12 + Math.floor(cityLevel / 2), 24); // More buildings as you level up
    
    for (let i = 0; i < count; i++) {
      let heightMultiplier = 1;
      let widthMultiplier = 1;
      let type = "house"; // default

      if (cityLevel >= 6 && cityLevel < 16) {
        // Mid-rise
        heightMultiplier = 1.5 + Math.random();
        type = Math.random() > 0.5 ? "midrise" : "house";
      } else if (cityLevel >= 16) {
        // Skyscrapers
        heightMultiplier = 2 + Math.random() * 2;
        widthMultiplier = 0.8 + Math.random() * 0.5;
        type = Math.random() > 0.3 ? "skyscraper" : "midrise";
      }

      const windowCount = type === "skyscraper" ? 12 : type === "midrise" ? 6 : 2;
      const windows = Array.from({ length: windowCount }).map((_, j) => ({
        id: j,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2
      }));

      bList.push({
        id: i,
        width: `${(Math.random() * 8 + 5) * widthMultiplier}%`,
        height: `${(Math.random() * 30 + 10) * heightMultiplier}%`,
        type,
        windows
      });
    }
    return bList;
  }, [cityLevel]);

  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 bg-gradient-to-b", getAtmosphere())}>
      {/* Sun/Moon Path */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          style={{ 
            left: `${sunMoonPos()}%`, 
            top: `${sunMoonVerticalPos()}%`,
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          {isNight ? '🌙' : '☀️'}
        </motion.div>
      </motion.div>

      {/* Urban Constellations (Night Mode) */}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ 
                top: `${Math.random() * 80}%`, 
                left: `${Math.random() * 100}%` 
              }}
            />
          ))}
        </div>
      )}

      {/* Cartoon City Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-around px-2 opacity-50">
        {buildings.map((b) => (
          <motion.div
            key={b.id}
            className={cn(
              "border-t-4 border-x-4 flex flex-col justify-start items-center overflow-hidden",
              b.type === "house" ? "rounded-t-full" : "rounded-t-md",
              isNight 
                ? "bg-indigo-900 border-indigo-950" 
                : "bg-white/40 border-white/50 backdrop-blur-sm"
            )}
            style={{
              width: b.width,
              height: b.height,
            }}
          >
            {/* Windows */}
            <div className={cn(
              "grid gap-2 p-2 w-full",
              b.type === "skyscraper" ? "grid-cols-3" : b.type === "midrise" ? "grid-cols-2" : "grid-cols-1"
            )}>
                {b.windows.map((w) => (
                    <motion.div 
                        key={w.id} 
                        className={cn("w-full h-3 rounded-sm", isNight ? "bg-yellow-500/80" : "bg-white/60")}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: w.duration, delay: w.delay }}
                    />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
