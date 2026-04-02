import { useState, useEffect } from "react";
import { Camera, AlertTriangle, Eye, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CAMERAS = [
  { id: "cam-01", location: "Sector 4 - Plaza", status: "ACTIVE", src: "https://picsum.photos/seed/plaza/400/300" },
  { id: "cam-02", location: "Transit Hub B", status: "ACTIVE", src: "https://picsum.photos/seed/transit/400/300" },
  { id: "cam-03", location: "Residential Block 9", status: "OFFLINE", src: "" },
  { id: "cam-04", location: "The Spire - Entrance", status: "ACTIVE", src: "https://picsum.photos/seed/spire/400/300" },
];

export function SurveillanceGrid({ onClose }: { onClose: () => void }) {
  const [activeCam, setActiveCam] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<{id: number, x: number, y: number, w: number, h: number}[]>([]);

  // Simulate facial recognition tracking boxes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setBoxes(prev => {
          if (prev.length > 3) return prev.slice(1);
          return [...prev, {
            id: Date.now(),
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            w: 10 + Math.random() * 20,
            h: 15 + Math.random() * 25,
          }];
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clay-grid backdrop-blur-xl border border-blue-500/50 p-6 font-mono text-blue-500 h-[600px] flex flex-col relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10"></div>
      
      <div className="flex justify-between items-center border-b border-blue-500/30 pb-4 mb-6 relative z-20">
        <div className="flex items-center gap-3">
          <Eye className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-blue-500">Optic-Net Override</h2>
            <div className="text-xs text-blue-500/70 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              UNAUTHORIZED ACCESS
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-xs font-bold text-blue-500/50 hover:text-blue-500 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-500/10 transition-colors">
          DISCONNECT
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20 overflow-y-auto custom-scrollbar pr-2">
        {CAMERAS.map((cam) => (
          <div 
            key={cam.id} 
            className={`relative border ${activeCam === cam.id ? 'border-red-500' : 'border-blue-500/30'} bg-black/50 rounded-lg overflow-hidden cursor-pointer group`}
            onClick={() => setActiveCam(activeCam === cam.id ? null : cam.id)}
          >
            <div className="absolute top-2 left-2 z-30 flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-[10px] font-bold tracking-wider">
              <Video className={`w-3 h-3 ${cam.status === 'ACTIVE' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
              {cam.id}
            </div>
            <div className="absolute top-2 right-2 z-30 text-[10px] bg-black/70 px-2 py-1 rounded text-blue-400 font-bold uppercase">
              {cam.location}
            </div>

            {cam.status === 'ACTIVE' ? (
              <div className="relative w-full h-full aspect-video">
                <img 
                  src={cam.src} 
                  alt={cam.location} 
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:brightness-100 transition-all"
                  referrerPolicy="no-referrer"
                />
                {/* Tracking Boxes Overlay */}
                <AnimatePresence>
                  {boxes.map(box => (
                    <motion.div
                      key={box.id}
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute border border-red-500 bg-red-500/10 z-20 pointer-events-none flex items-start justify-end"
                      style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
                    >
                      <div className="text-[8px] bg-red-500 text-black font-bold px-1 -mt-3 mr-[-1px]">MATCH: {Math.floor(Math.random() * 40 + 60)}%</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Static noise overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
              </div>
            ) : (
              <div className="w-full h-full aspect-video flex flex-col items-center justify-center bg-blue-950/20 text-blue-500/50">
                <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                <div className="text-xs font-bold tracking-widest">SIGNAL LOST</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
