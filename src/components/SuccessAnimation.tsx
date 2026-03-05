import { motion, AnimatePresence } from "motion/react";
import { Check, Calendar, Dumbbell, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

type AnimationType = "work" | "event" | "workout";

interface SuccessAnimationProps {
  type: AnimationType;
  isVisible: boolean;
  onComplete: () => void;
}

const CONFIG = {
  work: {
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-100",
    message: "Task Done!",
    borderColor: "border-blue-500"
  },
  event: {
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-100",
    message: "Event Added!",
    borderColor: "border-green-500"
  },
  workout: {
    icon: Dumbbell,
    color: "text-red-500",
    bg: "bg-red-100",
    message: "Workout Logged!",
    borderColor: "border-red-500"
  }
};

export function SuccessAnimation({ type, isVisible, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 ${config.borderColor} flex flex-col items-center gap-4`}
          >
            <div className={`w-24 h-24 rounded-full ${config.bg} flex items-center justify-center border-4 border-white shadow-inner`}>
              <Icon className={`w-12 h-12 ${config.color}`} />
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg"
            >
              <Check className="w-6 h-6 stroke-[4px]" />
            </motion.div>

            <h3 className={`text-2xl font-black ${config.color} uppercase tracking-wide`}>
              {config.message}
            </h3>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
