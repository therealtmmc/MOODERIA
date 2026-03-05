import { useState, useEffect } from "react";
import { Menu, Sparkles } from "lucide-react";
import { format } from "date-fns";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 pt-4 pb-2 sticky top-0 z-30 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border-b-4 border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="w-12 h-12 bg-[#8b5cf6] rounded-2xl flex items-center justify-center text-white shadow-md transform -rotate-3">
             <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-black text-3xl tracking-tighter text-[#8b5cf6]">MOODERIA</h1>
          <button 
            onClick={onMenuClick}
            className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors active:scale-95"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
        
        <div className="flex justify-center">
            <div className="font-black text-5xl tracking-tighter text-[#8b5cf6] drop-shadow-sm transform hover:scale-105 transition-transform">
                {format(time, "hh:mm a")}
            </div>
        </div>
      </div>
    </div>
  );
}
