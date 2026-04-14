import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import localforage from 'localforage';

export interface UserProfile {
  name: string;
  avatar: string;
  birthday: string;
  citizenship: string;
  pin: string;
  coinCurrency?: string;
  coinAppLockEnabled?: boolean;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  emotion: string;
}

export interface DiaryEntry {
  id: string;
  timestamp: number;
  content: string;
  emotion: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  type: 'one-time' | 'repetitive';
  daysOfWeek: number[]; // 0=Sun, 1=Mon, etc.
  date?: string; // YYYY-MM-DD for one-time
  time?: string; // HH:mm
  completedDates: string[]; // Array of YYYY-MM-DD
}

export interface VaultItem {
  id: string;
  type: 'image' | 'video';
  dataUrl: string;
  timestamp: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}

export interface AppState {
  isLoaded: boolean;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  moods: MoodEntry[];
  diary: DiaryEntry[];
  routines: RoutineTask[];
  vault: VaultItem[];
  events: EventItem[];
  lastMoodHourPrompt: number;
  isDarkMode: boolean;
}

type Action =
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'ADD_MOOD'; payload: MoodEntry }
  | { type: 'ADD_DIARY'; payload: DiaryEntry }
  | { type: 'DELETE_DIARY'; payload: string }
  | { type: 'ADD_ROUTINE'; payload: RoutineTask }
  | { type: 'TOGGLE_ROUTINE'; payload: { id: string; dateStr: string } }
  | { type: 'DELETE_ROUTINE'; payload: string }
  | { type: 'ADD_VAULT_ITEM'; payload: VaultItem }
  | { type: 'DELETE_VAULT_ITEM'; payload: string }
  | { type: 'ADD_EVENT'; payload: EventItem }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_LAST_MOOD_PROMPT'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOGOUT' }
  | { type: 'DELETE_ACCOUNT' };

const initialState: AppState = {
  isLoaded: false,
  profile: null,
  isAuthenticated: false,
  moods: [],
  diary: [],
  routines: [],
  vault: [],
  events: [],
  lastMoodHourPrompt: 0,
  isDarkMode: false,
};

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function storeReducer(state: AppState, action: Action): AppState {
  let newState = state;
  switch (action.type) {
    case 'LOAD_STATE':
      newState = { ...state, ...action.payload, isLoaded: true };
      break;
    case 'SET_PROFILE':
      newState = { ...state, profile: action.payload };
      break;
    case 'UPDATE_PROFILE':
      if (state.profile) {
        newState = { ...state, profile: { ...state.profile, ...action.payload } };
      }
      break;
    case 'SET_AUTH':
      newState = { ...state, isAuthenticated: action.payload };
      break;
    case 'ADD_MOOD':
      newState = { ...state, moods: [...state.moods, action.payload] };
      break;
    case 'ADD_DIARY':
      newState = { ...state, diary: [action.payload, ...state.diary] };
      break;
    case 'DELETE_DIARY':
      newState = { ...state, diary: state.diary.filter(d => d.id !== action.payload) };
      break;
    case 'ADD_ROUTINE':
      newState = { ...state, routines: [...state.routines, action.payload] };
      break;
    case 'TOGGLE_ROUTINE':
      newState = {
        ...state,
        routines: state.routines.map(r => {
          if (r.id === action.payload.id) {
            const isCompleted = r.completedDates.includes(action.payload.dateStr);
            return {
              ...r,
              completedDates: isCompleted
                ? r.completedDates.filter(d => d !== action.payload.dateStr)
                : [...r.completedDates, action.payload.dateStr]
            };
          }
          return r;
        })
      };
      break;
    case 'DELETE_ROUTINE':
      newState = { ...state, routines: state.routines.filter(r => r.id !== action.payload) };
      break;
    case 'ADD_VAULT_ITEM':
      newState = { ...state, vault: [action.payload, ...state.vault] };
      break;
    case 'DELETE_VAULT_ITEM':
      newState = { ...state, vault: state.vault.filter(v => v.id !== action.payload) };
      break;
    case 'ADD_EVENT':
      newState = { ...state, events: [...state.events, action.payload].sort((a, b) => a.date.localeCompare(b.date)) };
      break;
    case 'DELETE_EVENT':
      newState = { ...state, events: state.events.filter(e => e.id !== action.payload) };
      break;
    case 'SET_LAST_MOOD_PROMPT':
      newState = { ...state, lastMoodHourPrompt: action.payload };
      break;
    case 'TOGGLE_DARK_MODE':
      newState = { ...state, isDarkMode: !state.isDarkMode };
      break;
    case 'LOGOUT':
      newState = { ...state, isAuthenticated: false };
      break;
    case 'DELETE_ACCOUNT':
      localforage.clear();
      return { ...initialState, isLoaded: true };
    default:
      return state;
  }

  // Save to localforage
  if (action.type !== 'LOAD_STATE' && (action as any).type !== 'DELETE_ACCOUNT') {
    const stateToSave = { ...newState };
    // Don't persist auth state across reloads
    stateToSave.isAuthenticated = false;
    localforage.setItem('mooderia_v2_state', stateToSave);
  }

  return newState;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  useEffect(() => {
    localforage.getItem<Partial<AppState>>('mooderia_v2_state').then((savedState) => {
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
      } else {
        dispatch({ type: 'LOAD_STATE', payload: {} });
      }
    });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
