import { useState } from"react";
import {
 format,
 startOfMonth,
 endOfMonth,
 eachDayOfInterval,
 isSameMonth,
 isSameDay,
 addMonths,
 subMonths,
 getDay,
} from"date-fns";
import { ChevronLeft, ChevronRight } from"lucide-react";
import { cn } from"@/lib/utils";

type CalendarProps = {
 events?: { date: string; color?: string; dot?: boolean }[];
 onDateClick?: (date: Date) => void;
 className?: string;
};

export function Calendar({ events = [], onDateClick, className }: CalendarProps) {
 const [currentMonth, setCurrentMonth] = useState(new Date());
 const days = eachDayOfInterval({
 start: startOfMonth(currentMonth),
 end: endOfMonth(currentMonth),
 });

 const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

 // Calculate empty placeholders for start of month
 const startDay = getDay(startOfMonth(currentMonth));
 const placeholders = Array.from({ length: startDay });

 return (
 <div className={cn("bg-white rounded-2xl overflow-hidden", className)}>
 <div className="flex items-center justify-between p-4 bg-gray-50 -b">
 <button
 onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
 className="p-2 hover:bg-gray-200 rounded-full transition-colors"
 >
 <ChevronLeft className="w-5 h-5 text-gray-600" />
 </button>
 <h2 className="font-black text-gray-700 text-lg">
 {format(currentMonth,"MMMM yyyy")}
 </h2>
 <button
 onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
 className="p-2 hover:bg-gray-200 rounded-full transition-colors"
 >
 <ChevronRight className="w-5 h-5 text-gray-600" />
 </button>
 </div>

 <div className="grid grid-cols-7 p-2 gap-1">
 {weekDays.map((day) => (
 <div key={day} className="text-center text-xs font-bold text-gray-400 py-2 uppercase">
 {day}
 </div>
 ))}
 
 {placeholders.map((_, i) => (
 <div key={`placeholder-${i}`} />
 ))}

 {days.map((day) => {
 const dateStr = format(day,"yyyy-MM-dd");
 const event = events.find((e) => e.date === dateStr);
 const isToday = isSameDay(day, new Date());

 return (
 <button
 key={day.toString()}
 onClick={() => onDateClick?.(day)}
 className={cn(
"aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95",
 isToday ?"ring-2 ring-[#46178f] ring-offset-1" :"",
 event?.color ? event.color :"bg-gray-50 hover:bg-gray-100",
 event?.color ?"text-white" :"text-gray-700"
 )}
 >
 <span className={cn("text-xs font-bold", event?.color ?"text-white" :"")}>
 {format(day,"d")}
 </span>
 {event?.dot && (
 <div className="w-1.5 h-1.5 rounded-full bg-[#eb6123] mt-1" />
 )}
 </button>
 );
 })}
 </div>
 </div>
 );
}
