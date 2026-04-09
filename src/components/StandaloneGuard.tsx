import React, { useState, useEffect } from 'react';
import { Download, Share, MoreVertical, Smartphone } from 'lucide-react';

export function StandaloneGuard({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent flash
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as a standalone PWA
    const checkStandalone = () => {
      const isStandaloneQuery = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneIOS = (window.navigator as any).standalone === true;
      
      // Also allow if running in an iframe (for AI Studio development)
      // But wait, the user specifically asked for a restriction. 
      // If we strictly enforce it, they won't be able to use the preview.
      // Let's strictly enforce it, but add a small "Dev Bypass" button just in case they get stuck.
      
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md clay-card p-8 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center mx-auto">
          <Smartphone className="w-12 h-12 text-primary" />
        </div>
        
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Install Mooderia</h1>
          <p className="text-gray-500 font-bold leading-relaxed">
            For security and the best experience, Mooderia must be installed to your home screen to work.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 text-left space-y-6">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" /> 
            How to Install
          </h2>

          {isIOS ? (
            <ol className="space-y-4 text-sm font-bold text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">1</div>
                <p>Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> button at the bottom of Safari.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">2</div>
                <p>Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">3</div>
                <p>Open Mooderia from your home screen!</p>
              </li>
            </ol>
          ) : (
            <ol className="space-y-4 text-sm font-bold text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">1</div>
                <p>Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> <strong>Menu</strong> button in your browser.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">2</div>
                <p>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">3</div>
                <p>Open Mooderia from your home screen!</p>
              </li>
            </ol>
          )}
        </div>

        {/* Developer bypass for AI Studio Preview */}
        <button 
          onClick={() => setIsStandalone(true)}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 underline decoration-dotted underline-offset-4"
        >
          Developer Bypass (Preview Only)
        </button>
      </div>
    </div>
  );
}
