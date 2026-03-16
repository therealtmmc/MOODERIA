import { useState, useEffect } from "react";
import { Heart, Sparkles, CheckCircle2 } from "lucide-react";

type Broadcast = {
  id: string;
  citizenId: string;
  mood: string;
  message: string;
  resonances: number;
  time: string;
  isResonated: boolean;
};

const INITIAL_BROADCASTS: Broadcast[] = [
  { id: "1", citizenId: "CTZ-4921", mood: "Joyous", message: "The morning light in Serenity Park is absolutely optimal today.", resonances: 142, time: "2m ago", isResonated: false },
  { id: "2", citizenId: "CTZ-8834", mood: "Productive", message: "Completed my daily quota 3 hours early. Praise the system.", resonances: 89, time: "15m ago", isResonated: false },
  { id: "3", citizenId: "CTZ-1029", mood: "Harmonious", message: "Feeling deeply connected to the city's frequency after my morning meditation.", resonances: 256, time: "1h ago", isResonated: true },
  { id: "4", citizenId: "CTZ-5512", mood: "Content", message: "My nutrient paste was exceptionally flavorful today.", resonances: 45, time: "3h ago", isResonated: false },
];

export function ResonanceFeed() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);

  const handleResonate = (id: string) => {
    setBroadcasts(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          isResonated: !b.isResonated,
          resonances: b.isResonated ? b.resonances - 1 : b.resonances + 1
        };
      }
      return b;
    }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-indigo-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Resonance Feed
        </h2>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live</div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {broadcasts.map((broadcast) => (
          <div key={broadcast.id} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {broadcast.citizenId.split('-')[1].substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    {broadcast.citizenId}
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{broadcast.time}</div>
                </div>
              </div>
              <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">
                {broadcast.mood}
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              "{broadcast.message}"
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
              <button 
                onClick={() => handleResonate(broadcast.id)}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${broadcast.isResonated ? 'text-pink-500' : 'text-slate-400 hover:text-pink-400'}`}
              >
                <Heart className={`w-4 h-4 ${broadcast.isResonated ? 'fill-pink-500' : ''}`} />
                {broadcast.resonances} Resonances
              </button>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
                Amplify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
