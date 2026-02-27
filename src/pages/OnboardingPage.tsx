import { useState, ChangeEvent } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Globe, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !citizenship) return;

    dispatch({
      type: "SET_PROFILE",
      payload: {
        name,
        citizenship,
        joinedDate: format(new Date(), "MMM d, yyyy"),
        passportNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
        photo: photo || undefined,
      },
    });
    
    navigate("/mood");
  };

  return (
    <div className="min-h-screen bg-[#46178f] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-b-8 border-black/20"
      >
        <div className="bg-[#eb6123] p-6 text-center border-b-4 border-[#c54e16]">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">
            Passport
          </h1>
          <p className="text-white/80 font-bold text-sm uppercase tracking-widest mt-1">
            Mooderia Citizenship
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center mb-6">
            <label className="relative inline-block cursor-pointer group">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src="/logo.png" alt="Mooderia Logo" className="w-full h-full object-cover opacity-50" />
                )}
              </div>
              <div className="absolute bottom-4 right-0 bg-[#46178f] text-white p-2 rounded-full shadow-md">
                 <span className="text-xs font-bold">📷</span>
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <p className="text-gray-500 font-bold text-sm">Tap to Upload Photo</p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#46178f] focus:outline-none font-bold text-lg text-gray-800 placeholder-gray-300"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Citizenship
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#46178f] focus:outline-none font-bold text-lg text-gray-800 placeholder-gray-300"
                placeholder="e.g. Earth"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name || !citizenship}
            className="w-full bg-[#46178f] text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mt-4 border-b-4 border-[#2f0f60] active:border-b-0 active:translate-y-1"
          >
            Issue Passport
          </button>
        </div>
      </motion.div>
    </div>
  );
}
