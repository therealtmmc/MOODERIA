import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Plus, Book, Smile, Frown, Meh, Heart, Zap, Moon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const EMOTIONS = [
  { id: 'happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50' },
  { id: 'loved', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'energetic', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'tired', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export default function Diary() {
  const { state, dispatch } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('neutral');

  const handleSave = () => {
    if (content.trim()) {
      dispatch({
        type: 'ADD_DIARY',
        payload: {
          id: Date.now().toString(),
          timestamp: Date.now(),
          content,
          emotion
        }
      });
      setContent('');
      setEmotion('neutral');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Diary Vault</h1>
          <p className="text-gray-500 font-bold">Your private timeline</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className={cn("w-6 h-6 transition-transform", isAdding && "rotate-45")} />
        </button>
      </header>

      {isAdding && (
        <div className="clay-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Dear Diary..."
            className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-medium resize-none"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {EMOTIONS.map(emo => (
              <button
                key={emo.id}
                onClick={() => setEmotion(emo.id)}
                className={cn(
                  "p-3 rounded-2xl transition-all flex-shrink-0",
                  emotion === emo.id ? "bg-primary/10 border-2 border-primary" : "bg-gray-50 border-2 border-transparent"
                )}
              >
                <emo.icon className={cn("w-6 h-6", emo.color)} />
              </button>
            ))}
          </div>
          <button 
            onClick={handleSave}
            disabled={!content.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Save Entry
          </button>
        </div>
      )}

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {state.diary.map(entry => {
          const emo = EMOTIONS.find(e => e.id === entry.emotion) || EMOTIONS[2];
          return (
            <div key={entry.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mt-2">
                <emo.icon className={cn("w-6 h-6", emo.color)} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] clay-card p-4 relative group/card">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <span className="font-bold text-gray-900 block">{format(entry.timestamp, 'MMM d, yyyy')}</span>
                    <span className="text-xs font-bold text-gray-400">{format(entry.timestamp, 'h:mm a')}</span>
                  </div>
                  <button 
                    onClick={() => dispatch({ type: 'DELETE_DIARY', payload: entry.id })}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </div>
            </div>
          );
        })}
        {state.diary.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-400 font-bold">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your diary is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
