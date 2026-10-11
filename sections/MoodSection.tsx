import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mood, DiaryEntry } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, Zap, HeartPulse, RotateCcw, Loader2, Book, Plus, Trash2, X, Check } from 'lucide-react';
import MoodPetSection from './MoodPetSection';
import { t } from '../constants';

interface MoodSectionProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
  onReward: () => void;
  triggerAnimation: (type: 'express' | 'schedule' | 'routine' | 'diary' | 'alarm', text?: string) => void;
}

const MoodSection: React.FC<MoodSectionProps> = ({ user, onUpdate, isDarkMode, language, onReward, triggerAnimation }) => {
  // Express is the first tab!
  const [subTab, setSubTab] = useState<'Express' | 'Mood Pet' | 'Statistics' | 'Teller'>('Express');

  // Express (Diary) States
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryMood, setDiaryMood] = useState<Mood>('Normal');

  const handleSaveDiary = () => {
    if (!diaryTitle.trim() || !diaryContent.trim()) return;
    const newEntry: DiaryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: diaryTitle.trim(),
      content: diaryContent.trim(),
      mood: diaryMood,
      timestamp: Date.now()
    };
    onUpdate({ diaryEntries: [newEntry, ...(user.diaryEntries || [])] });
    setIsAddingDiary(false);
    setDiaryTitle('');
    setDiaryContent('');
    onReward();
    triggerAnimation('diary', diaryTitle);
  };

  const handleDeleteDiary = (id: string) => {
    onUpdate({ diaryEntries: (user.diaryEntries || []).filter(e => e.id !== id) });
  };

  // Teller States
  const [fortuneQuestion, setFortuneQuestion] = useState('');
  const [fortuneAnswer, setFortuneAnswer] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);

  // Statistics Data
  const lineData = useMemo(() => {
    return (user.moodHistory || []).slice(-14).map((entry, i) => ({ name: `Day ${i + 1}`, score: entry.score }));
  }, [user.moodHistory]);

  const barData = useMemo(() => {
    const counts: Record<string, number> = { Wonderful: 0, Excited: 0, Happy: 0, Normal: 0, Tired: 0, Angry: 0, Flaming: 0 };
    (user.moodHistory || []).forEach(e => { if (e.mood) counts[e.mood]++; });
    return Object.entries(counts).map(([name, val]) => ({ name, val }));
  }, [user.moodHistory]);

  const handleFortune = () => {
    if (!fortuneQuestion.trim()) return;
    setIsConsulting(true);
    setFortuneAnswer('');
    
    setTimeout(() => {
      const rand = Math.random();
      let answer = "";
      if (rand < 0.25) answer = language === 'English' ? "Yes, the stars align!" : "Oo, sumasang-ayon ang mga bituin!";
      else if (rand < 0.50) answer = language === 'English' ? "Not at this moment." : "Hindi sa ngayon.";
      else if (rand < 0.75) answer = language === 'English' ? "High probability: Yes!" : "Mataas ang posibilidad: Oo!";
      else answer = language === 'English' ? "Patience is required." : "Kailangan ng pasensya.";
      
      setFortuneAnswer(answer);
      setIsConsulting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-20">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
        {(['Express', 'Mood Pet', 'Statistics', 'Teller'] as const).map(tabName => (
          <button 
            key={tabName} 
            onClick={() => setSubTab(tabName)}
            className={`px-6 py-3 rounded-full font-black text-xs uppercase transition-all whitespace-nowrap border-b-4 ${subTab === tabName ? 'bg-indigo-600 text-white shadow-lg translate-y-[-2px]' : isDarkMode ? 'bg-white/5 border-black text-white/40' : 'bg-white border-gray-100 text-slate-500 shadow-sm'}`}
          >
            {tabName === 'Express' ? t('express', language) : tabName === 'Mood Pet' ? t('moodPet', language) : tabName === 'Statistics' ? t('statistics', language) : t('teller', language)}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {/* ========================================================
              EXPRESS TAB (Diary Memories - Now in Mood Section!)
             ======================================================== */}
          {subTab === 'Express' && (
            <motion.div key="express" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-xl`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                      <Book className="text-indigo-600"/> {t('express', language)}
                    </h3>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-0.5">
                      {language === 'English' ? 'Personal Reflections & Emotional Chronicles' : 'Mga Pansariling Tala at Emosyonal na Alaala'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddingDiary(true)} 
                    title="New Log" 
                    className="kahoot-button-green p-3.5 rounded-2xl text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user.diaryEntries || []).length > 0 ? (user.diaryEntries || []).map(entry => (
                    <div key={entry.id} className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} border-4 border-black/5 shadow-md group relative transition-all hover:border-indigo-500/30`}>
                      <button 
                        onClick={() => handleDeleteDiary(entry.id)} 
                        className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[9px] font-black uppercase opacity-40">{new Date(entry.timestamp).toLocaleDateString()}</span>
                         <span className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono">{entry.mood}</span>
                      </div>
                      <h5 className="text-lg font-black uppercase italic mb-2 line-clamp-1">{entry.title}</h5>
                      <p className="text-sm font-bold opacity-60 leading-relaxed line-clamp-3">"{entry.content}"</p>
                    </div>
                  )) : (
                    <div className="col-span-full py-16 text-center opacity-30 font-black uppercase space-y-3">
                      <Book size={48} className="mx-auto opacity-40 text-indigo-500" />
                      <p>{language === 'English' ? 'No memories archived yet. Tap + to write your first reflection.' : 'Wala pang nakatalang alaala. Pindutin ang + upang magtala.'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Entry Modal */}
              <AnimatePresence>
                {isAddingDiary && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative space-y-4`}>
                      <button onClick={() => setIsAddingDiary(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 p-2"><X size={24}/></button>
                      <h3 className="text-3xl font-black uppercase italic mb-4">
                        {language === 'English' ? 'New Express Entry' : 'Bagong Tala sa Express'}
                      </h3>
                      <div className="space-y-4">
                         <div>
                           <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Entry Title</label>
                           <input 
                             value={diaryTitle} 
                             onChange={e => setDiaryTitle(e.target.value)} 
                             placeholder="e.g. A breakthrough afternoon..." 
                             className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-green-500" 
                           />
                         </div>
                         <div>
                           <label className="text-[10px] font-black uppercase opacity-50 tracking-wider">Reflection Content</label>
                           <textarea 
                             value={diaryContent} 
                             onChange={e => setDiaryContent(e.target.value)} 
                             placeholder="Express your feelings freely..." 
                             className="w-full mt-1 p-4 rounded-2xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none focus:border-green-500 min-h-[140px]" 
                           />
                         </div>
                         <div>
                           <label className="text-[10px] font-black uppercase opacity-50 tracking-wider mb-2 block">Mood Frequency</label>
                           <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                             {(['Wonderful','Happy','Normal','Tired','Angry','Flaming'] as Mood[]).map(m => (
                               <button 
                                 key={m} 
                                 type="button"
                                 onClick={() => setDiaryMood(m)} 
                                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 shrink-0 transition-all ${diaryMood === m ? 'bg-green-600 text-white border-green-600 shadow-md' : 'border-black/10 dark:border-white/10 opacity-60'}`}
                               >
                                 {m}
                               </button>
                             ))}
                           </div>
                         </div>
                         <button 
                           onClick={handleSaveDiary} 
                           disabled={!diaryTitle.trim() || !diaryContent.trim()}
                           title="Archive Memory" 
                           className="kahoot-button-green w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                           <Check size={22} />
                           <span>{language === 'English' ? 'Archive Express Log' : 'I-save ang Tala'}</span>
                         </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {subTab === 'Statistics' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} shadow-xl border-4 border-black/5`}>
                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                  <TrendingUp className="text-indigo-500"/> {language === 'English' ? 'Overall Resonance Trends' : 'Pangkalahatang Resonance'}
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#eee'} />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="score" stroke="#46178f" strokeWidth={5} dot={{ fill: '#46178f', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} shadow-xl border-4 border-black/5`}>
                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                  <HeartPulse className="text-green-500"/> {language === 'English' ? 'Frequency Distribution' : 'Pamamahagi ng Dalas'}
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#eee'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold' }} />
                      <Bar dataKey="val" fill="#26890c" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {subTab === 'Mood Pet' && (
            <MoodPetSection user={user} onUpdate={onUpdate} isDarkMode={isDarkMode} language={language} />
          )}

          {subTab === 'Teller' && (
            <motion.div key="teller" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[450px]">
              <div className={`w-full max-w-xl p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-2xl text-center relative overflow-hidden`}>
                <Zap size={100} className={`absolute -top-6 -right-6 ${isConsulting ? 'text-purple-500 animate-spin' : 'text-purple-500/20'}`} />
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                  {language === 'English' ? 'Destiny Predictor' : 'Manghuhula ng Kapalaran'}
                </h2>
                
                {!fortuneAnswer ? (
                  <div className="space-y-6">
                    <p className="text-sm font-bold opacity-60">
                      {language === 'English' ? 'Ask a question to test the emotional current...' : 'Magtanong upang malaman ang takbo ng iyong kapalaran...'}
                    </p>
                    <textarea 
                      value={fortuneQuestion} 
                      onChange={e => setFortuneQuestion(e.target.value)} 
                      placeholder={language === 'English' ? "Will I conquer today's goals?" : "Matatapos ko ba ang aking mga layunin ngayon?"} 
                      className="w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 font-black text-center outline-none focus:border-purple-500 border-2 min-h-[100px]"
                    />
                    <button 
                      onClick={handleFortune} 
                      disabled={isConsulting || !fortuneQuestion.trim()}
                      title={language === 'English' ? 'Reveal Probability' : 'Tuklasin ang Sagot'}
                      aria-label="Reveal Probability"
                      className="kahoot-button-purple w-full py-4 rounded-2xl text-white font-black uppercase shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                      {isConsulting ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="p-8 bg-purple-500/10 rounded-[2rem] border-2 border-purple-500/20">
                      <h3 className="text-xl font-black italic text-purple-600 mb-2">
                        {language === 'English' ? 'The cosmos reveals...' : 'Ipinapahayag ng uniberso...'}
                      </h3>
                      <p className="text-3xl md:text-4xl font-black uppercase tracking-tight text-purple-600">{fortuneAnswer}</p>
                    </div>
                    <button 
                      onClick={() => { setFortuneAnswer(''); setFortuneQuestion(''); }} 
                      title={language === 'English' ? 'Ask Another Question' : 'Magtanong Muli'}
                      aria-label="Ask Another Question"
                      className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 mx-auto flex items-center justify-center transition-all shadow-sm"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MoodSection;
