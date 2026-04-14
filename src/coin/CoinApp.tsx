import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { db, initDB } from './db';
import { CoinNav } from './components/CoinNav';
import { PinLock } from './components/PinLock';
import { useStore } from '../context/StoreContext';

// Pages
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import History from './pages/History';

export default function CoinApp() {
  const { state } = useStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    initDB().then(() => setIsInitializing(false));
  }, []);

  const user = state.profile;

  if (isInitializing || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div>
      </div>
    );
  }

  // Handle App Lock
  if (user.coinAppLockEnabled && !isUnlocked) {
    return <PinLock correctPin={user.pin} onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-primary/20 selection:text-primary pb-28">
      <div className="max-w-md mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="budget" element={<Budgets />} />
          <Route path="add" element={<AddTransaction />} />
          <Route path="goals" element={<Goals />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Navigate to="/coin" replace />} />
        </Routes>
      </div>
      <CoinNav />
    </div>
  );
}
