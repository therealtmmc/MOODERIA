import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Smile, User, Plus, Book, Calendar, Lock, ListTodo } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { MoodHourPopup } from './MoodHourPopup';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/diary', icon: Book, label: 'Diary' },
    { path: '/routine', icon: ListTodo, label: 'Routine' },
    { path: '/vault', icon: Lock, label: 'Vault' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300">
      <MoodHourPopup />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 p-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-4 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-2 flex items-center justify-between shadow-xl z-50 overflow-x-auto no-scrollbar transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-full transition-all duration-300 flex-shrink-0",
                isActive ? "text-primary dark:text-primary-light" : "text-gray-400 dark:text-gray-500"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 relative z-10", isActive && "stroke-[3px]")} />
              <span className="text-[9px] font-bold mt-1 relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
