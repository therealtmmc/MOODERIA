import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from "react";

// Types
export type MoodEntry = {
  date: string; // ISO Date string (YYYY-MM-DD)
  mood: string; // e.g., "Happy", "Sad", "Excited"
  note: string;
};

export type Routine = {
  id: string;
  name: string;
  time: string; // HH:mm
  days: string[]; // ["Mon", "Tue", ...]
  active: boolean;
};

export type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description?: string;
};

export type WorkoutLog = {
  id: string;
  date: string;
  type: string; // "Pushups", "Squats"
  duration: number; // seconds
  reps: number;
  difficulty: "Easy" | "Medium" | "Hard";
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
  events: Event[];
  workouts: WorkoutLog[];
  walks: WalkLog[];
  streak: number;
  lastMoodDate: string | null;
};

type Action =
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "ADD_MOOD"; payload: MoodEntry }
  | { type: "ADD_ROUTINE"; payload: Routine }
  | { type: "TOGGLE_ROUTINE"; payload: string }
  | { type: "DELETE_ROUTINE"; payload: string }
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "LOG_WORKOUT"; payload: WorkoutLog }
  | { type: "LOG_WALK"; payload: WalkLog }
  | { type: "RESET_STREAK" }
  | { type: "INCREMENT_STREAK" }
  | { type: "LOAD_STATE"; payload: AppState };

const initialState: AppState = {
  userProfile: null,
  moods: [],
  routines: [],
  events: [],
  workouts: [],
  walks: [],
  streak: 0,
  lastMoodDate: null,
};

const StoreContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, userProfile: action.payload };
    case "ADD_MOOD":
      return {
        ...state,
        moods: [...state.moods, action.payload],
        lastMoodDate: action.payload.date,
      };
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
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
      };
    case "LOG_WORKOUT":
      return { ...state, workouts: [...state.workouts, action.payload] };
    case "LOG_WALK":
      return { ...state, walks: [...state.walks, action.payload] };
    case "RESET_STREAK":
      return { ...state, streak: 0 };
    case "INCREMENT_STREAK":
      return { ...state, streak: state.streak + 1 };
    case "LOAD_STATE":
      return action.payload;
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
