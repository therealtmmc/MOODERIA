import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PieChart, Plus, Target, History } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function CoinNav() {
  const location = useLocation();
  
  // Hide nav on the Add Transaction page to give more space
  if (location.pathname === '/coin/add') return null;

  const navItems = [
    { path: '/coin', icon: Home, label: 'Home' },
    { path: '/coin/budget', icon: PieChart, label: 'Budget' },
    { path: '/coin/add', icon: Plus, label: 'Add', isFab: true },
    { path: '/coin/goals', icon: Target, label: 'Goals' },
    { path: '/coin/history', icon: History, label: 'History' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-[2.5rem] p-2 flex items-center justify-between shadow-xl shadow-primary/10 border-2 border-gray-100 dark:border-gray-800">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                className="relative -top-6 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 active:scale-95 transition-transform border-4 border-white dark:border-gray-950"
              >
                <Icon className="w-8 h-8" />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative p-3 rounded-2xl flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="coin-nav-pill"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              <Icon className={cn("w-6 h-6", isActive && "text-primary")} />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
