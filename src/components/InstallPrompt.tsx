import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, Smartphone, MonitorX } from 'lucide-react';

export function InstallPrompt({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to avoid flash on load
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      // Check if standalone (PWA mode)
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      
      // Check if iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      
      // Check if mobile
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

      // For development/preview in iframe, we might want to bypass or handle gracefully.
      // But per user request, we enforce restriction.
      // However, to prevent locking out the preview completely if it doesn't support standalone,
      // we might need a way to test.
      // For now, I will implement the strict check as requested.
      
      setIsStandalone(isStandaloneMode);
      setIsIOS(isIosDevice);
      setIsMobile(isMobileDevice);
      setChecked(true);
    };

    checkStandalone();
    window.addEventListener('resize', checkStandalone);
    
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  if (!checked) return null; // Or a loading spinner

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-50 flex flex-col items-center justify-center p-6 text-center space-y-8 font-sans">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-gray-100">
         <Smartphone className="w-12 h-12 text-[#1368ce]" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-gray-900">Install App to Continue</h1>
        <p className="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
          This app is designed to be used as a standalone application. Please add it to your home screen.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full text-left space-y-5">
        <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg">
          <Download className="w-5 h-5 text-[#1368ce]" />
          How to Install
        </h3>
        
        {isIOS ? (
          <div className="space-y-4 text-sm text-gray-600 font-medium">
            <p className="flex items-center gap-3">
              <span className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full font-bold text-gray-500 text-xs">1</span>
              <span>Tap the <Share className="w-4 h-4 inline mx-1 text-blue-500" /> <strong>Share</strong> button.</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full font-bold text-gray-500 text-xs">2</span>
              <span>Scroll down and tap <PlusSquare className="w-4 h-4 inline mx-1 text-gray-600" /> <strong>Add to Home Screen</strong>.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-600 font-medium">
            <p className="flex items-center gap-3">
              <span className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full font-bold text-gray-500 text-xs">1</span>
              <span>Tap the browser menu (three dots).</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full font-bold text-gray-500 text-xs">2</span>
              <span>Select <strong>Add to Home Screen</strong> or <strong>Install App</strong>.</span>
            </p>
          </div>
        )}
      </div>
      
      {!isMobile && (
         <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-50 px-4 py-2 rounded-full">
           <MonitorX className="w-4 h-4" />
           <span>Desktop access is restricted. Use a mobile device.</span>
         </div>
      )}
    </div>
  );
}
