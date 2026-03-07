import { useState, useEffect } from "react";
import { Menu, Building2, Award } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "@/context/StoreContext";
import { Billboard } from "./Billboard";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [time, setTime] = useState(new Date());
  const { state } = useStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 pt-4 pb-2 sticky top-0 z-30 transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-4 shadow-lg border-4 border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#46178f] rounded-xl flex items-center justify-center text-white shadow-md transform -rotate-3 border-2 border-[#2f0f60]">
               <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter text-[#46178f] uppercase leading-none">Mooderia</h1>
              <div className="flex items-center gap-1 mt-1">
                <Award className="w-3 h-3 text-yellow-500" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level {state.currentRank}</p>
              </div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.min((state.streak / 30) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={onMenuClick}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 hover:bg-[#46178f] hover:text-white transition-colors active:scale-95 border-2 border-gray-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-4 bg-gray-900 rounded-2xl p-3 flex justify-between items-center shadow-inner border-2 border-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10 flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City Time</span>
              <span className="font-black text-3xl tracking-widest text-green-400 font-mono leading-none drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                  {format(time, "hh:mm a")}
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</span>
              <span className="font-bold text-sm text-gray-300 uppercase">
                  {format(time, "MMM dd, yyyy")}
              </span>
            </div>
        </div>
        <Billboard />
      </div>
    </div>
  );
}
