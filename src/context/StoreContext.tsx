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
  date?: string; // YYYY-MM-DD, optional for routine tasks
  isRoutine?: boolean; // If true, it appears every day
  isDecree?: boolean; // "Eat The Frog" / Government Announcement
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

export type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: "Meeting" | "Birthday" | "Holiday" | "Other";
  description?: string;
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
  difficulty: "Easy" | "Medium" | "Hard";
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
  currency: string;
  joinedDate: string;
  passportNumber: string; // Random generated ID
  photo?: string; // Base64 string
  intellect: number;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: "Salary" | "Gift" | "Initial Balance" | "Food" | "Transport" | "Bills" | "Savings Deposit" | "Other";
  note?: string;
};

export type MarketItem = {
  id: string;
  name: string;
  day: string; // "Monday", "Tuesday", etc.
  type: "liquid" | "solid";
  unit: string;
  amount: number;
  completed: boolean;
  price?: number;
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
  walletBalance: number;
  transactions: Transaction[];
  customRoutines: CustomRoutine[];
  streak: number;
  lastMoodDate: string | null;
  currentRank: number;
  showRankUpPopup: boolean;
  isNightMode: boolean;
  cityLevel: number;
  tasks: Task[];
  marketItems: MarketItem[];
  marketDecreeDay: string | null;
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
  | { type: "TOGGLE_DECREE"; payload: string }
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "LOG_WORKOUT"; payload: WorkoutLog }
  | { type: "LOG_WALK"; payload: WalkLog }
  | { type: "ADD_SAVINGS"; payload: SavingsGoal }
  | { type: "ADD_SAVINGS_ENTRY"; payload: { id: string; amount: number; date: string } }
  | { type: "DELETE_SAVINGS"; payload: string }
  | { type: "UPDATE_WALLET"; payload: { amount: number; type: "income" | "expense"; category: Transaction["category"]; note?: string } }
  | { type: "ADD_CUSTOM_ROUTINE"; payload: CustomRoutine }
  | { type: "EDIT_CUSTOM_ROUTINE"; payload: CustomRoutine }
  | { type: "DELETE_CUSTOM_ROUTINE"; payload: string }
  | { type: "RESET_STREAK" }
  | { type: "INCREMENT_STREAK" }
  | { type: "DELETE_DIARY"; payload: string } // payload is date
  | { type: "CLEAR_ALL_DIARY" }
  | { type: "CLOSE_RANK_POPUP" }
  | { type: "SET_THEME"; payload: boolean }
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "INCREMENT_CITY_LEVEL" }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "ADD_MARKET_ITEM"; payload: MarketItem }
  | { type: "BUY_MARKET_ITEM"; payload: string }
  | { type: "DELETE_MARKET_ITEM"; payload: string }
  | { type: "SET_MARKET_DECREE_DAY"; payload: string };

const initialState: AppState = {
  userProfile: null,
  moods: [],
  routines: [],
  workTasks: [],
  events: [],
  workouts: [],
  walks: [],
  savings: [],
  walletBalance: 0,
  transactions: [],
  customRoutines: [],
  streak: 0,
  lastMoodDate: null,
  currentRank: 0,
  showRankUpPopup: false,
  isNightMode: false,
  cityLevel: 1,
  tasks: [],
  marketItems: [],
  marketDecreeDay: null,
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
      return { ...state, userProfile: { ...action.payload, intellect: action.payload.intellect || 0 } };
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
    case "TOGGLE_DECREE":
      return {
        ...state,
        workTasks: state.workTasks.map(t => 
          t.id === action.payload 
            ? { ...t, isDecree: !t.isDecree } 
            : { ...t, isDecree: false } // Only one decree allowed at a time
        )
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
    case "UPDATE_WALLET":
      const newBalance = action.payload.type === "income" 
        ? state.walletBalance + action.payload.amount 
        : state.walletBalance - action.payload.amount;
      
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: action.payload.amount,
        type: action.payload.type,
        category: action.payload.category,
        note: action.payload.note
      };
      
      return {
        ...state,
        walletBalance: newBalance,
        transactions: [newTransaction, ...state.transactions]
      };
    case "ADD_CUSTOM_ROUTINE":
      return { ...state, customRoutines: [...state.customRoutines, action.payload] };
    case "EDIT_CUSTOM_ROUTINE":
      return {
        ...state,
        customRoutines: state.customRoutines.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
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
    case "SET_THEME":
      return { ...state, isNightMode: action.payload };
    case "INCREMENT_CITY_LEVEL":
      return { ...state, cityLevel: state.cityLevel + 1 };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case "ADD_MARKET_ITEM":
      return { ...state, marketItems: [...state.marketItems, action.payload] };
    case "BUY_MARKET_ITEM":
      const itemToBuy = state.marketItems.find(i => i.id === action.payload);
      const price = itemToBuy?.price || 0;
      
      const marketTransaction: Transaction = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: price,
        type: "expense",
        category: "Food",
        note: `Market Purchase: ${itemToBuy?.name || "Unknown Item"}`
      };

      return {
        ...state,
        marketItems: state.marketItems.map((item) =>
          item.id === action.payload ? { ...item, completed: true } : item
        ),
        walletBalance: state.walletBalance - price,
        transactions: [marketTransaction, ...state.transactions],
        userProfile: state.userProfile
          ? { ...state.userProfile, intellect: state.userProfile.intellect + 1 }
          : null,
      };
    case "DELETE_MARKET_ITEM":
      return {
        ...state,
        marketItems: state.marketItems.filter((item) => item.id !== action.payload),
      };
    case "SET_MARKET_DECREE_DAY":
      return {
        ...state,
        marketDecreeDay: action.payload,
      };
    case "LOAD_STATE":
      // Backfill IDs for old entries
      const moodsWithIds = (action.payload.moods || []).map((m) => ({
        ...m,
        id: m.id || crypto.randomUUID(),
      }));
      return {
        ...action.payload,
        moods: moodsWithIds,
        routines: action.payload.routines || [],
        workTasks: action.payload.workTasks || [],
        events: action.payload.events || [],
        workouts: action.payload.workouts || [],
        walks: action.payload.walks || [],
        savings: action.payload.savings || [],
        walletBalance: action.payload.walletBalance || 0,
        transactions: action.payload.transactions || [],
        customRoutines: Array.isArray(action.payload.customRoutines) ? action.payload.customRoutines : [],
        currentRank: action.payload.currentRank || 0,
        showRankUpPopup: false,
        streak: action.payload.streak || 0,
        lastMoodDate: action.payload.lastMoodDate || null,
        isNightMode: action.payload.isNightMode || false, // Default to false if not in saved state
        cityLevel: action.payload.cityLevel || 1,
        tasks: action.payload.tasks || [],
        marketItems: action.payload.marketItems || [],
        marketDecreeDay: action.payload.marketDecreeDay || null,
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

  // Automatic Day/Night Theme Switcher
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6; // 6pm to 6am is Night
      if (isNight !== state.isNightMode) {
        dispatch({ type: "SET_THEME", payload: isNight });
      }
    };

    checkTime(); // Initial check
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.isNightMode]);

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
