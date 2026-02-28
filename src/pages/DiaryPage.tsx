import { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { Book, Trash2, Image as ImageIcon, X, Camera, Video, Grid, List, BarChart2, Sparkles, Mic, MicOff, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
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

const PROMPTS = [
  "What made you smile today?",
  "What was the hardest part of your day?",
  "What are you grateful for right now?",
  "Who did you connect with today?",
  "What did you learn today?",
  "How did you take care of yourself today?",
];

export default function DiaryPage() {
  const { state, dispatch } = useStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = state.moods.find((m) => m.date === today);

  const [diaryEntry, setDiaryEntry] = useState(todayMood?.note || "");
  const [selectedMood, setSelectedMood] = useState<string | null>(todayMood?.mood || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(todayMood?.image || null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(todayMood?.video || null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(todayMood?.audio || null);
  const [viewMode, setViewMode] = useState<"list" | "gallery">("list");
  const [dailyPrompt, setDailyPrompt] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDailyPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setSelectedAudio(reader.result as string);
          };
          
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Could not access microphone. Please ensure you have granted permission.");
      }
    }
  };

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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check size (limit to 10MB for base64 safety in localstorage)
      if (file.size > 10 * 1024 * 1024) {
        alert("Video file is too large. Please choose a video under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedVideo(reader.result as string);
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
          image: selectedImage || undefined,
          video: selectedVideo || undefined,
          audio: selectedAudio || undefined
        } 
      });
      alert("Diary entry saved!");
    }
  };

  // Mood Insights Calculation (Last 7 Days)
  const last7DaysMoods = state.moods
    .filter(m => {
      const date = parseISO(m.date);
      const sevenDaysAgo = subDays(new Date(), 7);
      return date >= sevenDaysAgo;
    });
  
  const moodCounts = last7DaysMoods.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  // On This Day Logic
  const onThisDayEntries = state.moods.filter(m => {
    const entryDate = parseISO(m.date);
    const todayDate = new Date();
    return (
      entryDate.getDate() === todayDate.getDate() &&
      entryDate.getMonth() === todayDate.getMonth() &&
      entryDate.getFullYear() !== todayDate.getFullYear()
    );
  });

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1368ce]">Diary</h1>
          <p className="text-gray-500 font-bold">Capture your memories</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg transition-colors", viewMode === "list" ? "bg-[#1368ce] text-white" : "text-gray-400")}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("gallery")}
            className={cn("p-2 rounded-lg transition-colors", viewMode === "gallery" ? "bg-[#1368ce] text-white" : "text-gray-400")}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mood Insights */}
      {last7DaysMoods.length > 0 && (
        <div className="bg-white p-5 rounded-3xl shadow-md border-b-4 border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-[#1368ce]">
            <BarChart2 className="w-5 h-5" />
            <h3 className="font-black text-lg uppercase">Mood Insights (7 Days)</h3>
          </div>
          <div className="flex gap-2 items-end h-24">
            {sortedMoods.map(([mood, count]) => (
              <div key={mood} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex justify-center">
                  <div 
                    className={cn("w-full max-w-[20px] rounded-t-lg transition-all group-hover:opacity-80", MOOD_COLORS[mood])}
                    style={{ height: `${(count / 7) * 100}%`, minHeight: "20px" }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center">{mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

          <div className="relative">
            <textarea
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              className="w-full h-40 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none resize-none font-medium text-gray-700 text-sm mb-4 leading-relaxed z-10 relative bg-transparent"
              placeholder={dailyPrompt}
            />
            {!diaryEntry && (
              <div className="absolute top-4 left-4 right-4 pointer-events-none opacity-40 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#1368ce] shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#1368ce]">{dailyPrompt}</p>
              </div>
            )}
            
            {/* Voice Recording Button */}
            <button
              onClick={toggleRecording}
              className={cn(
                "absolute bottom-6 right-4 p-2 rounded-full shadow-md transition-all z-20",
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-white text-gray-400 hover:text-[#1368ce]"
              )}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          {/* Media Upload */}
          <div className="flex gap-2 mb-4">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload}
            />
            <input 
              type="file" 
              accept="video/*" 
              ref={videoInputRef} 
              className="hidden" 
              onChange={handleVideoUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-[#1368ce] hover:border-[#1368ce] hover:bg-blue-50 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span className="font-bold text-xs">Photo</span>
            </button>
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="flex-1 h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-[#1368ce] hover:border-[#1368ce] hover:bg-blue-50 transition-all"
            >
              <Video className="w-5 h-5" />
              <span className="font-bold text-xs">Video</span>
            </button>
          </div>

          {/* Media Previews */}
          {(selectedImage || selectedVideo || selectedAudio) && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group aspect-video">
                  <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedVideo && (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group aspect-video bg-black">
                  <video src={selectedVideo} controls className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedAudio && (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1368ce]/10 rounded-full flex items-center justify-center text-[#1368ce]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <audio src={selectedAudio} controls className="w-full h-8" />
                  <button 
                    onClick={() => setSelectedAudio(null)}
                    className="bg-gray-200 text-gray-500 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
          
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

      {/* On This Day */}
      {onThisDayEntries.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-xl mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> On This Day
            </h3>
            <p className="text-white/80 text-sm font-bold mb-4">You have memories from previous years!</p>
            
            <div className="space-y-3">
              {onThisDayEntries.map(entry => (
                <div key={entry.date} className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-sm">{format(parseISO(entry.date), "yyyy")}</span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">{entry.mood}</span>
                  </div>
                  {entry.image && (
                    <img src={entry.image} alt="Memory" className="w-full h-32 object-cover rounded-lg mb-2" />
                  )}
                  {entry.note && (
                    <p className="text-sm font-medium line-clamp-2">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Past Entries */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h4 className="font-black text-gray-700 text-lg">Past Memories</h4>
          {state.moods.some(m => m.note || m.image || m.video || m.audio) && (
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

        {viewMode === "list" ? (
          <div className="space-y-4">
            {state.moods
              .filter(m => m.note || m.image || m.video || m.audio)
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
                
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {entry.image && (
                    <div className="rounded-2xl overflow-hidden shadow-sm aspect-video">
                      <img src={entry.image} alt="Memory" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {entry.video && (
                    <div className="rounded-2xl overflow-hidden shadow-sm aspect-video bg-black">
                      <video src={entry.video} controls className="w-full h-full object-cover" />
                    </div>
                  )}
                  {entry.audio && (
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <div className="w-8 h-8 bg-[#1368ce]/10 rounded-full flex items-center justify-center text-[#1368ce] shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <audio src={entry.audio} controls className="w-full h-8" />
                    </div>
                  )}
                </div>

                {entry.note && (
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{entry.note}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {state.moods
              .filter(m => m.image || m.video || m.audio)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <motion.div
                  key={entry.date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100"
                >
                  {entry.image ? (
                    <img src={entry.image} alt="Gallery" className="w-full h-full object-cover" />
                  ) : entry.video ? (
                    <video src={entry.video} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Mic className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold">{format(new Date(entry.date), "MMM d")}</p>
                    <p className="text-white/80 text-[10px] uppercase font-bold">{entry.mood}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
        
        {state.moods.filter(m => m.note || m.image || m.video || m.audio).length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-bold">No memories saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
