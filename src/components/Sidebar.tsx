import { X, Calendar, Dumbbell, Briefcase, Smile, User, Book, PiggyBank, Globe, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/mood", label: "Mood Station", icon: Smile, color: "text-[#eb6123]" },
  { path: "/diary", label: "City Archives", icon: Book, color: "text-[#1368ce]" },
  { path: "/work", label: "Dept. of Labor", icon: Briefcase, color: "text-[#1368ce]" },
  { path: "/savings", label: "City Bank", icon: PiggyBank, color: "text-[#d4af37]" },
  { path: "/events", label: "Public Square", icon: Calendar, color: "text-[#26890c]" },
  { path: "/market", label: "Market District", icon: ShoppingCart, color: "text-amber-600" },
  { path: "/health", label: "General Hospital", icon: Dumbbell, color: "text-[#e21b3c]" },
  { path: "/global", label: "Global Center", icon: Globe, color: "text-blue-500" },
  { path: "/profile", label: "Citizen ID", icon: User, color: "text-[#46178f]" },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col rounded-l-[3rem] border-l-8 border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-3xl text-gray-800 tracking-tight">CITY MAP</h2>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-3xl transition-all active:scale-95",
                      isActive 
                        ? "bg-[#1368ce]/10 text-[#1368ce] shadow-sm border-2 border-[#1368ce]/20" 
                        : "text-gray-600 hover:bg-gray-50 border-2 border-transparent"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      isActive ? "bg-white shadow-sm" : "bg-gray-100"
                    )}>
                      <item.icon className={cn("w-6 h-6 stroke-[2.5px]", isActive ? item.color : "text-gray-400")} />
                    </div>
                    <span className="font-black text-lg tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Mooderia City v2.0</p>
                <p className="text-gray-300 text-[10px] font-bold mt-1">made with ❤</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
