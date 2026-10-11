import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, X, BellOff, Volume2, VolumeX, Vibrate } from 'lucide-react';

export interface ActiveAlarmData {
  id: string;
  title: string;
  type: 'task' | 'event';
  time: string;
  date?: string;
}

interface AlarmOverlayProps {
  alarm: ActiveAlarmData;
  alarmMode: 'silent' | 'vibrate' | 'vibrate_sound';
  onDismiss: () => void;
  onSnooze: () => void;
  isDarkMode?: boolean;
  language?: 'English' | 'Filipino';
}

const AlarmOverlay: React.FC<AlarmOverlayProps> = ({
  alarm,
  alarmMode,
  onDismiss,
  onSnooze,
  isDarkMode = false,
  language = 'English'
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundIntervalRef = useRef<any>(null);
  const vibrateIntervalRef = useRef<any>(null);

  // Play periodic alert chime for vibrate_sound mode
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 2-tone melodic alarm beep (high-low-high)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(880, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);
    } catch (e) {
      console.warn("Alarm audio error", e);
    }
  };

  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600]);
      } catch (e) {
        console.warn("Vibration error", e);
      }
    }
  };

  useEffect(() => {
    // 1. Audio mode handling
    if (alarmMode === 'vibrate_sound') {
      playChime();
      soundIntervalRef.current = setInterval(() => {
        playChime();
      }, 1400);
    }

    // 2. Vibration mode handling
    if (alarmMode === 'vibrate' || alarmMode === 'vibrate_sound') {
      triggerVibration();
      vibrateIntervalRef.current = setInterval(() => {
        triggerVibration();
      }, 2000);
    }

    return () => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      if (vibrateIntervalRef.current) clearInterval(vibrateIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(0); // Stop vibration
        } catch (e) {}
      }
    };
  }, [alarmMode]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        className="w-full max-w-lg rounded-[3.5rem] bg-gradient-to-b from-[#2a0e5b] via-[#1d0940] to-[#120529] text-white p-8 md:p-12 shadow-[0_0_80px_rgba(124,58,237,0.5)] border-4 border-purple-500/30 text-center relative overflow-hidden"
      >
        {/* Animated Background Pulse Waves */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-96 h-96 rounded-full border-4 border-purple-400 animate-ping" />
        </div>

        {/* App Logo & Alarm Icon */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/logo.png" 
            alt="Mooderia Logo" 
            className="w-12 h-12 object-contain rounded-2xl drop-shadow-lg border-2 border-white/20" 
          />
          <span className="font-black text-2xl italic tracking-wider text-white">MOODERIA</span>
        </div>

        {/* Pulsing Alarm Bell Icon */}
        <div className="relative mb-5 mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-xl animate-pulse" />
          <motion.div
            animate={{ rotate: [-12, 12, -12, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl border-4 border-purple-300"
          >
            <Bell size={40} className="text-white fill-white" />
          </motion.div>
        </div>

        {/* Alarm Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-purple-200 border border-white/20 text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm">
          <Clock size={12} className="animate-spin" />
          <span>{alarm.type === 'task' ? 'ROUTINE TASK ALARM' : 'SCHEDULED EVENT ALARM'}</span>
        </div>

        {/* Alarm Title & Timing */}
        <h2 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase leading-tight text-white drop-shadow-md mb-3">
          {alarm.title}
        </h2>

        <p className="text-lg md:text-xl font-mono font-black text-amber-300 tracking-wider mb-2">
          {alarm.time} {alarm.date ? `• ${alarm.date}` : ''}
        </p>

        {/* Mode Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 text-[10px] font-black uppercase opacity-80 tracking-wider mb-8">
          {alarmMode === 'vibrate_sound' && (
            <>
              <Volume2 size={12} className="text-emerald-400" />
              <span>Vibrate + Sound Active</span>
            </>
          )}
          {alarmMode === 'vibrate' && (
            <>
              <Vibrate size={12} className="text-yellow-400" />
              <span>Vibration Only Mode</span>
            </>
          )}
          {alarmMode === 'silent' && (
            <>
              <VolumeX size={12} className="text-slate-400" />
              <span>Silent Visual Overlay</span>
            </>
          )}
        </div>

        {/* Action Buttons: Snooze & Dismiss */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Snooze (5 min) */}
          <button
            onClick={onSnooze}
            className="kahoot-button-yellow py-4 px-6 rounded-2xl text-slate-950 font-black text-sm uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Clock size={20} />
            <span>{language === 'English' ? 'Snooze 5 Min' : 'I-snooze (5 Min)'}</span>
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="kahoot-button-red py-4 px-6 rounded-2xl text-white font-black text-sm uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BellOff size={20} />
            <span>{language === 'English' ? 'Dismiss Alarm' : 'I-dismiss ang Alarma'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlarmOverlay;
