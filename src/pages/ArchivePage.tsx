import { useStore } from "@/context/StoreContext";
import { motion } from "motion/react";

export default function ArchivePage() {
  const { state } = useStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-6">City Archive</h1>
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Mood Heatmap</h2>
        <div className="grid grid-cols-7 gap-2">
          {state.moods.map((mood) => (
            <div key={mood.id} className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs">
              {mood.mood[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
