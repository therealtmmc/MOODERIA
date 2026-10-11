import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { Flame, ShieldAlert, Sparkles, Zap, CloudRain, RotateCcw, Crown, Target, Play } from 'lucide-react';
import { getFlameConfig, toRomanNumeral, t } from '../constants';
import RankUpCelebration from '../components/RankUpCelebration';

interface MoodPetSectionProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
}

const MoodPetSection: React.FC<MoodPetSectionProps> = ({ user, onUpdate, isDarkMode, language }) => {
  const [showReviveSuccess, setShowReviveSuccess] = useState(false);
  const [showPreviewRankUp, setShowPreviewRankUp] = useState(false);

  const streak = user.moodStreak || 0;
  const currentRank = Math.min(100, Math.max(1, user.petLevel || 1));
  const romanRank = toRomanNumeral(currentRank);
  const nextRomanRank = toRomanNumeral(Math.min(100, currentRank + 1));
  const isMaxRank = currentRank >= 100;

  const flame = getFlameConfig(streak);
  const isBroken = streak === 0;

  // Monthly revive management
  const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  const revivesUsed = (user.reviveMonth === currentMonthKey) ? (user.monthlyRevivesUsed || 0) : 0;
  const revivesRemaining = Math.max(0, 5 - revivesUsed);

  // Growth tiers based on permanent Roman Numeral Rank (1-100)
  const getEvolutionInfo = (rk: number, stk: number) => {
    if (stk <= 0) {
      return {
        stage: 'Slumbering Spirit',
        tagalogStage: 'Natutulog na Espiritu',
        power: Math.max(20, rk * 100),
        desc: 'Lost its spark due to broken streak. Start at Day 1 to climb to the next Rank. Your Rank never resets!',
        tagalogDesc: 'Nawala ang ningas dahil naputol ang streak. Magsimula sa Araw 1 upang umakyat ng Antas. Hindi mawawala ang iyong Rank!',
        aura: 'rgba(100, 116, 139, 0.2)'
      };
    } else if (rk <= 4) {
      return {
        stage: 'Ember Hatchling',
        tagalogStage: 'Munting Alitaptap',
        power: rk * 250 + stk * 20,
        desc: 'Beginning to channel the warmth of early consistency.',
        tagalogDesc: 'Nagsisimulang sumiklab dahil sa maagang sipag.',
        aura: 'rgba(249, 115, 22, 0.4)'
      };
    } else if (rk <= 9) {
      return {
        stage: 'Solar Lynx',
        tagalogStage: 'Gintong Mabangis',
        power: rk * 300 + stk * 25,
        desc: 'Radiates steady golden determination and feline grace.',
        tagalogDesc: 'Nagniningning sa gintong determinasyon.',
        aura: 'rgba(234, 179, 8, 0.5)'
      };
    } else if (rk <= 24) {
      return {
        stage: 'Blaze Phoenix',
        tagalogStage: 'Nag-aapoy na Fenix',
        power: rk * 350 + stk * 30,
        desc: 'Forged in crimson resilience and fiery will.',
        tagalogDesc: 'Pinaigting ng matatag na kalooban at apoy.',
        aura: 'rgba(239, 68, 68, 0.6)'
      };
    } else if (rk <= 49) {
      return {
        stage: 'Amethyst Chimera',
        tagalogStage: 'Lilang Alagang Makapangyarihan',
        power: rk * 400 + stk * 35,
        desc: 'Channels mysterious cosmic resonance through enduring habit.',
        tagalogDesc: 'Nagpapakita ng pambihirang lakas at hiwaga.',
        aura: 'rgba(168, 85, 247, 0.7)'
      };
    } else if (rk < 100) {
      return {
        stage: 'Celestial Arch-Guardian',
        tagalogStage: 'Langitnon na Tagapagtanggol',
        power: rk * 500 + stk * 40,
        desc: 'A transcendent mythical being forged through dozens of 10-day ascensions.',
        tagalogDesc: 'Isang dakilang nilalang na pinatibay ng maraming tagumpay.',
        aura: 'rgba(6, 182, 212, 0.85)'
      };
    } else {
      return {
        stage: 'Supreme Sovereign Titan',
        tagalogStage: 'Kataas-taasang Pinuno Titan',
        power: 100 * 600 + stk * 50,
        desc: 'The pinnacle Rank C guardian. Day streaks now ascend eternally without reset.',
        tagalogDesc: 'Ang tugatog na Antas C. Walang katapusan ang patuloy na streak.',
        aura: 'rgba(250, 204, 21, 1)'
      };
    }
  };

  const evolution = getEvolutionInfo(currentRank, streak);

  const handleRevive = () => {
    if (revivesRemaining <= 0) {
      alert(language === 'English' ? "You have reached your limit of 5 revives for this month." : "Naubos na ang 5 muling pagbuhay para sa buwang ito.");
      return;
    }

    // Broken streak returns to Day 1, while rank is permanently preserved
    onUpdate({
      moodStreak: 1,
      monthlyRevivesUsed: revivesUsed + 1,
      reviveMonth: currentMonthKey
    });

    setShowReviveSuccess(true);
    setTimeout(() => setShowReviveSuccess(false), 2500);
  };

  const handleRestartStreak = () => {
    // Start fresh at Day 1 (Rank never resets)
    onUpdate({
      moodStreak: 1
    });
  };

  const handleAdvanceDayStreak = () => {
    const nextStreak = streak + 1;
    onUpdate({
      moodStreak: nextStreak
    });
  };

  const handleSimulateBreakStreak = () => {
    onUpdate({
      moodStreak: 0,
      previousStreak: streak > 0 ? streak : 1
    });
  };

  return (
    <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-2xl relative overflow-hidden transition-all duration-700 space-y-6`}>
      {/* Background Ambience */}
      {isBroken ? (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-none z-0 flex items-start justify-end p-6">
          <CloudRain className="text-slate-400 opacity-20 animate-bounce" size={140} />
        </div>
      ) : (
        <div 
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: flame.color }}
        />
      )}

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Guardian Companion</span>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">{user.petName || 'Mood Guardian'}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Flame streak */}
          <div 
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-black text-xs uppercase shadow-lg border-b-4 transition-all"
            style={{ 
              backgroundColor: flame.color, 
              boxShadow: isBroken ? 'none' : flame.glow 
            }}
          >
            <Flame size={16} className={isBroken ? 'opacity-30' : 'animate-pulse'} />
            <span>{streak} {t('streak', language)}</span>
          </div>

          {/* ROMAN NUMERAL RANK BADGE */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs uppercase shadow-md flex items-center gap-1.5 border-b-4 border-amber-700">
            {isMaxRank && <Crown size={14} className="fill-slate-950" />}
            <span>Rank {romanRank}</span>
          </div>
        </div>
      </div>

      {/* 10-DAY STREAK TO NEXT RANK PROGRESS CARD & QUICK TEST ACTIONS */}
      <div className={`relative z-10 p-5 rounded-3xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-amber-50/70 border-amber-200/60'} border-2 space-y-3`}>
        <div className="flex justify-between items-center text-xs font-black uppercase">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-amber-500" />
            <span>
              {isMaxRank ? (
                language === 'English' ? 'Maximum Rank Achieved (C)' : 'Nakamit ang Pinakamataas na Antas (C)'
              ) : (
                language === 'English' 
                  ? `Ascension to Rank ${nextRomanRank}` 
                  : `Pag-angat sa Antas ${nextRomanRank}`
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-mono">
              {isMaxRank ? `Streak: ${streak}` : `${Math.min(streak, 10)} / 10 Days`}
            </span>

            {/* Quick Test & Simulation Controls (Strictly Icon Only) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAdvanceDayStreak}
                title={language === 'English' ? "Simulate +1 Day Streak (Rank Up at Day 10)" : "Subukan ang +1 Araw ng Streak (Mag-ra-rank up sa Araw 10)"}
                aria-label="Simulate +1 day streak"
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-all active:scale-95"
              >
                <Sparkles size={14} />
              </button>

              <button
                onClick={handleSimulateBreakStreak}
                title={language === 'English' ? "Simulate Streak Break (Returns to Day 1, Rank Preserved)" : "Subukan ang Pagkaputol ng Streak (Babalik sa Araw 1, Hindi Mawawala ang Rank)"}
                aria-label="Simulate streak break"
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow transition-all active:scale-95"
              >
                <ShieldAlert size={14} />
              </button>

              <button
                onClick={() => setShowPreviewRankUp(true)}
                title={language === 'English' ? "Preview Rank Up Animation" : "Silipin ang Animasyon ng Rank Up"}
                aria-label="Preview rank up animation"
                className="p-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 shadow transition-all active:scale-95"
              >
                <Crown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 10-Day Segment Indicators */}
        {!isMaxRank ? (
          <div>
            <div className="grid grid-cols-10 gap-1.5 h-3">
              {Array.from({ length: 10 }, (_, i) => {
                const dayNum = i + 1;
                const isCompleted = streak >= dayNum;
                return (
                  <div
                    key={dayNum}
                    className={`h-full rounded-md transition-all ${
                      isCompleted 
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                        : isDarkMode ? 'bg-white/10' : 'bg-black/10'
                    }`}
                    title={`Day ${dayNum}`}
                  />
                );
              })}
            </div>
            <p className="text-[10px] font-bold opacity-60 mt-2">
              {language === 'English'
                ? "Reach Day 10 to trigger Rank Up and cycle streak back to Day 1. Your Rank never resets."
                : "Abutin ang Araw 10 upang mag-Rank Up at magsimula muli sa Araw 1. Hindi mabubura ang iyong Rank kailanman."}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase">
            <Crown size={16} />
            <span>
              {language === 'English'
                ? "Rank 100 (C) unlocked! Your streak now climbs endlessly above 10 without resetting!"
                : "Bukas na ang Antas 100 (C)! Ang streak mo ay tuloy-tuloy nang tataas lagpas 10 nang hindi nagre-reset!"}
            </span>
          </div>
        )}
      </div>

      {/* Pet Avatar & Aura */}
      <div className="relative z-10 my-6 flex flex-col items-center justify-center">
        <div 
          className="relative p-10 rounded-[3.5rem] flex items-center justify-center transition-all duration-700"
          style={{
            background: isBroken 
              ? 'radial-gradient(circle, rgba(71,85,105,0.2) 0%, rgba(15,23,42,0) 70%)' 
              : `radial-gradient(circle, ${evolution.aura} 0%, rgba(0,0,0,0) 75%)`,
            boxShadow: isBroken ? 'none' : `0 0 55px ${evolution.aura}`
          }}
        >
          <motion.div
            animate={isBroken ? { y: [0, 4, 0], opacity: 0.6, rotate: [-2, 2, -2] } : { y: [0, -12, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: isBroken ? 3 : 2, repeat: Infinity, ease: "easeInOut" }}
            className={`text-8xl md:text-9xl select-none filter ${isBroken ? 'grayscale contrast-75' : 'drop-shadow-2xl'}`}
          >
            {user.petEmoji || '🦊'}
          </motion.div>
        </div>

        {/* Evolution Title & Subtitle */}
        <div className="mt-4 text-center space-y-1">
          <p 
            className="text-xl md:text-2xl font-black italic uppercase tracking-tight"
            style={{ color: isBroken ? '#94a3b8' : flame.color }}
          >
            {language === 'English' ? evolution.stage : evolution.tagalogStage}
          </p>
          <p className="text-xs font-bold opacity-60 max-w-md mx-auto">
            {language === 'English' ? evolution.desc : evolution.tagalogDesc}
          </p>
        </div>
      </div>

      {/* Power Level & Flame Aspect */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-black/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase opacity-40 tracking-widest">Aura Power Level</p>
            <p className="text-2xl font-black tracking-tight">{evolution.power} <span className="text-xs text-indigo-500 font-bold">BP</span></p>
          </div>
          <Zap className={isBroken ? "text-slate-400" : "text-amber-500 animate-pulse"} size={28} />
        </div>

        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-black/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase opacity-40 tracking-widest">Flame Aspect</p>
            <p className="text-xl font-black tracking-tight" style={{ color: flame.color }}>{flame.name}</p>
          </div>
          <Flame size={28} style={{ color: flame.color }} />
        </div>
      </div>

      {/* Broken Streak Atmosphere & Revive or Start at Day 1 */}
      {isBroken ? (
        <div className="relative z-10 p-6 md:p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl border-4 border-slate-700/50 space-y-4 text-left">
          <div className="flex items-center gap-3 text-amber-400">
            <ShieldAlert size={28} />
            <h4 className="text-xl font-black uppercase italic tracking-tight">{t('streakBroken', language)}</h4>
          </div>
          <p className="text-sm font-medium opacity-80 leading-relaxed">
            {t('streakBrokenMsg', language)}
          </p>
          <p className="text-xs font-bold text-amber-300">
            {language === 'English' 
              ? `Your Rank ${romanRank} is permanently preserved! Returning to Day 1 will allow you to conquer 10 days and ascend to Rank ${nextRomanRank}.`
              : `Ang iyong Antas ${romanRank} ay nananatili! Ang pagbabalik sa Araw 1 ay magbibigay-daan upang maabot muli ang 10 araw at umakyat sa Antas ${nextRomanRank}.`}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-white/10">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">{t('revivesLeft', language)}</p>
              <p className="text-lg font-black text-amber-300">{revivesRemaining} / 5</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Start Fresh at Day 1 (Strictly Icon Only) */}
              <button
                onClick={handleRestartStreak}
                title={language === 'English' ? "Start at Day 1 (Rank Preserved)" : "Magsimula sa Araw 1 (Nananatili ang Rank)"}
                aria-label="Start at Day 1"
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white shadow-xl flex items-center justify-center border-b-4 border-slate-950 active:translate-y-1 transition-all"
              >
                <Play size={22} className="fill-white" />
              </button>

              {/* Revive Streak button (Strictly Icon Only) */}
              <button
                onClick={handleRevive}
                disabled={revivesRemaining <= 0}
                title={`${t('reviveStreak', language)} (${revivesRemaining}/5)`}
                aria-label={t('reviveStreak', language)}
                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-xl flex items-center justify-center border-b-4 border-orange-800 active:translate-y-1 transition-all disabled:opacity-40"
              >
                <RotateCcw size={22} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-500 animate-spin" size={24} />
            <p className="text-xs font-bold opacity-80">
              {language === 'English' 
                ? `Maintain your consistency! Each 10-day milestone ascends your companion to the next Roman Rank.`
                : `Panatilihin ang iyong sipag! Bawat 10-araw na tagumpay ay nag-aangat sa iyong alaga sa susunod na Romanong Antas.`}
            </p>
          </div>
        </div>
      )}

      {/* Revive Success Banner */}
      <AnimatePresence>
        {showReviveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6"
          >
            <Flame className="text-orange-500 animate-bounce mb-4" size={80} />
            <h3 className="text-3xl font-black italic uppercase tracking-tight text-amber-400">Streak Restored!</h3>
            <p className="text-sm font-bold opacity-80 mt-2">Your companion's flame blazes once again at Day 1!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rank Up Celebration Preview / Test Modal */}
      <AnimatePresence>
        {showPreviewRankUp && (
          <RankUpCelebration
            oldRank={currentRank}
            newRank={Math.min(100, currentRank + 1)}
            onClose={() => setShowPreviewRankUp(false)}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodPetSection;
