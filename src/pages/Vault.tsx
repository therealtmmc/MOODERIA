import React, { useState, useRef } from 'react';
import { useStore, VaultItem } from '@/context/StoreContext';
import { Lock, Image as ImageIcon, Video, Plus, Trash2, X } from 'lucide-react';

const MAX_ITEMS = 20;

export default function Vault() {
  const { state, dispatch } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [viewingItem, setViewingItem] = useState<VaultItem | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (state.vault.length + files.length > MAX_ITEMS) {
      alert(`Vault limit reached! You can only store up to ${MAX_ITEMS} items.`);
      return;
    }

    Array.from(files).forEach((file: File) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: 'ADD_VAULT_ITEM',
          payload: {
            id: Date.now().toString() + Math.random(),
            type: isVideo ? 'video' : 'image',
            dataUrl: reader.result as string,
            timestamp: Date.now()
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePointerDown = (id: string) => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (window.confirm("Delete this item?")) {
        dispatch({ type: 'DELETE_VAULT_ITEM', payload: id });
      }
    }, 600);
  };

  const handlePointerUp = (item: VaultItem) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!isLongPress.current) {
      setViewingItem(item);
    }
  };

  const handlePointerLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const filteredVault = state.vault.filter(item => filter === 'all' || item.type === filter);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            <Lock className="w-8 h-8 text-primary" /> Vault
          </h1>
          <p className="text-gray-500 font-bold">Private Media ({state.vault.length}/{MAX_ITEMS})</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*,video/*" 
          multiple 
          className="hidden" 
        />
      </header>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
        {['all', 'image', 'video'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors capitalize ${filter === f ? "bg-white shadow text-primary" : "text-gray-500"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredVault.map(item => (
          <div 
            key={item.id} 
            className="clay-card overflow-hidden relative group aspect-square cursor-pointer"
            onPointerDown={() => handlePointerDown(item.id)}
            onPointerUp={() => handlePointerUp(item)}
            onPointerLeave={handlePointerLeave}
          >
            {item.type === 'image' ? (
              <img src={item.dataUrl} alt="Vault item" className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <>
                <video src={item.dataUrl} className="w-full h-full object-cover pointer-events-none" controls={false} />
                <Video className="absolute top-2 left-2 w-6 h-6 text-white drop-shadow-md" />
              </>
            )}
          </div>
        ))}
        {filteredVault.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400 font-bold">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your vault is empty.</p>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
          <button 
            onClick={() => setViewingItem(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          {viewingItem.type === 'image' ? (
            <img src={viewingItem.dataUrl} alt="Vault item full" className="max-w-full max-h-full object-contain rounded-lg" />
          ) : (
            <video src={viewingItem.dataUrl} controls autoPlay className="max-w-full max-h-full rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}
