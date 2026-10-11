import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { JOB_TITLES, PROFILE_BACKGROUNDS, COUNTRIES, toRomanNumeral, t } from '../constants';
import { Camera, Edit3, Check, Upload, X } from 'lucide-react';

interface ProfileSectionProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  isDarkMode: boolean;
  language?: 'English' | 'Filipino';
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdate, isDarkMode, language = 'English' }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    title: user.title || 'Citizen',
    profileBackground: user.profileBackground || 'metropolis-neon',
    bio: user.bio || '',
    profilePic: user.profilePic || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find active background config
  const currentBgId = user.profileBackground || 'metropolis-neon';
  const activeBg = PROFILE_BACKGROUNDS.find(b => b.id === currentBgId) || PROFILE_BACKGROUNDS[0];

  const handleOpenEdit = () => {
    setEditForm({
      displayName: user.displayName,
      title: user.title || 'Citizen',
      profileBackground: user.profileBackground || 'metropolis-neon',
      bio: user.bio || '',
      profilePic: user.profilePic || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({
      displayName: editForm.displayName.trim() || user.displayName,
      title: editForm.title,
      profileBackground: editForm.profileBackground,
      bio: editForm.bio.trim(),
      profilePic: editForm.profilePic
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditForm(prev => ({ ...prev, profilePic: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const countryName = COUNTRIES.find(c => c.code === user.country)?.name || 'Metropolis';

  return (
    <div className="space-y-8 pb-20">
      <div className={`rounded-[3rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5`}>
        
        {/* Clean Artistic Banner */}
        <div className={`h-56 md:h-72 w-full relative ${activeBg.css} transition-all duration-500`}>
          {/* Title Watermark */}
          <div className="absolute inset-0 opacity-15 flex items-center justify-center overflow-hidden pointer-events-none">
            <h1 className="text-[18vw] font-black text-white italic whitespace-nowrap uppercase tracking-tighter select-none">
              {user.title || 'CITIZEN'}
            </h1>
          </div>

          {/* THE SINGLE EDIT PROFILE BUTTON (ICON ONLY) */}
          <button 
            onClick={handleOpenEdit} 
            title={language === 'English' ? 'Edit Profile' : 'I-edit ang Propayl'}
            aria-label={language === 'English' ? 'Edit Profile' : 'I-edit ang Propayl'}
            className="absolute top-6 right-6 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-2xl text-white transition-all shadow-xl flex items-center justify-center border border-white/20 active:scale-95"
          >
            <Edit3 size={20} />
          </button>

          {/* Avatar positioning overlapping bottom of banner */}
          <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-white dark:bg-[#111] p-2 shadow-2xl">
              <div 
                className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-black/5 relative bg-indigo-600 flex items-center justify-center text-white text-5xl font-black italic shadow-inner"
              >
                {user.profilePic ? (
                  <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span>{(user.displayName || 'U')[0].toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Profile Info Details (NO edit controls shown outside) */}
        <div className="pt-20 px-8 md:px-12 pb-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">
                {user.displayName}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">
                  {user.title || 'Citizen'}
                </span>
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                  Rank {toRomanNumeral(user.petLevel || 1)}
                </span>
                <span className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-600/20">
                  {countryName}
                </span>
              </div>
            </div>
          </div>

          {/* Bio Quote (Clean Presentation) */}
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5">
            <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-2">
              {t('bio', language)}
            </p>
            <p className="text-base font-bold opacity-80 leading-relaxed italic">
              "{user.bio || 'Navigating the vibrant frequencies of Mooderia.'}"
            </p>
          </div>

          {/* Stats Bar: Streak, Tasks Finished (replacing coins), Moods */}
          <div className="pt-6 flex gap-10 border-t border-black/5 dark:border-white/5 flex-wrap">
            <div>
              <p className="text-3xl font-black italic leading-none">{user.moodStreak || 0}</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">{t('streak', language)}</p>
            </div>
            <div>
              <p className="text-3xl font-black italic leading-none text-amber-500">{user.tasksFinishedCount || 0}</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">{t('tasksFinished', language)}</p>
            </div>
            <div>
              <p className="text-3xl font-black italic leading-none text-purple-500">{toRomanNumeral(user.petLevel || 1)}</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">Pet Rank</p>
            </div>
            <div>
              <p className="text-3xl font-black italic leading-none">{(user.moodHistory || []).length}</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">Mood Logs</p>
            </div>
          </div>
        </div>
      </div>

      {/* ALL-IN-ONE EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white/10 relative my-8`}
            >
              <button 
                onClick={() => setIsEditing(false)} 
                className="absolute top-6 right-6 opacity-40 hover:opacity-100 p-2"
              >
                <X size={24}/>
              </button>

              <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-6">
                {language === 'English' ? 'Edit Profile' : 'I-edit ang Propayl'}
              </h3>

              <div className="space-y-5">
                {/* 1. Photo Upload in Modal */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    {editForm.profilePic ? (
                      <img src={editForm.profilePic} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span>{(editForm.displayName || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-tight">
                      {language === 'English' ? 'Profile Picture' : 'Larawan ng Propayl'}
                    </p>
                    <p className="text-[10px] opacity-50 font-bold">
                      {language === 'English' ? 'Upload an image from your device' : 'Pumili ng larawan mula sa iyong device'}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title={language === 'English' ? 'Choose Image' : 'Pumili ng Larawan'}
                      className="mt-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md w-fit transition-all"
                    >
                      <Upload size={16} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* 2. Citizen Name */}
                <div>
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 ml-1 block">
                    {t('citizenName', language)}
                  </label>
                  <input 
                    value={editForm.displayName} 
                    onChange={e => setEditForm({ ...editForm, displayName: e.target.value })} 
                    className="w-full p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-indigo-500" 
                  />
                </div>

                {/* 3. Role */}
                <div>
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 ml-1 block">
                    {t('role', language)}
                  </label>
                  <select 
                    value={editForm.title} 
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })} 
                    className="w-full p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-black outline-none focus:border-indigo-500 appearance-none"
                  >
                    {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                {/* 4. Bio */}
                <div>
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 ml-1 block">
                    {t('bio', language)}
                  </label>
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })} 
                    placeholder="Write a few words about your journey..."
                    className="w-full p-4 rounded-xl border-2 bg-black/5 dark:bg-white/5 font-bold outline-none focus:border-indigo-500 min-h-[80px]" 
                  />
                </div>

                {/* 5. Card Background Designs (Inside Modal) */}
                <div>
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2 ml-1 block">
                    {t('chooseBg', language)} ({PROFILE_BACKGROUNDS.length} Designs)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PROFILE_BACKGROUNDS.map(bg => {
                      const isSelected = editForm.profileBackground === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, profileBackground: bg.id })}
                          className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-105 shadow-md' : 'border-transparent bg-black/5 dark:bg-white/5 opacity-70'}`}
                        >
                          <div className="w-full h-8 rounded-lg shadow-inner" style={{ background: bg.preview }} />
                          <span className="text-[8px] font-black uppercase truncate w-full text-center">
                            {language === 'English' ? bg.name : bg.tagalogName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons (STRICTLY ICON ONLY) */}
                <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/10">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)} 
                    title="Cancel"
                    aria-label="Cancel"
                    className="flex-1 py-4 font-black uppercase rounded-2xl bg-black/5 dark:bg-white/5 opacity-60 hover:opacity-100 flex items-center justify-center transition-all shadow-sm"
                  >
                    <X size={22} />
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave} 
                    title="Save Changes"
                    aria-label="Save Changes"
                    className="flex-1 kahoot-button-blue py-4 rounded-2xl text-white font-black uppercase flex items-center justify-center shadow-lg transition-all"
                  >
                    <Check size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSection;
