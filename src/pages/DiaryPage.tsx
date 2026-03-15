import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { format, subDays, isSameDay, parseISO, isAfter, addMonths, addYears, addDays } from "date-fns";
import { Book, Trash2, Image as ImageIcon, X, Camera, Video, Grid, List, BarChart2, Sparkles, Mic, MicOff, Play, Pause, Lock, Unlock, Trophy, Calendar, Mail, Clock, BookOpen, Library, Share2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { SuccessAnimation } from "@/components/SuccessAnimation";

import { ShareQRModal } from "@/components/ShareQRModal";

const MOOD_COLORS: Record<string, string> = {
  Happy: "bg-yellow-400",
  Sad: "bg-blue-400",
  Neutral: "bg-gray-400",
  Loved: "bg-pink-400",
  Angry: "bg-red-500",
  Energetic: "bg-orange-400",
  Tired: "bg-white border border-gray-200 text-gray-500",
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
  const [selectedImage, setSelectedImage] = useState<string | Blob | null>(todayMood?.image || null);
  const [selectedVideo, setSelectedVideo] = useState<string | Blob | null>(todayMood?.video || null);
  const [selectedAudio, setSelectedAudio] = useState<string | Blob | null>(todayMood?.audio || null);
  const [lockDate, setLockDate] = useState<string | null>(todayMood?.lockDate || null);
  const [isHighlight, setIsHighlight] = useState<boolean>(todayMood?.isHighlight || false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successStats, setSuccessStats] = useState("");
  
  const [viewMode, setViewMode] = useState<"list" | "gallery">("list");
  const [filterMode, setFilterMode] = useState<"all" | "wins">("all");
  const [dailyPrompt, setDailyPrompt] = useState("");

  const filteredMoods = React.useMemo(() => {
    return state.moods.filter(m => m.note || m.image || m.video || m.audio);
  }, [state.moods]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingPopup, setShowRecordingPopup] = useState(false);
  
  // Future Letter State
  const [showFutureLetterModal, setShowFutureLetterModal] = useState(false);
  const [futureLetterText, setFutureLetterText] = useState("");
  const [futureLetterDate, setFutureLetterDate] = useState(format(addMonths(new Date(), 6), "yyyy-MM-dd"));
  const [shareData, setShareData] = useState<{ isOpen: boolean; data: any; title: string }>({ isOpen: false, data: null, title: "" });
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDailyPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const startRecording = async () => {
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
      setShowRecordingPopup(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please ensure you have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowRecordingPopup(false);
    }
  };

  const getMediaUrl = (media: string | Blob | undefined) => {
    if (!media) return "";
    if (media instanceof Blob) {
      return URL.createObjectURL(media);
    }
    return media;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("Image file is too large. Please choose an image under 50MB.");
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check size (limit to 50MB now that we use IndexedDB)
      if (file.size > 50 * 1024 * 1024) {
        alert("Video file is too large. Please choose a video under 50MB.");
        return;
      }
      setSelectedVideo(file);
    }
  };

  const handleSaveDiary = () => {
    if (!selectedMood && !todayMood) return;

    const moodToSave = selectedMood || todayMood?.mood;
    
    if (moodToSave) {
      dispatch({ 
        type: "ADD_MOOD", 
        payload: { 
          id: crypto.randomUUID(),
          date: today,
          mood: moodToSave,
          note: diaryEntry,
          image: selectedImage || undefined,
          video: selectedVideo || undefined,
          audio: selectedAudio || undefined,
          lockDate: lockDate || undefined,
          isHighlight: isHighlight
        } 
      });
      setShowSuccess(true);
      setSuccessStats("Vitality +3");
    }
  };

  const handleSaveFutureLetter = () => {
    if (!futureLetterText || !futureLetterDate) return;

    dispatch({ 
      type: "ADD_MOOD", 
      payload: { 
        id: crypto.randomUUID(),
        date: today, // Created today
        mood: "Neutral", // Default mood for letters
        note: futureLetterText,
        lockDate: futureLetterDate,
        isHighlight: false
      } 
    });
    
    setShowFutureLetterModal(false);
    setFutureLetterText("");
    setShowSuccess(true);
    setSuccessStats("+1 Future Letter Sealed");
  };

  // Mood Insights Calculation (Last 7 Days)
  const last7DaysMoods = React.useMemo(() => {
    return state.moods.filter(m => {
      const date = parseISO(m.date);
      const sevenDaysAgo = subDays(new Date(), 7);
      return date >= sevenDaysAgo;
    });
  }, [state.moods]);
  
  const moodCounts = React.useMemo(() => {
    return last7DaysMoods.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [last7DaysMoods]);

  const sortedMoods = React.useMemo(() => {
    return Object.entries(moodCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  }, [moodCounts]);

  // On This Day Logic
  const onThisDayEntries = React.useMemo(() => {
    return state.moods.filter(m => {
      const entryDate = parseISO(m.date);
      const todayDate = new Date();
      return (
        entryDate.getDate() === todayDate.getDate() &&
        entryDate.getMonth() === todayDate.getMonth() &&
        entryDate.getFullYear() !== todayDate.getFullYear()
      );
    });
  }, [state.moods]);

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <SuccessAnimation 
        type="mood" 
        isVisible={showSuccess} 
        onComplete={() => {setShowSuccess(false); setSuccessStats("");}} 
        stats={successStats}
      />
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1368ce] flex items-center gap-2">
            <Library className="w-8 h-8" /> Library of Memories
          </h1>
          <p className="text-gray-500 font-bold">Your Personal Archives</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFutureLetterModal(true)}
            className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shadow-sm border border-indigo-200 active:scale-95 transition-transform"
          >
            <Mail className="w-5 h-5" />
          </button>
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
        </div>
      </header>

      {/* Future Letter Modal */}
      <AnimatePresence>
        {showFutureLetterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#fdfbf7] w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-[#8b5cf6] flex flex-col max-h-[80vh]"
            >
              <div className="bg-[#8b5cf6] p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-white" />
                  <div>
                    <h3 className="text-white font-black text-xl leading-tight">Future Letter</h3>
                    <p className="text-white/80 text-xs font-bold">Write to your future self</p>
                  </div>
                </div>
                <button onClick={() => setShowFutureLetterModal(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Open Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                      value={futureLetterDate}
                      onChange={(e) => setFutureLetterDate(e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#8b5cf6] focus:outline-none font-bold text-gray-700"
                    />
                    <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    <button 
                      onClick={() => setFutureLetterDate(format(addMonths(new Date(), 6), "yyyy-MM-dd"))}
                      className="text-[10px] font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full whitespace-nowrap"
                    >
                      +6 Months
                    </button>
                    <button 
                      onClick={() => setFutureLetterDate(format(addYears(new Date(), 1), "yyyy-MM-dd"))}
                      className="text-[10px] font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full whitespace-nowrap"
                    >
                      +1 Year
                    </button>
                    <button 
                      onClick={() => setFutureLetterDate(format(addYears(new Date(), 5), "yyyy-MM-dd"))}
                      className="text-[10px] font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full whitespace-nowrap"
                    >
                      +5 Years
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
                  <textarea
                    value={futureLetterText}
                    onChange={(e) => setFutureLetterText(e.target.value)}
                    className="w-full h-48 p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#8b5cf6] focus:outline-none resize-none font-medium text-gray-700 leading-relaxed"
                    placeholder="Dear Future Me, I hope you have achieved..."
                  />
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                <button
                  onClick={handleSaveFutureLetter}
                  disabled={!futureLetterText}
                  className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-[#7c3aed] active:border-b-0 active:translate-y-1 disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  Seal Time Capsule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mood Insights */}
      {last7DaysMoods.length > 0 && (
        <div className="bg-white p-5 rounded-3xl shadow-md border-b-4 border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-[#1368ce]">
            <BarChart2 className="w-5 h-5" />
            <h3 className="font-black text-lg uppercase">Mood Insights (7 Days)</h3>
          </div>
          <div className="flex gap-2 items-end h-24">
            {sortedMoods.map(([mood, count]: [string, number]) => (
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
          </div>

          {/* Extra Options: Highlight & Lock */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setIsHighlight(!isHighlight)}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all",
                isHighlight
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
              )}
            >
              <Trophy className={cn("w-4 h-4", isHighlight && "fill-yellow-500 text-yellow-500")} />
              {isHighlight ? "Marked as Win!" : "Mark as Win"}
            </button>
            
            <div className="flex-1 relative">
              <input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={lockDate || ""}
                onChange={(e) => setLockDate(e.target.value || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <button
                className={cn(
                  "w-full h-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all pointer-events-none",
                  lockDate
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                )}
              >
                {lockDate ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Locked until {format(parseISO(lockDate), "MMM d")}
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Lock Memory
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div className="flex gap-2 mb-2">
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
            Max file size: 50MB
          </p>

          {/* Media Previews */}
          {(selectedImage || selectedVideo || selectedAudio) && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group aspect-video">
                  <img src={getMediaUrl(selectedImage)} alt="Attachment" className="w-full h-full object-cover" />
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
                  <video src={getMediaUrl(selectedVideo)} controls playsInline className="w-full h-full object-cover" />
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
                  <audio src={getMediaUrl(selectedAudio)} controls className="w-full h-8" />
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
            onClick={startRecording}
            className="w-full mb-3 bg-white border-2 border-[#1368ce] text-[#1368ce] py-3 rounded-2xl font-black shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-50"
          >
            <Mic className="w-5 h-5" />
            <span>Record Voice Note</span>
          </button>

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

      {/* Recording Popup */}
      <AnimatePresence>
        {showRecordingPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-red-500 p-8 text-center space-y-8"
            >
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Recording...</h3>
                <p className="text-gray-500 font-bold">Speak clearly into your microphone</p>
              </div>

              <div className="w-32 h-32 rounded-full bg-red-50 flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20" />
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Mic className="w-10 h-10" />
                </div>
              </div>

              <button
                onClick={stopRecording}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <MicOff className="w-6 h-6" />
                Stop Recording
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterMode(filterMode === "all" ? "wins" : "all")}
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1",
                filterMode === "wins" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
              )}
            >
              <Trophy className="w-3 h-3" /> Wins Only
            </button>
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
        </div>

        {viewMode === "list" ? (
          <div className="space-y-6">
            {/* Bookshelf Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredMoods
                .filter(m => filterMode === "all" || m.isHighlight)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, index) => {
                  const isLocked = entry.lockDate && isAfter(parseISO(entry.lockDate), new Date());
                  
                  return (
                    <motion.div 
                      key={entry.id ? `${entry.id}-${index}` : index} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => !isLocked && setSelectedEntry(entry)}
                      className={cn(
                        "relative aspect-[3/4] rounded-r-2xl rounded-l-md shadow-lg border-l-8 flex flex-col justify-between p-4 overflow-hidden group cursor-pointer",
                        MOOD_COLORS[entry.mood] || "bg-gray-200 border-gray-400",
                        "border-black/20" // Book spine effect
                      )}
                    >
                      {/* Book Cover Texture */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

                      {isLocked && (
                        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2">
                          <Lock className="w-8 h-8 text-white mb-2" />
                          <p className="text-white text-[10px] font-bold">
                            Opens {format(parseISO(entry.lockDate!), "MMM d, yyyy")}
                          </p>
                        </div>
                      )}

                      <div className="relative z-10 flex justify-between items-start">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                          <p className="font-black text-gray-800 text-xs">{format(new Date(entry.date), "MMM d")}</p>
                          <p className="text-[8px] font-bold uppercase text-gray-500">{format(new Date(entry.date), "yyyy")}</p>
                        </div>
                        {entry.isHighlight && <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300 drop-shadow-md" />}
                      </div>
                      
                      <div className="relative z-10 mt-auto">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2">
                            {entry.note || "Media Entry"}
                          </p>
                          <div className="flex gap-1 mt-1 text-gray-400">
                            {entry.image && <ImageIcon className="w-3 h-3" />}
                            {entry.video && <Video className="w-3 h-3" />}
                            {entry.audio && <Mic className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>

                      {/* Delete Button (Hidden until hover/focus) */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareData({ isOpen: true, data: entry, title: `Diary Entry: ${format(new Date(entry.date), "MMM d, yyyy")}` });
                          }}
                          className="bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                        >
                          <QrCode className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if(confirm("Delete this memory?")) {
                              dispatch({ type: "DELETE_DIARY", payload: entry.id });
                            }
                          }}
                          className="bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
            {/* Shelf Graphic */}
            <div className="h-4 bg-amber-800/20 rounded-full w-full mt-2 shadow-inner" />
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              filteredMoods
                .filter(m => m.image || m.video || m.audio)
                .filter(m => filterMode === "all" || m.isHighlight)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .reduce((acc, entry) => {
                  const dateKey = entry.date;
                  if (!acc[dateKey]) acc[dateKey] = [];
                  acc[dateKey].push(entry);
                  return acc;
                }, {} as Record<string, typeof state.moods>)
            ).map(([date, entries]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3 ml-1">
                  <div className="w-2 h-2 rounded-full bg-[#1368ce]" />
                  <h5 className="font-black text-gray-700 text-sm uppercase tracking-wide">
                    {format(parseISO(date), "MMMM d, yyyy")}
                  </h5>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(entries as typeof state.moods).map((entry, index) => {
                     const isLocked = entry.lockDate && isAfter(parseISO(entry.lockDate), new Date());
                     return (
                      <motion.div
                        key={entry.id ? `${entry.id}-${index}` : index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => !isLocked && setSelectedEntry(entry)}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100 cursor-pointer group"
                      >
                        {isLocked ? (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                            <Lock className="w-8 h-8 text-gray-400" />
                          </div>
                        ) : (
                          <>
                            {entry.image ? (
                              <img src={entry.image} alt="Gallery" className="w-full h-full object-cover" />
                            ) : (entry.video ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                                <Video className="w-10 h-10 mb-2 opacity-50" />
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">Video Memory</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Mic className="w-12 h-12 text-gray-400" />
                              </div>
                            ))}
                          </>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-white text-xs font-bold">{format(new Date(entry.date), "MMM d")}</p>
                              <p className="text-white/80 text-[10px] uppercase font-bold">{entry.mood}</p>
                            </div>
                            {entry.isHighlight && <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareData({ isOpen: true, data: entry, title: `Diary Entry: ${format(new Date(entry.date), "MMM d, yyyy")}` });
                            }}
                            className="bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                          >
                            <QrCode className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm("Delete this memory?")) {
                                dispatch({ type: "DELETE_DIARY", payload: entry.id });
                              }
                            }}
                            className="bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredMoods.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-bold">No memories saved yet.</p>
          </div>
        )}
      </div>

      {/* Maximized Entry Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={cn(
                "p-6 text-white flex justify-between items-center",
                MOOD_COLORS[selectedEntry.mood] || "bg-gray-400"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-xl uppercase tracking-tight">{format(new Date(selectedEntry.date), "MMM d, yyyy")}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">{selectedEntry.mood}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEntry(null)} 
                  className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {selectedEntry.note && (
                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                      {selectedEntry.note}
                    </p>
                  </div>
                )}

                {selectedEntry.image && (
                  <img src={getMediaUrl(selectedEntry.image)} alt="Diary" className="w-full rounded-2xl shadow-md" />
                )}

                {selectedEntry.video && (
                  <video 
                    src={getMediaUrl(selectedEntry.video)} 
                    controls 
                    playsInline 
                    preload="metadata" 
                    className="w-full rounded-2xl shadow-md max-h-[60vh] bg-black" 
                  />
                )}

                {selectedEntry.audio && (
                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                    <audio src={getMediaUrl(selectedEntry.audio)} controls className="w-full" />
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t-2 border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_DIARY", payload: selectedEntry.id });
                    setSelectedEntry(null);
                  }}
                  className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShareData({ isOpen: true, data: selectedEntry, title: `Diary Entry: ${format(new Date(selectedEntry.date), "MMM d, yyyy")}` });
                    setSelectedEntry(null);
                  }}
                  className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                >
                  <QrCode className="w-5 h-5" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareQRModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        type="diary"
        data={shareData.data}
        title={shareData.title}
      />
    </div>
  );
}
