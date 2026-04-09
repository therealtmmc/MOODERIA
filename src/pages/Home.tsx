import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { differenceInDays, parseISO, format } from 'date-fns';

const MOOD_COLORS: Record<string, string> = {
  happy: '#eab308',
  sad: '#3b82f6',
  neutral: '#6b7280',
  loved: '#ec4899',
  energetic: '#f97316',
  tired: '#6366f1'
};

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  loved: '🥰',
  energetic: '⚡',
  tired: '😴'
};

export default function Home() {
  const { state } = useStore();

  // Calculate mood stats for graph
  const moodCounts = state.moods.reduce((acc, mood) => {
    acc[mood.emotion] = (acc[mood.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const graphData = Object.keys(MOOD_COLORS).map(emotion => ({
    name: emotion,
    count: moodCounts[emotion] || 0,
    color: MOOD_COLORS[emotion]
  })).filter(d => d.count > 0);

  // Nearest Event
  const upcomingEvents = state.events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));
  const nearestEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const daysUntilNearest = nearestEvent ? differenceInDays(parseISO(nearestEvent.date), new Date()) : null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Hi, {state.profile?.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 font-semibold">How are you today?</p>
        </div>
        {state.profile?.avatar ? (
          <img src={state.profile.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20" />
        ) : (
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
        )}
      </header>

      {/* Event Countdown */}
      {nearestEvent && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="clay-card p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-none shadow-primary/30 relative overflow-hidden"
        >
          <Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{nearestEvent.title}</h3>
              <p className="text-primary-light text-sm font-bold">{format(parseISO(nearestEvent.date), 'MMM d, yyyy')}</p>
            </div>
            <div className="text-center bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-black leading-none">{daysUntilNearest === 0 ? '0' : daysUntilNearest}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">{daysUntilNearest === 0 ? 'TODAY' : 'DAYS'}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Graph */}
      <section className="clay-card p-6">
        <h2 className="text-xl font-black mb-6 dark:text-white">Mood Tracker</h2>
        {graphData.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}>
                <XAxis dataKey="name" tickFormatter={(val) => MOOD_EMOJIS[val]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                  {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 font-bold">
            <p>No moods tracked yet.</p>
            <p className="text-sm mt-1">Wait for the Mood Hour!</p>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-black mb-4 dark:text-white">Recent Moods</h2>
        <div className="space-y-4">
          {state.moods.slice(-3).reverse().map((item) => (
            <div key={item.id} className="clay-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gray-50 dark:bg-gray-800">
                {MOOD_EMOJIS[item.emotion]}
              </div>
              <div>
                <h4 className="font-bold capitalize dark:text-white">{item.emotion}</h4>
                <p className="text-xs text-gray-400 font-bold">{format(item.timestamp, 'MMM d, h:mm a')}</p>
              </div>
            </div>
          ))}
          {state.moods.length === 0 && (
            <p className="text-center text-gray-400 font-bold py-4">No recent activity.</p>
          )}
        </div>
      </section>
    </div>
  );
}
