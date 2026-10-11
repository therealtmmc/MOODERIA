import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { Building2, Loader2, AlertTriangle, ArrowRight, ShieldCheck, Upload, FileJson } from 'lucide-react';
import { registerUser, loginUser, importUserDataJson } from '../services/supabaseService';
import { COUNTRIES } from '../constants';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].code);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setIsLoading(true);

    try {
      const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomSuffix = Math.floor(Math.random() * 10000);
      const username = `${cleanName}${randomSuffix}`;
      const dummyPassword = Math.random().toString(36).slice(-8);

      const newUser: User = {
        displayName: name.trim(),
        username: username,
        citizenCode: '',
        password: dummyPassword,
        country: selectedCountry,
        moodHistory: [],
        diaryEntries: [],
        schedule: [],
        routines: [],
        moodStreak: 0,
        tasksFinishedCount: 0,
        petName: 'Guardian',
        petEmoji: '🦊',
        petLevel: 1,
        petExp: 0,
        petHasBeenChosen: true,
        petBackground: 'default',
        unlockedBackgrounds: ['default'],
        friends: [],
        friendRequests: [],
        following: [],
        followers: [],
        likesReceived: 0,
        title: 'Citizen',
        profileBackground: 'metropolis-neon'
      };

      const result = await registerUser(newUser, dummyPassword);
      if (!result.success) {
        setError(result.error || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      // Automatically sign in with generated passport credentials
      const loginResult = await loginUser(result.citizenCode!, dummyPassword);
      if (loginResult.success && loginResult.user) {
        onLogin(loginResult.user);
      } else {
        onLogin({ ...newUser, citizenCode: result.citizenCode || 'MDR101' });
      }
    } catch (err) {
      setError('Registration malfunction. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const text = await file.text();
      const result = await importUserDataJson(text);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || "Invalid passport backup file.");
      }
    } catch (err) {
      setError("Failed to read file.");
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#46178f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-end justify-center">
        <Building2 size={600} className="text-white" />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10 border-b-[12px] border-black/10 text-slate-900"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center mx-auto mb-4 shadow-md overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Mooderia Logo" 
              className="w-16 h-16 object-contain drop-shadow-sm" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic text-indigo-600 tracking-tighter uppercase mb-1">
            Mooderia
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
            Citizen Passport Issue
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase opacity-40 tracking-wider ml-1 mb-1 block">
                Citizen Full Name
              </label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter your name" 
                className="w-full p-4 rounded-xl bg-black/5 font-black text-sm border-b-4 border-transparent focus:border-indigo-500 outline-none" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase opacity-40 tracking-wider ml-1 mb-1 block">
                Citizenship (Country)
              </label>
              <select 
                value={selectedCountry} 
                onChange={e => setSelectedCountry(e.target.value)} 
                className="w-full p-4 rounded-xl bg-black/5 font-black text-sm border-b-4 border-transparent focus:border-indigo-500 outline-none"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        
          {error && (
            <div className="p-4 bg-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase leading-tight border-b-4 border-red-200">
              <AlertTriangle size={20} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || !name.trim()} 
            className="kahoot-button-blue w-full py-5 rounded-2xl text-white font-black uppercase text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
            <span>{isLoading ? 'Issuing Passport...' : 'Issue Passport & Enter'}</span>
          </button>
        </form>

        {/* Import Existing JSON Passport */}
        <div className="mt-6 pt-6 border-t border-black/10 text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-2 mx-auto opacity-70 hover:opacity-100"
          >
            <Upload size={14} />
            <span>Import Existing Passport (.json)</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport} 
            accept=".json,application/json" 
            className="hidden" 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
