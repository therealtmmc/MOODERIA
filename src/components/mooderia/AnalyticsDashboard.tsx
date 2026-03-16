import { useStore } from "@/context/StoreContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export function AnalyticsDashboard() {
  const { state } = useStore();

  // Generate fake data for the last 30 days if not enough real data exists
  const data = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    // Try to find real mood data, otherwise generate a "perfect" utopian baseline
    const realMood = state.moods.find(m => m.date === date.toISOString().split('T')[0]);
    
    let auraLevel = 85 + Math.random() * 10; // High baseline for Mooderia
    if (realMood) {
      if (realMood.mood === "Happy" || realMood.mood === "Excited") auraLevel = 95 + Math.random() * 5;
      if (realMood.mood === "Sad" || realMood.mood === "Anxious") auraLevel = 60 + Math.random() * 10;
    }

    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aura: Math.round(auraLevel),
      productivity: Math.round(70 + Math.random() * 25),
    };
  });

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-indigo-900 tracking-tight">Aura Analytics</h2>
        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Optimal
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-2xl p-4">
          <div className="text-sm font-medium text-indigo-500 uppercase tracking-wider">Average Aura</div>
          <div className="text-3xl font-black text-indigo-900 mt-1">92%</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4">
          <div className="text-sm font-medium text-purple-500 uppercase tracking-wider">City Alignment</div>
          <div className="text-3xl font-black text-purple-900 mt-1">98%</div>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAura" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="aura" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAura)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-slate-500 text-center font-medium">
        Your emotional resonance is perfectly aligned with the city's frequency.
      </p>
    </div>
  );
}
