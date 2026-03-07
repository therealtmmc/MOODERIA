import { useStore } from "@/context/StoreContext";
import { motion } from "motion/react";
import { TaskComponent } from "@/components/TaskComponent";

export default function CitizenHome() {
  const { state } = useStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-6">Citizen Home</h1>
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Welcome, {state.userProfile?.name}</h2>
        <p className="text-gray-600">This is your personal space in Mooderia.</p>
        <div className="mt-6 flex gap-4">
          <div className="bg-indigo-100 p-4 rounded-2xl">
            <h3 className="font-bold text-indigo-900">City Level</h3>
            <p className="text-4xl font-black text-indigo-600">{state.cityLevel}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-2xl">
            <h3 className="font-bold text-orange-900">Streak</h3>
            <p className="text-4xl font-black text-orange-600">{state.streak}</p>
          </div>
        </div>
      </div>
      <TaskComponent />
    </div>
  );
}
