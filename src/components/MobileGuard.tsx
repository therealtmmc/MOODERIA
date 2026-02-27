import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MobileGuard({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      // Assuming mobile breakpoint is around 768px (tablets/phones)
      // But let's be generous for "laptop size" detection.
      // If width > 1024px, it's definitely a laptop/desktop.
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#46178f] text-white p-8 text-center z-50">
        <h1 className="text-4xl font-black mb-4 drop-shadow-lg">Mooderia</h1>
        <p className="text-xl font-bold bg-white/20 p-6 rounded-2xl backdrop-blur-sm border-4 border-white/30 shadow-xl">
          This app is available on mobile only! 📱
          <br />
          <span className="text-sm font-normal mt-2 block opacity-80">
            Please resize your window or open on a mobile device.
          </span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
