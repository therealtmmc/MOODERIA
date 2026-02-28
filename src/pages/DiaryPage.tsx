import { useState, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Book, Trash2, Image as ImageIcon, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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

export default function DiaryPage() {
  const { state, dispatch } = useStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = state.moods.find((m) => m.date === today);

  const [diaryEntry, setDiaryEntry] = useState(todayMood?.note || "");
  const [selectedMood, setSelectedMood] = useState<string | null>(todayMood?.mood || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(todayMood?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDiary = () => {
    if (!selectedMood && !todayMood) return;

    const moodToSave = selectedMood || todayMood?.mood;
    
    if (moodToSave) {
      dispatch({ 
        type: "ADD_MOOD", 
        payload: { 
          date: today,
          mood: moodToSave,
          note: diaryEntry,
          image: selectedImage || undefined
        } 
      });
      alert("Diary entry saved!");
    }
  };

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#1368ce]">Diary</h1>
        <p className="text-gray-500 font-bold">Capture your memories</p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border-b-8 border-gray-200 overflow-hidden">
        {/* New Entry Section */}
        <div className="p-6 bg-white">
          <h4 className="font-bold text-[#1368ce] mb-4 text-sm uppercase flex items-center gap-2">
            <span>✍️</span> Today's Entry
          </h4>
          
          {/* Mood Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">How are you feeling?</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Object.keys(MOOD_COLORS).map((mood) => {
                const isSelected = selectedMood === mood;
                return (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2",
                      isSelected 
                        ? `${MOOD_COLORS[mood]} text-white border-transparent scale-105 shadow-md` 
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    )}
                  >
                    {mood}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={diaryEntry}
            onChange={(e) => setDiaryEntry(e.target.value)}
            className="w-full h-40 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none resize-none font-medium text-gray-700 text-sm mb-4 leading-relaxed"
            placeholder="Write about your day..."
          />

          {/* Image Upload */}
          <div className="mb-4">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload}
            />
            
            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 group">
                <img src={selectedImage} alt="Diary attachment" className="w-full h-48 object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-16 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-[#1368ce] hover:border-[#1368ce] hover:bg-blue-50 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span className="font-bold text-sm">Add a photo</span>
              </button>
            )}
          </div>
          
          <button
            onClick={handleSaveDiary}
            disabled={!selectedMood}
            className="w-full bg-[#1368ce] text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            <span>Save Entry</span>
            <Book className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Past Entries */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h4 className="font-black text-gray-700 text-lg">Past Memories</h4>
          {state.moods.some(m => m.note || m.image) && (
            <button 
              onClick={() => {
                if(confirm("Delete all diary entries?")) {
                  dispatch({ type: "CLEAR_ALL_DIARY" });
                }
              }}
              className="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-3 py-1 rounded-full transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-4">
          {state.moods
            .filter(m => m.note || m.image)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry) => (
            <motion.div 
              key={entry.date} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-3xl shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm", MOOD_COLORS[entry.mood])}>
                    {/* You could put an icon here based on mood */}
                    <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800">{format(new Date(entry.date), "MMMM d, yyyy")}</p>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider text-gray-400")}>
                       {entry.mood}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if(confirm("Delete this entry?")) {
                      dispatch({ type: "DELETE_DIARY", payload: entry.date });
                    }
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {entry.image && (
                <div className="mb-4 rounded-2xl overflow-hidden shadow-sm">
                  <img src={entry.image} alt="Memory" className="w-full h-auto object-cover max-h-64" />
                </div>
              )}

              {entry.note && (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{entry.note}</p>
                </div>
              )}
            </motion.div>
          ))}
          
          {state.moods.filter(m => m.note || m.image).length === 0 && (
            <div className="text-center py-12 opacity-50">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">No memories saved yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
