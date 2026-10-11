import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { Smartphone, Bell, Clock, Camera, Calculator, CloudSun, Music, Image as ImageIcon, ShieldCheck, CheckCircle2, AlertTriangle, Play, Sparkles, Send } from 'lucide-react';
import { ActiveAlarmData } from '../components/AlarmOverlay';

interface AppsSectionProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  isDarkMode: boolean;
  language: 'English' | 'Filipino';
  onTriggerAlarm: (alarm: ActiveAlarmData) => void;
  onSendNotification: (title: string, body: string) => void;
}

const AppsSection: React.FC<AppsSectionProps> = ({ user, onUpdate, isDarkMode, language, onTriggerAlarm, onSendNotification }) => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  
  // App-specific internal states
  const [noteText, setNoteText] = useState(localStorage.getItem('phone_note') || '');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [customNotifTitle, setCustomNotifTitle] = useState('Custom Alert');
  const [customNotifBody, setCustomNotifBody] = useState('Hello from your phone app!');

  // Permissions state
  const [permissions, setPermissions] = useState({
    notifications: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
    camera: false,
    location: false,
    overlay: user.overlayPermissionGranted !== false
  });

  const requestPermission = async (type: 'notifications' | 'camera' | 'location' | 'overlay') => {
    if (type === 'notifications') {
      if ('Notification' in window) {
        const res = await Notification.requestPermission();
        setPermissions(p => ({ ...p, notifications: res === 'granted' }));
        if (res === 'granted') {
          onSendNotification("Permission Granted 🔔", "Browser & Phone push notifications are now enabled!");
        }
      }
    } else if (type === 'camera') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());
        setPermissions(p => ({ ...p, camera: true }));
        onSendNotification("Camera Permission 📷", "Camera access granted successfully.");
      } catch (e) {
        alert("Camera permission denied or unavailable.");
      }
    } else if (type === 'location') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissions(p => ({ ...p, location: true }));
            onSendNotification("Location Permission 📍", "GPS location acquired successfully.");
          },
          () => alert("Location permission denied.")
        );
      }
    } else if (type === 'overlay') {
      setPermissions(p => ({ ...p, overlay: true }));
      onUpdate({ overlayPermissionGranted: true });
      onSendNotification("Alarm Overlay ⏰", "Full-screen alarm overlay permission enabled.");
    }
  };

  const appsList = [
    { id: 'alarm', name: 'Clock & Alarms', icon: Clock, color: 'bg-blue-500 text-white', desc: 'Test alarm overlays & timers' },
    { id: 'notes', name: 'Quick Notes', icon: Calculator, color: 'bg-yellow-500 text-white', desc: 'Saved securely to localStorage' },
    { id: 'camera', name: 'Camera & Lens', icon: Camera, color: 'bg-purple-500 text-white', desc: 'Capture moments & permissions' },
    { id: 'music', name: 'Neural Beats', icon: Music, color: 'bg-pink-500 text-white', desc: 'Ambient focus frequencies' },
    { id: 'weather', name: 'Metro Weather', icon: CloudSun, color: 'bg-cyan-500 text-white', desc: 'Live atmospheric conditions' },
    { id: 'gallery', name: 'Photo Gallery', icon: ImageIcon, color: 'bg-emerald-500 text-white', desc: 'Memories & badges archive' },
  ];

  return (
    <div className="h-full flex flex-col pb-10 relative overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shrink-0">
        <div>
          <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Phone & Apps
          </h2>
          <p className="opacity-50 font-black uppercase tracking-[0.2em] text-xs mt-2">
            Simulated Phone Environment • Notifications • Permissions
          </p>
        </div>
        <div className="px-6 py-3 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl flex items-center gap-2 border-b-4 border-emerald-800">
           <Smartphone size={18} /> OS Active (LocalStorage)
        </div>
      </div>

      {/* Permissions Center */}
      <div className={`p-6 md:p-8 rounded-[2.5rem] mb-8 ${isDarkMode ? 'bg-[#161616] border-white/5' : 'bg-white border-black/5'} border-2 shadow-xl`}>
        <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
           <ShieldCheck className="text-emerald-500" size={24} /> Phone Permissions Manager
        </h3>
        <p className="text-sm opacity-70 mb-6 font-bold">Grant system permissions to experience background alarms, push notifications, and hardware sensors.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Notification Permission */}
           <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${permissions.notifications ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/5 border-transparent'}`}>
              <div>
                 <h4 className="font-black text-sm uppercase">Notifications</h4>
                 <p className="text-xs opacity-60 font-bold">{permissions.notifications ? 'Granted' : 'Required for alerts'}</p>
              </div>
              {permissions.notifications ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <button onClick={() => requestPermission('notifications')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-md">Grant</button>
              )}
           </div>

           {/* Camera Permission */}
           <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${permissions.camera ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/5 border-transparent'}`}>
              <div>
                 <h4 className="font-black text-sm uppercase">Camera Feed</h4>
                 <p className="text-xs opacity-60 font-bold">{permissions.camera ? 'Granted' : 'Hardware sensor'}</p>
              </div>
              {permissions.camera ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <button onClick={() => requestPermission('camera')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-md">Grant</button>
              )}
           </div>

           {/* Location Permission */}
           <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${permissions.location ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/5 border-transparent'}`}>
              <div>
                 <h4 className="font-black text-sm uppercase">GPS Location</h4>
                 <p className="text-xs opacity-60 font-bold">{permissions.location ? 'Granted' : 'Atmospheric sync'}</p>
              </div>
              {permissions.location ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <button onClick={() => requestPermission('location')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-md">Grant</button>
              )}
           </div>

           {/* Overlay Permission */}
           <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${permissions.overlay ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/5 border-transparent'}`}>
              <div>
                 <h4 className="font-black text-sm uppercase">Alarm Overlays</h4>
                 <p className="text-xs opacity-60 font-bold">{permissions.overlay ? 'Granted' : 'Screen takeover'}</p>
              </div>
              {permissions.overlay ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <button onClick={() => requestPermission('overlay')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-md">Grant</button>
              )}
           </div>
        </div>

        {/* Test Notification Sender */}
        <div className="mt-6 pt-6 border-t border-black/5 flex flex-col md:flex-row items-center gap-4">
           <input 
             value={customNotifTitle} 
             onChange={e => setCustomNotifTitle(e.target.value)} 
             placeholder="Notification Title" 
             className={`w-full md:w-1/3 p-3 rounded-2xl ${isDarkMode ? 'bg-[#222] text-white' : 'bg-gray-100 text-slate-900'} font-bold text-sm outline-none`}
           />
           <input 
             value={customNotifBody} 
             onChange={e => setCustomNotifBody(e.target.value)} 
             placeholder="Notification Message" 
             className={`w-full md:w-1/2 p-3 rounded-2xl ${isDarkMode ? 'bg-[#222] text-white' : 'bg-gray-100 text-slate-900'} font-bold text-sm outline-none`}
           />
           <button 
             onClick={() => onSendNotification(customNotifTitle, customNotifBody)}
             className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2"
           >
              <Send size={16} /> Test Push
           </button>
        </div>
      </div>

      {/* Apps Grid */}
      <h3 className="text-lg font-black uppercase tracking-wider mb-4">Installed Phone Applications</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
         {appsList.map(app => (
           <motion.button 
             key={app.id}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setActiveApp(app.id)}
             className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-[#161616] border-white/5' : 'bg-white border-black/5'} border-2 shadow-xl flex flex-col items-center text-center gap-4 group`}
           >
              <div className={`w-16 h-16 rounded-2xl ${app.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                 <app.icon size={32} />
              </div>
              <div>
                 <h4 className="font-black text-sm uppercase">{app.name}</h4>
                 <p className="text-[10px] opacity-60 font-bold mt-1 line-clamp-1">{app.desc}</p>
              </div>
           </motion.button>
         ))}
      </div>

      {/* Active App Modal / Viewer */}
      <AnimatePresence>
        {activeApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-xl rounded-[3rem] ${isDarkMode ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'} border-4 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
            >
               {/* Modal Header */}
               <div className="p-6 border-b border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                        {activeApp[0].toUpperCase()}
                     </div>
                     <h3 className="font-black uppercase text-lg tracking-wider">{activeApp} App</h3>
                  </div>
                  <button onClick={() => setActiveApp(null)} className="p-2 rounded-full hover:bg-black/10 font-black">✕</button>
               </div>

               {/* Modal Body */}
               <div className="p-6 md:p-8 overflow-y-auto flex-1">
                  {activeApp === 'alarm' && (
                    <div className="space-y-6 text-center">
                       <Clock size={64} className="mx-auto text-blue-500 animate-pulse" />
                       <h4 className="text-2xl font-black uppercase">Alarm Overlay Simulator</h4>
                       <p className="text-sm opacity-70 font-bold">Trigger a full-screen alarm overlay right now to test snooze and dismiss functions.</p>
                       <button 
                         onClick={() => {
                           onTriggerAlarm({
                             id: 'test_' + Date.now(),
                             title: 'Urgent Mindfulness Alert',
                             type: 'event',
                             time: '12:00 PM',
                             date: new Date().toDateString()
                           });
                           setActiveApp(null);
                         }}
                         className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-sm shadow-xl hover:scale-105 transition-all"
                       >
                          Trigger Alarm Overlay Now
                       </button>
                    </div>
                  )}

                  {activeApp === 'notes' && (
                    <div className="space-y-4">
                       <h4 className="font-black uppercase text-sm">Quick Notepad (LocalStorage)</h4>
                       <textarea 
                         value={noteText}
                         onChange={e => {
                           setNoteText(e.target.value);
                           localStorage.setItem('phone_note', e.target.value);
                         }}
                         placeholder="Type quick notes here..."
                         className={`w-full h-48 p-4 rounded-2xl ${isDarkMode ? 'bg-[#222] text-white' : 'bg-gray-100 text-slate-900'} font-bold text-sm outline-none resize-none`}
                       />
                       <p className="text-xs opacity-50 font-bold">Auto-saved to device storage instantly.</p>
                    </div>
                  )}

                  {activeApp === 'camera' && (
                    <div className="space-y-6 text-center">
                       <div className="w-full h-64 rounded-3xl bg-black/90 flex flex-col items-center justify-center border-2 border-dashed border-white/20 relative overflow-hidden">
                          <Camera size={48} className="text-purple-400 mb-2 animate-bounce" />
                          <p className="text-white font-black text-sm uppercase">Camera Viewfinder Active</p>
                          <p className="text-xs text-purple-300 font-bold mt-1">Sensor Ready • 1080p Neural Stream</p>
                       </div>
                       <button 
                         onClick={() => onSendNotification("Camera Snapshot 📸", "Photo saved to local gallery successfully.")}
                         className="px-8 py-4 bg-purple-600 text-white rounded-[2rem] font-black uppercase text-sm shadow-xl"
                       >
                          Capture Photo
                       </button>
                    </div>
                  )}

                  {activeApp === 'music' && (
                    <div className="space-y-6 text-center">
                       <Music size={64} className="mx-auto text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
                       <h4 className="text-2xl font-black uppercase">Alpha Wave Generator</h4>
                       <p className="text-sm opacity-70 font-bold">Binaural frequency: 432 Hz Healing Resonance</p>
                       <button 
                         onClick={() => setMusicPlaying(!musicPlaying)}
                         className={`px-8 py-4 ${musicPlaying ? 'bg-red-500' : 'bg-pink-600'} text-white rounded-[2rem] font-black uppercase text-sm shadow-xl`}
                       >
                          {musicPlaying ? 'Stop Frequency' : 'Play Frequency'}
                       </button>
                    </div>
                  )}

                  {activeApp === 'weather' && (
                    <div className="space-y-6 text-center">
                       <CloudSun size={64} className="mx-auto text-cyan-400" />
                       <h4 className="text-3xl font-black uppercase">28°C • Neon Metropolis</h4>
                       <p className="text-sm opacity-70 font-bold">Atmospheric stability: Optimal. Humidity: 45%.</p>
                       <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 font-bold text-sm">
                          Air quality index is pristine. Perfect for outdoor citizen routines.
                       </div>
                    </div>
                  )}

                  {activeApp === 'gallery' && (
                    <div className="space-y-4">
                       <h4 className="font-black uppercase text-sm">Local Photo Gallery</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-black text-indigo-400 text-xs">Mood Guardian</div>
                          <div className="h-32 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-purple-400 text-xs">City Skyline</div>
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppsSection;
