import React, { useState } from 'react';
import { Home, Smile, Building2, Wrench, User as UserIcon, Settings, Moon, Sun, Globe, Menu, X, Flame, Crown } from 'lucide-react';
import { Section, User } from '../types';
import { t, toRomanNumeral } from '../constants';

interface NavbarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  isDarkMode: boolean;
  onToggleDarkMode?: () => void;
  user: User;
  unreadMails: number;
  language: 'English' | 'Filipino';
  onToggleLanguage?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  user,
  unreadMails,
  language,
  onToggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Section; label: string; icon: any; color: string }[] = [
    { id: 'Home', label: t('home', language), icon: Home, color: 'text-indigo-600' },
    { id: 'Mood', label: t('mood', language), icon: Smile, color: 'text-amber-500' },
    { id: 'CityHall', label: t('cityHall', language), icon: Building2, color: 'text-rose-600' },
    { id: 'Apps', label: language === 'English' ? 'Tools' : 'Kagamitan', icon: Wrench, color: 'text-emerald-600' },
    { id: 'Profile', label: t('profile', language), icon: UserIcon, color: 'text-blue-600' },
    { id: 'Settings', label: t('settings', language), icon: Settings, color: 'text-slate-600' },
  ];

  const handleNavClick = (id: Section) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0f0f14]/90 border-white/10 text-white' 
        : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('Home')}>
            <div className="relative group">
              <img 
                src="/logo.png" 
                alt="Mooderia Logo" 
                className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl italic tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  MOODERIA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  WEB
                </span>
              </div>
              <p className="text-[9px] font-bold opacity-60 tracking-wider uppercase hidden sm:block">
                Metropolis Wellness Platform
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isDarkMode
                        ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.id === 'CityHall' && unreadMails > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      {unreadMails}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Tools (Streak, Theme, Language, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Citizen Rank / Streak Pill */}
            <div 
              onClick={() => handleNavClick('Home')}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-slate-100/80 border-slate-200 hover:bg-slate-200/80'
              }`}
              title="Citizen Level & Streak"
            >
              <div className="flex items-center gap-1 text-amber-500">
                <Crown size={14} />
                <span>Rank {toRomanNumeral(user.petLevel || 1)}</span>
              </div>
              <span className="opacity-30">|</span>
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} className={(user.moodStreak || 0) > 0 ? 'fill-orange-500' : ''} />
                <span>{user.moodStreak || 0}d</span>
              </div>
            </div>

            {/* Language Switcher */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                title={language === 'English' ? 'Switch to Filipino' : 'Switch to English'}
                aria-label="Switch Language"
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200' 
                    : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Globe size={16} />
                <span className="ml-1 text-[10px] font-black uppercase hidden lg:inline">
                  {language === 'English' ? 'EN' : 'FIL'}
                </span>
              </button>
            )}

            {/* Theme Toggle (Light / Dark) */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-amber-300' 
                    : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* User Profile Avatar Pill */}
            <button
              onClick={() => handleNavClick('Profile')}
              className="flex items-center gap-2 p-1 pl-2 sm:pr-3 rounded-full border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all text-left"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.displayName || 'U')[0].toUpperCase()}</span>
                )}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-black truncate max-w-[90px]">{user.displayName}</p>
                <p className="text-[9px] font-bold opacity-60 uppercase">{user.title || 'Citizen'}</p>
              </div>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'border-white/10 bg-white/5 text-white' 
                  : 'border-slate-200 bg-slate-100 text-slate-800'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Website Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 pt-4 pb-6 space-y-2 shadow-2xl transition-all ${
          isDarkMode 
            ? 'bg-[#12121a] border-white/10' 
            : 'bg-white border-slate-200'
        }`}>
          {/* User & Rank Info Banner */}
          <div className={`p-4 rounded-2xl mb-3 flex items-center justify-between border ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shadow-md">
                {(user.displayName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-black text-sm">{user.displayName}</p>
                <p className="text-[10px] font-bold opacity-60 uppercase">{user.title || 'Citizen'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-amber-500 flex items-center justify-end gap-1">
                <Crown size={12} /> Rank {toRomanNumeral(user.petLevel || 1)}
              </span>
              <span className="text-[11px] font-black text-orange-500 flex items-center justify-end gap-1 mt-0.5">
                <Flame size={12} fill="currentColor" /> {user.moodStreak || 0}d Streak
              </span>
            </div>
          </div>

          {/* Links list */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
