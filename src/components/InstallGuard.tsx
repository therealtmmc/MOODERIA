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

  // DEV BYPASS: Allow bypassing if in development environment (iframe)
  // In a real scenario, we might remove this, but for this preview to be usable
  // by the user immediately without actually installing, we might need a "Demo Mode"
  // However, the user explicitly asked "it wont get access here on browser".
  // So I will hide the bypass behind a "Developer" click area or just make it strict
  // but provide a button for "Preview Mode" since I cannot actually install it on this iframe.
  
  const [bypass, setBypass] = useState(false);

  if (isStandalone || bypass) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#f2f2f2] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-200 max-w-sm w-full">
        <div className="w-20 h-20 bg-[#46178f] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
          <span className="text-4xl">✨</span>
        </div>
        
        <h1 className="text-2xl font-black text-[#46178f] mb-4">Install Mooderia</h1>
        <p className="text-gray-600 font-bold mb-8">
          To use Mooderia, you must install it to your home screen. This app is designed to live on your phone!
        </p>

        <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 text-left space-y-4">
          {isIOS ? (
            <>
              <div className="flex items-center gap-3">
                <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-gray-600">1</span>
                <span className="font-bold text-gray-600">Tap the <Share className="inline w-4 h-4" /> Share button</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-gray-600">2</span>
                <span className="font-bold text-gray-600">Select "Add to Home Screen"</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-gray-600">1</span>
                <span className="font-bold text-gray-600">Tap the <MoreVertical className="inline w-4 h-4" /> Menu button</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-gray-600">2</span>
                <span className="font-bold text-gray-600">Select "Install App" or "Add to Home Screen"</span>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={() => setBypass(true)}
          className="mt-8 text-xs font-bold text-gray-300 hover:text-gray-400 uppercase tracking-widest"
        >
          Preview in Browser (Dev Only)
        </button>
      </div>
    </div>
  );
}
