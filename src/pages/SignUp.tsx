import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Camera, ArrowRight, Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

const CITIZENSHIPS = [
  "American", "Argentine", "Australian", "Bangladeshi", "Brazilian", "British", "Canadian", 
  "Chinese", "Colombian", "Filipino", "French", "German", "Indian", "Indonesian", 
  "Italian", "Japanese", "Kenyan", "Mexican", "Nigerian", "Pakistani", "Peruvian", 
  "Polish", "Russian", "South African", "South Korean", "Spanish", "Thai", "Turkish", 
  "Ukrainian", "Vietnamese", "Other"
];

export default function SignUp() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [citizenship, setCitizenship] = useState(CITIZENSHIPS[0]);
  const [avatar, setAvatar] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  const [activePinField, setActivePinField] = useState<'pin' | 'confirmPin'>('pin');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && name && birthday && avatar) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6 && pin === confirmPin) {
      dispatch({
        type: 'SET_PROFILE',
        payload: { name, avatar, birthday, citizenship, pin }
      });
      dispatch({ type: 'SET_AUTH', payload: true });
      navigate('/');
    } else {
      alert("PINs must match and be exactly 6 digits.");
    }
  };

  const handleKeypad = (num: string) => {
    if (activePinField === 'pin') {
      if (pin.length < 6) setPin(prev => prev + num);
      if (pin.length === 5) setActivePinField('confirmPin');
    } else {
      if (confirmPin.length < 6) setConfirmPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (activePinField === 'pin') {
      setPin(prev => prev.slice(0, -1));
    } else {
      if (confirmPin.length === 0) {
        setActivePinField('pin');
        setPin(prev => prev.slice(0, -1));
      } else {
        setConfirmPin(prev => prev.slice(0, -1));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">Mooderia</h1>
          <p className="text-gray-500 font-bold">Welcome to your new life.</p>
        </div>

        <form onSubmit={handleSubmit} className="clay-card p-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-center mb-6">Citizen Registration</h2>
              
              <div className="flex justify-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-full bg-gray-100 border-4 border-primary/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs font-bold text-gray-400">Upload Photo</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Birthday</label>
                  <input 
                    type="date" 
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Citizenship</label>
                  <select 
                    value={citizenship}
                    onChange={e => setCitizenship(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold appearance-none"
                  >
                    {CITIZENSHIPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleNext}
                disabled={!name || !birthday || !avatar}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-center mb-6">Security PIN</h2>
              <p className="text-center text-gray-500 font-bold text-sm mb-8">
                Set a 6-digit PIN to secure your Mooderia vault.
              </p>
              
              <div className="space-y-4">
                <div onClick={() => setActivePinField('pin')} className="cursor-pointer">
                  <label className="block text-sm font-bold text-gray-700 mb-1">New PIN</label>
                  <div className={cn("w-full p-4 bg-gray-50 rounded-2xl border-2 font-black text-2xl tracking-widest text-center min-h-[60px] flex items-center justify-center", activePinField === 'pin' ? "border-primary" : "border-gray-200")}>
                    {pin.padEnd(6, '•')}
                  </div>
                </div>
                <div onClick={() => setActivePinField('confirmPin')} className="cursor-pointer">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm PIN</label>
                  <div className={cn("w-full p-4 bg-gray-50 rounded-2xl border-2 font-black text-2xl tracking-widest text-center min-h-[60px] flex items-center justify-center", activePinField === 'confirmPin' ? "border-primary" : "border-gray-200")}>
                    {confirmPin.padEnd(6, '•')}
                  </div>
                </div>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypad(num.toString())}
                    className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-2xl transition-colors active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <div className="p-4"></div>
                <button
                  type="button"
                  onClick={() => handleKeypad('0')}
                  className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-2xl transition-colors active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                >
                  <Delete className="w-8 h-8" />
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={pin.length < 6 || pin !== confirmPin}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
