import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function Events() {
  const { state, dispatch } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    if (title.trim() && date) {
      dispatch({
        type: 'ADD_EVENT',
        payload: {
          id: Date.now().toString(),
          title,
          date
        }
      });
      setTitle('');
      setDate('');
      setIsAdding(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = state.events.filter(e => parseLocalDate(e.date) >= today);
  const nearestEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const daysUntilNearest = nearestEvent ? differenceInDays(parseLocalDate(nearestEvent.date), today) : null;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Look forward to it!</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className={cn("w-6 h-6 transition-transform", isAdding && "rotate-45")} />
        </button>
      </header>

      {nearestEvent && (
        <div className="clay-card p-8 bg-gradient-to-br from-primary to-primary-dark text-white border-none shadow-primary/30 text-center relative overflow-hidden">
          <Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary-light mb-2">Next Big Event</h2>
          <div className="text-6xl font-black mb-2">{daysUntilNearest === 0 ? 'TODAY' : daysUntilNearest}</div>
          <div className="text-sm font-bold uppercase tracking-widest text-primary-light mb-4">{daysUntilNearest === 0 ? '' : 'Days Left'}</div>
          <h3 className="text-2xl font-black">{nearestEvent.title}</h3>
          <p className="text-primary-light font-bold mt-1">{format(parseLocalDate(nearestEvent.date), 'MMMM d, yyyy')}</p>
        </div>
      )}

      {isAdding && (
        <div className="clay-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event name..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
          />
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
          />
          <button 
            onClick={handleSave}
            disabled={!title.trim() || !date}
            className="btn-primary w-full disabled:opacity-50"
          >
            Add Event
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-black text-xl text-gray-800 dark:text-gray-100">All Events</h3>
        {state.events.length === 0 ? (
          <div className="text-center py-8 text-gray-400 font-bold">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No events scheduled.</p>
          </div>
        ) : (
          state.events.map(event => {
            const isPast = parseLocalDate(event.date) < today;
            return (
              <div key={event.id} className={cn("clay-card p-4 flex items-center gap-4 group", isPast && "opacity-50")}>
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold uppercase">{format(parseLocalDate(event.date), 'MMM')}</span>
                  <span className="text-xl font-black leading-none">{format(parseLocalDate(event.date), 'd')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">{event.title}</h4>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{format(parseLocalDate(event.date), 'EEEE, yyyy')}</p>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_EVENT', payload: event.id })}
                  className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
