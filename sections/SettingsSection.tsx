import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Globe, Shield, Check, AlertTriangle, BellRing, Heart, Download, Upload, FileJson, Trash2, X, Volume2, VolumeX, Vibrate, Layers, Bell, Smartphone, Tablet, Package, ExternalLink, Code } from 'lucide-react';
import { User } from '../types';
import { COUNTRIES, t } from '../constants';
import { exportUserDataJson, importUserDataJson, resetAllData } from '../services/supabaseService';

interface SettingsSectionProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'English' | 'Filipino';
  onToggleLanguage: () => void;
  user: User;
  onUpdate?: (updates: Partial<User>) => void;
  onTestNotification?: () => void;
  onTriggerTestAlarm?: () => void;
  onResetData?: () => void;
  onImportData?: (user: User) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  language, 
  onToggleLanguage, 
  user, 
  onUpdate,
  onTestNotification,
  onTriggerTestAlarm,
  onResetData,
  onImportData
}) => {
  const [notifStatus, setNotifStatus] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';
  });

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestNotification = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        try {
          const res = await Notification.requestPermission();
          setNotifStatus(res);
        } catch (e) {
          console.error(e);
        }
      } else {
        setNotifStatus('granted');
      }
    }
    if (onTestNotification) {
      onTestNotification();
    }
  };

  const handleExportData = () => {
    exportUserDataJson(user);
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importUserDataJson(text);
      if (result.success && result.user) {
        setImportStatus(language === 'English' ? 'Passport imported successfully!' : 'Matagumpay na na-import ang pasaporte!');
        if (onImportData) {
          onImportData(result.user);
        }
        setTimeout(() => {
          try {
            window.location.reload();
          } catch (e) {}
        }, 1200);
      } else {
        setImportStatus(result.error || (language === 'English' ? 'Failed to import file.' : 'Nabigong i-import ang file.'));
      }
    } catch (err) {
      setImportStatus(language === 'English' ? 'Could not read file.' : 'Hindi mabasa ang file.');
    }
    e.target.value = '';
  };

  const handleExecuteReset = () => {
    resetAllData();
    setShowResetConfirmModal(false);
    if (onResetData) {
      onResetData();
    } else {
      try {
        window.location.reload();
      } catch (e) {}
    }
  };
  
  const flagUrl = `https://flagcdn.com/w320/${user.country || 'ph'}.png`;
  const citizenshipCountry = COUNTRIES.find(c => c.code === user.country)?.name || 'Philippines';

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {language === 'English' ? 'Citizen Terminal' : 'Sentro ng Mamamayan'}
        </h2>
        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mt-1">
          {language === 'English' ? 'Identity & Configuration' : 'Pagkakakilanlan at Pagsasaayos'}
        </p>
      </div>

      {/* OFFICIAL CITIZEN PASSPORT CARD - CLEAN, SPACIOUS, ZERO OVERLAP */}
      <div className={`relative w-full max-w-xl mx-auto rounded-[2.5rem] p-7 md:p-9 min-h-[340px] md:min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 border-4 ${isDarkMode ? 'bg-gradient-to-br from-[#12121c] via-[#161626] to-[#0d0d17] border-white/10 text-white' : 'bg-gradient-to-br from-white via-indigo-50/30 to-slate-100 border-indigo-200/80 text-slate-900'}`}>
        {/* Subtle, ultra-clean civic watermark (no messy textures) */}
        <Shield size={320} className="absolute -right-16 -bottom-16 opacity-[0.03] pointer-events-none text-indigo-600" />
        
        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-600 shrink-0">
              <Shield size={26} />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-300">
                {t('passportTitle', language)}
              </h3>
              <p className="text-[8px] font-black uppercase opacity-40 tracking-[0.2em] mt-0.5">
                Republic of Mooderia • Official Credentials
              </p>
            </div>
          </div>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-indigo-500 overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-black shadow-md shrink-0">
            {user.profilePic ? (
              <img src={user.profilePic} className="w-full h-full object-cover" alt="Citizen Photo" />
            ) : (
              <span className="text-xl">{(user.displayName || 'U')[0].toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Middle Passport Fields - Generous line-height and responsive spacing */}
        <div className="relative z-10 my-6 space-y-5">
          <div>
            <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">
              {t('citizenName', language)}
            </p>
            <p className="text-2xl md:text-3xl font-black italic uppercase leading-snug break-words">
              {user.displayName}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5">
              <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">
                {t('role', language)}
              </p>
              <p className="text-sm md:text-base font-black uppercase text-indigo-600 dark:text-indigo-400">
                {user.title || 'Citizen'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5">
              <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">
                {t('citizenship', language)}
              </p>
              <div className="flex items-center gap-2">
                <img src={flagUrl} className="w-5 h-3.5 object-cover rounded shadow-sm border border-black/10 shrink-0" alt="Flag" />
                <p className="text-sm md:text-base font-black uppercase text-indigo-600 dark:text-indigo-400">
                  {citizenshipCountry}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Official Gold Seal Stamp Footer */}
        <div className="relative z-10 pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap justify-between items-center gap-2">
          <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
            {t('passportVerified', language)}
          </span>
          <div className="text-[9px] font-black uppercase px-2.5 py-1 bg-amber-400/20 text-amber-600 dark:text-amber-300 rounded-md border border-amber-400/40">
            {t('officialCitizen', language)}
          </div>
        </div>
      </div>

      {/* Settings Grid with Icon-Only Action Buttons */}
      <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111]' : 'bg-white'} border-4 border-black/5 shadow-2xl space-y-4`}>
        
        {/* DATA BACKUP & RESTORE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export JSON Tile */}
          <div className={`flex items-center justify-between p-5 rounded-3xl transition-all border-2 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50/70'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                <FileJson size={22}/>
              </div>
              <div className="text-left">
                <p className="font-black italic uppercase text-xs md:text-sm">
                  {language === 'English' ? 'Export Data (JSON)' : 'I-export ang Datos (JSON)'}
                </p>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  {language === 'English' ? 'Local File Backup' : 'Lokal na Backup'}
                </p>
              </div>
            </div>
            {/* ICON-ONLY ACTION BUTTON */}
            <button
              onClick={handleExportData}
              title={language === 'English' ? 'Export JSON' : 'I-export ang JSON'}
              aria-label="Export JSON"
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
            >
              <Download size={20} />
            </button>
          </div>

          {/* Import JSON Tile */}
          <div className={`flex items-center justify-between p-5 rounded-3xl transition-all border-2 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-purple-50/70'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 shadow-sm'}`}>
                <FileJson size={22}/>
              </div>
              <div className="text-left">
                <p className="font-black italic uppercase text-xs md:text-sm">
                  {language === 'English' ? 'Import Data (JSON)' : 'Mag-import ng Datos (JSON)'}
                </p>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  {language === 'English' ? 'Transfer to Device' : 'Ilipat sa Device'}
                </p>
              </div>
            </div>
            {/* ICON-ONLY ACTION BUTTON */}
            <button
              onClick={handleTriggerImport}
              title={language === 'English' ? 'Import JSON' : 'Mag-import ng JSON'}
              aria-label="Import JSON"
              className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
            >
              <Upload size={20} />
            </button>
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport} 
            accept=".json,application/json" 
            className="hidden" 
          />
        </div>

        {/* Import Notification Banner */}
        {importStatus && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase text-center flex items-center justify-center gap-2 shadow-lg">
            <Check size={18} />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Device Notifications Test & Enable */}
        <div className={`flex items-center justify-between p-5 rounded-3xl transition-all border-2 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-amber-50/70'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 shadow-sm'}`}>
              <BellRing size={22}/>
            </div>
            <div className="text-left">
              <p className="font-black italic uppercase text-xs md:text-sm">
                {language === 'English' ? 'Device Notifications' : 'Mga Abiso sa Device'}
              </p>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">
                {notifStatus === 'granted' 
                  ? (language === 'English' ? '✅ Active on Device' : '✅ Aktibo sa Device') 
                  : notifStatus === 'denied' 
                  ? (language === 'English' ? '❌ Blocked in Device Settings' : '❌ Naka-block sa Settings') 
                  : (language === 'English' ? '🔔 Tap icon to test' : '🔔 Pindutin ang icon')}
              </p>
            </div>
          </div>
          {/* ICON-ONLY ACTION BUTTON */}
          <button
            onClick={handleTestNotification}
            title={language === 'English' ? 'Test Device Notification' : 'Subukan ang Abiso'}
            aria-label="Test Notification"
            className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <BellRing size={20} />
          </button>
        </div>

        {/* Dark / Light Mode */}
        <div className={`flex items-center justify-between p-5 rounded-3xl transition-all border-2 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
              {isDarkMode ? <Moon size={22}/> : <Sun size={22}/>}
            </div>
            <div className="text-left">
              <p className="font-black italic uppercase text-xs md:text-sm">
                {language === 'English' ? 'City Lighting' : 'Ilaw ng Lungsod'}
              </p>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                {isDarkMode ? (language === 'English' ? 'Dark Mode' : 'Madilim na Tema') : (language === 'English' ? 'Light Mode' : 'Maliwanag na Tema')}
              </p>
            </div>
          </div>
          {/* ICON-ONLY ACTION BUTTON */}
          <button
            onClick={onToggleDarkMode}
            title={language === 'English' ? 'Toggle Theme' : 'Palitan ang Tema'}
            aria-label="Toggle Theme"
            className="p-3.5 rounded-2xl bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Language Dialect Switch */}
        <div className={`flex items-center justify-between p-5 rounded-3xl transition-all border-2 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 shadow-sm'}`}>
              <Globe size={22}/>
            </div>
            <div className="text-left">
              <p className="font-black italic uppercase text-xs md:text-sm">
                {language === 'English' ? 'Citizen Dialect' : 'Wikang Mamamayan'}
              </p>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                {language === 'English' ? 'English (Tap to switch)' : 'Filipino (Pindutin para lumipat)'}
              </p>
            </div>
          </div>
          {/* ICON-ONLY ACTION BUTTON */}
          <button
            onClick={onToggleLanguage}
            title={language === 'English' ? 'Switch to Filipino' : 'Lumipat sa Ingles'}
            aria-label="Switch Language"
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <Globe size={20} />
          </button>
        </div>

        {/* ========================================================
            ANDROID: DISPLAY OVER OTHER APPS PERMISSION ACCESS
           ======================================================== */}
        <div className={`p-6 rounded-3xl transition-all border-2 ${user.overlayPermissionGranted ? 'border-indigo-500/30 bg-indigo-500/5' : isDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${user.overlayPermissionGranted ? 'bg-indigo-600 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-500'} shadow-sm shrink-0`}>
                <Layers size={22}/>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-black italic uppercase text-xs md:text-sm">
                    {language === 'English' ? 'Display Over Other Apps' : 'Ipakita sa Ibabaw ng Ibang Apps'}
                  </p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${user.overlayPermissionGranted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {user.overlayPermissionGranted ? 'Active' : 'Permission Required'}
                  </span>
                </div>
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-0.5">
                  {user.overlayPermissionGranted 
                    ? (language === 'English' ? 'Full-screen alarm overlays can popup over any app' : 'Maaaring lumabas ang alarma sa ibabaw ng anumang app')
                    : (language === 'English' ? 'Allows alarms & routine notifications over lock screen and other apps' : 'Pinapayagan ang mga alarma na lumabas sa ibabaw ng ibang apps')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  // Trigger Android Native Bridge if available
                  if (typeof window !== 'undefined' && (window as any).AndroidBridge?.requestOverlayPermission) {
                    try {
                      (window as any).AndroidBridge.requestOverlayPermission();
                    } catch (e) {
                      console.warn("AndroidBridge error", e);
                    }
                  } else {
                    // Deep link to Android overlay settings on mobile devices
                    try {
                      window.location.href = "intent:#Intent;action=android.settings.action.MANAGE_OVERLAY_PERMISSION;package=com.mooderia.app;end";
                    } catch (e) {
                      console.warn("Intent launch failed", e);
                    }
                  }

                  const nextState = !user.overlayPermissionGranted;
                  if (onUpdate) onUpdate({ overlayPermissionGranted: nextState });
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    try { navigator.vibrate([150, 80, 150]); } catch (e) {}
                  }
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase transition-all shadow-md active:scale-95 flex items-center gap-2 ${user.overlayPermissionGranted ? 'bg-indigo-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                title="Grant or Configure Phone Overlay Permission"
              >
                {user.overlayPermissionGranted ? <Check size={16} /> : <Smartphone size={16} />}
                <span>{user.overlayPermissionGranted ? 'Permission Granted' : 'Grant Permission'}</span>
              </button>

              {onTriggerTestAlarm && (
                <button
                  onClick={onTriggerTestAlarm}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  title="Test Alarm Overlay popup immediately"
                >
                  <Bell size={14} />
                  <span>Test</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            ALARM & ALERT MODES: SILENT, VIBRATE, VIBRATE + SOUND
           ======================================================== */}
        <div className={`p-6 rounded-3xl space-y-4 border-2 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-600/10 text-purple-600">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-black italic uppercase text-xs md:text-sm">
                  {language === 'English' ? 'Alarm Alert Mode' : 'Mode ng Alarma'}
                </p>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  {language === 'English' ? 'Choose alert behavior for tasks & events' : 'Piliin ang kilos ng alarma sa mga gawain'}
                </p>
              </div>
            </div>

            {/* Test Alarm Overlay Button */}
            {onTriggerTestAlarm && (
              <button
                type="button"
                onClick={onTriggerTestAlarm}
                className="kahoot-button-purple px-3.5 py-2 rounded-xl text-white font-black text-[10px] uppercase shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                title="Test Alarm Overlay"
              >
                <Bell size={12} />
                <span>Test Overlay</span>
              </button>
            )}
          </div>

          {/* 3 Modes: Silent, Vibrate, Vibrate + Sound */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              { id: 'silent' as const, label: 'Silent', sub: 'Visual only', icon: VolumeX, color: 'text-slate-400' },
              { id: 'vibrate' as const, label: 'Vibrate', sub: 'Haptics only', icon: Vibrate, color: 'text-yellow-500' },
              { id: 'vibrate_sound' as const, label: 'Vibrate + Sound', sub: 'Sound & Haptics', icon: Volume2, color: 'text-emerald-500' }
            ].map(m => {
              const currentMode = user.alarmMode || 'vibrate_sound';
              const isSelected = currentMode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (onUpdate) onUpdate({ alarmMode: m.id });
                    // Provide sensory feedback
                    if (m.id === 'vibrate') {
                      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                        try { navigator.vibrate([200, 100, 200]); } catch (e) {}
                      }
                    } else if (m.id === 'vibrate_sound') {
                      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                        try { navigator.vibrate([200, 100, 200]); } catch (e) {}
                      }
                      try {
                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                        if (AudioContextClass) {
                          const ctx = new AudioContextClass();
                          const osc = ctx.createOscillator();
                          const gain = ctx.createGain();
                          osc.connect(gain);
                          gain.connect(ctx.destination);
                          osc.frequency.setValueAtTime(600, ctx.currentTime);
                          gain.gain.setValueAtTime(0.1, ctx.currentTime);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.2);
                        }
                      } catch (e) {}
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105' : isDarkMode ? 'bg-black/20 border-white/5 hover:bg-white/5' : 'bg-white border-black/5 hover:bg-black/5'}`}
                >
                  <Icon size={24} className={isSelected ? 'text-white' : m.color} />
                  <p className="font-black text-xs uppercase mt-2">{m.label}</p>
                  <p className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-white/80' : 'opacity-40'}`}>{m.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Factory Reset Tile (100% Local Storage Reset via In-App Confirmation Modal) */}
        <div className="flex items-center justify-between p-5 rounded-3xl bg-red-500/10 border-2 border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-600 text-white shadow-sm shrink-0">
              <AlertTriangle size={22}/>
            </div>
            <div className="text-left">
              <p className="font-black italic uppercase text-xs md:text-sm text-red-600 dark:text-red-400">
                {language === 'English' ? 'Reset All Data' : 'I-reset ang Lahat ng Datos'}
              </p>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">
                {language === 'English' ? 'Wipe local storage & restart' : 'Burahin ang lokal na memorya'}
              </p>
            </div>
          </div>
          {/* ICON-ONLY ACTION BUTTON */}
          <button 
            onClick={() => setShowResetConfirmModal(true)}
            title={language === 'English' ? 'Reset All Data' : 'I-reset ang Lahat'}
            aria-label="Reset All Data"
            className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center font-black italic tracking-widest text-xs py-10 opacity-60 flex items-center justify-center gap-2">
        <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
        <span>Love from the city of MOODERIA</span>
      </div>

      {/* IN-APP CONFIRMATION MODAL FOR RESET DATA (GUARANTEED TO WORK OFFLINE & IN IFRAMES) */}
      <AnimatePresence>
        {showResetConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-slate-900 border-black/10'} w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-4 text-center space-y-6 relative`}
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={36} />
              </div>
              
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">
                  {t('resetTitle', language)}
                </h3>
                <p className="text-xs font-bold opacity-70 leading-relaxed">
                  {t('resetDesc', language)}
                </p>
              </div>

              {/* Action Buttons: Strictly Icon-Only */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  title="Cancel"
                  aria-label="Cancel"
                  className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-slate-600 dark:text-slate-300 font-black flex items-center justify-center transition-all shadow-sm"
                >
                  <X size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  title={t('confirmReset', language)}
                  aria-label={t('confirmReset', language)}
                  className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center justify-center transition-all shadow-lg shadow-red-500/30"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsSection;
