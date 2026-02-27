import { useStore } from "@/context/StoreContext";
import { User, Globe, Calendar, Hash } from "lucide-react";

export default function ProfilePage() {
  const { state } = useStore();
  const { userProfile } = state;

  if (!userProfile) return null;

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#46178f]">Profile</h1>
      </header>

      <div className="bg-[#f8f5f2] rounded-3xl shadow-xl overflow-hidden border-2 border-gray-200 relative">
        {/* Passport Header */}
        <div className="bg-[#46178f] p-4 flex items-center justify-between border-b-4 border-[#eb6123]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛂</span>
            <span className="font-black text-white uppercase tracking-widest text-sm">Mooderia Passport</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-9xl">✨</span>
          </div>

          <div className="flex gap-6">
            <div className="w-24 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
               <User className="w-12 h-12 text-gray-400" />
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Surname / Given Names</label>
                <p className="font-black text-xl text-gray-800 font-mono uppercase leading-tight">{userProfile.name}</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Citizenship</label>
                <p className="font-black text-lg text-gray-800 font-mono uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#eb6123]" />
                  {userProfile.citizenship}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date of Issue</label>
              <p className="font-bold text-gray-800 font-mono">{userProfile.joinedDate}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passport No.</label>
              <p className="font-bold text-[#eb6123] font-mono">{userProfile.passportNumber}</p>
            </div>
          </div>

          {/* Machine Readable Zone Style */}
          <div className="mt-8 pt-4 border-t-2 border-gray-200 opacity-50 font-mono text-xs break-all tracking-widest leading-loose">
            P&lt;MOODERIA&lt;&lt;{userProfile.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br/>
            {userProfile.passportNumber}&lt;0MOOD&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-gray-200">
        <h3 className="font-black text-lg text-gray-700 mb-4">Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500">Total Moods Logged</span>
            <span className="font-black text-xl text-[#46178f]">{state.moods.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500">Current Streak</span>
            <span className="font-black text-xl text-[#eb6123]">{state.streak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500">Workouts Completed</span>
            <span className="font-black text-xl text-[#26890c]">{state.workouts.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
