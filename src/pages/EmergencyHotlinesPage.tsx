import { useState, useEffect, useRef } from "react";
import { Shield, Flame, AlertTriangle, Phone, Edit2, MapPin, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type HotlineType = "police" | "fire" | "disaster";

interface Hotline {
  type: HotlineType;
  number: string;
  theme: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function EmergencyHotlinesPage() {
  const [municipality, setMunicipality] = useState("Manila");
  const [isSOSActive, setIsSOSActive] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [hotlines, setHotlines] = useState<Hotline[]>([
    { type: "police", title: "Police", desc: "Crime & Security", number: "09171234567", theme: "from-blue-500 to-blue-700", icon: <Shield className="w-12 h-12 text-white" /> },
    { type: "fire", title: "Fire Dept", desc: "Fire & Rescue", number: "09181234567", theme: "from-orange-500 to-red-600", icon: <Flame className="w-12 h-12 text-white" /> },
    { type: "disaster", title: "Disaster Risk", desc: "Natural Calamities", number: "09191234567", theme: "from-teal-500 to-emerald-700", icon: <AlertTriangle className="w-12 h-12 text-white" /> },
  ]);

  const changeNumber = (type: HotlineType) => {
    const newNumber = prompt(`Enter new 11-digit number for ${type}:`);
    if (newNumber && newNumber.length >= 11) {
      setHotlines(prev => prev.map(h => h.type === type ? { ...h, number: newNumber } : h));
    } else if (newNumber) {
      alert("Please enter a valid 11-digit Philippine number (e.g. 09171234567)");
    }
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const toggleSOS = () => {
    setIsSOSActive(true);
  };

  const stopSOS = () => {
    setIsSOSActive(false);
  };

  useEffect(() => {
    const cleanupAudio = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (oscillatorRef.current) {
        try {
          const oscs = Array.isArray(oscillatorRef.current) ? oscillatorRef.current : [oscillatorRef.current];
          oscs.forEach(osc => {
            try { osc.stop(); } catch(e) {}
            try { osc.disconnect(); } catch(e) {}
          });
        } catch(e) {}
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch(e) {}
        audioCtxRef.current = null;
      }
    };

    if (isSOSActive) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      
      // Create two oscillators for a harsh, dissonant siren effect
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth'; // Harsher waveform
      osc2.type = 'square';   // Very harsh waveform
      
      osc1.frequency.setValueAtTime(800, ctx.currentTime);
      osc2.frequency.setValueAtTime(820, ctx.currentTime);
      
      // Maximize volume (0.8 is very loud, avoiding full 1.0 to prevent extreme clipping)
      gain.gain.setValueAtTime(0.8, ctx.currentTime); 
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      
      // Store both oscillators in the ref
      oscillatorRef.current = [osc1, osc2] as any;
      
      let isHigh = false;
      intervalRef.current = setInterval(() => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          // Fast high-low alternation (yelp) with dissonance
          const freq1 = isHigh ? 1200 : 800;
          const freq2 = isHigh ? 1250 : 750;
          try {
            osc1.frequency.setValueAtTime(freq1, audioCtxRef.current.currentTime);
            osc2.frequency.setValueAtTime(freq2, audioCtxRef.current.currentTime);
          } catch (e) {}
          isHigh = !isHigh;
        }
      }, 120); // 120ms is very fast, creating a panic "yelp" siren

    } else {
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [isSOSActive]);

  return (
    <div className="p-4 pt-8 pb-40 space-y-6 relative min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
          <AlertOctagon className="text-red-600 w-8 h-8" />
          Emergency
        </h1>
        <div className="flex items-center gap-3 mt-4 bg-white p-4 clay-card">
          <MapPin className="text-red-500 w-6 h-6" />
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Municipality</p>
            <input 
              type="text" 
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="font-black text-xl w-full outline-none text-gray-800 bg-transparent"
              placeholder="Enter your municipality..."
            />
          </div>
        </div>
      </header>

      <div className="space-y-6 relative z-10">
        {hotlines.map((hotline) => (
          <motion.div 
            key={hotline.type}
            className="clay-card relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            {/* Colored background layer inside the clay card */}
            <div className={`absolute inset-0 bg-gradient-to-br ${hotline.theme} opacity-90`} />
            
            {/* Decorative background icon */}
            <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 scale-150 pointer-events-none">
              {hotline.icon}
            </div>

            <div className="relative z-10 p-6 flex flex-col gap-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    {hotline.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-wide">{hotline.title}</h2>
                    <p className="text-white/80 font-bold text-sm">{hotline.desc}</p>
                  </div>
                </div>
                <button onClick={() => changeNumber(hotline.type)} className="p-3 bg-white/20 hover:bg-white/30 transition-colors rounded-full backdrop-blur-sm">
                  <Edit2 className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="bg-black/20 rounded-2xl p-4 my-2 backdrop-blur-sm border border-white/10">
                <div className="text-3xl sm:text-4xl font-black tracking-[0.2em] text-center font-mono">
                  {hotline.number}
                </div>
              </div>

              <button 
                onClick={() => callNumber(hotline.number)}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                CALL NOW
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SOS Button */}
      <div className="fixed bottom-24 left-0 right-0 p-4 z-40 max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSOS}
          className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black text-2xl shadow-[0_10px_25px_rgba(220,38,38,0.5)] border-4 border-white flex items-center justify-center gap-3"
        >
          <AlertOctagon className="w-8 h-8" />
          ACTIVATE SOS
        </motion.button>
      </div>

      {/* SOS Overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-red-600 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className="text-white text-5xl sm:text-7xl font-black text-center uppercase tracking-widest mb-16 leading-tight"
            >
              STATE OF<br/>EMERGENCY
            </motion.div>
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mb-16"
            >
              <AlertTriangle className="w-40 h-40 text-white" />
            </motion.div>

            <button 
              onClick={stopSOS}
              className="bg-white text-red-600 font-black text-4xl py-6 px-16 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95 transition-transform w-full max-w-xs"
            >
              STOP
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
