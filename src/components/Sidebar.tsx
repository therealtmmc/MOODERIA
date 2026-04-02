import { X, Calendar, Dumbbell, Briefcase, Smile, User, Book, PiggyBank, Globe, ShoppingCart, Terminal, GraduationCap, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";

const BASE_NAV_ITEMS = [
  { path: "/mood", label: "Mood Station", icon: Smile, color: "text-[#eb6123]" },
  { path: "/diary", label: "City Archives", icon: Book, color: "text-[#1368ce]" },
  { path: "/work", label: "Dept. of Labor", icon: Briefcase, color: "text-[#1368ce]" },
  { path: "/school", label: "City Academy", icon: GraduationCap, color: "text-indigo-600" },
  { path: "/savings", label: "City Bank", icon: PiggyBank, color: "text-[#d4af37]" },
  { path: "/events", label: "Public Square", icon: Calendar, color: "text-[#26890c]" },
  { path: "/market", label: "Market District", icon: ShoppingCart, color: "text-amber-600" },
  { path: "/health", label: "General Hospital", icon: Dumbbell, color: "text-[#e21b3c]" },
  { path: "/global", label: "Global Center", icon: Globe, color: "text-blue-500" },
  { path: "/emergency", label: "Emergency Hotlines", icon: Phone, color: "text-red-500" },
  { path: "/profile", label: "Citizen ID", icon: User, color: "text-[#46178f]" },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
 const location = useLocation();
 const { state } = useStore();

 const navItems = state.isStarkTheme 
 ? [{ path:"/home", label:"Hacker Terminal", icon: Terminal, color:"text-green-500" }, ...BASE_NAV_ITEMS]
 : BASE_NAV_ITEMS;

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
 />
 <motion.div
 initial={{ x:"100%" }}
 animate={{ x: 0 }}
 exit={{ x:"100%" }}
 transition={{ type:"spring", damping: 25, stiffness: 200 }}
 className={cn(
 "fixed top-0 right-0 h-full w-4/5 max-w-xs shadow-2xl z-50 p-6 flex flex-col rounded-l-[3rem] -l-8",
 state.isStarkTheme ? "bg-[#0a0c0a] border-l-4 border-[#879E2A] rounded-none stark-theme" : "bg-white"
 )}
 >
 <div className="flex justify-between items-center mb-8">
 <h2 className={cn("font-black text-3xl tracking-tight", state.isStarkTheme ? "text-[#879E2A] font-mono uppercase" : "text-gray-800")}>
 {state.isStarkTheme ? "SYS.MENU" : "CITY MAP"}
 </h2>
 <button 
 onClick={onClose}
 className={cn(
 "w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-90",
 state.isStarkTheme ? "bg-[#0a0c0a] border-2 border-[#879E2A] text-[#879E2A] hover:bg-[#879E2A] hover:text-[#0a0c0a] rounded-none" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
 )}
 >
 <X className="w-6 h-6" />
 </button>
 </div>

 <div className="space-y-4 flex-1 overflow-y-auto pr-2">
 {navItems.map((item) => {
 const isActive = location.pathname.startsWith(item.path);
 return (
 <Link
 key={item.path}
 to={item.path}
 onClick={onClose}
 className={cn(
 "flex items-center gap-4 p-4 transition-all active:scale-95",
 state.isStarkTheme ? "rounded-none border-2 border-transparent hover:border-[#879E2A]" : "rounded-3xl",
 isActive 
 ? (state.isStarkTheme ? "bg-[#879E2A] text-[#0a0c0a]" : "bg-[#1368ce]/10 text-[#1368ce] /20") 
 : (state.isStarkTheme ? "text-[#879E2A]" : "text-gray-600 hover:bg-gray-50")
 )}
 >
 <div className={cn(
 "p-3 transition-colors",
 state.isStarkTheme ? "rounded-none bg-transparent" : (isActive ?"bg-white rounded-2xl" :"bg-gray-100 rounded-2xl")
 )}>
 <item.icon className={cn("w-6 h-6 stroke-[2.5px]", state.isStarkTheme ? "text-current" : (isActive ? item.color :"text-gray-400"))} />
 </div>
 <span className={cn("font-black text-lg tracking-wide", state.isStarkTheme ? "font-mono uppercase" : "")}>{item.label}</span>
 </Link>
 );
 })}
 </div>
 
 <div className="mt-8 pt-6 -t-2 space-y-4">
 <button
 onClick={() => {
 if (confirm("EMERGENCY RESET: This will clear all your data (memories, profile, savings). Use this if the app is crashing or very slow. Continue?")) {
 localStorage.removeItem("MOODERIA-state");
 window.location.href ="/";
 }
 }}
 className={cn("w-full py-3 text-[10px] font-black uppercase tracking-widest transition-colors", state.isStarkTheme ? "text-[#879E2A] hover:bg-[#879E2A] hover:text-[#0a0c0a] border-2 border-[#879E2A]" : "text-red-400 hover:text-red-600")}
 >
 Emergency Reset
 </button>
 <div className="text-center">
 <p className={cn("text-xs font-black uppercase tracking-widest", state.isStarkTheme ? "text-[#879E2A] font-mono" : "text-gray-400")}><b>MOODERIA</b> City v2.0</p>
 <p className={cn("text-[10px] font-bold mt-1", state.isStarkTheme ? "text-[#879E2A]/70 font-mono" : "text-gray-300")}>made with ❤</p>
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
