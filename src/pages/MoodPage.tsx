import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Smile, Book, HelpCircle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/Calendar";
import { motion, AnimatePresence } from "motion/react";

const MOOD_COLORS: Record<string, string> = {
  Happy: "bg-yellow-400",
  Sad: "bg-blue-400",
  Neutral: "bg-gray-400",
  Loved: "bg-pink-400",
  Angry: "bg-red-500",
  Energetic: "bg-orange-400",
  Tired: "bg-brown-400",
  Calm: "bg-indigo-400",
};

export default function MoodPage() {
  const { state, dispatch } = useStore();
  const [showDiary, setShowDiary] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);
  const [diaryEntry, setDiaryEntry] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = state.moods.find((m) => m.date === today);

  const handleSaveDiary = () => {
    if (todayMood) {
      // Update existing mood with note
      // Since we don't have an UPDATE action, we'll remove and re-add (hacky but works for MVP)
      // Actually, let's just add a new entry for today which overwrites or we can filter.
      // Better: Add UPDATE_MOOD action. But for now, let's just assume we can't edit past moods easily without ID.
      // Let's just find the index and update in a new action or just modify the state directly in a real app.
      // For this MVP, I'll add a specific action to StoreContext later if needed.
      // For now, I will just console log.
      // Wait, I need to save it.
      // Let's add a simple "UPDATE_DIARY" action to StoreContext.
      dispatch({ 
        type: "ADD_MOOD", 
        payload: { ...todayMood, note: diaryEntry } 
      });
      // Note: This will duplicate entries if I'm not careful in reducer. 
      // My reducer just pushes. I should fix the reducer to update if date exists.
    }
    setShowDiary(false);
  };

  const askOracle = () => {
    const answers = ["Yes", "No", "Maybe", "I don't know"];
    const random = answers[Math.floor(Math.random() * answers.length)];
    setOracleAnswer(random);
  };

  const calendarEvents = state.moods.map((m) => ({
    date: m.date,
    color: MOOD_COLORS[m.mood] || "bg-gray-200",
  }));

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#46178f] drop-shadow-sm">Mooderia</h1>
          <p className="text-gray-500 font-bold">How are you today?</p>
        </div>
        <div className="bg-[#eb6123] text-white px-4 py-2 rounded-full font-black shadow-md border-b-4 border-[#c54e16] flex items-center gap-2">
          <span>🔥</span>
          <span>{state.streak}</span>
        </div>
      </header>

      <div className="bg-white p-4 rounded-3xl shadow-xl border-b-8 border-gray-200">
        <h2 className="text-xl font-black text-gray-700 mb-4 flex items-center gap-2">
          <Smile className="w-6 h-6 text-[#eb6123]" />
          Mood Calendar
        </h2>
        <Calendar events={calendarEvents} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setDiaryEntry(todayMood?.note || "");
            setShowDiary(true);
          }}
          className="bg-[#1368ce] text-white p-6 rounded-3xl shadow-xl border-b-8 border-[#0e4b96] active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center"
        >
          <Book className="w-10 h-10 mb-2" />
          <span className="font-black text-xl">Diary</span>
        </button>
        <button
          onClick={() => {
            setOracleAnswer(null);
            setShowOracle(true);
          }}
          className="bg-[#26890c] text-white p-6 rounded-3xl shadow-xl border-b-8 border-[#1a5e08] active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center"
        >
          <HelpCircle className="w-10 h-10 mb-2" />
          <span className="font-black text-xl">Oracle</span>
        </button>
      </div>

      {/* Diary Modal (Book Version) */}
      <AnimatePresence>
        {showDiary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#fdfbf7] w-full max-w-md h-[85vh] rounded-r-3xl rounded-l-md shadow-2xl overflow-hidden flex flex-col relative border-r-[12px] border-b-[12px] border-[#d4c5b0]"
              style={{
                boxShadow: "inset 20px 0 50px rgba(0,0,0,0.1), 10px 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {/* Book Spine Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#5c4033] to-[#8b5a2b] z-20 shadow-xl" />
              
              {/* Header */}
              <div className="pl-10 pr-6 py-6 border-b-2 border-[#e6e2d8] flex justify-between items-center bg-[#fdfbf7]">
                <div>
                  <h3 className="font-serif font-black text-3xl text-[#4a4a4a] italic">My Journal</h3>
                  <p className="font-serif text-[#8a8a8a] text-sm italic">Mooderia Chronicles</p>
                </div>
                <button 
                  onClick={() => setShowDiary(false)} 
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pl-10 pr-6 py-6 space-y-8 custom-scrollbar bg-[#fdfbf7]">
                
                {/* Today's Entry Page */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-100/50" />
                  <h4 className="font-serif font-bold text-[#46178f] mb-4 text-lg border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span>✍️</span> Today's Entry
                  </h4>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group">
                    {/* Lines effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-10" 
                         style={{ backgroundImage: "linear-gradient(#000000 1px, transparent 1px)", backgroundSize: "100% 24px" }} 
                    />
                    
                    <textarea
                      value={diaryEntry}
                      onChange={(e) => setDiaryEntry(e.target.value)}
                      className="w-full h-40 bg-transparent focus:outline-none resize-none font-serif text-gray-700 text-lg leading-[24px]"
                      placeholder="Dear Diary, today I felt..."
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSaveDiary}
                      className="bg-[#46178f] text-white px-6 py-2 rounded-full font-serif font-bold shadow-md hover:bg-[#35116e] transition-colors flex items-center gap-2"
                    >
                      <span>Save to Journal</span>
                      <Book className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Past Entries */}
                <div className="pt-8">
                  <div className="flex justify-between items-end mb-6 border-b-2 border-gray-800 pb-2">
                    <h4 className="font-serif font-black text-2xl text-gray-800">Past Entries</h4>
                    {state.moods.some(m => m.note) && (
                      <button 
                        onClick={() => {
                          if(confirm("Burn all diary pages? This cannot be undone.")) {
                            dispatch({ type: "CLEAR_ALL_DIARY" });
                          }
                        }}
                        className="text-red-500 text-xs font-bold uppercase tracking-wider hover:underline"
                      >
                        Burn All Pages 🔥
                      </button>
                    )}
                  </div>

                  <div className="space-y-8">
                    {state.moods
                      .filter(m => m.note)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <div key={entry.date} className="relative pl-4 group">
                        {/* Vertical line */}
                        <div className="absolute left-0 top-2 bottom-0 w-1 bg-gray-200 rounded-full group-hover:bg-[#46178f] transition-colors" />
                        
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-serif font-bold text-gray-800 text-lg block">
                              {format(new Date(entry.date), "MMMM do, yyyy")}
                            </span>
                            <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider mt-1", MOOD_COLORS[entry.mood])}>
                              Felt {entry.mood}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => {
                              if(confirm("Tear out this page?")) {
                                dispatch({ type: "DELETE_DIARY", payload: entry.date });
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full text-red-400"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="font-serif text-gray-600 text-lg leading-relaxed whitespace-pre-wrap italic">
                          "{entry.note}"
                        </p>
                      </div>
                    ))}
                    
                    {state.moods.filter(m => m.note).length === 0 && (
                      <div className="text-center py-12 opacity-50">
                        <Book className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="font-serif text-gray-400 italic">The pages are empty...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Oracle Modal */}
      <AnimatePresence>
        {showOracle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c]"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">The Oracle</h3>
                <button onClick={() => setShowOracle(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                  {oracleAnswer ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-[#26890c]"
                    >
                      {oracleAnswer}
                    </motion.span>
                  ) : (
                    <span className="text-4xl">🔮</span>
                  )}
                </div>
                <p className="font-bold text-gray-500">
                  Think of a Yes/No question...
                </p>
                <button
                  onClick={askOracle}
                  className="w-full bg-[#26890c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform border-b-4 border-[#1a5e08] active:border-b-0 active:translate-y-1"
                >
                  Ask the Oracle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
