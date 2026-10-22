
import React, { useState, useEffect } from 'react';
import { Home, Smile, Building2, User as UserIcon, Settings, Wifi, WifiOff } from 'lucide-react';
import { Section, User } from '../types';
import { t, toRomanNumeral } from '../constants';

interface SidebarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  isDarkMode: boolean;
  user: User;
  unreadMails: number;
  language: 'English' | 'Filipino';
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isDarkMode, user, unreadMails, language }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const items: { id: Section, icon: any, labelKey: string, color: string }[] = [
    { id: 'Home', icon: Home, labelKey: 'home', color: 'bg-indigo-600' },
    { id: 'Mood', icon: Smile, labelKey: 'mood', color: 'bg-yellow-500' },
    { id: 'CityHall', icon: Building2, labelKey: 'cityHall', color: 'bg-red-600' },
    { id: 'Profile', icon: UserIcon, labelKey: 'profile', color: 'bg-blue-600' },
    { id: 'Settings', icon: Settings, labelKey: 'settings', color: 'bg-slate-600' },
  ];

  // Layout mode: 'auto' (default: mobile bottom taskbar for phones & tablets < 1024px), 'bottom' (always bottom taskbar), 'side' (desktop sidebar on >=768px)
  const taskbarPref = user.taskbarLayout || 'auto';
  const forceBottom = taskbarPref === 'bottom';
  const forceSide = taskbarPref === 'side';

  // If forceBottom: always show bottom taskbar & top header.
  // If forceSide: show side bar on md (>=768px).
  // If auto (default): tablets (iPad mini, iPad Air/Pro 768px-1024px, Galaxy Tab) use the same mobile bottom taskbar + top header, side bar only appears on desktop laptops >= 1024px (lg).
  const mobileHeaderClass = forceBottom 
    ? 'flex' 
    : forceSide 
      ? 'md:hidden flex' 
      : 'lg:hidden flex';

  const bottomNavClass = forceBottom 
    ? 'flex' 
    : forceSide 
      ? 'md:hidden flex' 
      : 'lg:hidden flex';

  const sideNavClass = forceBottom 
    ? 'hidden' 
    : forceSide 
      ? 'hidden md:flex' 
      : 'hidden lg:flex';

  return (
    <>
      {/* Top Header (Phone & Tablet) */}
      <div className={`${mobileHeaderClass} fixed top-0 left-0 right-0 z-50 h-14 items-center px-4 md:px-6 justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} border-b shadow-sm`}>
        <div className="flex items-center gap-2.5">
           <img 
             src="/logo.png" 
             alt="Mooderia Logo" 
             className="w-8 h-8 object-contain rounded-lg drop-shadow-sm" 
           />
           <span className="font-black text-xl italic tracking-wider text-[#46178f] dark:text-purple-300">MOODERIA</span>
           <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 animate-pulse'}`} />
        </div>
        <button 
          onClick={() => onNavigate('Profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md active:scale-95 transition-all"
          title="Profile"
        >
           {user.profilePic ? (
             <img src={user.profilePic} className="w-full h-full object-cover" alt={user.displayName} />
           ) : (
             <span>{(user.displayName || 'U')[0].toUpperCase()}</span>
           )}
        </button>
      </div>

      {/* Bottom Nav Taskbar (Phone & Tablet) */}
      <nav className={`${bottomNavClass} fixed bottom-0 left-0 right-0 z-50 h-16 md:h-18 items-center justify-around px-4 max-w-2xl md:mx-auto md:bottom-3 md:rounded-3xl md:border md:shadow-2xl ${isDarkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'} border-t shadow-2xl overflow-x-auto no-scrollbar`}>
        {items.map(item => (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            title={t(item.labelKey as any, language)}
            className={`relative flex flex-col items-center justify-center p-3 md:px-6 transition-all rounded-2xl ${activeSection === item.id ? 'text-indigo-600 bg-indigo-500/10 scale-110' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
          >
            <item.icon size={24} />
            {item.id === 'CityHall' && unreadMails > 0 && (
               <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{unreadMails}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Desktop Side Taskbar (Laptops & Desktops) */}
      <aside className={`${sideNavClass} flex-col w-24 h-screen sticky top-0 items-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} border-r shadow-lg py-6 px-3 shrink-0`}>
        <div className="mb-8 flex flex-col items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Mooderia Logo" 
            className="w-10 h-10 object-contain rounded-xl drop-shadow-md hover:scale-105 transition-transform" 
          />
          <span className="font-black text-[11px] italic tracking-tighter text-center text-[#46178f] dark:text-purple-300 uppercase leading-tight">MOODERIA</span>
          <div title={isOnline ? "Cloud Sync Active" : "Local-Only Mode"} className={`p-1 rounded-lg border ${isOnline ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500'}`}>
             {isOnline ? <Wifi size={12}/> : <WifiOff size={12}/>}
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-10 w-full flex flex-col items-center">
          {items.map(item => (
            <button 
              key={item.id} 
              onClick={() => onNavigate(item.id)}
              title={t(item.labelKey as any, language)}
              className={`w-12 h-12 group flex items-center justify-center rounded-2xl transition-all relative ${activeSection === item.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'hover:bg-black/5 text-slate-500'}`}
            >
              <item.icon size={22} className={activeSection === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
              {item.id === 'CityHall' && unreadMails > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{unreadMails}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={`mt-auto p-2 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`}>
          <button 
            onClick={() => onNavigate('Profile')}
            className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-500 shrink-0"
            title={user.displayName}
          >
             {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-black text-xs">{user.displayName[0]}</div>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
