export type Mood = 'Wonderful' | 'Excited' | 'Happy' | 'Normal' | 'Tired' | 'Angry' | 'Flaming' | null;

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  period: 'AM' | 'PM';
  timestamp: number;
  alerted: boolean;
  description?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  icon: string;
  days: number[]; // 0-6 (Sun-Sat)
  startTime: string; // HH:mm
  startPeriod: 'AM' | 'PM';
  endTime?: string; // HH:mm
  endPeriod?: 'AM' | 'PM';
  durationMinutes?: number;
  completedDates: string[]; // List of YYYY-MM-DD dates marked as completed
  color?: string; // Hex or tailwind color for colorful block
}

export interface BudgetDeposit {
  id: string;
  amount: number;
  timestamp: number;
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  createdAt: number;
  deposits: BudgetDeposit[];
}

export interface User {
  id?: string;
  citizenCode: string;
  username?: string;
  displayName: string;
  password?: string;
  country: string; 
  profilePic?: string;
  profileColor?: string;
  profileBackground?: string; // ID of selected artistic background
  title?: string;
  bio?: string;
  moodHistory: { date: string, mood: Mood, score: number }[];
  diaryEntries: DiaryEntry[];
  schedule: ScheduleItem[];
  routines: RoutineItem[]; 
  moodStreak: number;
  lastMoodDate?: string;
  tasksFinishedCount: number; // Replaced mood coins

  // Budget Goals
  budgetGoals?: BudgetGoal[];
  pinnedBudgetGoalId?: string;

  // Widget Sizes (4x2 or 2x2)
  widgetSizes?: {
    countdown?: '4x2' | '2x2';
    task?: '4x2' | '2x2';
    moodPet?: '4x2' | '2x2';
    budget?: '4x2' | '2x2';
  };

  // Alarm & Overlay Settings
  alarmMode?: 'silent' | 'vibrate' | 'vibrate_sound';
  overlayPermissionGranted?: boolean;
  
  // Navigation Taskbar Layout: 'auto' | 'bottom' | 'side'
  taskbarLayout?: 'auto' | 'bottom' | 'side';
  
  // Streak Revive System
  monthlyRevivesUsed?: number; // Up to 5 per month
  reviveMonth?: string; // YYYY-MM
  previousStreak?: number; // Cached previous streak for revival

  // Mood Pet (Evolves with streak)
  petName: string;
  petEmoji: string;
  petLevel: number;
  petExp: number;
  petHasBeenChosen: boolean;
  petBackground: string; 
  unlockedBackgrounds: string[]; 

  // Social
  friends: string[];
  friendRequests: string[];
  following: string[];
  followers: string[];
  likesReceived: number;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface AppNotification {
  id: string;
  type: 'mail' | 'schedule' | 'routine' | 'system' | 'heart' | 'comment_heart' | 'comment' | 'reply' | 'repost' | 'achievement' | 'follow' | 'friend_request' | 'friend_accepted';
  sourceUser?: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export type Section = 'Home' | 'Mood' | 'CityHall' | 'Apps' | 'Profile' | 'Settings';
export type Notification = AppNotification;