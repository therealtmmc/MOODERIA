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
  Building2,
  Smile, Heart, Zap, Star, Cloud, Sun, Moon, Music, Coffee, Book, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BACKGROUND_ICONS = [
  Smile, Heart, Zap, Star, Cloud, Sun, Moon, Music, Coffee, Book, Sparkles, Flame
];

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  slogan: string;
  description: string;
  details: string[];
  icon: any;
  emoji: string;
  color: string;
  textColor: string;
  bgLight: string;
  imageSeed: string;
}

const FEATURES: Feature[] = [
  {
    id: 'mood',
    title: 'Central Park',
    subtitle: 'Happy Zone',
    slogan: 'Turn that Frown Upside Down! 🌳',
    description: 'The emotional lungs of your city. Log your daily feelings and keep the vibes high!',
    details: [
      'Daily Mood Logging: Track your emotional trends over time.',
      'Breathing Exercises: Quick sessions to reduce stress and find focus.',
      'Emotional Garden: Watch your city\'s nature reflect your inner state.',
      'Wellness Analytics: Gain insights into what drives your happiness.'
    ],
    icon: TreePine,
    emoji: '🌳✨🌈',
    color: 'bg-emerald-400',
    textColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    imageSeed: 'forest',
  },
  {
    id: 'work',
    title: 'Business District',
    subtitle: 'Hustle Hub',
    slogan: 'Get Stuff Done! 🚀',
    description: 'Where city operations happen. Organize your routines and become a Super Citizen!',
    details: [
      'Routine Management: Build and maintain productive city habits.',
      'Task Delegation: Organize your professional duties with ease.',
      'Citizen Ranking: Earn prestige as you complete your daily decrees.',
      'Focus Zones: Dedicated timers for deep urban productivity.'
    ],
    icon: Briefcase,
    emoji: '💼🚀🔥',
    color: 'bg-blue-400',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    imageSeed: 'office',
  },
  {
    id: 'savings',
    title: 'Financial District',
    subtitle: 'Money Vault',
    slogan: 'Stack those Coins! 💰',
    description: 'The vault of your future. Secure your budget and watch your wealth grow!',
    details: [
      'Budget Tracking: Real-time monitoring of your city\'s cash flow.',
      'Savings Goals: Set and visualize your path to urban prosperity.',
      'Net Worth Monitor: Watch your financial legacy grow over time.',
      'Expense Categorization: Understand where your city\'s wealth goes.'
    ],
    icon: PiggyBank,
    emoji: '💰💎🏦',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    imageSeed: 'gold',
  },
  {
    id: 'market',
    title: 'Market District',
    subtitle: 'Shopping Spree',
    slogan: 'Fill your Cart! 🛒',
    description: 'Your city supply center. Manage your goods and track your urban spending.',
    details: [
      'Smart Shopping Lists: Organize your procurement by category.',
      'Unit Conversion: Seamlessly switch between urban measurements.',
      'Spending History: Review your past market transactions.',
      'Supply Inventory: Keep track of your city\'s essential stock.'
    ],
    icon: ShoppingCart,
    emoji: '🛒🍎📦',
    color: 'bg-orange-400',
    textColor: 'text-orange-700',
    bgLight: 'bg-orange-50',
    imageSeed: 'market',
  },
  {
    id: 'events',
    title: 'Public Square',
    subtitle: 'Party Central',
    slogan: 'Join the Fun! 🎉',
    description: 'Stay informed about city-wide events and social activities in your personal city.',
    details: [
      'City Calendar: Never miss a major urban event or milestone.',
      'Public Notices: Stay updated with the latest city decrees.',
      'Social Feed: Connect with the pulse of your personal community.',
      'Event Reminders: Get notified before city activities begin.'
    ],
    icon: Megaphone,
    emoji: '🎉🎈📣',
    color: 'bg-pink-400',
    textColor: 'text-pink-600',
    bgLight: 'bg-pink-50',
    imageSeed: 'crowd',
  },
  {
    id: 'diary',
    title: 'The Library',
    subtitle: 'Secret Archives',
    slogan: 'Write your Story! 📖',
    description: 'The archive of your legacy. Write down reflections and store precious memories.',
    details: [
      'Daily Journaling: A private space for your urban reflections.',
      'Memory Vault: Store photos and notes from city milestones.',
      'Historical Timeline: Review your journey through Mooderia.',
      'Searchable Archives: Easily find past entries and reflections.'
    ],
    icon: BookOpen,
    emoji: '📖✍️🕰️',
    color: 'bg-purple-400',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    imageSeed: 'library',
  },
  {
    id: 'health',
    title: 'The Gym',
    subtitle: 'Power House',
    slogan: 'Get Stronger! 💪',
    description: 'The foundation of a strong citizen. Log your workouts and stay in top condition.',
    details: [
      'Workout Logging: Record your physical training sessions.',
      'Activity Tracking: Monitor your daily steps and movement.',
      'Health Metrics: Keep track of your city\'s vital statistics.',
      'Fitness Goals: Set and achieve new levels of physical vigor.'
    ],
    icon: Dumbbell,
    emoji: '💪🏋️‍♂️🥗',
    color: 'bg-red-400',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    imageSeed: 'fitness',
  },
  {
    id: 'profile',
    title: 'Town Hall',
    subtitle: 'Boss Mode',
    slogan: 'Rule your World! 👑',
    description: 'The brain of your city. Manage your identity and oversee your city progress.',
    details: [
      'Citizen Profile: Customize your identity in the Republic.',
      'City Settings: Fine-tune your urban experience.',
      'Progress Overview: See your overall growth across all districts.',
      'Account Security: Protect your city\'s data and legacy.'
    ],
    icon: Building2,
    emoji: '👑🏛️⚙️',
    color: 'bg-indigo-400',
    textColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    imageSeed: 'city',
  }
];

const QUOTES = [
  "Your mind is a city; keep the streets clean and the lights bright. ✨",
  "Productivity is the heartbeat of progress. ⚡",
  "In the Republic of Mooderia, every citizen is a hero. 👑",
  "Small habits build great empires. 🏛️",
  "Peace is the foundation of urban harmony. 🌳",
  "Your potential is as vast as the city skyline. 🏙️"
];

const DistrictPoster = ({ feature, onClick }: { feature: Feature, onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, rotate: 1 }}
      onClick={onClick}
      className={cn(
        "group relative w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-[16/9] rounded-[3rem] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-8 border-white transition-all duration-500",
        feature.color
      )}
    >
      {/* Cartoonish Background Patterns */}
      <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-6 gap-4 p-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center opacity-20 rotate-12">
              {React.createElement(feature.icon, { className: "w-8 h-8 text-black" })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Visual */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
        >
          {React.createElement(feature.icon, { className: "w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 text-white opacity-80" })}
        </motion.div>
      </div>

      {/* Micro-Interaction Sparkles on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200]
            }}
            transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
            className="absolute top-1/2 left-1/2 text-2xl"
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* District Mascot */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl border-4 border-black/10 z-20 hidden sm:flex items-center justify-center text-purple-600"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      {/* Poster Content */}
      <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border-4 border-black/10 shadow-lg">
            <p className={cn("text-sm font-black uppercase tracking-[0.2em]", feature.textColor)}>
              {feature.subtitle}
            </p>
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl border-4 border-black/10 flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
            {React.createElement(feature.icon, { className: cn("w-8 h-8", feature.textColor) })}
          </div>
        </div>

        <div className="space-y-4 bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border-4 border-black/10 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <div className="space-y-1">
            <h3 className={cn("text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none", feature.textColor)}>
              {feature.title}
            </h3>
            <p className="text-gray-600 font-black text-sm sm:text-lg uppercase tracking-widest">
              {feature.slogan}
            </p>
          </div>

          <p className="text-gray-500 font-bold text-sm sm:text-base max-w-xl line-clamp-2">
            {feature.description}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <div className={cn("h-2 flex-1 rounded-full opacity-20", feature.color)} />
            <div className={cn("flex items-center gap-2 font-black text-xs uppercase tracking-widest", feature.textColor)}>
              <span>Explore</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function MooderiaGatekeeper({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [checked, setChecked] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [confetti, setConfetti] = useState(false);

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

    // Randomize quote on load
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    window.addEventListener('resize', checkStatus);
    return () => {
      window.removeEventListener('resize', checkStatus);
    };
  }, []);

  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  if (!checked) return null;

  // If we are in standalone mode, show the app
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden font-sans no-scrollbar bg-[#46178f] text-white">
      {/* Tiled Background Pattern */}
      <div className="fixed inset-0 opacity-10 flex flex-wrap justify-center content-center gap-12 transform -rotate-12 scale-150 pointer-events-none z-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const Icon = BACKGROUND_ICONS[i % BACKGROUND_ICONS.length];
          return (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <Icon className="w-12 h-12" />
            </motion.div>
          );
        })}
      </div>

      {/* Vignette Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#46178f_100%)] pointer-events-none z-0" />

      {/* Confetti Celebration */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-[10001]">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 20, rotate: 360 }}
              transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
              className="absolute text-2xl"
            >
              {['🎉', '✨', '🏙️', '🌈'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Fast-Travel Mini-Map */}
      <div className="fixed bottom-8 right-8 z-[1000] hidden lg:flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border-4 border-black/10 shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Mini-Map</p>
        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => {
                const el = document.getElementById(`poster-${f.id}`);
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform", f.color)}
            >
              {React.createElement(f.icon, { className: "w-5 h-5" })}
            </button>
          ))}
        </div>
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
                  <h1 className="text-2xl font-black uppercase tracking-tighter leading-none text-white">Mooderia</h1>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-purple-300">The Future of Living</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Welcome</p>
              </div>
            </motion.div>

            <div className="flex-1 flex flex-col justify-center space-y-8">
              {/* Citizen's Daily Quote */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border-4 border-white/10 shadow-2xl inline-block rotate-[-2deg] self-start max-w-sm relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-black text-white leading-tight italic">
                  "{quote}"
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mt-4">— Republic Wisdom</p>
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/50"
                >
                  <span className="text-sm font-black text-purple-900 uppercase tracking-[0.3em]">Republic of Mooderia</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white"
                >
                  Your City <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Awaits.</span>
                </motion.h1>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-2xl font-bold leading-tight max-w-md text-purple-200"
              >
                Mooderia is currently in <strong>Standalone Mode</strong>. Install the Republic to your home screen to begin your urban legacy.
              </motion.p>

              {/* Scroll Indicator for mobile */}
              <div className="lg:hidden mt-8">
                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-4 text-white/40">
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
                {/* Vertical Features List - The "Up to Down" arrangement with Posters */}
                <div className="grid gap-8 sm:gap-12">
                  {FEATURES.map((feature, idx) => (
                    <div key={feature.id}>
                      <DistrictPoster 
                        feature={feature} 
                        onClick={() => setSelectedFeature(idx)} 
                      />
                    </div>
                  ))}
                </div>

                {/* Fixed-style Action Button at the bottom of the list */}
                <div className="sticky bottom-6 mt-12">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowGuide(true);
                      triggerConfetti();
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
