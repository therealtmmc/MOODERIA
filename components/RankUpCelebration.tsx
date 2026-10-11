import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Sparkles, Check, Crown, Star } from 'lucide-react';
import { toRomanNumeral } from '../constants';

interface RankUpCelebrationProps {
  oldRank: number;
  newRank: number;
  onClose: () => void;
  language: 'English' | 'Filipino';
}

const RankUpCelebration: React.FC<RankUpCelebrationProps> = ({ oldRank, newRank, onClose, language }) => {
  useEffect(() => {
    // Triumphant Web Audio Fanfare (Offline & Instant)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.001, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + (idx === notes.length - 1 ? 0.9 : 0.28));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + (idx === notes.length - 1 ? 0.95 : 0.3));
        });
      }
    } catch (e) {
      console.warn("Audio fanfare failed:", e);
    }
  }, []);

  const oldRoman = toRomanNumeral(oldRank);
  const newRoman = toRomanNumeral(newRank);
  const isMaxRank = newRank >= 100;

  // Particle positions for celebratory burst
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 18,
    distance: 140 + (i % 3) * 40,
    size: 6 + (i % 4) * 4,
    color: i % 2 === 0 ? '#fbbf24' : '#f59e0b'
  }));

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden">
      {/* Background Radiance & Rotating Sunburst Rays */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full pointer-events-none opacity-25"
        style={{
          background: 'conic-gradient(from 0deg, #f59e0b, transparent, #ec4899, transparent, #6366f1, transparent, #f59e0b)'
        }}
      />

      {/* Floating Sparkles & Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.distance;
          const y = Math.sin(rad) * p.distance;
          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x, y, opacity: [0, 1, 0.8, 0], scale: [0, 1.4, 1, 0.4] }}
              transition={{ duration: 2.2, delay: 0.1 + (p.id * 0.05), repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 14px ${p.color}`
              }}
            />
          );
        })}
      </div>

      {/* Main Celebration Card */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: "spring", damping: 14, stiffness: 140 }}
        className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#1c1438] via-[#130d28] to-[#0a0717] rounded-[3.5rem] p-8 md:p-10 text-center shadow-[0_0_80px_rgba(245,158,11,0.35)] border-4 border-amber-400/40 text-white"
      >
        {/* Crown & Stars Header */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-2 mb-2"
        >
          <Star className="text-amber-400 fill-amber-400" size={18} />
          <Crown className="text-amber-300 animate-bounce" size={38} />
          <Star className="text-amber-400 fill-amber-400" size={18} />
        </motion.div>

        {/* Celebratory Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-300/80">
            {language === 'English' ? 'Milestone Reached' : 'Naabot na Tagumpay'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            RANK UP!
          </h2>
        </motion.div>

        {/* Grand Roman Numeral Showcase */}
        <div className="my-8 relative flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.25, 1], rotate: [ -30, 8, 0 ] }}
            transition={{ delay: 0.4, type: "spring", stiffness: 160 }}
            className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-1.5 shadow-[0_0_60px_rgba(251,191,36,0.6)] flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[2.8rem] bg-[#100b21] flex flex-col items-center justify-center border-2 border-amber-300/40 relative overflow-hidden">
              <Sparkles className="absolute top-3 right-3 text-amber-300 opacity-60" size={20} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300/60 mb-1">
                RANK
              </p>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                {newRoman}
              </h1>
              <p className="text-[9px] font-bold uppercase text-amber-200/70 mt-1">
                Level {newRank} / 100
              </p>
            </div>
          </motion.div>
        </div>

        {/* Transition Badge: Old Rank -> New Rank */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-5"
        >
          <span className="opacity-50">Rank {oldRoman}</span>
          <span className="text-amber-400 font-black">➔</span>
          <span className="text-amber-300 font-black">Rank {newRoman}</span>
        </motion.div>

        {/* Explanatory Streak Reset Details */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs font-bold text-amber-100/80 leading-relaxed mb-8 max-w-xs mx-auto"
        >
          {isMaxRank ? (
            language === 'English'
              ? "Supreme Rank C reached! Your day streak will now climb infinitely above 10 without resetting!"
              : "Naabot ang pinakamataas na Antas C! Ang iyong streak ay tuloy-tuloy nang tataas lagpas 10 araw nang hindi nagre-reset!"
          ) : (
            language === 'English'
              ? "You conquered 10 consecutive days! Your daily streak resets to 1 to begin the climb to the next Rank!"
              : "Nakamit mo ang 10 sunod-sunod na araw! Ang streak ay nagbalik sa Araw 1 upang simulan ang pag-akyat sa susunod na Antas!"
          )}
        </motion.p>

        {/* Action Button: Strictly Icon-Only */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={onClose}
            title={language === 'English' ? 'Claim & Continue' : 'Tanggapin at Magpatuloy'}
            aria-label="Claim and Continue"
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <Check size={30} strokeWidth={3} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RankUpCelebration;
