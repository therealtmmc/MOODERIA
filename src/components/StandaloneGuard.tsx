import React, { useState, useEffect } from 'react';
import { Download, Share, MoreVertical, Smile, Book, ListTodo, Lock, Calendar, ArrowDown } from 'lucide-react';
import { LegalModal } from './LegalModal';
import { Link } from 'react-router-dom';

export function StandaloneGuard({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent flash
  const [isIOS, setIsIOS] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    // Check if running as a standalone PWA
    const checkStandalone = () => {
      const isStandaloneQuery = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneIOS = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneQuery || isStandaloneIOS);
    };

    // Check OS for specific instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    checkStandalone();

    // Listen for changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (isStandalone) {
    return <>{children}</>;
  }

  const features = [
    { icon: Smile, title: "Mood Tracking", desc: "Log your emotions and track your mental well-being over time." },
    { icon: Book, title: "Private Diary", desc: "A secure space to write your thoughts, protected by your PIN." },
    { icon: ListTodo, title: "Daily Routine", desc: "Build habits and manage your daily tasks effortlessly." },
    { icon: Lock, title: "Secure Vault", desc: "Store your private photos and videos away from prying eyes." },
    { icon: Calendar, title: "Event Manager", desc: "Keep track of important dates and upcoming events." }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-primary/20 selection:text-primary overflow-y-auto">
      {/* Hero Section */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center relative">
        <div className="w-28 h-28 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 flex items-center justify-center mb-10 animate-in zoom-in duration-700 shadow-2xl shadow-primary/10">
          {/* We use the logo if available, fallback to icon */}
          <img 
            src="/icon-192x192.png" 
            alt="Mooderia Logo" 
            className="w-20 h-20 rounded-2xl object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }} 
          />
          <Smile className="w-14 h-14 text-primary hidden" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Mooderia
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Your personal sanctuary for mind, body, and soul.
        </p>
        
        <div className="absolute bottom-12 animate-bounce text-primary/40">
          <ArrowDown className="w-8 h-8" />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto p-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need.</h2>
          <p className="text-gray-500 font-medium text-lg">Beautifully designed, completely private.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Section */}
      <div className="bg-primary/5 py-24 px-6 border-t border-primary/10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-black mb-4 text-primary">Ready to begin?</h2>
          <p className="text-gray-600 font-medium mb-12 leading-relaxed">
            Mooderia is designed as a standalone application for maximum privacy. Install it to your home screen to unlock your vault.
          </p>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 text-left border border-primary/10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Download className="w-6 h-6 text-primary" />
              </div>
              Installation Guide
            </h3>

            {isIOS ? (
              <ol className="space-y-8 text-gray-600 font-medium">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="pt-1">Tap the <Share className="w-5 h-5 inline mx-1 text-gray-900" /> <strong>Share</strong> button at the bottom of Safari.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="pt-1">Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-primary/30">3</div>
                  <p className="pt-1 text-gray-900 font-bold">Open Mooderia from your home screen!</p>
                </li>
              </ol>
            ) : (
              <ol className="space-y-8 text-gray-600 font-medium">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="pt-1">Tap the <MoreVertical className="w-5 h-5 inline mx-1 text-gray-900" /> <strong>Menu</strong> button in your browser.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="pt-1">Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-primary/30">3</div>
                  <p className="pt-1 text-gray-900 font-bold">Open Mooderia from your home screen!</p>
                </li>
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* Ecosystem Section */}
      <div className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-black mb-8 text-gray-900">Explore our ecosystem</h2>
          <Link 
            to="/coin"
            className="inline-flex flex-col items-center group"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] border-2 border-gray-100 flex items-center justify-center mb-4 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-300 group-hover:-translate-y-2">
              <img 
                src="/mooderiacoin.png" 
                alt="Mooderia Coin" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-12 h-12 bg-yellow-400 rounded-full hidden items-center justify-center text-white font-black text-2xl shadow-inner">
                $
              </div>
            </div>
            <span className="font-black text-gray-600 group-hover:text-primary transition-colors">Mooderia Coin</span>
            <span className="text-xs font-bold text-gray-400 mt-1">Coming Soon</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 text-center text-gray-400 font-medium text-sm border-t border-gray-100">
        <div className="flex items-center justify-center gap-6 mb-4">
          <button onClick={() => setLegalType('terms')} className="hover:text-primary transition-colors">Terms & Conditions</button>
          <span>•</span>
          <button onClick={() => setLegalType('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
        </div>
        <p>© {new Date().getFullYear()} Mooderia. All rights reserved.</p>
      </footer>

      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </div>
  );
}
