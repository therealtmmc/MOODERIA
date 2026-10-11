import { User, Message } from '../types';

// Pure LocalStorage Storage Architecture (Offline-First, Zero Server)
const MOODERIA_USER_KEY = 'mooderia_active_citizen';
const MOODERIA_BACKUP_KEY = 'mooderia_local_vault';

/**
 * Normalizes user data ensuring all fields and arrays exist safely.
 */
export const normalizeUser = (user: any): User => ({
  ...user,
  displayName: user.displayName || 'Citizen',
  country: user.country || 'ph',
  title: user.title || 'Citizen',
  citizenCode: user.citizenCode || '001001',
  moodStreak: user.moodStreak || 0,
  tasksFinishedCount: user.tasksFinishedCount || 0,
  moodHistory: user.moodHistory || [],
  diaryEntries: user.diaryEntries || [],
  schedule: user.schedule || [],
  routines: user.routines || [],
  friends: user.friends || [],
  friendRequests: user.friendRequests || [],
  unlockedBackgrounds: user.unlockedBackgrounds || ['default'],
  following: user.following || [],
  followers: user.followers || [],
  likesReceived: user.likesReceived || 0,
  profileBackground: user.profileBackground || 'metropolis-neon',
  petName: user.petName || 'Mood Guardian',
  petEmoji: user.petEmoji || '🦊',
  petLevel: user.petLevel || 1,
  petExp: user.petExp || 0,
  petHasBeenChosen: user.petHasBeenChosen !== false,
  petBackground: user.petBackground || 'default',
  monthlyRevivesUsed: user.monthlyRevivesUsed || 0,
  reviveMonth: user.reviveMonth || new Date().toISOString().slice(0, 7)
});

// --- SESSION MANAGEMENT (100% LOCAL STORAGE) ---

export const getCurrentSessionUser = async (): Promise<User | null> => {
  try {
    const raw = localStorage.getItem(MOODERIA_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeUser(parsed);
  } catch (e) {
    console.warn("Local storage parse issue", e);
    return null;
  }
};

export const clearSession = async () => {
  try {
    localStorage.removeItem(MOODERIA_USER_KEY);
    localStorage.removeItem('mooderia_theme');
    localStorage.removeItem('mooderia_lang');
    localStorage.removeItem('mooderia_last_pet_alert');
  } catch (e) {}
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(MOODERIA_USER_KEY);
    localStorage.removeItem(MOODERIA_BACKUP_KEY);
    localStorage.removeItem('mooderia_theme');
    localStorage.removeItem('mooderia_lang');
    localStorage.removeItem('mooderia_last_pet_alert');
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.error("Storage reset error", e);
  }
};

// --- AUTHENTICATION (LOCAL ONLY) ---

export const registerUser = async (user: User, password?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = normalizeUser({ ...user, citizenCode: code });
    localStorage.setItem(MOODERIA_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  } catch (e: any) {
    return { success: false, error: "Failed to initialize local passport." };
  }
};

export const loginUser = async (citizenCodeAttempt: string, passwordAttempt?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  const current = await getCurrentSessionUser();
  if (current) return { success: true, user: current };
  return { success: false, error: "No citizen found in local storage." };
};

// --- REALTIME SYNC (DIRECT LOCAL STORAGE WRITE) ---

export const syncProfile = async (user: User) => {
  try {
    const normalized = normalizeUser(user);
    localStorage.setItem(MOODERIA_USER_KEY, JSON.stringify(normalized));
  } catch (e) {
    console.error("Local sync error", e);
  }
};

export const subscribeToUser = (citizenCode: string, callback: (user: User) => void) => {
  // Offline-friendly local storage listener
  const handleStorage = (e: StorageEvent) => {
    if (e.key === MOODERIA_USER_KEY && e.newValue) {
      try {
        callback(normalizeUser(JSON.parse(e.newValue)));
      } catch (err) {}
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
};

export const subscribeToMessages = (citizenCode: string, callback: (msgs: Message[]) => void) => {
  return () => {};
};

export const sendMessageCloud = async () => true;
export const sendFriendRequest = async () => ({ success: true });
export const respondToFriendRequest = async () => ({ success: true });
export const markMessagesAsRead = async () => {};

// --- JSON EXPORT & IMPORT (OFFLINE DEVICE-TO-DEVICE) ---

export const exportUserDataJson = (user: User) => {
  const exportPayload = {
    ...normalizeUser(user),
    _app: "Mooderia",
    _version: "2.0",
    _exportDate: new Date().toISOString()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const fileName = `mooderia_${(user.displayName || 'citizen').toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup.json`;
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importUserDataJson = async (jsonString: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || (!parsed.displayName && !parsed.name)) {
      return { success: false, error: "Invalid backup file: citizen name missing." };
    }
    const normalized = normalizeUser(parsed);
    localStorage.setItem(MOODERIA_USER_KEY, JSON.stringify(normalized));
    return { success: true, user: normalized };
  } catch (err: any) {
    return { success: false, error: "Failed to parse JSON file." };
  }
};

export const generateTransferCode = (user: User): string => {
  return btoa(unescape(encodeURIComponent(JSON.stringify(user))));
};

export const importTransferCode = async (passportString: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const json = decodeURIComponent(escape(atob(passportString)));
    return await importUserDataJson(json);
  } catch (e) {
    return { success: false, error: "Corrupted passport data." };
  }
};
