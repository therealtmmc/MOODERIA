import { useState, useEffect, useRef } from "react";
import { useStore, WorkoutLog, WalkLog } from "@/context/StoreContext";
import { Play, MapPin, StopCircle, Timer, Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const WORKOUT_TYPES = ["Pushups", "Squats", "Situps", "Jumping Jacks", "Plank"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function HealthPage() {
  const { state, dispatch } = useStore();
  
  // Workout State
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<{ type: string; difficulty: string; startTime: number } | null>(null);
  const [workoutTime, setWorkoutTime] = useState(0);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Walk State
  const [isWalking, setIsWalking] = useState(false);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0); // meters
  const walkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Workout Logic
  const startWorkout = (type: string, difficulty: string) => {
    setActiveWorkout({ type, difficulty, startTime: Date.now() });
    setShowWorkoutModal(false);
    setWorkoutTime(0);
    workoutTimerRef.current = setInterval(() => {
      setWorkoutTime((prev) => prev + 1);
    }, 1000);
  };

  const stopWorkout = () => {
    if (activeWorkout && workoutTimerRef.current) {
      clearInterval(workoutTimerRef.current);
      const log: WorkoutLog = {
        id: crypto.randomUUID(),
        date: format(new Date(), "yyyy-MM-dd"),
        type: activeWorkout.type,
        difficulty: activeWorkout.difficulty as any,
        duration: workoutTime,
        reps: Math.floor(workoutTime / 3), // Mock reps calculation
      };
      dispatch({ type: "LOG_WORKOUT", payload: log });
      setActiveWorkout(null);
      setWorkoutTime(0);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e21b3c", "#ffffff"],
      });
    }
  };

  // Walk Logic
  const toggleWalk = () => {
    if (isWalking) {
      // Stop
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
      const log: WalkLog = {
        id: crypto.randomUUID(),
        date: format(new Date(), "yyyy-MM-dd"),
        distance: walkDistance,
        duration: walkTime,
      };
      dispatch({ type: "LOG_WALK", payload: log });
      setIsWalking(false);
      setWalkTime(0);
      setWalkDistance(0);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#26890c", "#ffffff"],
      });
    } else {
      // Start
      setIsWalking(true);
      walkTimerRef.current = setInterval(() => {
        setWalkTime((prev) => prev + 1);
        setWalkDistance((prev) => prev + (Math.random() * 1.5 + 0.5)); // Simulate 0.5-2m per second
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 pt-8 pb-24 space-y-6 relative">
      <header>
        <h1 className="text-3xl font-black text-[#e21b3c]">Health</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Distance</span>
          <p className="text-2xl font-black text-[#e21b3c]">
            {(state.walks.reduce((acc, curr) => acc + curr.distance, 0) / 1000).toFixed(2)} km
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase">Workouts</span>
          <p className="text-2xl font-black text-[#e21b3c]">{state.workouts.length}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => setShowWorkoutModal(true)}
          disabled={!!activeWorkout || isWalking}
          className="w-full bg-[#e21b3c] text-white p-4 rounded-2xl shadow-lg border-b-4 border-[#b0152e] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4"
        >
          <span className="font-black text-lg">Start Workout</span>
          <Play className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={toggleWalk}
          disabled={!!activeWorkout}
          className={cn(
            "w-full p-4 rounded-2xl shadow-lg border-b-4 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50",
            isWalking
              ? "bg-gray-800 text-white border-gray-900"
              : "bg-white text-[#e21b3c] border-gray-200"
          )}
        >
          <span className="font-black text-lg">{isWalking ? "Stop Walking" : "Track Walk"}</span>
          {isWalking ? <StopCircle className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
        </button>
      </div>

      {/* Active Walk Overlay */}
      <AnimatePresence>
        {isWalking && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-[#e21b3c] mt-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-[#e21b3c] flex items-center gap-2">
                <MapPin className="w-6 h-6 animate-bounce" />
                Walking...
              </h3>
              <div className="bg-red-100 text-[#e21b3c] px-3 py-1 rounded-full font-bold text-sm animate-pulse">
                Recording
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase">Time</p>
                <p className="text-3xl font-black text-gray-800 font-mono">{formatTime(walkTime)}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase">Distance</p>
                <p className="text-3xl font-black text-gray-800 font-mono">{Math.floor(walkDistance)}m</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Workout Overlay (Full Screen) */}
      <AnimatePresence>
        {activeWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#e21b3c] flex flex-col items-center justify-center text-white p-8"
          >
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-wider mb-2">{activeWorkout.type}</h2>
                <p className="text-xl font-bold opacity-80">{activeWorkout.difficulty}</p>
              </div>

              <div className="w-64 h-64 rounded-full border-8 border-white/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-8 border-white border-t-transparent animate-spin duration-[3s]" />
                <span className="text-6xl font-black font-mono">{formatTime(workoutTime)}</span>
              </div>

              <button
                onClick={stopWorkout}
                className="bg-white text-[#e21b3c] px-8 py-4 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform flex items-center gap-2 mx-auto"
              >
                <StopCircle className="w-6 h-6" />
                Finish Workout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Selection Modal */}
      <AnimatePresence>
        {showWorkoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#e21b3c]"
            >
              <div className="bg-[#e21b3c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">Start Workout</h3>
                <button onClick={() => setShowWorkoutModal(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Exercise</label>
                  <div className="grid grid-cols-2 gap-2">
                    {WORKOUT_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          // For simplicity, just pick first difficulty or show next step.
                          // Let's just default to Medium for now or add state.
                          startWorkout(type, "Medium");
                        }}
                        className="bg-gray-100 hover:bg-[#e21b3c] hover:text-white p-3 rounded-xl font-bold text-sm transition-colors text-gray-700"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
