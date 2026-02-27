import { useState, useEffect, useRef } from "react";
import { useStore, WorkoutLog, WalkLog } from "@/context/StoreContext";
import { Play, MapPin, StopCircle, Timer, Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const WORKOUT_PROGRAMS = [
  {
    id: "abs_beginner",
    title: "Beginner Abs",
    description: "Core strength foundation",
    color: "bg-orange-500",
    exercises: [
      { name: "Crunches", duration: 30 },
      { name: "Plank", duration: 30 },
      { name: "Leg Raises", duration: 30 },
      { name: "Mountain Climbers", duration: 30 },
    ]
  },
  {
    id: "arms_beginner",
    title: "Beginner Arms",
    description: "Biceps & Triceps tone",
    color: "bg-blue-500",
    exercises: [
      { name: "Pushups (Knees)", duration: 30 },
      { name: "Tricep Dips", duration: 30 },
      { name: "Arm Circles", duration: 30 },
      { name: "Diamond Pushups", duration: 30 },
    ]
  },
  {
    id: "legs_beginner",
    title: "Beginner Legs",
    description: "Quads & Glutes power",
    color: "bg-green-500",
    exercises: [
      { name: "Squats", duration: 45 },
      { name: "Lunges", duration: 45 },
      { name: "Calf Raises", duration: 30 },
      { name: "Wall Sit", duration: 30 },
    ]
  }
];

export default function HealthPage() {
  const { state, dispatch } = useStore();
  
  // Workout State
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeProgram, setActiveProgram] = useState<typeof WORKOUT_PROGRAMS[0] | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Walk State
  const [isWalking, setIsWalking] = useState(false);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0); // meters
  const walkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Workout Logic
  const startProgram = (program: typeof WORKOUT_PROGRAMS[0]) => {
    setActiveProgram(program);
    setCurrentExerciseIndex(0);
    setIsResting(false);
    setTimeLeft(program.exercises[0].duration);
    setIsActive(true);
    setShowWorkoutModal(false);
  };

  const stopWorkout = () => {
    setIsActive(false);
    setActiveProgram(null);
    if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      workoutTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
      
      if (isResting) {
        // Rest finished, start next exercise
        if (activeProgram && currentExerciseIndex < activeProgram.exercises.length - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setIsResting(false);
          setTimeLeft(activeProgram.exercises[currentExerciseIndex + 1].duration);
        } else {
          // Workout finished!
          completeWorkout();
        }
      } else {
        // Exercise finished, start rest
        if (activeProgram && currentExerciseIndex < activeProgram.exercises.length - 1) {
          setIsResting(true);
          setTimeLeft(15); // 15s rest
        } else {
          completeWorkout();
        }
      }
    }
    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [isActive, timeLeft, isResting, currentExerciseIndex, activeProgram]);

  const completeWorkout = () => {
    if (!activeProgram) return;
    
    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: activeProgram.title,
      difficulty: "Medium",
      duration: activeProgram.exercises.reduce((acc, ex) => acc + ex.duration, 0),
      reps: activeProgram.exercises.length,
    };
    
    dispatch({ type: "LOG_WORKOUT", payload: log });
    stopWorkout();
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#e21b3c"],
    });
  };

  // Walk Logic
  const toggleWalk = () => {
    if (isWalking) {
      // Stop
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      
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
      if (!("geolocation" in navigator)) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      setIsWalking(true);
      
      // Timer
      walkTimerRef.current = setInterval(() => {
        setWalkTime((prev) => prev + 1);
      }, 1000);

      // Geolocation Tracking
      let lastLat: number | null = null;
      let lastLng: number | null = null;

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      const success = (pos: GeolocationPosition) => {
        const crd = pos.coords;
        
        if (lastLat !== null && lastLng !== null) {
          const dist = getDistanceFromLatLonInM(lastLat, lastLng, crd.latitude, crd.longitude);
          // Filter small GPS jitters (less than 2m)
          if (dist > 2) {
             setWalkDistance((prev) => prev + dist);
             lastLat = crd.latitude;
             lastLng = crd.longitude;
          }
        } else {
          lastLat = crd.latitude;
          lastLng = crd.longitude;
        }
      };

      const error = (err: GeolocationPositionError) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        // Fallback to simulated distance if GPS fails (e.g. indoors/preview)
        // setWalkDistance((prev) => prev + 1); 
      };

      watchIdRef.current = navigator.geolocation.watchPosition(success, error, options);
    }
  };

  // Haversine formula to calculate distance
  function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d * 1000; // Distance in m
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }

  useEffect(() => {
    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
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
          disabled={isActive || isWalking}
          className="w-full bg-[#e21b3c] text-white p-4 rounded-2xl shadow-lg border-b-4 border-[#b0152e] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4"
        >
          <span className="font-black text-lg">Start Workout Program</span>
          <Play className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={toggleWalk}
          disabled={isActive}
          className={cn(
            "w-full p-4 rounded-2xl shadow-lg border-b-4 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50",
            isWalking
              ? "bg-gray-800 text-white border-gray-900"
              : "bg-white text-[#e21b3c] border-gray-200"
          )}
        >
          <span className="font-black text-lg">{isWalking ? "Stop Walking" : "Track Walk (GPS)"}</span>
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
        {isActive && activeProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#e21b3c] flex flex-col items-center justify-center text-white p-8"
          >
            <div className="text-center space-y-8 w-full max-w-md">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">{activeProgram.title}</h2>
                <p className="text-xl font-bold opacity-80">
                  {isResting ? "REST TIME" : activeProgram.exercises[currentExerciseIndex].name}
                </p>
              </div>

              <div className={cn(
                "w-64 h-64 rounded-full border-8 flex items-center justify-center relative mx-auto transition-colors duration-500",
                isResting ? "border-blue-400 bg-blue-500/20" : "border-white/30"
              )}>
                <div className="absolute inset-0 rounded-full border-8 border-white border-t-transparent animate-spin duration-[3s]" />
                <span className="text-8xl font-black font-mono">{timeLeft}</span>
              </div>
              
              <div className="flex justify-center gap-2">
                {activeProgram.exercises.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      idx === currentExerciseIndex ? "bg-white" : idx < currentExerciseIndex ? "bg-white/50" : "bg-black/20"
                    )} 
                  />
                ))}
              </div>

              <button
                onClick={stopWorkout}
                className="bg-white text-[#e21b3c] px-8 py-4 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform flex items-center gap-2 mx-auto"
              >
                <StopCircle className="w-6 h-6" />
                Quit Workout
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
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#e21b3c] max-h-[80vh] overflow-y-auto"
            >
              <div className="bg-[#e21b3c] p-4 flex justify-between items-center sticky top-0 z-10">
                <h3 className="text-white font-black text-xl">Select Program</h3>
                <button onClick={() => setShowWorkoutModal(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {WORKOUT_PROGRAMS.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => startProgram(program)}
                    className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl border-2 border-gray-200 text-left transition-colors flex items-center gap-4 group"
                  >
                    <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm", program.color)}>
                      💪
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-lg group-hover:text-[#e21b3c] transition-colors">{program.title}</h4>
                      <p className="text-gray-500 text-sm font-bold">{program.description}</p>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        {program.exercises.length} Exercises • {Math.ceil(program.exercises.reduce((a,b)=>a+b.duration,0)/60)} Mins
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
