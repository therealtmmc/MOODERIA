import { useState, useEffect, useRef } from "react";
import { useStore, WorkoutLog, WalkLog } from "@/context/StoreContext";
import { Play, MapPin, StopCircle, Timer, Flame, X, Calendar, Sword, Shield, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { SuccessAnimation } from "@/components/SuccessAnimation";

import { ShareQRModal } from "@/components/ShareQRModal";
import { Share2, Edit2, Trash2, QrCode } from "lucide-react";

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
  const [showBuilderModal, setShowBuilderModal] = useState(false); // New Builder Modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [successStats, setSuccessStats] = useState("");
  
  // New Flexible Routine State
  type WorkoutStep = {
    type: "time" | "reps" | "rest";
    name: string;
    duration?: number; // seconds
    reps?: number;
  };
  
  const [activeRoutine, setActiveRoutine] = useState<WorkoutStep[] | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Builder State
  const [builderSteps, setBuilderSteps] = useState<WorkoutStep[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [routineDifficulty, setRoutineDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  const [newStep, setNewStep] = useState<{name: string, type: "time" | "reps", val: string}>({
    name: "", type: "reps", val: ""
  });
  const [restDuration, setRestDuration] = useState("");

  // Walk State
  const [isWalking, setIsWalking] = useState(false);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0); // meters
  const walkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Workout Logging State
  const [showLogModal, setShowLogModal] = useState(false);
  const [customExercises, setCustomExercises] = useState<{name: string, sets: string, reps: string, weight: string}[]>([
    { name: "", sets: "", reps: "", weight: "" }
  ]);
  const [shareData, setShareData] = useState<{ isOpen: boolean; data: any; title: string }>({ isOpen: false, data: null, title: "" });
  const [selectedRoutine, setSelectedRoutine] = useState<any | null>(null);

  const handleAddExerciseRow = () => {
    setCustomExercises([...customExercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const newExercises = [...customExercises];
    // @ts-ignore
    newExercises[index][field] = value;
    setCustomExercises(newExercises);
  };

  const handleRemoveExerciseRow = (index: number) => {
    const newExercises = customExercises.filter((_, i) => i !== index);
    setCustomExercises(newExercises);
  };

  const saveCustomWorkout = () => {
    // Filter out empty rows
    const validExercises = customExercises.filter(e => e.name && e.sets && e.reps);
    
    if (validExercises.length === 0) return;

    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Custom Workout",
      difficulty: "Medium",
      duration: 0, // Not tracked for manual entry
      reps: validExercises.reduce((acc, curr) => acc + (parseInt(curr.reps) * parseInt(curr.sets)), 0),
      exercises: validExercises.map(e => ({
        name: e.name,
        sets: parseInt(e.sets),
        reps: parseInt(e.reps),
        weight: e.weight ? parseFloat(e.weight) : undefined
      }))
    };

    dispatch({ type: "LOG_WORKOUT", payload: log });
    
    // Damage Boss
    const damage = Math.max(5, validExercises.length * 5);
    dispatch({ type: "DAMAGE_BOSS", payload: damage });
    
    if (state.boss.hp - damage <= 0) {
      dispatch({ type: "LEVEL_UP_BOSS" });
      setSuccessStats(`Defeated ${state.boss.name}! +50 Coins`);
    } else {
      setSuccessStats(`Dealt ${damage} DMG to ${state.boss.name}!`);
    }

    setShowLogModal(false);
    setCustomExercises([{ name: "", sets: "", reps: "", weight: "" }]);
    setShowSuccess(true);
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#e21b3c"],
    });
  };

  const startCustomRoutine = (routine?: WorkoutStep[]) => {
    const stepsToRun = routine || builderSteps;
    if (stepsToRun.length === 0) return;
    setActiveRoutine([...stepsToRun]);
    setCurrentStepIndex(0);
    setTimeLeft(stepsToRun[0].duration || 0);
    setIsActive(true);
    setShowBuilderModal(false);
  };

  const openBuilderForEdit = (routine: typeof customRoutines[0]) => {
    setBuilderSteps(routine.steps);
    setRoutineName(routine.name);
    setRoutineDifficulty(routine.difficulty || "Medium");
    setEditingRoutineId(routine.id);
    setShowBuilderModal(true);
  };

  const openBuilderNew = () => {
    setBuilderSteps([]);
    setRoutineName("");
    setRoutineDifficulty("Medium");
    setEditingRoutineId(null);
    setShowBuilderModal(true);
  };

  const saveCustomRoutine = () => {
    if (!routineName || builderSteps.length === 0) return;
    
    if (editingRoutineId) {
      dispatch({
        type: "EDIT_CUSTOM_ROUTINE",
        payload: {
          id: editingRoutineId,
          name: routineName,
          steps: builderSteps,
          difficulty: routineDifficulty
        }
      });
    } else {
      dispatch({
        type: "ADD_CUSTOM_ROUTINE",
        payload: {
          id: crypto.randomUUID(),
          name: routineName,
          steps: builderSteps,
          difficulty: routineDifficulty
        }
      });
    }
    
    setRoutineName("");
    setBuilderSteps([]);
    setEditingRoutineId(null);
    setShowBuilderModal(false);
    setShowSuccess(true);
    setSuccessStats("Strength +5");
  };

  const nextStep = () => {
    if (!activeRoutine) return;
    
    if (currentStepIndex < activeRoutine.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(activeRoutine[nextIndex].duration || 0);
    } else {
      completeWorkout();
    }
  };

  const stopWorkout = () => {
    setIsActive(false);
    setActiveRoutine(null);
    if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
  };

  useEffect(() => {
    if (!isActive || !activeRoutine) return;

    const currentStep = activeRoutine[currentStepIndex];

    // Only run timer for time-based steps (time or rest)
    if (currentStep.type === "time" || currentStep.type === "rest") {
      if (timeLeft > 0) {
        workoutTimerRef.current = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
        nextStep();
      }
    } else {
      // For reps, no timer runs automatically, user clicks Next
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    }

    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [isActive, timeLeft, currentStepIndex, activeRoutine]);

  const completeWorkout = () => {
    if (!activeRoutine) return;
    
    // Calculate total duration/reps from the routine
    const totalDuration = activeRoutine.reduce((acc, step) => acc + (step.duration || 0), 0);
    const totalReps = activeRoutine.reduce((acc, step) => acc + (step.reps || 0), 0);

    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Custom Session",
      difficulty: "Medium",
      duration: totalDuration,
      reps: totalReps,
      exercises: activeRoutine.filter(s => s.type !== "rest").map(s => ({
        name: s.name,
        sets: 1,
        reps: s.reps || 0,
        duration: s.duration
      }))
    };
    
    dispatch({ type: "LOG_WORKOUT", payload: log });
    
    // Damage Boss
    const damage = Math.max(10, Math.floor(totalDuration / 10) + Math.floor(totalReps / 2));
    dispatch({ type: "DAMAGE_BOSS", payload: damage });
    
    if (state.boss.hp - damage <= 0) {
      dispatch({ type: "LEVEL_UP_BOSS" });
      setSuccessStats(`Defeated ${state.boss.name}! +50 Coins`);
    } else {
      setSuccessStats(`Dealt ${damage} DMG to ${state.boss.name}!`);
    }

    stopWorkout();
    setShowSuccess(true);
    
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
      
      // Damage Boss
      const damage = Math.max(2, Math.floor(walkDistance / 100)); // 1 dmg per 100m
      dispatch({ type: "DAMAGE_BOSS", payload: damage });
      
      if (state.boss.hp - damage <= 0) {
        dispatch({ type: "LEVEL_UP_BOSS" });
        setSuccessStats(`Defeated ${state.boss.name}! +50 Coins`);
      } else {
        setSuccessStats(`Dealt ${damage} DMG to ${state.boss.name}!`);
      }

      setIsWalking(false);
      setWalkTime(0);
      setWalkDistance(0);
      setShowSuccess(true);
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

  // Safe Data Access
  const workouts = Array.isArray(state.workouts) ? state.workouts : [];
  const walks = Array.isArray(state.walks) ? state.walks : [];
  const customRoutines = Array.isArray(state.customRoutines) ? state.customRoutines : [];

  // Calculate Workout Streak
  const calculateWorkoutStreak = () => {
    try {
      if (workouts.length === 0) return 0;
      
      // Get unique dates of workouts, sorted descending
      const uniqueDates = Array.from<string>(new Set(workouts.map(w => w?.date).filter(Boolean)))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
      if (uniqueDates.length === 0) return 0;

      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
      
      // Check if streak is active (worked out today or yesterday)
      if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
      }

      let streak = 1;
      let currentDate = new Date(uniqueDates[0]);

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i]);
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          streak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
      return streak;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 0;
    }
  };

  const workoutStreak = calculateWorkoutStreak();

  // Calculate Weekly Stats
  const calculateWeeklyStats = () => {
    try {
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
      const end = endOfWeek(now, { weekStartsOn: 1 });

      const weeklyLogs = workouts.filter(w => {
        if (!w || !w.date) return false;
        try {
          const workoutDate = parseISO(w.date);
          return isWithinInterval(workoutDate, { start, end });
        } catch (e) {
          return false;
        }
      });

      const totalDuration = weeklyLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      const count = weeklyLogs.length;
      
      let avgIntensity = "N/A";
      if (count > 0) {
        const intensityScore = weeklyLogs.reduce((acc, curr) => {
          if (curr.difficulty === "Hard") return acc + 3;
          if (curr.difficulty === "Medium") return acc + 2;
          return acc + 1; // Easy
        }, 0) / count;

        if (intensityScore < 1.5) avgIntensity = "Easy";
        else if (intensityScore < 2.5) avgIntensity = "Medium";
        else avgIntensity = "Hard";
      }

      return { totalDuration, count, avgIntensity };
    } catch (error) {
      console.error("Error calculating weekly stats:", error);
      return { totalDuration: 0, count: 0, avgIntensity: "N/A" };
    }
  };

  const weeklyStats = calculateWeeklyStats();

  return (
    <div className="p-4 pt-8 pb-24 space-y-6 relative">
      <SuccessAnimation 
        type="workout" 
        isVisible={showSuccess} 
        onComplete={() => {setShowSuccess(false); setSuccessStats("");}} 
        stats={successStats}
      />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#e21b3c] flex items-center gap-2">
            <Sword className="w-8 h-8" /> The Arena
          </h1>
          <p className="text-gray-500 font-bold">Defeat monsters by working out!</p>
        </div>
        {workoutStreak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full border-2 border-orange-200">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-black text-orange-600">{workoutStreak} Day Streak</span>
          </div>
        )}
      </header>

      {/* Boss Battle UI */}
      <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden border-4 border-gray-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/30">
            Level {state.boss.level} Boss
          </div>
          
          <h2 className="text-3xl font-black text-white drop-shadow-md">{state.boss.name}</h2>
          
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-inner relative">
             <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               className="text-6xl drop-shadow-[0_0_15px_rgba(226,27,60,0.5)]"
             >
               👾
             </motion.div>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
              <span>HP</span>
              <span>{state.boss.hp} / {state.boss.maxHp}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: "100%" }}
                animate={{ width: `${(state.boss.hp / state.boss.maxHp) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <p className="text-gray-400 text-sm font-bold">Complete workouts to deal damage!</p>
        </div>
      </div>

      {/* Streak Visualizer */}
      {workoutStreak > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Flame className="w-48 h-48" />
          </div>
          <h3 className="font-black text-lg mb-2 relative z-10">Workout Streak</h3>
          <div className="flex flex-wrap gap-2 relative z-10">
            {Array.from({ length: Math.min(workoutStreak, 14) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
              >
                <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-md" />
              </motion.div>
            ))}
            {workoutStreak > 14 && (
              <div className="flex items-center justify-center bg-white/20 px-3 rounded-xl font-black text-sm">
                +{workoutStreak - 14} more
              </div>
            )}
          </div>
          <p className="text-xs font-bold mt-3 opacity-90 relative z-10">
            You're on fire! Keep it up! 🔥
          </p>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="bg-white p-5 rounded-3xl shadow-md border-b-4 border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-[#e21b3c]">
          <Calendar className="w-5 h-5" />
          <h3 className="font-black text-lg uppercase">This Week</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 divide-x divide-gray-100">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Duration</p>
            <p className="font-black text-xl text-gray-800">
              {Math.round(weeklyStats.totalDuration / 60)}<span className="text-sm text-gray-400 ml-1">min</span>
            </p>
          </div>
          <div className="text-center pl-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Workouts</p>
            <p className="font-black text-xl text-gray-800">{weeklyStats.count}</p>
          </div>
          <div className="text-center pl-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Avg Intensity</p>
            <p className={cn(
              "font-black text-lg",
              weeklyStats.avgIntensity === "Hard" ? "text-red-500" :
              weeklyStats.avgIntensity === "Medium" ? "text-orange-500" :
              weeklyStats.avgIntensity === "Easy" ? "text-green-500" : "text-gray-400"
            )}>
              {weeklyStats.avgIntensity}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Distance</span>
          <p className="text-2xl font-black text-[#e21b3c]">
            {(walks.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000).toFixed(2)} km
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase">Workouts</span>
          <p className="text-2xl font-black text-[#e21b3c]">{workouts.length}</p>
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
          onClick={openBuilderNew}
          disabled={isActive || isWalking}
          className="w-full bg-white text-[#e21b3c] p-4 rounded-2xl shadow-lg border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50"
        >
          <span className="font-black text-lg">Build Custom Routine</span>
          <span className="text-2xl">🏗️</span>
        </button>

        {/* Saved Routines List */}
        {customRoutines.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase ml-2">Your Saved Routines</p>
            {customRoutines.map((routine) => (
              <div 
                key={routine.id} 
                onClick={() => setSelectedRoutine(routine)}
                className="bg-white p-4 rounded-2xl shadow-md border-2 border-gray-100 relative overflow-hidden group cursor-pointer hover:border-[#e21b3c] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-lg text-gray-800">{routine.name}</h3>
                    <span className={cn(
                      "text-xs font-black uppercase px-2 py-0.5 rounded-full",
                      routine.difficulty === "Hard" ? "bg-red-100 text-red-600" :
                      routine.difficulty === "Medium" ? "bg-orange-100 text-orange-600" :
                      "bg-green-100 text-green-600"
                    )}>
                      {routine.difficulty || "Medium"}
                    </span>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShareData({ isOpen: true, data: routine, title: `Workout: ${routine.name}` })}
                      className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openBuilderForEdit(routine)}
                      className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-xs font-bold">Edit</span>
                    </button>
                    <button
                      onClick={() => dispatch({ type: "DELETE_CUSTOM_ROUTINE", payload: routine.id })}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs font-bold text-gray-400">
                    {routine.steps.length} Steps • {Math.round(routine.steps.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)} min
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startCustomRoutine(routine.steps);
                    }}
                    disabled={isActive || isWalking}
                    className="bg-[#e21b3c] text-white px-4 py-2 rounded-xl font-black text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2 disabled:opacity-50"
                  >
                    Start <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowLogModal(true)}
          disabled={isActive || isWalking}
          className="w-full bg-white text-[#e21b3c] p-4 rounded-2xl shadow-lg border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-between disabled:opacity-50"
        >
          <span className="font-black text-lg">Log Custom Workout</span>
          <span className="text-2xl">📝</span>
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
        {isActive && activeRoutine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#e21b3c] flex flex-col items-center justify-center text-white p-8"
          >
            <div className="text-center space-y-8 w-full max-w-md">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">
                  {activeRoutine[currentStepIndex].type === "rest" ? "Rest Time" : activeRoutine[currentStepIndex].name}
                </h2>
                <p className="text-xl font-bold opacity-80">
                  {activeRoutine[currentStepIndex].type === "rest" 
                    ? "Catch your breath!" 
                    : activeRoutine[currentStepIndex].type === "time" 
                      ? "Keep going!" 
                      : "Complete your reps"}
                </p>
              </div>

              {/* Timer or Reps Display */}
              {(activeRoutine[currentStepIndex].type === "time" || activeRoutine[currentStepIndex].type === "rest") ? (
                <div className={cn(
                  "w-64 h-64 rounded-full border-8 flex items-center justify-center relative mx-auto transition-colors duration-500",
                  activeRoutine[currentStepIndex].type === "rest" ? "border-blue-400 bg-blue-500/20" : "border-white/30"
                )}>
                  <div className="absolute inset-0 rounded-full border-8 border-white border-t-transparent animate-spin duration-[3s]" />
                  <span className="text-8xl font-black font-mono">{timeLeft}</span>
                </div>
              ) : (
                <div className="w-64 h-64 rounded-full border-8 border-white/30 flex flex-col items-center justify-center relative mx-auto bg-white/10">
                  <span className="text-6xl font-black font-mono">{activeRoutine[currentStepIndex].reps}</span>
                  <span className="text-xl font-bold uppercase mt-2">Reps</span>
                </div>
              )}
              
              <div className="flex justify-center gap-2 flex-wrap">
                {activeRoutine.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      idx === currentStepIndex ? "bg-white scale-125" : idx < currentStepIndex ? "bg-white/50" : "bg-black/20"
                    )} 
                  />
                ))}
              </div>

              <div className="space-y-4">
                {/* Next Button for Reps (or manual skip) */}
                {(activeRoutine[currentStepIndex].type === "reps" || activeRoutine[currentStepIndex].type === "time") && (
                  <button
                    onClick={nextStep}
                    className="w-full bg-white text-[#e21b3c] px-8 py-4 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    {activeRoutine[currentStepIndex].type === "reps" ? "Done / Next" : "Skip Timer"}
                  </button>
                )}

                <button
                  onClick={stopWorkout}
                  className="w-full bg-black/20 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-none hover:bg-black/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <StopCircle className="w-6 h-6" />
                  Quit Workout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Workout Builder Modal */}
      <AnimatePresence>
        {showBuilderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#e21b3c] max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#e21b3c] p-4 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-xl">Build Routine</h3>
                <button onClick={() => setShowBuilderModal(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {/* Step List */}
                {builderSteps.length > 0 ? (
                  <div className="space-y-2">
                    {builderSteps.map((step, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-black text-gray-800">{step.name}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase">
                            {step.type === "time" ? `${step.duration}s` : step.type === "reps" ? `${step.reps} Reps` : `${step.duration}s Rest`}
                          </p>
                        </div>
                        <button 
                          onClick={() => setBuilderSteps(builderSteps.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 font-bold">
                    Add exercises to build your routine
                  </div>
                )}

                {/* Add Exercise Form */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase">Add Exercise</p>
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={newStep.name}
                    onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 font-bold text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newStep.type}
                      // @ts-ignore
                      onChange={(e) => setNewStep({ ...newStep, type: e.target.value })}
                      className="p-2 rounded-lg border border-gray-300 font-bold text-sm bg-white"
                    >
                      <option value="reps">Reps</option>
                      <option value="time">Time (s)</option>
                    </select>
                    <input
                      type="number"
                      placeholder={newStep.type === "reps" ? "Count" : "Seconds"}
                      value={newStep.val}
                      onChange={(e) => setNewStep({ ...newStep, val: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 font-bold text-sm"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newStep.name || !newStep.val) return;
                      setBuilderSteps([...builderSteps, {
                        type: newStep.type,
                        name: newStep.name,
                        duration: newStep.type === "time" ? parseInt(newStep.val) : undefined,
                        reps: newStep.type === "reps" ? parseInt(newStep.val) : undefined
                      }]);
                      setNewStep({ name: "", type: "reps", val: "" });
                    }}
                    className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold text-sm"
                  >
                    Add Step
                  </button>
                </div>

                {/* Add Rest Form */}
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 space-y-3">
                  <p className="text-xs font-bold text-blue-400 uppercase">Add Rest</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Rest (Seconds)"
                      value={restDuration}
                      onChange={(e) => setRestDuration(e.target.value)}
                      className="w-full p-2 rounded-lg border border-blue-200 font-bold text-sm"
                    />
                    <button
                      onClick={() => {
                        if (!restDuration) return;
                        setBuilderSteps([...builderSteps, {
                          type: "rest",
                          name: "Rest",
                          duration: parseInt(restDuration)
                        }]);
                        setRestDuration("");
                      }}
                      className="bg-blue-500 text-white px-4 rounded-lg font-bold text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Save Routine Section */}
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 space-y-3">
                   <p className="text-xs font-bold text-orange-400 uppercase">Save Routine</p>
                   <input
                     type="text"
                     placeholder="Routine Name (e.g. Morning Cardio)"
                     value={routineName}
                     onChange={(e) => setRoutineName(e.target.value)}
                     className="w-full p-2 rounded-lg border border-orange-200 font-bold text-sm"
                   />
                   <div className="flex gap-2 items-center">
                     <span className="text-xs font-bold text-orange-400 uppercase">Difficulty:</span>
                     <select
                       value={routineDifficulty}
                       // @ts-ignore
                       onChange={(e) => setRoutineDifficulty(e.target.value)}
                       className="p-2 rounded-lg border border-orange-200 font-bold text-sm bg-white flex-1"
                     >
                       <option value="Easy">Easy</option>
                       <option value="Medium">Medium</option>
                       <option value="Hard">Hard</option>
                     </select>
                   </div>
                   <button
                     onClick={saveCustomRoutine}
                     disabled={!routineName || builderSteps.length === 0}
                     className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                   >
                     {editingRoutineId ? "Update Routine" : "Save for Later"}
                   </button>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                <button
                  onClick={() => startCustomRoutine()}
                  disabled={builderSteps.length === 0}
                  className="w-full bg-[#e21b3c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  Start Now (One-time)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Workout Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#e21b3c] max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#e21b3c] p-4 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-xl">Log Workout</h3>
                <button onClick={() => setShowLogModal(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {customExercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200 relative">
                    {index > 0 && (
                      <button 
                        onClick={() => handleRemoveExerciseRow(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Exercise Name</label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        placeholder="e.g. Bench Press"
                        className="w-full p-2 rounded-lg border border-gray-300 font-bold text-gray-700 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 font-bold text-gray-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 font-bold text-gray-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Kg/Lbs</label>
                        <input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 font-bold text-gray-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={handleAddExerciseRow}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-sm hover:border-[#e21b3c] hover:text-[#e21b3c] transition-colors"
                >
                  + Add Another Exercise
                </button>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                <button
                  onClick={() => {
                    saveCustomWorkout();
                    setShowLogModal(false);
                  }}
                  className="w-full bg-[#e21b3c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform"
                >
                  Save Log
                </button>
              </div>
            </motion.div>
          </div>
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
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#e21b3c] max-h-[80vh] overflow-y-auto"
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
                    onClick={() => {
                       const routineSteps: WorkoutStep[] = program.exercises.map(e => ({
                         type: "time",
                         name: e.name,
                         duration: e.duration,
                       }));
                       startCustomRoutine(routineSteps);
                       setShowWorkoutModal(false);
                    }}
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
      {/* Selected Routine Modal */}
      <AnimatePresence>
        {selectedRoutine && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 bg-[#e21b3c] text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-xl uppercase tracking-tight">{selectedRoutine.name}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                      {selectedRoutine.difficulty || "Medium"} • {Math.round(selectedRoutine.steps.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) / 60)} min
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRoutine(null)} 
                  className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest">Exercises</h3>
                <div className="space-y-3">
                  {selectedRoutine.steps.map((step: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-black text-gray-500 text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-800">{step.name}</h4>
                        <p className="text-xs font-bold text-gray-500">
                          {step.duration ? `${step.duration}s` : `${step.reps} reps`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t-2 border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    startCustomRoutine(selectedRoutine.steps);
                    setSelectedRoutine(null);
                  }}
                  disabled={isActive || isWalking}
                  className="flex-1 py-4 bg-[#e21b3c] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-[#c01733] active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-[#9e132a] active:border-b-0 active:translate-y-1 disabled:opacity-50"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start
                </button>
                <button
                  onClick={() => {
                    setShareData({ isOpen: true, data: selectedRoutine, title: `Workout: ${selectedRoutine.name}` });
                    setSelectedRoutine(null);
                  }}
                  className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                >
                  <QrCode className="w-5 h-5" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareQRModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        type="workout"
        data={shareData.data}
        title={shareData.title}
      />
    </div>
  );
}
