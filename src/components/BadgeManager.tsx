import { useEffect } from"react";
import { useStore } from"@/context/StoreContext";

export function BadgeManager() {
 const { state, dispatch } = useStore();

 useEffect(() => {
 const checkBadges = () => {
 const stats = state.statistics || {};
 const badges = state.badges || [];
 const hasBadge = (id: string) => badges.some(b => b.id === id);

 const newBadges = [];

 if (!hasBadge("first_steps") && (stats.walksCompleted || 0) >= 1) {
 newBadges.push({ id:"first_steps", name:"First Steps", description:"Completed your first walk.", icon:"🚶" });
 }
 if (!hasBadge("bookworm") && (stats.diaryEntries || 0) >= 5) {
 newBadges.push({ id:"bookworm", name:"Bookworm", description:"Wrote 5 diary entries.", icon:"📚" });
 }
 if (!hasBadge("hard_worker") && (stats.workTasksCompleted || 0) >= 10) {
 newBadges.push({ id:"hard_worker", name:"Hard Worker", description:"Completed 10 work tasks.", icon:"💼" });
 }
 if (!hasBadge("social_butterfly") && (stats.eventsAttended || 0) >= 5) {
 newBadges.push({ id:"social_butterfly", name:"Social Butterfly", description:"Attended 5 events.", icon:"🦋" });
 }
 if (!hasBadge("wealthy_citizen") && (stats.coinsEarned || 0) >= 1000) {
 newBadges.push({ id:"wealthy_citizen", name:"Wealthy Citizen", description:"Earned 1000 coins.", icon:"💰" });
 }
 if (!hasBadge("scholar") && (stats.filesUploaded || 0) >= 5) {
 newBadges.push({ id:"scholar", name:"Scholar", description:"Uploaded 5 files to the Academy.", icon:"🎓" });
 }

 newBadges.forEach(badge => {
 dispatch({
 type:"UNLOCK_BADGE",
 payload: { ...badge, unlockedAt: Date.now() }
 });
 });
 };

 checkBadges();
 }, [state.statistics, state.badges, dispatch]);

 return null;
}
