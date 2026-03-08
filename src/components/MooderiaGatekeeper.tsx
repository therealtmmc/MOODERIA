import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  MonitorX, 
  Share, 
  PlusSquare, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  TreePine,
  Briefcase,
  PiggyBank,
  ShoppingCart,
  Megaphone,
  BookOpen,
  Dumbbell,
  ArrowRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    id: 'mood',
    title: 'Central Park',
    subtitle: 'Emotional Wellness',
    description: 'Track your daily emotions, find balance with breathing exercises, and watch your inner garden grow.',
    icon: TreePine,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 'work',
    title: 'Business District',
    subtitle: 'Professional Duties',
    description: 'Stay on top of your official duties. Issue decrees, manage routines, and climb the city ranks.',
    icon: Briefcase,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    bgLight: 'bg-blue-50',
  },
  {
    id: 'savings',
    title: 'Financial District',
    subtitle: 'Wealth Management',
    description: 'Manage your wallet, set ambitious savings goals, and track your net worth as you prosper.',
    icon: PiggyBank,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgLight: 'bg-yellow-50',
  },
  {
    id: 'market',
    title: 'Market District',
    subtitle: 'Supplies & Goods',
    description: 'Procure essential supplies for your journey. Convert units and follow the Mayor\'s shopping decrees.',
    icon: ShoppingCart,
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgLight: 'bg-amber-50',
  },
  {
    id: 'events',
    title: 'Public Square',
    subtitle: 'City Happenings',
    description: 'Never miss a beat in Mooderia. Stay informed about city-wide events and social gatherings.',
    icon: Megaphone,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    bgLight: 'bg-orange-50',
  },
  {
    id: 'diary',
    title: 'The Library',
    subtitle: 'Personal Records',
    description: 'A quiet space for reflection. Capture your thoughts, memories, and city milestones.',
    icon: BookOpen,
    color: 'bg-stone-500',
    textColor: 'text-stone-600',
    bgLight: 'bg-stone-100',
  },
  {
    id: 'health',
    title: 'The Gym',
    subtitle: 'Physical Vigor',
    description: 'Keep your citizen profile strong. Log workouts, track walks, and maintain peak physical health.',
    icon: Dumbbell,
    color: 'bg-red-500',
    textColor: 'text-red-500',
    bgLight: 'bg-red-50',
  }
];

export function MooderiaGatekeeper({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [checked, setChecked] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || window.innerWidth <= 1024;

      setIsStandalone(isStandaloneMode);
      setIsIOS(isIosDevice);
      setIsMobile(isMobileDevice);
      setChecked(true);
    };

    checkStatus();
    window.addEventListener('resize', checkStatus);
    return () => window.removeEventListener('resize', checkStatus);
  }, []);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  if (!checked) return null;

  // If we are in standalone mode, show the app
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#46178f] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/30 rounded-full blur-[120px]" 
        />
      </div>

      <div className="w-full max-w-md h-full flex flex-col p-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white/50"
            >
              <Sparkles className="w-7 h-7 text-[#46178f]" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Mooderia</h1>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mt-1">The Future of Living</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">v2.0 Beta</p>
          </div>
        </motion.div>

        {!showGuide ? (
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <h2 className="text-4xl font-black text-white leading-none">WELCOME TO THE CITY</h2>
              <p className="text-purple-200 font-bold">Experience Mooderia as it was meant to be.</p>
            </motion.div>

            {/* Feature Showcase Card */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={FEATURES[currentFeature].id}
                  initial={{ x: 50, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -50, opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white/20 relative overflow-hidden"
                >
                  <div className={cn("absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2", FEATURES[currentFeature].color)} />
                  
                  <div className="relative z-10 space-y-6">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl", FEATURES[currentFeature].color)}
                    >
                      {React.createElement(FEATURES[currentFeature].icon, { className: "w-10 h-10" })}
                    </motion.div>
                    
                    <div>
                      <p className={cn("text-xs font-black uppercase tracking-widest mb-1", FEATURES[currentFeature].textColor)}>
                        {FEATURES[currentFeature].subtitle}
                      </p>
                      <h3 className="text-4xl font-black text-gray-900 leading-none">
                        {FEATURES[currentFeature].title}
                      </h3>
                    </div>

                    <p className="text-gray-500 font-bold leading-relaxed text-lg">
                      {FEATURES[currentFeature].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {FEATURES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFeature(idx)}
                    className={cn(
                      "h-3 rounded-full transition-all duration-500",
                      currentFeature === idx ? "w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "w-3 bg-white/20"
                    )}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevFeature}
                className="absolute left-[-25px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all hover:bg-white/30"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={nextFeature}
                className="absolute right-[-25px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all hover:bg-white/30"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGuide(true)}
              className="w-full bg-white text-[#46178f] py-6 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="relative z-10">ENTER MOODERIA</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-white/20 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto text-[#46178f] shadow-inner">
                <Smartphone className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 leading-none uppercase">Install Required</h2>
                <p className="text-gray-500 font-bold leading-tight">
                  Mooderia is a Progressive Web App. Add it to your home screen to unlock all city features.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 text-left space-y-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                  <Download className="w-4 h-4 text-purple-600" />
                  Installation Guide
                </h4>

                {isIOS ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-white rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-sm">1</div>
                      <p className="text-sm font-bold text-gray-600">
                        Tap the <Share className="inline w-4 h-4 mx-1 text-blue-500" /> <strong>Share</strong> icon in your browser.
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-white rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-sm">2</div>
                      <p className="text-sm font-bold text-gray-600">
                        Scroll down and select <PlusSquare className="inline w-4 h-4 mx-1 text-gray-700" /> <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-white rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-sm">1</div>
                      <p className="text-sm font-bold text-gray-600">
                        Open your browser menu (usually three dots <span className="font-black">⋮</span>).
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-white rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-sm">2</div>
                      <p className="text-sm font-bold text-gray-600">
                        Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-left">
                  <MonitorX className="w-8 h-8 text-red-500 shrink-0" />
                  <p className="text-[10px] font-black text-red-600 uppercase leading-tight">
                    Desktop access is restricted. Please open this link on your mobile device to install.
                  </p>
                </div>
              )}
            </motion.div>

            <button 
              onClick={() => setShowGuide(false)}
              className="text-white/60 font-black text-sm uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Showcase
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Info className="w-3 h-3 text-purple-300" />
            <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">
              Optimized for Mobile Standalone Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
