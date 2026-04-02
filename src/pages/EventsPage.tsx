import { useState, useEffect } from"react";
import { useStore, Event } from"@/context/StoreContext";
import { Plus, Trash2, X, Calendar as CalendarIcon, Clock, List, Grid, AlertCircle, Briefcase, User, Plane, Layers, Share2, QrCode } from"lucide-react";
import { Calendar } from"@/components/Calendar";
import { motion, AnimatePresence } from"motion/react";
import { format, parseISO, isAfter, startOfDay, differenceInDays, differenceInHours, differenceInMinutes } from"date-fns";
import { cn } from"@/lib/utils";
import { SuccessAnimation } from"@/components/SuccessAnimation";
import { ShareQRModal } from"@/components/ShareQRModal";

const EVENT_TYPES = [
 { id:"Social", label:"Social", icon: User, color:"bg-green-100 text-green-600 border-green-500" },
 { id:"Work", label:"Work", icon: Briefcase, color:"bg-blue-100 text-blue-600 border-blue-500" },
 { id:"Urgent", label:"Urgent", icon: AlertCircle, color:"bg-red-100 text-red-600 border-red-500" },
 { id:"Travel", label:"Travel", icon: Plane, color:"bg-purple-100 text-purple-600 border-purple-500" },
 { id:"Other", label:"Other", icon: Layers, color:"bg-gray-100 text-gray-600 border-gray-500" },
];

export default function EventsPage() {
 const { state, dispatch } = useStore();
 const [showAdd, setShowAdd] = useState(false);
 const [showCalendarReminder, setShowCalendarReminder] = useState(false);
 const [viewMode, setViewMode] = useState<"calendar" |"agenda">("calendar");
 const [showSuccess, setShowSuccess] = useState(false);
 const [successStats, setSuccessStats] = useState("");
 const [newEvent, setNewEvent] = useState<Partial<Event>>({
 title:"",
 date: format(new Date(),"yyyy-MM-dd"),
 time:"12:00",
 description:"",
 type:"Other",
 });

 // Countdown Logic
 const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, mins: number} | null>(null);
 const [shareData, setShareData] = useState<{ isOpen: boolean; data: any; title: string }>({ isOpen: false, data: null, title:"" });
 const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
 
 const upcomingEvents = state.events
 .filter((e) => isAfter(parseISO(e.date), startOfDay(new Date())) || e.date === format(new Date(),"yyyy-MM-dd"))
 .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

 const nearestEvent = upcomingEvents[0];

 useEffect(() => {
 if (!nearestEvent) {
 setTimeLeft(null);
 return;
 }

 const calculateTimeLeft = () => {
 const now = new Date();
 const eventDate = new Date(`${nearestEvent.date}T${nearestEvent.time}`);
 
 const days = differenceInDays(eventDate, now);
 const hours = differenceInHours(eventDate, now) % 24;
 const mins = differenceInMinutes(eventDate, now) % 60;

 if (days < 0 && hours < 0 && mins < 0) {
 setTimeLeft(null); // Passed
 } else {
 setTimeLeft({ days, hours, mins });
 }
 };

 calculateTimeLeft();
 const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

 return () => clearInterval(timer);
 }, [nearestEvent]);


 const handleAddEvent = () => {
 if (!newEvent.title || !newEvent.date || !newEvent.time) return;

 dispatch({
 type:"ADD_EVENT",
 payload: {
 id: crypto.randomUUID(),
 title: newEvent.title,
 date: newEvent.date,
 time: newEvent.time,
 description: newEvent.description,
 type: newEvent.type,
 } as Event,
 });
 setShowAdd(false);
 setShowCalendarReminder(true); // Show reminder
 setShowSuccess(true);
 setSuccessStats("Intellect +5");
 setNewEvent({
 title:"",
 date: format(new Date(),"yyyy-MM-dd"),
 time:"12:00",
 description:"",
 type:"Other",
 });
 };

 const calendarEvents = state.events.map((e) => {
 const typeColor = EVENT_TYPES.find(t => t.id === e.type)?.color ||"bg-gray-100 text-gray-800";
 // Extract bg color for dot
 const bgClass = typeColor.split("")[0]; 
 return {
 date: e.date,
 dot: true,
 color: bgClass, 
 };
 });

 const getEventTypeStyle = (type?: string) => {
 return EVENT_TYPES.find(t => t.id === type) || EVENT_TYPES[4];
 };

 return (
 <div className="p-4 pt-8 pb-24 space-y-6">
 <SuccessAnimation 
 type="event" 
 isVisible={showSuccess} 
 onComplete={() => {setShowSuccess(false); setSuccessStats("");}} 
 stats={successStats}
 />

 <header className="flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-black text-[#26890c]">Public Square</h1>
 <p className="text-gray-500 font-bold">City Events & Gatherings</p>
 </div>
 <div className="flex gap-2">
 <div className="bg-white p-1 rounded-xl flex">
 <button
 onClick={() => setViewMode("calendar")}
 className={cn("p-2 rounded-lg transition-colors", viewMode ==="calendar" ?"bg-[#26890c] text-white" :"text-gray-400")}
 >
 <Grid className="w-5 h-5" />
 </button>
 <button
 onClick={() => setViewMode("agenda")}
 className={cn("p-2 rounded-lg transition-colors", viewMode ==="agenda" ?"bg-[#26890c] text-white" :"text-gray-400")}
 >
 <List className="w-5 h-5" />
 </button>
 </div>
 <button
 onClick={() => setShowAdd(true)}
 className="bg-[#26890c] text-white p-2 rounded-xl active:scale-95 transition-transform"
 >
 <Plus className="w-6 h-6" />
 </button>
 </div>
 </header>

 {/* Countdown Widget */}
 <AnimatePresence>
 {nearestEvent && timeLeft && (
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, height: 0 }}
 className="bg-gradient-to-r from-[#26890c] to-[#34d399] p-6 rounded-3xl text-white relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
 <Clock className="w-32 h-32" />
 </div>
 
 <div className="relative z-10">
 <p className="text-xs font-bold uppercase opacity-80 mb-1">Up Next</p>
 <h3 className="text-2xl font-black mb-4 truncate pr-8">{nearestEvent.title}</h3>
 
 <div className="flex gap-4 text-center">
 <div className="bg-white/20 rounded-xl p-2 min-w-[60px] backdrop-blur-sm">
 <p className="text-2xl font-black">{timeLeft.days}</p>
 <p className="text-[10px] font-bold uppercase">Days</p>
 </div>
 <div className="bg-white/20 rounded-xl p-2 min-w-[60px] backdrop-blur-sm">
 <p className="text-2xl font-black">{timeLeft.hours}</p>
 <p className="text-[10px] font-bold uppercase">Hrs</p>
 </div>
 <div className="bg-white/20 rounded-xl p-2 min-w-[60px] backdrop-blur-sm">
 <p className="text-2xl font-black">{timeLeft.mins}</p>
 <p className="text-[10px] font-bold uppercase">Mins</p>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {viewMode ==="calendar" && (
 <motion.div 
 initial={{ opacity: 0 }} 
 animate={{ opacity: 1 }}
 className="bg-white p-4 rounded-3xl"
 >
 <Calendar events={calendarEvents} />
 </motion.div>
 )}

 <div className="space-y-4">
 <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
 <CalendarIcon className="w-5 h-5 text-[#26890c]" />
 {viewMode ==="calendar" ?"Upcoming" :"Agenda"}
 </h2>
 
 {upcomingEvents.length === 0 ? (
 <div className="text-center py-8 opacity-50">
 <p className="font-bold">No upcoming events.</p>
 </div>
 ) : (
 upcomingEvents.map((event) => {
 const typeStyle = getEventTypeStyle(event.type);
 const TypeIcon = typeStyle.icon;

 return (
 <motion.div
 key={event.id}
 layout
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 onClick={() => setSelectedEvent(event)}
 className={cn(
"bg-white p-4 rounded-2xl -l-8 flex justify-between items-center cursor-pointer hover: transition-shadow",
 typeStyle.color.split("").pop() // Get color class
 )}
 >
 <div className="flex items-center gap-3">
 <div className={cn("p-2 rounded-full", typeStyle.color.split("").slice(0, 2).join(""))}>
 <TypeIcon className="w-5 h-5" />
 </div>
 <div>
 <h3 className="font-black text-lg">{event.title}</h3>
 <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
 <span className="flex items-center gap-1">
 <CalendarIcon className="w-3 h-3" /> {format(parseISO(event.date),"MMM d")}
 </span>
 <span>•</span>
 <span className="flex items-center gap-1">
 <Clock className="w-3 h-3" /> {event.time}
 </span>
 </div>
 </div>
 </div>
 <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
 <button
 onClick={() => setShareData({ isOpen: true, data: event, title: `Event: ${event.title}` })}
 className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
 title="Share Event"
 >
 <QrCode className="w-5 h-5" />
 </button>
 <a
 href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date.replace(/-/g,"")}T${event.time.replace(/:/g,"")}00/${event.date.replace(/-/g,"")}T${event.time.replace(/:/g,"")}00&details=${encodeURIComponent(event.description ||"")}`}
 target="_blank"
 rel="noopener noreferrer"
 className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
 title="Add to Google Calendar"
 >
 <CalendarIcon className="w-5 h-5" />
 </a>
 <button
 onClick={() => dispatch({ type:"DELETE_EVENT", payload: event.id })}
 className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
 >
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </motion.div>
 );
 })
 )}
 </div>

 {/* Calendar Reminder Popup */}
 <AnimatePresence>
 {showCalendarReminder && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-6"
 >
 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
 <CalendarIcon className="w-8 h-8 text-[#26890c]" />
 </div>
 
 <div>
 <h3 className="text-xl font-black text-gray-800 mb-2">Event Added!</h3>
 <p className="text-gray-600 font-medium leading-relaxed">
 Don't forget to add this to your Google Calendar to get notified!
 </p>
 </div>

 <a
 href="https://calendar.google.com/calendar/u/0/r"
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => setShowCalendarReminder(false)}
 className="block w-full bg-[#26890c] text-white py-3 rounded-xl font-black active:scale-95 transition-transform flex items-center justify-center gap-2"
 >
 <CalendarIcon className="w-5 h-5" />
 Open Google Calendar
 </a>
 
 <button
 onClick={() => setShowCalendarReminder(false)}
 className="text-gray-400 font-bold text-sm hover:text-gray-600"
 >
 Close
 </button>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Add Event Modal */}
 <AnimatePresence>
 {showAdd && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="bg-[#26890c] p-4 flex justify-between items-center">
 <h3 className="text-white font-black text-xl">New Event</h3>
 <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
 <X className="w-6 h-6" />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Event Title</label>
 <input
 type="text"
 value={newEvent.title}
 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold"
 placeholder="e.g., Birthday Party"
 />
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Date</label>
 <input
 type="date"
 value={newEvent.date}
 onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold"
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Time</label>
 <input
 type="time"
 value={newEvent.time}
 onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Type</label>
 <div className="flex gap-2 overflow-x-auto pb-2">
 {EVENT_TYPES.map(type => {
 const Icon = type.icon;
 const isSelected = newEvent.type === type.id;
 return (
 <button
 key={type.id}
 // @ts-ignore
 onClick={() => setNewEvent({ ...newEvent, type: type.id })}
 className={cn(
"flex flex-col items-center p-2 rounded-xl min-w-[60px] transition-all",
 isSelected 
 ? `bg-white ${type.color.split("").pop()} scale-105` 
 :"bg-gray-50 text-gray-400"
 )}
 >
 <Icon className={cn("w-5 h-5 mb-1", isSelected ? type.color.split("")[1] :"text-gray-400")} />
 <span className={cn("text-[10px] font-bold uppercase", isSelected ?"text-gray-800" :"text-gray-400")}>{type.label}</span>
 </button>
 )
 })}
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Description (Optional)</label>
 <textarea
 value={newEvent.description}
 onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold resize-none h-24"
 placeholder="Details..."
 />
 </div>

 <button
 onClick={handleAddEvent}
 disabled={!newEvent.title || !newEvent.date || !newEvent.time}
 className="w-full mt-4 bg-[#26890c] text-white py-3 rounded-xl font-black active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
 >
 Add Event
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 {/* Selected Event Modal */}
 <AnimatePresence>
 {selectedEvent && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
 >
 <div className={cn(
"p-6 text-white flex justify-between items-center",
 getEventTypeStyle(selectedEvent.type).color.split("").slice(0, 2).join("").replace('text-','bg-').replace('bg-','bg-').replace('100','500').replace('600','500') // Quick hack to get a solid color from the style
 )}>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
 {(() => {
 const Icon = getEventTypeStyle(selectedEvent.type).icon;
 return <Icon className="w-5 h-5" />;
 })()}
 </div>
 <div>
 <h2 className="font-black text-xl uppercase tracking-tight">{selectedEvent.title}</h2>
 <p className="text-xs font-bold uppercase tracking-widest opacity-80">
 {selectedEvent.type}
 </p>
 </div>
 </div>
 <button 
 onClick={() => setSelectedEvent(null)} 
 className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="p-6 overflow-y-auto flex-1 space-y-6">
 <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
 <div className="flex-1 text-center -r-2">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
 <p className="font-black text-gray-800 text-lg">{format(parseISO(selectedEvent.date),"MMM d, yyyy")}</p>
 </div>
 <div className="flex-1 text-center">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Time</p>
 <p className="font-black text-gray-800 text-lg">{selectedEvent.time}</p>
 </div>
 </div>

 {selectedEvent.description && (
 <div className="space-y-2">
 <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest">Description</h3>
 <div className="bg-gray-50 p-4 rounded-2xl">
 <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
 {selectedEvent.description}
 </p>
 </div>
 </div>
 )}
 </div>

 <div className="p-6 bg-gray-50 -t-2 flex gap-3">
 <button
 onClick={() => {
 if(confirm("Delete this event?")) {
 dispatch({ type:"DELETE_EVENT", payload: selectedEvent.id });
 setSelectedEvent(null);
 }
 }}
 className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
 >
 <Trash2 className="w-5 h-5" />
 Delete
 </button>
 <button
 onClick={() => {
 setShareData({ isOpen: true, data: selectedEvent, title: `Event: ${selectedEvent.title}` });
 setSelectedEvent(null);
 }}
 className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-transform flex items-center justify-center gap-2"
 >
 <QrCode className="w-5 h-5" />
 Share
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Share Modal */}
 <ShareQRModal
 isOpen={shareData.isOpen}
 onClose={() => setShareData({ ...shareData, isOpen: false })}
 type="event"
 data={shareData.data}
 title={shareData.title}
 />
 </div>
 );
}
