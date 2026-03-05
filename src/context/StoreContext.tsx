import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from "react";

// Types
export type MoodEntry = {
  id: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  mood: string; // e.g., "Happy", "Sad", "Excited"
  note: string;
  image?: string; // Base64 string or URL
  video?: string; // Base64 string or URL
  audio?: string; // Base64 string or URL
  lockDate?: string; // ISO Date string for Time Capsule
  isHighlight?: boolean; // "This was a Win"
};

export type Routine = {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  days: string[]; // ["Mon", "Tue", ...]
  active: boolean;
  lastCompletedDate?: string; // YYYY-MM-DD
  lastFailedDate?: string; // YYYY-MM-DD
  streak: number;
  category?: "Health" | "Work" | "Learning" | "Self-care" | "Other";
  duration?: number; // minutes, for the timer
};

export type WorkTask = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dateCompleted?: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon?: string; // Emoji
  history: {
    id: string;
    date: string;
    amount: number;
  }[];
};

export type WorkoutStep = {
  type: "time" | "reps" | "rest";
  name: string;
  duration?: number; // seconds
  reps?: number;
};

export type CustomRoutine = {
  id: string;
  name: string;
  steps: WorkoutStep[];
};

export type ExerciseLog = {
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg or lbs
  duration?: number; // in seconds
};

export type WorkoutLog = {
  id: string;
  date: string;
  type: string; // "Pushups", "Squats", "Custom"
  duration: number; // seconds
  reps: number; // Total reps if applicable
  difficulty: "Easy" | "Medium" | "Hard";
  exercises?: ExerciseLog[];
};

export type WalkLog = {
  id: string;
  date: string;
  distance: number; // meters
  duration: number; // seconds
};

export type UserProfile = {
  name: string;
  citizenship: string;
  joinedDate: string;
  passportNumber: string; // Random generated ID
  photo?: string; // Base64 string
};

export type AppState = {
  userProfile: UserProfile | null;
  moods: MoodEntry[];
  routines: Routine[];
  workTasks: WorkTask[];
  events: Event[];
  workouts: WorkoutLog[];
  walks: WalkLog[];
  savings: SavingsGoal[];
  customRoutines: CustomRoutine[];
  streak: number;
  lastMoodDate: string | null;
  currentRank: number;
  showRankUpPopup: boolean;
};

type Action =
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "ADD_MOOD"; payload: MoodEntry }
  | { type: "ADD_ROUTINE"; payload: Routine }
  | { type: "TOGGLE_ROUTINE"; payload: string }
  | { type: "DELETE_ROUTINE"; payload: string }
  | { type: "COMPLETE_ROUTINE"; payload: { id: string; date: string } }
  | { type: "FAIL_ROUTINE"; payload: { id: string; date: string } }
  | { type: "ADD_WORK_TASK"; payload: WorkTask }
  | { type: "COMPLETE_WORK_TASK"; payload: string }
  | { type: "DELETE_WORK_TASK"; payload: string }
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "LOG_WORKOUT"; payload: WorkoutLog }
  | { type: "LOG_WALK"; payload: WalkLog }
  | { type: "ADD_SAVINGS"; payload: SavingsGoal }
  | { type: "ADD_SAVINGS_ENTRY"; payload: { id: string; amount: number; date: string } }
  | { type: "DELETE_SAVINGS"; payload: string }
  | { type: "ADD_CUSTOM_ROUTINE"; payload: CustomRoutine }
  | { type: "DELETE_CUSTOM_ROUTINE"; payload: string }
  | { type: "RESET_STREAK" }
  | { type: "INCREMENT_STREAK" }
  | { type: "DELETE_DIARY"; payload: string } // payload is date
  | { type: "CLEAR_ALL_DIARY" }
  | { type: "CLOSE_RANK_POPUP" }
  | { type: "LOAD_STATE"; payload: AppState };

const initialState: AppState = {
  userProfile: null,
  moods: [],
  routines: [],
  workTasks: [],
  events: [],
  workouts: [],
  walks: [],
  savings: [],
  customRoutines: [],
  streak: 0,
  lastMoodDate: null,
  currentRank: 0,
  showRankUpPopup: false,
};

const StoreContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

// Rank Thresholds
const RANK_THRESHOLDS = [10, 20, 50, 80, 120, 160, 200, 250, 300, 350];

function calculateRank(totalTasks: number): number {
  let rank = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalTasks >= RANK_THRESHOLDS[i]) {
      rank = i + 1;
    } else {
      break;
    }
  }
  return rank;
}

function checkRankUp(state: AppState): AppState {
  const totalTasks = 
    state.moods.length + 
    state.workTasks.filter(t => t.completed).length + 
    state.events.length + 
    state.workouts.length;
  
  const newRank = calculateRank(totalTasks);
  
  if (newRank > state.currentRank) {
    return { ...state, currentRank: newRank, showRankUpPopup: true };
  }
  return state;
}

function reducer(state: AppState, action: Action): AppState {
  let newState = state;

  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, userProfile: action.payload };
    case "ADD_MOOD":
      newState = {
        ...state,
        moods: [...state.moods, action.payload],
        lastMoodDate: action.payload.date,
      };
      return checkRankUp(newState);
    case "ADD_ROUTINE":
      return { ...state, routines: [...state.routines, action.payload] };
    case "TOGGLE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) =>
          r.id === action.payload ? { ...r, active: !r.active } : r
        ),
      };
    case "DELETE_ROUTINE":
      return {
        ...state,
        routines: state.routines.filter((r) => r.id !== action.payload),
      };
    case "COMPLETE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) => {
          if (r.id === action.payload.id) {
            // Check if completed today already
            if (r.lastCompletedDate === action.payload.date) return r;
            
            return {
              ...r,
              lastCompletedDate: action.payload.date,
              streak: (r.streak || 0) + 1,
            };
          }
          return r;
        }),
      };
    case "FAIL_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) => {
          if (r.id === action.payload.id) {
            if (r.lastFailedDate === action.payload.date) return r; // Already failed today
            return {
              ...r,
              lastFailedDate: action.payload.date,
              streak: Math.max(0, (r.streak || 0) - 1),
            };
          }
          return r;
        }),
      };
    case "ADD_WORK_TASK":
      return { ...state, workTasks: [...state.workTasks, action.payload] };
    case "COMPLETE_WORK_TASK":
      newState = {
        ...state,
        workTasks: state.workTasks.map(t => 
          t.id === action.payload ? { ...t, completed: true, dateCompleted: new Date().toISOString() } : t
        ),
        streak: state.streak + 1 // Increment streak on work task completion
      };
      return checkRankUp(newState);
    case "DELETE_WORK_TASK":
      return {
        ...state,
        workTasks: state.workTasks.filter(t => t.id !== action.payload)
      };
    case "ADD_EVENT":
      newState = { ...state, events: [...state.events, action.payload] };
      return checkRankUp(newState);
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
      };
    case "LOG_WORKOUT":
      newState = { ...state, workouts: [...state.workouts, action.payload] };
      return checkRankUp(newState);
    case "LOG_WALK":
      return { ...state, walks: [...state.walks, action.payload] };
    case "ADD_SAVINGS":
      return { ...state, savings: [...state.savings, action.payload] };
    case "ADD_SAVINGS_ENTRY":
      return {
        ...state,
        savings: state.savings.map((s) =>
          s.id === action.payload.id
            ? {
                ...s,
                currentAmount: s.currentAmount + action.payload.amount,
                history: [
                  ...s.history,
                  {
                    id: crypto.randomUUID(),
                    date: action.payload.date,
                    amount: action.payload.amount,
                  },
                ],
              }
            : s
        ),
      };
    case "DELETE_SAVINGS":
      return {
        ...state,
        savings: state.savings.filter((s) => s.id !== action.payload),
      };
    case "ADD_CUSTOM_ROUTINE":
      return { ...state, customRoutines: [...state.customRoutines, action.payload] };
    case "DELETE_CUSTOM_ROUTINE":
      return {
        ...state,
        customRoutines: state.customRoutines.filter((r) => r.id !== action.payload),
      };
    case "RESET_STREAK":
      return { ...state, streak: 0 };
    case "INCREMENT_STREAK":
      return { ...state, streak: state.streak + 1 };
    case "DELETE_DIARY":
      return {
        ...state,
        moods: state.moods.filter((m) => m.id !== action.payload),
      };
    case "CLEAR_ALL_DIARY":
      return {
        ...state,
        moods: state.moods.map((m) => ({ ...m, note: "" })),
      };
    case "CLOSE_RANK_POPUP":
      return { ...state, showRankUpPopup: false };
    case "LOAD_STATE":
      // Backfill IDs for old entries
      const moodsWithIds = action.payload.moods.map(m => ({
        ...m,
        id: m.id || crypto.randomUUID()
      }));
      return { 
        ...action.payload, 
        moods: moodsWithIds, 
        savings: action.payload.savings || [],
        workTasks: action.payload.workTasks || [],
        customRoutines: action.payload.customRoutines || [],
        currentRank: action.payload.currentRank || 0,
        showRankUpPopup: false 
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mooderia-state");
    if (saved) {
      try {
        dispatch({ type: "LOAD_STATE", payload: JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("mooderia-state", JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
