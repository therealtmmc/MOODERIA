import { useState } from"react";
import { MapPin, Building2, Trees, Zap } from"lucide-react";
import { motion } from"motion/react";

const DISTRICTS = [
 { id:"d1", name:"Serenity Park", type:"nature", harmony: 98, x: 20, y: 30, icon: Trees, color:"text-emerald-500", bg:"bg-emerald-100" },
 { id:"d2", name:"The Spire", type:"business", harmony: 92, x: 50, y: 50, icon: Building2, color:"text-indigo-500", bg:"bg-indigo-100" },
 { id:"d3", name:"Harmony Hub", type:"residential", harmony: 95, x: 70, y: 20, icon: MapPin, color:"text-purple-500", bg:"bg-purple-100" },
 { id:"d4", name:"Energy Sector", type:"industrial", harmony: 88, x: 80, y: 70, icon: Zap, color:"text-amber-500", bg:"bg-amber-100" },
];

export function CityMap() {
 const [activeDistrict, setActiveDistrict] = useState(DISTRICTS[1]);

 return (
 <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-white/50 space-y-6">
 <div className="flex justify-between items-center">
 <h2 className="text-2xl font-black text-indigo-900 tracking-tight">City Grid</h2>
 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sector 4</div>
 </div>

 <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border-slate-200">
 {/* Fake Map Background using CSS patterns */}
 <div className="absolute inset-0 opacity-20" style={{ backgroundImage:'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize:'20px 20px' }}></div>
 <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)', backgroundSize:'40px 40px', backgroundPosition:'0 0, 20px 20px' }}></div>

 {/* Map Pins */}
 {DISTRICTS.map((district) => {
 const Icon = district.icon;
 const isActive = activeDistrict.id === district.id;
 return (
 <motion.button
 key={district.id}
 onClick={() => setActiveDistrict(district)}
 className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all ${isActive ?'scale-125 z-10' :'scale-100 hover:scale-110 z-0'}`}
 style={{ left: `${district.x}%`, top: `${district.y}%` }}
 whileHover={{ y: -5 }}
 >
 <div className={`p-2 rounded-full ${isActive ? district.bg :'bg-white'}`}>
 <Icon className={`w-5 h-5 ${isActive ? district.color :'text-slate-400'}`} />
 </div>
 {isActive && (
 <div className="bg-white px-2 py-1 rounded-md text-[10px] font-bold text-slate-800 whitespace-nowrap">
 {district.name}
 </div>
 )}
 </motion.button>
 );
 })}

 {/* Radar Sweep Effect */}
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ repeat: Infinity, duration: 10, ease:"linear" }}
 className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 origin-center pointer-events-none opacity-30"
 style={{ background:'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(139, 92, 246, 0.2) 360deg)' }}
 />
 </div>

 <div className="bg-slate-50 rounded-2xl p-4 border-slate-100">
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-bold text-slate-800 flex items-center gap-2">
 <activeDistrict.icon className={`w-4 h-4 ${activeDistrict.color}`} />
 {activeDistrict.name}
 </h3>
 <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
 Optimal
 </div>
 </div>
 <div className="flex justify-between items-end">
 <div>
 <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Harmony Index</div>
 <div className="text-2xl font-black text-indigo-900">{activeDistrict.harmony}%</div>
 </div>
 <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors">
 Fast Travel
 </button>
 </div>
 </div>
 </div>
 );
}
