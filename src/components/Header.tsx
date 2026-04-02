import { useState, useEffect } from"react";
import { Menu, Building2, Terminal } from"lucide-react";
import { format } from"date-fns";
import { Billboard } from"./Billboard";
import { useStore } from"@/context/StoreContext";
import { cn } from"@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
 const [time, setTime] = useState(new Date());
 const { state, dispatch } = useStore();

 useEffect(() => {
 const timer = setInterval(() => setTime(new Date()), 1000);
 return () => clearInterval(timer);
 }, []);

 return (
 <div className="px-4 pt-4 pb-2 sticky top-0 z-30 transition-all duration-[3000ms]">
 <div className={cn(
"backdrop-blur-md p-4 transition-all duration-[3000ms]",
 state.isStarkTheme 
 ?"bg-black/90 rounded-none border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
 :"bg-white/90 rounded-[2.5rem]"
 )}>
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-2">
 <button 
 onClick={() => dispatch({ type:"TOGGLE_STARK_THEME" })}
 className={cn(
"flex items-center justify-center transition-all duration-[3000ms] cursor-pointer active:scale-95",
 state.isStarkTheme
 ?"text-green-400 bg-transparent -none p-0"
 :"w-10 h-10 bg-[#46178f] text-white rounded-xl transform -rotate-3"
 )}
 title="Toggle Code Mooderia"
 >
 {state.isStarkTheme ? <Terminal className="w-6 h-6" /> : <Building2 className="w-5 h-5" />}
 </button>
 <div className="flex items-center">
 <h1 className={cn(
"font-bold text-xl leading-none transition-colors duration-[3000ms]",
 state.isStarkTheme ?"text-[#879E2A] font-mono tracking-widest stark-theme-glitch ml-1 uppercase text-glitch" :"tracking-tighter text-[#46178f]"
 )}>
 {state.isStarkTheme ?"code MOODERIA" :"MOODERIA"}
 </h1>
 </div>
 </div>
 
 <button 
 onClick={onMenuClick}
 className={cn(
"w-10 h-10 flex items-center justify-center transition-colors active:scale-95",
 state.isStarkTheme
 ?"bg-black text-green-400 border-green-500/50 hover:bg-green-900/30 rounded-none"
 :"bg-gray-100 rounded-xl text-gray-700 hover:bg-[#46178f] hover:text-white"
 )}
 >
 <Menu className="w-5 h-5" />
 </button>
 </div>
 
 <div className={cn(
"mt-4 p-3 flex justify-between items-center relative overflow-hidden transition-all duration-[3000ms]",
 state.isStarkTheme
 ?"bg-black border-green-500/30 rounded-none"
 :"bg-gray-900 rounded-2xl shadow-inner border-gray-800"
 )}>
 {!state.isStarkTheme && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>}
 {state.isStarkTheme && <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>}
 
 <div className="relative z-10 flex flex-col">
 <span className={cn(
"text-[10px] font-bold uppercase tracking-wider",
 state.isStarkTheme ?"text-green-600/70 font-mono" :"text-gray-500"
 )}>
 {state.isStarkTheme ?"SYS.TIME" :"City Time"}
 </span>
 <span className={cn(
"font-black text-3xl tracking-widest font-mono leading-none",
 state.isStarkTheme ?"text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" :"text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]"
 )}>
 {format(time,"hh:mm a")}
 </span>
 </div>
 <div className="relative z-10 flex flex-col items-end">
 <span className={cn(
"text-[10px] font-bold uppercase tracking-wider",
 state.isStarkTheme ?"text-green-600/70 font-mono" :"text-gray-500"
 )}>
 {state.isStarkTheme ?"SYS.DATE" :"Date"}
 </span>
 <span className={cn(
"font-bold text-sm uppercase",
 state.isStarkTheme ?"text-green-400 font-mono" :"text-gray-300"
 )}>
 {format(time,"MMM dd, yyyy")}
 </span>
 </div>
 </div>
 {!state.isStarkTheme && <Billboard />}
 </div>
 </div>
 );
}
