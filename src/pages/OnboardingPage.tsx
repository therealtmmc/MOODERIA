import { useState, ChangeEvent } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Globe, User, Camera, ChevronDown, Check, Building2, ArrowRight, ScanLine, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COUNTRIES } from "@/constants/countries";

export default function OnboardingPage() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

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

    setIsScanning(true);

    // Simulate system processing
    setTimeout(() => {
      const selectedCountry = COUNTRIES.find(c => c.name === citizenship);
      const currency = selectedCountry?.currency || "USD";

      dispatch({
        type: "SET_PROFILE",
        payload: {
          name,
          citizenship,
          currency,
          joinedDate: format(new Date(), "MMM d, yyyy"),
          passportNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
          photo: photo || undefined,
        },
      });
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#46178f] flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#eb6123]/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(70,23,143,0.9),rgba(70,23,143,0.8)),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50"></div>
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#46178f]/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <div className="relative w-24 h-24 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Verifying Identity</h2>
            <p className="text-white/60 font-bold text-sm">Accessing Mooderia City Database...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0f2f5] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white/20 relative z-10"
      >
        {/* Header Section */}
        <div className="bg-[#46178f] p-8 pb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#eb6123] rounded-full blur-xl opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 mb-4 shadow-inner transform rotate-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">
              Mooderia
            </h1>
            <p className="text-white/60 font-bold text-xs uppercase tracking-[0.2em] mt-2 bg-white/10 px-3 py-1 rounded-full border border-white/5">
              The Virtual City
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 -mt-6 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 border border-gray-100 relative overflow-hidden">
            
            {/* Photo Upload */}
            <div className="text-center -mt-16 mb-8 relative z-10">
              <label className="relative inline-block cursor-pointer group">
                <div className="w-28 h-28 bg-gray-100 rounded-2xl mx-auto border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform relative">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                     {!photo && <Camera className="w-8 h-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#eb6123] text-white p-2 rounded-xl shadow-md border-2 border-white transform rotate-3 group-hover:rotate-6 transition-transform">
                   <Camera className="w-4 h-4" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-wide mt-3">Upload Citizen Photo</p>
            </div>

            {/* Name Input */}
            <div className={`transition-all duration-300 ${isFocused === 'name' ? 'transform scale-[1.02]' : ''}`}>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Citizen Name
              </label>
              <div className={`relative group bg-gray-50 rounded-2xl border-2 transition-colors ${isFocused === 'name' ? 'border-[#46178f] bg-white shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="absolute left-4 top-4 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onFocus={() => setIsFocused('name')}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none font-black text-lg text-gray-800 placeholder-gray-300"
                  placeholder="Enter your name"
                />
                {name && (
                  <div className="absolute right-4 top-4 text-green-500 bg-green-50 rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Citizenship Select */}
            <div className={`transition-all duration-300 ${isFocused === 'citizenship' ? 'transform scale-[1.02]' : ''}`}>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Origin
              </label>
              <div className={`relative group bg-gray-50 rounded-2xl border-2 transition-colors ${isFocused === 'citizenship' ? 'border-[#46178f] bg-white shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="absolute left-4 top-4 text-gray-400">
                  <Globe className="w-5 h-5" />
                </div>
                <select
                  value={citizenship}
                  onFocus={() => setIsFocused('citizenship')}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setCitizenship(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-transparent focus:outline-none font-black text-lg text-gray-800 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Country</option>
                  {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              {citizenship && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold text-[#46178f] mt-2 ml-1 flex items-center gap-1 bg-[#46178f]/5 px-2 py-1 rounded-lg inline-flex"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#46178f]"></span>
                  Local Currency: {COUNTRIES.find(c => c.name === citizenship)?.currency}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!name || !citizenship || isScanning}
              className="w-full bg-[#46178f] hover:bg-[#3a1378] text-white py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_#2f0f60] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-none mt-4 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">Enter City</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

          </div>
        </div>
      </motion.div>
      
      <p className="text-white/40 font-bold text-[10px] mt-8 uppercase tracking-widest">
        made with ❤
      </p>
    </div>
  );
}
