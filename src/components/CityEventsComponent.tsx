import { useStore } from"@/context/StoreContext";
import { motion, AnimatePresence } from"motion/react";
import { useEffect, useState } from"react";

export function CityEventsComponent() {
 const { state } = useStore();
 const [event, setEvent] = useState<string | null>(null);

 useEffect(() => {
 const lastMood = state.moods[state.moods.length - 1]?.mood;
 if (lastMood ==="Happy") {
 setEvent("A festival is happening in the Public Square!");
 } else if (lastMood ==="Calm") {
 setEvent("A quiet reading hour is happening in the Library.");
 } else {
 setEvent(null);
 }
 }, [state.moods]);

 return (
 <AnimatePresence>
 {event && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="bg-orange-500 text-white p-4 rounded-2xl"
 >
 {event}
 </motion.div>
 )}
 </AnimatePresence>
 );
}
