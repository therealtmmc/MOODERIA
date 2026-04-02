import { motion } from"motion/react";
import { useStore } from"@/context/StoreContext";
import { useLocation } from"react-router-dom";
import { DISTRICTS } from"@/constants/districts";

export function Avatar() {
 const { state } = useStore();
 const location = useLocation();
 const lastMood = state.moods[state.moods.length - 1]?.mood ||"Neutral";
 const district = DISTRICTS[location.pathname];

 const getAvatarExpression = (mood: string, districtName?: string) => {
 // District-specific poses
 if (districtName ==="Library") return"📖";
 if (districtName ==="Gym") return"💪";
 if (districtName ==="Business District") return"💼";
 
 // Mood-based expressions
 switch (mood) {
 case"Happy": return"😊";
 case"Sad": return"😢";
 case"Energetic": return"⚡";
 default: return"😐";
 }
 };

 return (
 <motion.div
 className="fixed bottom-20 right-6 z-40 text-6xl"
 initial={{ y: 100 }}
 animate={{ y: 0 }}
 whileHover={{ scale: 1.1 }}
 key={location.pathname}
 >
 {getAvatarExpression(lastMood, district?.name)}
 </motion.div>
 );
}
