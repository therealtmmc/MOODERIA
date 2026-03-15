import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Database, CheckSquare, Square, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ShareQRModal } from './ShareQRModal';

interface DataTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataTransferModal({ isOpen, onClose }: DataTransferModalProps) {
  const { state } = useStore();
  
  const [selectedMoods, setSelectedMoods] = useState<Set<string>>(new Set());
  const [selectedWorkouts, setSelectedWorkouts] = useState<Set<string>>(new Set());
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [selectedMarketItems, setSelectedMarketItems] = useState<Set<string>>(new Set());
  
  const [showQR, setShowQR] = useState(false);
  const [transferData, setTransferData] = useState<any>(null);

  // Calculate approximate size safely
  const estimatedSize = useMemo(() => {
    let size = 150; // Base profile + wallet size approx
    
    const getItemSize = (item: any) => {
      let itemSize = 0;
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'string') itemSize += value.length;
        else if (value instanceof Blob) itemSize += value.size;
        else if (typeof value === 'number') itemSize += 8;
        else if (typeof value === 'boolean') itemSize += 4;
        else if (value && typeof value === 'object') itemSize += JSON.stringify(value).length;
      });
      return itemSize;
    };

    state.moods.forEach(m => { if (selectedMoods.has(m.id)) size += getItemSize(m); });
    state.customRoutines.forEach(w => { if (selectedWorkouts.has(w.id)) size += getItemSize(w); });
    state.events.forEach(e => { if (selectedEvents.has(e.id)) size += getItemSize(e); });
    state.marketItems.forEach(i => { if (selectedMarketItems.has(i.id)) size += getItemSize(i); });
    
    return size;
  }, [selectedMoods, selectedWorkouts, selectedEvents, selectedMarketItems, state]);

  // Max safe URL length is around 2000 chars. LZ-string compresses by ~50%.
  // So ~4000 raw JSON chars is a safe limit.
  const MAX_SAFE_SIZE = 4000;
  const sizePercentage = Math.min((estimatedSize / MAX_SAFE_SIZE) * 100, 100);
  const isOverLimit = estimatedSize > MAX_SAFE_SIZE;

  const handleToggle = (set: Set<string>, setFunction: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    const newSet = new Set(set);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setFunction(newSet);
  };

  const handleSelectAll = (items: any[], setFunction: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setFunction(new Set(items.map(i => i.id)));
  };

  const handleClearAll = (setFunction: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setFunction(new Set());
  };

  const handleGenerate = () => {
    if (isOverLimit) return;
    
    // Helper to strip Blobs for QR transfer (QR can't handle them)
    const stripMedia = (item: any) => {
      const { image, video, audio, ...rest } = item;
      return {
        ...rest,
        image: typeof image === 'string' ? image : undefined,
        video: typeof video === 'string' ? video : undefined,
        audio: typeof audio === 'string' ? audio : undefined,
      };
    };

    const payload = {
      profile: state.userProfile,
      walletBalance: state.walletBalance,
      coins: state.coins,
      currentRank: state.currentRank,
      streak: state.streak,
      profileBorder: state.profileBorder,
      moods: state.moods.filter(m => selectedMoods.has(m.id)).map(stripMedia),
      workouts: state.customRoutines.filter(w => selectedWorkouts.has(w.id)),
      events: state.events.filter(e => selectedEvents.has(e.id)),
      marketItems: state.marketItems.filter(i => selectedMarketItems.has(i.id)),
    };
    
    setTransferData(payload);
    setShowQR(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-xl uppercase tracking-tight">Account Passport</h2>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Transfer or Restore your account
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                <div>
                  <p className="font-black text-indigo-900 uppercase text-sm">Automatic Inclusion</p>
                  <p className="text-xs font-bold text-indigo-700 mt-1">
                    Your Profile, Level, Wallet Balance, and Coins are automatically packed.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">QR Capacity</h3>
                  <span className={`text-xs font-black ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {Math.round(sizePercentage)}%
                  </span>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
                  <motion.div 
                    className={`h-full rounded-full ${isOverLimit ? 'bg-red-500' : 'bg-indigo-500'}`}
                    animate={{ width: `${Math.min(sizePercentage, 100)}%` }}
                  />
                </div>
                {isOverLimit && (
                  <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Too much data! Deselect some items.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <SelectionGroup 
                  title="Diary Entries" 
                  items={state.moods} 
                  selected={selectedMoods} 
                  onToggle={(id) => handleToggle(selectedMoods, setSelectedMoods, id)}
                  onSelectAll={() => handleSelectAll(state.moods, setSelectedMoods)}
                  onClearAll={() => handleClearAll(setSelectedMoods)}
                  renderItem={(item) => `${item.date} - ${item.mood}`}
                />
                <SelectionGroup 
                  title="Custom Workouts" 
                  items={state.customRoutines} 
                  selected={selectedWorkouts} 
                  onToggle={(id) => handleToggle(selectedWorkouts, setSelectedWorkouts, id)}
                  onSelectAll={() => handleSelectAll(state.customRoutines, setSelectedWorkouts)}
                  onClearAll={() => handleClearAll(setSelectedWorkouts)}
                  renderItem={(item) => item.name}
                />
                <SelectionGroup 
                  title="Events" 
                  items={state.events} 
                  selected={selectedEvents} 
                  onToggle={(id) => handleToggle(selectedEvents, setSelectedEvents, id)}
                  onSelectAll={() => handleSelectAll(state.events, setSelectedEvents)}
                  onClearAll={() => handleClearAll(setSelectedEvents)}
                  renderItem={(item) => item.title}
                />
                <SelectionGroup 
                  title="Market Items" 
                  items={state.marketItems} 
                  selected={selectedMarketItems} 
                  onToggle={(id) => handleToggle(selectedMarketItems, setSelectedMarketItems, id)}
                  onSelectAll={() => handleSelectAll(state.marketItems, setSelectedMarketItems)}
                  onClearAll={() => handleClearAll(setSelectedMarketItems)}
                  renderItem={(item) => item.name}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t-2 border-gray-100">
              <button
                onClick={handleGenerate}
                disabled={isOverLimit}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:active:scale-100 disabled:active:translate-y-0 disabled:active:border-b-4"
              >
                <QrCode className="w-5 h-5" />
                Generate Passport QR
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {showQR && transferData && (
        <ShareQRModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          type="passport"
          data={transferData}
          title="Mooderia Passport"
        />
      )}
    </AnimatePresence>
  );
}

function SelectionGroup({ title, items, selected, onToggle, onSelectAll, onClearAll, renderItem }: any) {
  if (items.length === 0) return null;
  
  const allSelected = selected.size === items.length;

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
      <div className="bg-gray-50 p-3 flex justify-between items-center border-b-2 border-gray-100">
        <h4 className="font-black text-gray-700 uppercase tracking-widest text-xs">{title} ({selected.size}/{items.length})</h4>
        <div className="flex gap-2">
          <button onClick={allSelected ? onClearAll : onSelectAll} className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-lg">
            {allSelected ? 'Clear' : 'All'}
          </button>
        </div>
      </div>
      <div className="max-h-40 overflow-y-auto p-2 space-y-1">
        {items.map((item: any, index: number) => (
          <div 
            key={item.id ? `${item.id}-${index}` : index} 
            onClick={() => onToggle(item.id)}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          >
            {selected.has(item.id) ? (
              <CheckSquare className="w-5 h-5 text-indigo-600 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-gray-300 shrink-0" />
            )}
            <span className="text-sm font-bold text-gray-700 truncate">{renderItem(item) || 'Unnamed Item'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
