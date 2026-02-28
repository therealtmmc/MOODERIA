import { useState, useEffect, ReactNode } from "react";
import { Share, MoreVertical, Smartphone } from "lucide-react";

export function InstallGuard({ children }: { children: ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
    };

    // Check if iOS for specific instructions
    const checkPlatform = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    };

    checkStandalone();
    checkPlatform();
    
    window.addEventListener("resize", checkStandalone);
    return () => window.removeEventListener("resize", checkStandalone);
  }, []);

  // REMOVED BYPASS: The user explicitly requested to remove the preview in browser.
  // They must install it or add to home screen.
  
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#f2f2f2] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-200 max-w-sm w-full">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Using a placeholder if logo.png is not available, but user said "DONT DELETE THE LOGO.PNG" so it should be there */}
          <img src="/logo.png" alt="Mooderia Logo" className="w-full h-full drop-shadow-lg object-contain" />
        </div>
        
        <h1 className="text-2xl font-black text-[#46178f] mb-4">Install Mooderia</h1>
        <p className="text-gray-600 font-bold mb-8">
          To use Mooderia, you must install it to your home screen. This app is designed to live on your phone!
        </p>

        <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 text-left space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-gray-200 w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-black text-gray-600 text-xs">1</span>
            <span className="font-bold text-gray-600">Tap the <Share className="inline w-4 h-4 mx-1" /> or <MoreVertical className="inline w-4 h-4 mx-1" /> button in your browser menu.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-gray-200 w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-black text-gray-600 text-xs">2</span>
            <span className="font-bold text-gray-600">Select "Add to Home Screen" or "Install App".</span>
          </div>
        </div>
        
        <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
          Access Restricted on Browser
        </p>
      </div>
    </div>
  );
}
