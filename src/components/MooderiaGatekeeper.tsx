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
    details: [
      'Daily Mood Logging: Track your emotional trends over time.',
      'Breathing Exercises: Quick sessions to reduce stress and find focus.',
      'Emotional Garden: Watch your city\'s nature reflect your inner state.',
      'Wellness Analytics: Gain insights into what drives your happiness.'
    ],
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
    details: [
      'Routine Management: Build and maintain productive city habits.',
      'Task Delegation: Organize your professional duties with ease.',
      'Citizen Ranking: Earn prestige as you complete your daily decrees.',
      'Focus Zones: Dedicated timers for deep urban productivity.'
    ],
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
    details: [
      'Budget Tracking: Real-time monitoring of your city\'s cash flow.',
      'Savings Goals: Set and visualize your path to urban prosperity.',
      'Net Worth Monitor: Watch your financial legacy grow over time.',
      'Expense Categorization: Understand where your city\'s wealth goes.'
    ],
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
    details: [
      'Smart Shopping Lists: Organize your procurement by category.',
      'Unit Conversion: Seamlessly switch between urban measurements.',
      'Spending History: Review your past market transactions.',
      'Supply Inventory: Keep track of your city\'s essential stock.'
    ],
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
    details: [
      'City Calendar: Never miss a major urban event or milestone.',
      'Public Notices: Stay updated with the latest city decrees.',
      'Social Feed: Connect with the pulse of your personal community.',
      'Event Reminders: Get notified before city activities begin.'
    ],
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
    details: [
      'Daily Journaling: A private space for your urban reflections.',
      'Memory Vault: Store photos and notes from city milestones.',
      'Historical Timeline: Review your journey through Mooderia.',
      'Searchable Archives: Easily find past entries and reflections.'
    ],
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
    details: [
      'Workout Logging: Record your physical training sessions.',
      'Activity Tracking: Monitor your daily steps and movement.',
      'Health Metrics: Keep track of your city\'s vital statistics.',
      'Fitness Goals: Set and achieve new levels of physical vigor.'
    ],
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
    details: [
      'Citizen Profile: Customize your identity in the Republic.',
      'City Settings: Fine-tune your urban experience.',
      'Progress Overview: See your overall growth across all districts.',
      'Account Security: Protect your city\'s data and legacy.'
    ],
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
  const [showGuide, setShowGuide] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

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

  if (!checked) return null;

  // If we are in standalone mode, show the app
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#46178f] overflow-y-auto overflow-x-hidden font-sans no-scrollbar">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[100%] h-[100%] md:w-[70%] md:h-[70%] bg-purple-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[100%] h-[100%] md:w-[70%] md:h-[70%] bg-blue-500/20 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content Container */}
        <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
          
          {/* Left Side: Branding & Welcome (Sticky in landscape) */}
          <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 md:p-12 lg:sticky lg:top-0 lg:h-screen">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center mb-8 lg:mb-12"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 15 }}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50"
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

            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 mb-8 lg:mb-0"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                  WELCOME TO <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">THE CITY</span>
                </h2>
                <p className="text-purple-200 font-bold text-lg sm:text-xl max-w-md">
                  Experience Mooderia as it was meant to be. A personal sanctuary for your mind, body, and soul.
                </p>
              </motion.div>

              {/* Scroll Indicator for mobile */}
              <div className="lg:hidden mt-8">
                <div className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span>Scroll to Explore Districts</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Area (Features list or Install Guide) */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-12 flex flex-col">
            {!showGuide ? (
              <div className="space-y-6">
                {/* Vertical Features List - The "Up to Down" arrangement */}
                <div className="grid gap-4 sm:gap-6">
                  {FEATURES.map((feature, idx) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedFeature(idx)}
                      className="group bg-white/5 hover:bg-white backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-white/10 hover:border-white transition-all duration-500 shadow-xl cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl shrink-0 group-hover:scale-110 transition-transform", feature.color)}>
                          {React.createElement(feature.icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={cn("text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1 group-hover:opacity-100 opacity-60 transition-opacity", feature.textColor)}>
                                {feature.subtitle}
                              </p>
                              <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-gray-900 leading-none transition-colors">
                                {feature.title}
                              </h3>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:text-gray-900 group-hover:border-gray-900 transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                          <p className="text-purple-100 group-hover:text-gray-500 font-bold leading-relaxed text-sm sm:text-base transition-colors">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Fixed-style Action Button at the bottom of the list */}
                <div className="sticky bottom-6 mt-12">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowGuide(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-white text-[#46178f] py-6 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 group relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="relative z-10">ENTER MOODERIA</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="lg:h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border-4 border-white/20 text-center space-y-8"
                >
                  <div className="w-24 h-24 bg-purple-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#46178f] shadow-inner">
                    <Smartphone className="w-12 h-12" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-none uppercase tracking-tighter">Installation Required</h2>
                    <p className="text-lg text-gray-500 font-bold leading-tight">
                      Mooderia is a Progressive Web App. Add it to your home screen to unlock all city features.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 text-left space-y-6">
                    <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight text-lg">
                      <Download className="w-5 h-5 text-purple-600" />
                      Step-by-Step Guide
                    </h4>

                    {isIOS ? (
                      <div className="space-y-6">
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-white rounded-2xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600">1</div>
                          <p className="text-base sm:text-lg font-bold text-gray-600 leading-snug">
                            Tap the <Share className="inline w-5 h-5 mx-1 text-blue-500" /> <strong>Share</strong> icon in your Safari browser.
                          </p>
                        </div>
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-white rounded-2xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600">2</div>
                          <p className="text-base sm:text-lg font-bold text-gray-600 leading-snug">
                            Scroll down and select <PlusSquare className="inline w-5 h-5 mx-1 text-gray-700" /> <strong>Add to Home Screen</strong>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-white rounded-2xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600">1</div>
                          <p className="text-base sm:text-lg font-bold text-gray-600 leading-snug">
                            Open your browser menu (usually three dots <span className="font-black">⋮</span>).
                          </p>
                        </div>
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-white rounded-2xl border-2 border-purple-100 flex items-center justify-center shrink-0 font-black text-purple-600">2</div>
                          <p className="text-base sm:text-lg font-bold text-gray-600 leading-snug">
                            Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowGuide(false)}
                    className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back to Districts
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Global Footer */}
        <div className="w-full p-8 text-center mt-auto">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <Info className="w-4 h-4 text-purple-300" />
            <p className="text-[10px] sm:text-xs font-bold text-purple-200 uppercase tracking-[0.2em]">
              Republic of Mooderia
            </p>
          </div>
        </div>

        {/* Expanded Knowledge Overlay */}
        <AnimatePresence>
          {selectedFeature !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md overflow-y-auto p-4 sm:p-8 flex justify-center items-start sm:items-center no-scrollbar"
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Section */}
                <div className={cn("p-8 sm:p-12 text-white relative overflow-hidden", FEATURES[selectedFeature].color)}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                      {React.createElement(FEATURES[selectedFeature].icon, { className: "w-10 h-10 text-white" })}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                        {FEATURES[selectedFeature].subtitle}
                      </p>
                      <h3 className="text-4xl sm:text-5xl font-black leading-none">
                        {FEATURES[selectedFeature].title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 sm:p-12 space-y-8 pb-16 sm:pb-20">
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">District Overview</h4>
                    <p className="text-gray-500 text-lg font-bold leading-relaxed">
                      {FEATURES[selectedFeature].description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Key Functions</h4>
                    <div className="grid gap-3">
                      {FEATURES[selectedFeature].details?.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-colors", FEATURES[selectedFeature].color)}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <p className="text-gray-600 font-bold leading-snug">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFeature(null)}
                    className={cn("w-full py-6 rounded-[2rem] text-white font-black text-xl shadow-xl transition-transform active:scale-95", FEATURES[selectedFeature].color)}
                  >
                    CLOSE ARCHIVES
                  </button>
                </div>

                {/* Close Button (Top Corner) */}
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white hover:bg-black/20 transition-colors z-20"
                >
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
