import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Smile, Frown, Meh, Heart, Zap, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MOODS = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50' },
  { id: 'loved', label: 'Loved', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'energetic', label: 'Energetic', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'tired', label: 'Tired', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export function MoodHourPopup() {
  const { state, dispatch } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we need to show the prompt (e.g., every 1 hour)
    // For demo purposes, we'll just show it if it hasn't been shown in the last 5 minutes
    const now = Date.now();
    const timeSinceLastPrompt = now - state.lastMoodHourPrompt;
    
    // 5 minutes = 300000 ms. Change to 3600000 for 1 hour.
    if (timeSinceLastPrompt > 300000 && state.profile) {
      setIsVisible(true);
    }
  }, [state.lastMoodHourPrompt, state.profile]);

  const handleSelect = (moodId: string) => {
    dispatch({
      type: 'ADD_MOOD',
      payload: {
        id: Date.now().toString(),
        timestamp: Date.now(),
        emotion: moodId
      }
    });
    dispatch({ type: 'SET_LAST_MOOD_PROMPT', payload: Date.now() });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 max-w-sm w-full shadow-2xl border-4 border-primary/20 dark:border-primary/40 text-center transition-colors duration-300"
          >
            <h2 className="text-3xl font-black text-primary dark:text-primary-light mb-2">Mood Hour!</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">How are you feeling right now?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelect(mood.id)}
                  className="clay-card p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <div className={cn("p-3 rounded-2xl", mood.bg, "dark:bg-opacity-20")}>
                    <mood.icon className={cn("w-8 h-8", mood.color)} />
                  </div>
                  <span className="font-bold text-xs uppercase dark:text-gray-200">{mood.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
