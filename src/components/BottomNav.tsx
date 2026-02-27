import { Link, useLocation } from "react-router-dom";
import { Calendar, Dumbbell, Heart, ListTodo, Smile, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/mood", label: "Mood", icon: Smile, color: "text-[#eb6123]" }, // Orange
  { path: "/routine", label: "Routine", icon: ListTodo, color: "text-[#1368ce]" }, // Blue
  { path: "/events", label: "Events", icon: Calendar, color: "text-[#26890c]" }, // Green
  { path: "/health", label: "Health", icon: Dumbbell, color: "text-[#e21b3c]" }, // Red
  { path: "/profile", label: "Profile", icon: User, color: "text-[#46178f]" }, // Purple
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-transform active:scale-90",
                isActive ? "opacity-100" : "opacity-50 hover:opacity-75"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isActive ? "bg-gray-100 shadow-inner" : ""
                )}
              >
                <item.icon
                  className={cn(
                    "w-7 h-7 stroke-[2.5px]",
                    isActive ? item.color : "text-gray-500"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1 uppercase tracking-wider",
                  isActive ? "text-gray-800" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
