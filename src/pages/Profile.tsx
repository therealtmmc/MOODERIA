import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { Settings, LogOut, Camera, X, Edit2, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { differenceInYears, parseISO, format } from 'date-fns';

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
  
  // Settings state
  const [editName, setEditName] = useState(state.profile?.name || '');
  const [editPin, setEditPin] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.")) {
      dispatch({ type: 'DELETE_ACCOUNT' });
      navigate('/signup');
    }
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
        className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-md text-gray-400 hover:text-primary transition-colors z-10"
      >
        <Settings className="w-6 h-6" />
      </button>

      <header className="flex flex-col items-center text-center pt-8">
        <div className="w-32 h-32 bg-primary/10 rounded-[3rem] border-4 border-white shadow-xl flex items-center justify-center mb-6 overflow-hidden">
          {state.profile.avatar ? (
            <img src={state.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Name</span>
          <span className="font-black text-gray-900">{state.profile.name}</span>
        </div>
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Citizenship</span>
          <span className="font-black text-primary">{state.profile.citizenship}</span>
        </div>
        <div className="clay-card p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-gray-400 uppercase mb-1">Age</span>
          <span className="text-xl font-black text-gray-800">{age}</span>
        </div>
        <div className="clay-card p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-gray-400 uppercase mb-1">Zodiac</span>
          <span className="text-xl font-black text-gray-800">{zodiac}</span>
        </div>
        <div className="clay-card p-4 col-span-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">Birthday</span>
          <span className="font-black text-gray-800">{format(parseISO(state.profile.birthday), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Mooderia</p>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-6 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Change Avatar</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Change Name</label>
                <div className="relative">
                  <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Change PIN (6 digits)</label>
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
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold tracking-widest"
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

              <div className="pt-4 border-t-2 border-gray-100 space-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full p-4 bg-orange-50 text-orange-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Lock App (Log Out)
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full p-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
