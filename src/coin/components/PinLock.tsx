import React, { useState } from 'react';
import { Lock, Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinLockProps {
  correctPin: string;
  onUnlock: () => void;
}

export function PinLock({ correctPin, onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumber = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
        <Lock className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">App Locked</h1>
      <p className="text-gray-500 dark:text-gray-400 font-bold mb-12">Enter your PIN to access Mooderia Coin</p>

      <div className="flex gap-4 mb-12">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-300",
              pin.length > i ? "bg-primary scale-110" : "bg-gray-200 dark:bg-gray-800",
              error && "bg-red-500 animate-bounce"
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="w-20 h-20 rounded-full text-3xl font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleNumber('0')}
          className="w-20 h-20 rounded-full text-3xl font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-20 h-20 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center"
        >
          <Delete className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
