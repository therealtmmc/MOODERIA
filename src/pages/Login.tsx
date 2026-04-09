import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Lock, Delete } from 'lucide-react';

export default function Login() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.profile && pin === state.profile.pin) {
      dispatch({ type: 'SET_AUTH', payload: true });
      navigate('/');
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeypad = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-bold">Enter your 6-digit PIN</p>
        </div>

        <form onSubmit={handleSubmit} className="clay-card p-8">
          <div className="space-y-6">
            <div>
              <div className={`w-full p-4 bg-gray-50 rounded-2xl border-2 font-black text-3xl tracking-[0.5em] text-center min-h-[70px] flex items-center justify-center ${error ? 'border-red-500 text-red-500 animate-shake' : 'border-gray-200 focus:border-primary'}`}>
                {pin.padEnd(6, '•')}
              </div>
              {error && <p className="text-red-500 text-sm font-bold text-center mt-2">Incorrect PIN</p>}
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

            <button 
              type="submit"
              disabled={pin.length < 6}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
