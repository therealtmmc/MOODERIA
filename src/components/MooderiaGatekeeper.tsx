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
  Info,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    id: 'mood',
    title: 'Central Park',
    subtitle: 'Emotional Sanctuary',
    description: 'The emotional lungs of your city. Log your daily feelings to maintain harmony and use breathing tools to find peace.',
    icon: TreePine,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 'work',
    title: 'Business District',
    subtitle: 'Command Center',
    description: 'Where city operations happen. Organize your daily routines, execute professional tasks, and level up your citizen status.',
    icon: Briefcase,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    bgLight: 'bg-blue-50',
  },
  {
    id: 'savings',
    title: 'Financial District',
    subtitle: 'The Treasury',
    description: 'The vault of your future. Secure your budget, set ambitious savings targets, and track your growing wealth with precision.',
    icon: PiggyBank,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgLight: 'bg-yellow-50',
  },
  {
    id: 'market',
    title: 'Market District',
    subtitle: 'Procurement Hub',
    description: 'Your city supply center. Assign items to your shopping lists, manage essential goods, and track your urban spending.',
    icon: ShoppingCart,
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgLight: 'bg-amber-50',
  },
  {
    id: 'events',
    title: 'Public Square',
    subtitle: 'Social Heartbeat',
    description: 'Stay informed about city-wide events, community announcements, and social activities happening in your personal city.',
    icon: Megaphone,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    bgLight: 'bg-orange-50',
  },
  {
    id: 'diary',
    title: 'The Library',
    subtitle: 'City Archives',
    description: 'The archive of your legacy. Write down daily reflections, store precious memories, and document your city\'s history.',
    icon: BookOpen,
    color: 'bg-stone-500',
    textColor: 'text-stone-600',
    bgLight: 'bg-stone-100',
  },
  {
    id: 'health',
    title: 'The Gym',
    subtitle: 'Physical Vigor',
    description: 'The foundation of a strong citizen. Log your workouts, track your daily activity, and ensure your health is in top condition.',
    icon: Dumbbell,
    color: 'bg-red-500',
    textColor: 'text-red-500',
    bgLight: 'bg-red-50',
  },
  {
    id: 'profile',
    title: 'Town Hall',
    subtitle: 'Administrative Core',
    description: 'The brain of your city. Manage your citizen identity, customize your profile, and oversee your overall city progress.',
    icon: Building2,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    bgLight: 'bg-purple-50',
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
          className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] bg-purple-500/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] bg-blue-500/30 rounded-full blur-[120px]" 
        />
      </div>

      <div className="w-full max-w-lg h-[100dvh] flex flex-col p-4 sm:p-6 md:p-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white/50"
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#46178f]" />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-none">Mooderia</h1>
              <p className="text-[8px] sm:text-[10px] font-black text-purple-300 uppercase tracking-widest mt-0.5 sm:mt-1">The Future of Living</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-lg">
            <p className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">v2.0 Beta</p>
          </div>
        </motion.div>

        {!showGuide ? (
          <div className="flex-1 flex flex-col justify-center space-y-6 sm:space-y-8 overflow-y-auto no-scrollbar py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-1 sm:space-y-2"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">WELCOME TO THE CITY</h2>
              <p className="text-purple-200 font-bold text-sm sm:text-base">Experience Mooderia as it was meant to be.</p>
            </motion.div>

            {/* Feature Showcase Card */}
            <div className="relative px-2 sm:px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={FEATURES[currentFeature].id}
                  initial={{ x: 50, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -50, opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white/20 relative overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col justify-center"
                >
                  <div className={cn("absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2", FEATURES[currentFeature].color)} />
                  
                  <div className="relative z-10 space-y-4 sm:space-y-6">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-xl", FEATURES[currentFeature].color)}
                    >
                      {React.createElement(FEATURES[currentFeature].icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
                    </motion.div>
                    
                    <div>
                      <p className={cn("text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1", FEATURES[currentFeature].textColor)}>
                        {FEATURES[currentFeature].subtitle}
                      </p>
                      <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">
                        {FEATURES[currentFeature].title}
                      </h3>
                    </div>

                    <p className="text-gray-500 font-bold leading-relaxed text-base sm:text-lg">
                      {FEATURES[currentFeature].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                {FEATURES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFeature(idx)}
                    className={cn(
                      "h-2 sm:h-3 rounded-full transition-all duration-500",
                      currentFeature === idx ? "w-8 sm:w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "w-2 sm:w-3 bg-white/20"
                    )}
                  />
                ))}
              </div>

              {/* Navigation Arrows - Hidden on very small screens, visible on sm+ */}
              <button 
                onClick={prevFeature}
                className="absolute left-[-10px] sm:left-[-25px] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all hover:bg-white/30 z-20"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button 
                onClick={nextFeature}
                className="absolute right-[-10px] sm:right-[-25px] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all hover:bg-white/30 z-20"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGuide(true)}
              className="w-full bg-white text-[#46178f] py-4 sm:py-6 rounded-[2rem] sm:rounded-[2.5rem] font-black text-xl sm:text-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 sm:gap-4 group relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="relative z-10">ENTER MOODERIA</span>
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center space-y-6 sm:space-y-8 overflow-y-auto no-scrollbar py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl border-4 border-white/20 text-center space-y-4 sm:space-y-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-[#46178f] shadow-inner">
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-none uppercase">Install Required</h2>
                <p className="text-sm sm:text-base text-gray-500 font-bold leading-tight">
                  Mooderia is a Progressive Web App. Add it to your home screen to unlock all city features.
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-gray-100 text-left space-y-3 sm:space-y-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight text-sm sm:text-base">
                  <Download className="w-4 h-4 text-purple-600" />
                  Installation Guide
                </h4>

                {isIOS ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-xs sm:text-sm">1</div>
                      <p className="text-xs sm:text-sm font-bold text-gray-600">
                        Tap the <Share className="inline w-4 h-4 mx-1 text-blue-500" /> <strong>Share</strong> icon in your browser.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-xs sm:text-sm">2</div>
                      <p className="text-xs sm:text-sm font-bold text-gray-600">
                        Scroll down and select <PlusSquare className="inline w-4 h-4 mx-1 text-gray-700" /> <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-xs sm:text-sm">1</div>
                      <p className="text-xs sm:text-sm font-bold text-gray-600">
                        Open your browser menu (usually three dots <span className="font-black">⋮</span>).
                      </p>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600 text-xs sm:text-sm">2</div>
                      <p className="text-xs sm:text-sm font-bold text-gray-600">
                        Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className="bg-red-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-100 flex items-center gap-2 sm:gap-3 text-left">
                  <MonitorX className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0" />
                  <p className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase leading-tight">
                    Desktop access is restricted. Please open this link on your mobile device to install.
                  </p>
                </div>
              )}
            </motion.div>

            <button 
              onClick={() => setShowGuide(false)}
              className="text-white/60 font-black text-xs sm:text-sm uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Showcase
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 sm:pt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
            <Info className="w-3 h-3 text-purple-300" />
            <p className="text-[8px] sm:text-[10px] font-bold text-purple-200 uppercase tracking-widest">
              Optimized for Mobile Standalone Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
