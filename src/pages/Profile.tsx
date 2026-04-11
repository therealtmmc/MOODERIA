import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { Settings, LogOut, Camera, X, Edit2, Shield, Trash2, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { differenceInYears, parseISO, format } from 'date-fns';
import { LegalModal } from '@/components/LegalModal';

function getZodiacSign(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Unknown";
}

export default function Profile() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);
  
  // Settings state
  const [editName, setEditName] = useState(state.profile?.name || '');
  const [editPin, setEditPin] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    dispatch({ type: 'DELETE_ACCOUNT' });
    navigate('/signup');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'UPDATE_PROFILE', payload: { avatar: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    const payload: any = {};
    if (editName.trim() !== state.profile?.name) payload.name = editName.trim();
    if (editPin.length === 6) payload.pin = editPin;
    
    if (Object.keys(payload).length > 0) {
      dispatch({ type: 'UPDATE_PROFILE', payload });
    }
    setShowSettings(false);
    setEditPin('');
  };

  if (!state.profile) return null;

  const age = differenceInYears(new Date(), parseISO(state.profile.birthday));
  const zodiac = getZodiacSign(state.profile.birthday);

  return (
    <div className="space-y-8 relative">
      <button 
        onClick={() => setShowSettings(true)}
        className="absolute top-0 right-0 p-3 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-400 hover:text-primary transition-colors z-10"
      >
        <Settings className="w-6 h-6" />
      </button>

      <header className="flex flex-col items-center text-center pt-8">
        <div className="w-32 h-32 bg-primary/10 rounded-[3rem] border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center mb-6 overflow-hidden">
          {state.profile.avatar ? (
            <img src={state.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Name</span>
          <span className="font-black text-gray-900 dark:text-white">{state.profile.name}</span>
        </div>
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Citizenship</span>
          <span className="font-black text-primary">{state.profile.citizenship}</span>
        </div>
        <div className="clay-card p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-gray-400 uppercase mb-1">Age</span>
          <span className="text-xl font-black text-gray-800 dark:text-gray-100">{age}</span>
        </div>
        <div className="clay-card p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-gray-400 uppercase mb-1">Zodiac</span>
          <span className="text-xl font-black text-gray-800 dark:text-gray-100">{zodiac}</span>
        </div>
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Birthday</span>
          <span className="font-black text-gray-800 dark:text-gray-100">{format(parseISO(state.profile.birthday), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">Mooderia</p>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {state.isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  <span className="font-bold text-gray-700 dark:text-gray-200">Dark Mode</span>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    state.isDarkMode ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                    state.isDarkMode ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Change Avatar</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Camera className="w-5 h-5" /> Upload New Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Change Name</label>
                <div className="relative">
                  <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Change PIN (6 digits)</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={editPin}
                    onChange={e => setEditPin(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold tracking-widest"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={saveSettings}
                  className="btn-primary flex-1"
                >
                  Save Changes
                </button>
              </div>

              <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-800 space-y-2">
                <button 
                  onClick={() => setLegalType('terms')}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Terms & Conditions
                </button>
                <button 
                  onClick={() => setLegalType('privacy')}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Privacy Policy
                </button>
              </div>

              <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-800 space-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full p-4 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Lock App (Log Out)
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 space-y-6 animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Delete Account?</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </div>
  );
}
