import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decodeShareData, SharePayload } from '@/lib/shareUtils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { Mail, Dumbbell, Calendar, Save, X, AlertTriangle, ArrowRight, ShoppingCart, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShareReceiverPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState(false);
  const [animationState, setAnimationState] = useState<'initial' | 'opening' | 'opened'>('initial');
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('d');
    if (dataParam) {
      const decoded = decodeShareData(dataParam);
      if (decoded) {
        setPayload(decoded);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  const handleOpen = () => {
    setAnimationState('opening');
    setTimeout(() => {
      setAnimationState('opened');
    }, 1500);
  };

  const handleSave = () => {
    if (!state.userProfile) {
      setShowNotice(true);
      return;
    }

    if (!payload) return;

    switch (payload.type) {
      case 'diary':
        dispatch({ type: 'ADD_MOOD_ENTRY', payload: { ...payload.data, id: crypto.randomUUID() } });
        navigate('/diary');
        break;
      case 'workout':
        dispatch({ type: 'ADD_CUSTOM_ROUTINE', payload: { ...payload.data, id: crypto.randomUUID() } });
        navigate('/health');
        break;
      case 'event':
        dispatch({ type: 'ADD_EVENT', payload: { ...payload.data, id: crypto.randomUUID() } });
        navigate('/events');
        break;
      case 'market':
        // payload.data is { day: string, items: MarketItem[] }
        const total = payload.data.items.reduce((acc: number, item: any) => acc + (item.price || 0), 0);
        if (state.walletBalance >= total) {
          payload.data.items.forEach((item: any) => {
            const newId = crypto.randomUUID();
            dispatch({ type: 'ADD_MARKET_ITEM', payload: { ...item, id: newId } });
            dispatch({ type: 'BUY_MARKET_ITEM', payload: newId });
          });
          navigate('/market');
        } else {
          alert("Insufficient funds in bank! Please deposit money first in City Bank.");
        }
        break;
      case 'passport':
        // payload.data contains profile, walletBalance, coins, currentRank, streak, profileBorder, moods, workouts, events, marketItems
        // The user wants to REPLACE the current account data with the passport data
        
        // Construct a clean state based on the passport data
        const newState = {
          userProfile: payload.data.profile || null,
          walletBalance: payload.data.walletBalance || 0,
          coins: payload.data.coins || 0,
          currentRank: payload.data.currentRank || 0,
          streak: payload.data.streak || 0,
          profileBorder: payload.data.profileBorder || null,
          moods: payload.data.moods || [],
          customRoutines: payload.data.workouts || [],
          events: payload.data.events || [],
          marketItems: payload.data.marketItems || [],
          // Reset other things to default
          routines: [],
          workTasks: [],
          workouts: [],
          walks: [],
          savings: [],
          transactions: [],
          lastMoodDate: payload.data.moods?.[payload.data.moods.length - 1]?.date || null,
          showRankUpPopup: false,
          isNightMode: state.isNightMode,
          cityLevel: 1,
          tasks: [],
          marketDecreeDay: null,
          inventory: [],
          boss: { name: "The Slump", hp: 100, maxHp: 100, level: 1 },
          extraXP: 0,
          streakSavers: 0,
        };

        dispatch({ type: 'LOAD_STATE', payload: newState as any });
        navigate('/profile');
        break;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 uppercase">Invalid Link</h1>
          <p className="text-gray-500 mt-2 font-bold">This share link is broken or expired.</p>
          <button onClick={() => navigate('/')} className="mt-6 w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!payload) return null;

  return (
    <div className="min-h-screen bg-[#46178f] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {animationState === 'initial' && (
          <motion.div
            key="initial"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
            className="text-center z-10"
          >
            <button
              onClick={handleOpen}
              className="group relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-colors"></div>
              <div className="relative bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-purple-300 group-hover:scale-105 transition-transform">
                {payload.type === 'diary' && <Mail className="w-12 h-12 text-purple-600" />}
                {payload.type === 'workout' && <Dumbbell className="w-12 h-12 text-red-500" />}
                {payload.type === 'event' && <Calendar className="w-12 h-12 text-blue-500" />}
                {payload.type === 'market' && <ShoppingCart className="w-12 h-12 text-amber-500" />}
                {payload.type === 'passport' && <Database className="w-12 h-12 text-indigo-500" />}
              </div>
            </button>
            <h2 className="text-white font-black text-2xl mt-6 uppercase tracking-widest drop-shadow-md">
              Incoming {payload.type}
            </h2>
            <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mt-2">Tap to open</p>
          </motion.div>
        )}

        {animationState === 'opening' && (
          <motion.div
            key="opening"
            className="z-10 flex items-center justify-center"
          >
            {payload.type === 'diary' && (
              <motion.div
                animate={{ rotateX: [0, 180], y: [0, -50, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-48 h-32 bg-white rounded-lg shadow-2xl border-t-[40px] border-t-gray-200 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-gray-300" />
                </div>
              </motion.div>
            )}
            {payload.type === 'workout' && (
              <motion.div
                animate={{ scaleY: [0.1, 1], rotate: [-10, 0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-48 h-64 bg-white rounded-xl shadow-2xl origin-top border-t-8 border-t-gray-800"
              />
            )}
            {payload.type === 'event' && (
              <motion.div
                animate={{ scale: [0.5, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, ease: "backOut" }}
                className="w-48 h-48 bg-white rounded-3xl shadow-2xl border-t-[30px] border-t-red-500 flex items-center justify-center"
              >
                <span className="text-6xl font-black text-gray-800">
                  {new Date(payload.data.date || Date.now()).getDate()}
                </span>
              </motion.div>
            )}
            {payload.type === 'market' && (
              <motion.div
                animate={{ y: [-50, 0], scale: [0.8, 1] }}
                transition={{ duration: 1.5, ease: "bounce" }}
                className="w-48 h-64 bg-white rounded-xl shadow-2xl border-t-8 border-t-amber-500 flex flex-col items-center justify-start pt-4"
              >
                <div className="w-32 h-4 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-24 h-4 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-28 h-4 bg-gray-200 rounded-full"></div>
              </motion.div>
            )}
            {payload.type === 'passport' && (
              <motion.div
                animate={{ rotate: [0, 360], scale: [0.5, 1] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-48 h-48 bg-white rounded-full shadow-2xl border-8 border-indigo-500 flex items-center justify-center"
              >
                <Database className="w-20 h-20 text-indigo-500" />
              </motion.div>
            )}
          </motion.div>
        )}

        {animationState === 'opened' && (
          <motion.div
            key="opened"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className={cn(
              "p-6 text-white flex justify-between items-center",
              payload.type === 'diary' ? 'bg-purple-600' :
              payload.type === 'workout' ? 'bg-red-500' :
              payload.type === 'market' ? 'bg-amber-500' : 
              payload.type === 'passport' ? 'bg-indigo-600' : 'bg-blue-500'
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  {payload.type === 'diary' && <Mail className="w-5 h-5" />}
                  {payload.type === 'workout' && <Dumbbell className="w-5 h-5" />}
                  {payload.type === 'event' && <Calendar className="w-5 h-5" />}
                  {payload.type === 'market' && <ShoppingCart className="w-5 h-5" />}
                  {payload.type === 'passport' && <Database className="w-5 h-5" />}
                </div>
                <h2 className="font-black text-xl uppercase tracking-tight">Shared {payload.type}</h2>
              </div>
              <button onClick={() => navigate('/')} className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {payload.type === 'diary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                    <span className="text-sm font-bold text-gray-400 uppercase">{payload.data.date}</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase">
                      {payload.data.mood}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                    {payload.data.note}
                  </p>
                  {payload.data.image && (
                    payload.data.image.startsWith('[') ? (
                      <div className="bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 mt-4">
                        {payload.data.image}
                      </div>
                    ) : (
                      <img src={payload.data.image} alt="Diary" className="w-full rounded-2xl shadow-md mt-4" />
                    )
                  )}
                  {payload.data.video && (
                    <div className="bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 mt-4">
                      {payload.data.video.startsWith('[') ? payload.data.video : 'Video Attachment'}
                    </div>
                  )}
                  {payload.data.audio && (
                    <div className="bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 mt-4">
                      {payload.data.audio.startsWith('[') ? payload.data.audio : 'Audio Attachment'}
                    </div>
                  )}
                </div>
              )}

              {payload.type === 'workout' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-900 uppercase">{payload.data.name}</h3>
                    <span className={cn(
                      "inline-block mt-2 px-4 py-1 rounded-full text-sm font-black uppercase",
                      payload.data.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      payload.data.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {payload.data.difficulty}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {payload.data.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-gray-400 shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-800 uppercase">{step.name}</p>
                          <p className="text-xs font-bold text-gray-500 uppercase">
                            {step.type === 'time' ? `${step.duration}s` : step.type === 'reps' ? `${step.reps} reps` : `${step.duration}s rest`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {payload.type === 'event' && (
                <div className="space-y-6 text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex flex-col items-center justify-center mx-auto border-4 border-blue-100 shadow-inner">
                    <span className="text-xs font-black text-blue-400 uppercase">{new Date(payload.data.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-4xl font-black text-blue-600 leading-none">{new Date(payload.data.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase">{payload.data.title}</h3>
                    <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest">{payload.data.time}</p>
                  </div>
                  {payload.data.description && (
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 text-left">
                      <p className="text-gray-700 font-medium">{payload.data.description}</p>
                    </div>
                  )}
                  <div className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-black text-sm uppercase">
                    {payload.data.type}
                  </div>
                </div>
              )}

              {payload.type === 'market' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-900 uppercase">{payload.data.day}'s List</h3>
                    <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest">{payload.data.items.length} items</p>
                  </div>
                  <div className="space-y-3">
                    {payload.data.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-gray-400 shadow-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-black text-gray-800 uppercase">{item.name}</p>
                            <p className="text-xs font-bold text-gray-500 uppercase">
                              {item.amount} {item.unit}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-gray-900">{state.userProfile?.currency} {item.price || 0}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t-4 border-gray-200 flex justify-between items-center">
                    <span className="font-black text-xl text-gray-800 uppercase tracking-widest">Total</span>
                    <span className="font-black text-2xl text-amber-600">
                      {state.userProfile?.currency} {payload.data.items.reduce((acc: number, item: any) => acc + (item.price || 0), 0)}
                    </span>
                  </div>
                  {state.walletBalance < payload.data.items.reduce((acc: number, item: any) => acc + (item.price || 0), 0) && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold text-left mt-4">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Insufficient funds in bank! Please deposit money first in City Bank.</span>
                    </div>
                  )}
                </div>
              )}

              {payload.type === 'passport' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-900 uppercase">Data Passport</h3>
                    <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest">
                      {payload.data.profile?.name || 'Unknown Citizen'}
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center font-black text-indigo-700">
                      {payload.data.currentRank || 0}
                    </div>
                    <div>
                      <p className="font-black text-indigo-900 uppercase">Level & Wallet</p>
                      <p className="text-xs font-bold text-indigo-700 uppercase">
                        {payload.data.walletBalance || 0} {payload.data.profile?.currency || 'Coins'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 text-center">
                      <p className="text-2xl font-black text-purple-600">{payload.data.moods?.length || 0}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Diary Entries</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 text-center">
                      <p className="text-2xl font-black text-red-500">{payload.data.workouts?.length || 0}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Workouts</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 text-center">
                      <p className="text-2xl font-black text-blue-500">{payload.data.events?.length || 0}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Events</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 text-center">
                      <p className="text-2xl font-black text-amber-500">{payload.data.marketItems?.length || 0}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Market Items</p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-red-700 text-xs font-bold text-left mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Warning: Importing this passport will OVERWRITE your current account data. Your current progress will be lost and replaced by the data in this passport.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50 border-t-2 border-gray-100">
              <button
                onClick={handleSave}
                disabled={payload.type === 'market' && state.walletBalance < payload.data.items.reduce((acc: number, item: any) => acc + (item.price || 0), 0)}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100",
                  payload.type === 'diary' ? 'bg-purple-600 hover:bg-purple-700 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1' :
                  payload.type === 'workout' ? 'bg-red-500 hover:bg-red-600 border-b-4 border-red-700 active:border-b-0 active:translate-y-1' :
                  payload.type === 'market' ? 'bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1' :
                  payload.type === 'passport' ? 'bg-indigo-600 hover:bg-indigo-700 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1' :
                  'bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1'
                )}
              >
                {payload.type === 'market' ? (
                  <>
                    <ShoppingCart className="w-5 h-5 fill-current" />
                    Purchase All
                  </>
                ) : payload.type === 'passport' ? (
                  <>
                    <Database className="w-5 h-5" />
                    Restore Account
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save to My City
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice Board Modal for Unauthenticated Users */}
      <AnimatePresence>
        {showNotice && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-amber-400 -skew-y-6 origin-top-left -z-10"></div>
              
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-amber-100">
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">
                Notice Board
              </h2>
              
              <p className="text-gray-600 font-bold mb-8">
                You must create your Mooderia profile first to save this {payload.type} to your city!
              </p>

              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                Create Profile <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowNotice(false)}
                className="mt-4 text-gray-400 font-bold uppercase text-xs tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
