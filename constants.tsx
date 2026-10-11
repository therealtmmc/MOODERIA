import { Mood } from './types';

export const JOB_TITLES = [
  'Citizen', 'Student', 'Teacher', 'Artist', 'Engineer', 'Doctor', 'Chef', 'Athlete', 'Musician', 'Explorer', 'Parent'
];

export const COUNTRIES = [
  { name: 'Philippines', code: 'ph' },
  { name: 'United States', code: 'us' },
  { name: 'Japan', code: 'jp' },
  { name: 'South Korea', code: 'kr' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'Germany', code: 'de' },
  { name: 'France', code: 'fr' },
  { name: 'Brazil', code: 'br' },
  { name: 'India', code: 'in' },
  { name: 'China', code: 'cn' },
  { name: 'Russia', code: 'ru' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Italy', code: 'it' },
  { name: 'Spain', code: 'es' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Thailand', code: 'th' },
  { name: 'Vietnam', code: 'vn' },
  { name: 'Indonesia', code: 'id' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Other', code: 'un' }
];

export const MOOD_SCORES: Record<string, number> = {
  'Wonderful': 100,
  'Excited': 85,
  'Happy': 70,
  'Normal': 50,
  'Tired': 35,
  'Angry': 15,
  'Flaming': 0
};

export const ZODIAC_SIGNS = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', element: 'Fire', trait: 'Courageous', icon: '♈' },
  { name: 'Taurus', date: 'Apr 20 - May 20', element: 'Earth', trait: 'Reliable', icon: '♉' },
  { name: 'Gemini', date: 'May 21 - Jun 20', element: 'Air', trait: 'Versatile', icon: '♊' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', element: 'Water', trait: 'Intuitive', icon: '♋' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', element: 'Fire', trait: 'Passionate', icon: '♌' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', element: 'Earth', trait: 'Analytical', icon: '♍' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', element: 'Air', trait: 'Diplomatic', icon: '♎' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', element: 'Water', trait: 'Resourceful', icon: '♏' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', element: 'Fire', trait: 'Optimistic', icon: '♐' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', element: 'Earth', trait: 'Disciplined', icon: '♑' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', element: 'Air', trait: 'Independent', icon: '♒' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', element: 'Water', trait: 'Artistic', icon: '♓' }
];

// Famous Motivational Quotes
export interface WisdomQuote {
  quote: string;
  author: string;
}

export const FAMOUS_WISDOM: WisdomQuote[] = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "You may encounter many defeats, but you must not be defeated.", author: "Maya Angelou" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" }
];

export const WISDOM_OF_MOODERIA = FAMOUS_WISDOM.map(w => `"${w.quote}" — ${w.author}`);

// Profile Artistic Backgrounds (6 fixed designs)
export const PROFILE_BACKGROUNDS = [
  {
    id: 'metropolis-neon',
    name: 'Metropolis Neon',
    tagalogName: 'Neong Lungsod',
    css: 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-700',
    preview: 'linear-gradient(135deg, #312e81, #581c87, #be185d)'
  },
  {
    id: 'cyberpunk-grid',
    name: 'Cyberpunk Grid',
    tagalogName: 'Cyber Lungsod',
    css: 'bg-gradient-to-br from-cyan-900 via-blue-950 to-fuchsia-900',
    preview: 'linear-gradient(135deg, #164e63, #082f49, #701a75)'
  },
  {
    id: 'sunset-horizon',
    name: 'Skyline Sunset',
    tagalogName: 'Takipsilim',
    css: 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-900',
    preview: 'linear-gradient(135deg, #d97706, #e11d48, #581c87)'
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    tagalogName: 'Kosmikong Bituin',
    css: 'bg-gradient-to-tr from-slate-950 via-indigo-950 to-violet-900',
    preview: 'linear-gradient(135deg, #020617, #1e1b4b, #4c1d95)'
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora',
    tagalogName: 'Luntiang Aurora',
    css: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950',
    preview: 'linear-gradient(135deg, #064e3b, #134e4a, #020617)'
  },
  {
    id: 'golden-hour',
    name: 'Golden Mirage',
    tagalogName: 'Gintong Silang',
    css: 'bg-gradient-to-tr from-yellow-700 via-amber-600 to-orange-800',
    preview: 'linear-gradient(135deg, #a16207, #d97706, #9a3412)'
  }
];

// Flame Streak Color Config
export const getFlameConfig = (streak: number) => {
  if (streak <= 0) {
    return {
      color: '#64748b',
      name: 'Extinguished',
      bgClass: 'bg-slate-600',
      textClass: 'text-slate-400',
      borderClass: 'border-slate-800',
      glow: 'none'
    };
  } else if (streak <= 3) {
    return {
      color: '#f97316',
      name: 'Warm Orange',
      bgClass: 'bg-orange-500',
      textClass: 'text-orange-400',
      borderClass: 'border-orange-700',
      glow: '0 0 15px rgba(249,115,22,0.6)'
    };
  } else if (streak <= 7) {
    return {
      color: '#eab308',
      name: 'Radiant Gold',
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-400',
      borderClass: 'border-amber-700',
      glow: '0 0 18px rgba(234,179,8,0.7)'
    };
  } else if (streak <= 14) {
    return {
      color: '#ef4444',
      name: 'Crimson Blaze',
      bgClass: 'bg-red-500',
      textClass: 'text-red-400',
      borderClass: 'border-red-700',
      glow: '0 0 22px rgba(239,68,68,0.8)'
    };
  } else if (streak <= 29) {
    return {
      color: '#a855f7',
      name: 'Amethyst Flame',
      bgClass: 'bg-purple-600',
      textClass: 'text-purple-400',
      borderClass: 'border-purple-800',
      glow: '0 0 26px rgba(168,85,247,0.9)'
    };
  } else {
    return {
      color: '#06b6d4',
      name: 'Celestial Cyan',
      bgClass: 'bg-cyan-500',
      textClass: 'text-cyan-400',
      borderClass: 'border-cyan-700',
      glow: '0 0 30px rgba(6,182,212,1)'
    };
  }
};

export const toRomanNumeral = (num: number): string => {
  if (num <= 0) return 'I';
  const lookup: [number, string][] = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];
  let roman = '';
  let n = Math.min(100, Math.max(1, Math.floor(num)));
  for (const [val, str] of lookup) {
    while (n >= val) {
      roman += str;
      n -= val;
    }
  }
  return roman || 'I';
};

export const getExpNeeded = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

export const TRANSLATIONS = {
  English: {
    welcome: "Welcome, Citizen!",
    home: "Home",
    mood: "Mood",
    cityHall: "City Hall",
    mails: "Mails",
    profile: "Profile",
    settings: "Settings",
    statistics: "Statistics",
    diary: "Diary",
    moodPet: "Mood Pet",
    teller: "Teller",
    express: "Express",
    schedule: "Schedule",
    routine: "Routine",
    wisdom: "Wisdom",
    choosePet: "Choose your Guardian",
    newTask: "New Event",
    newRoutine: "New Routine",
    startTask: "Start Task",
    complete: "Complete",
    locked: "Locked",
    level: "Power Rank",
    exp: "EXP",
    streak: "Day Streak",
    noEntries: "No entries found.",
    tasksFinished: "Tasks Finished",
    countdown: "Event Countdown",
    upcomingEvent: "Upcoming Highlight",
    todayRoutine: "Today's Routine",
    noEventsSoon: "No events scheduled soon",
    noRoutineToday: "No routine tasks for today",
    markFinished: "Mark Finished",
    markUndone: "Mark Undone",
    allTasksCompleted: "All tasks finished for today! Streak increased! 🔥",
    reviveStreak: "Revive Streak",
    revivesLeft: "Revives left this month",
    streakBroken: "Streak Broken",
    streakBrokenMsg: "Your pet is downcast and lost its fiery aura. Revive your streak to restore its spirits!",
    bio: "Biography",
    editBio: "Edit Bio",
    saveBio: "Save Bio",
    changePhoto: "Upload Photo",
    chooseBg: "Card Background",
    citizenship: "Citizenship",
    citizenName: "Citizen Name",
    role: "Role",
    passportTitle: "MOODERIA CITIZEN PASSPORT",
    passportVerified: "PASSPORT ACTIVE & VERIFIED",
    officialCitizen: "OFFICIAL CITIZEN",
    resetTitle: "Reset All Data?",
    resetDesc: "This will permanently erase all local passport data, streaks, routines, schedule events, and pet progress from this device. Are you sure?",
    confirmReset: "Confirm Reset",
    viewMonth: "Month View",
    viewWeek: "Week View",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    deleteEvent: "Delete",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    eventNear: "Starting Soon!",
    budget: "Budget Goals",
    budgetTab: "Budget",
    loveFrom: "Love from the city of MOODERIA"
  },
  Filipino: {
    welcome: "Mabuhay, Mamamayan!",
    home: "Tahanan",
    mood: "Damdamin",
    cityHall: "Munisipyo",
    mails: "Sulat",
    profile: "Propayl",
    settings: "Settings",
    statistics: "Estadistika",
    diary: "Talaarawan",
    moodPet: "Alagang Hayop",
    teller: "Manghuhula",
    express: "Express",
    schedule: "Iskedyul",
    routine: "Rutina",
    wisdom: "Karunungan",
    budget: "Mga Layunin sa Pera",
    budgetTab: "Badyet",
    choosePet: "Piliin ang Tagapag-alaga",
    newTask: "Bagong Kaganapan",
    newRoutine: "Bagong Rutina",
    startTask: "Simulan ang Gawain",
    complete: "Tapos Na",
    locked: "Naka-lock",
    level: "Antas ng Lakas",
    exp: "EXP",
    streak: "Sunod-sunod na Araw",
    noEntries: "Walang talaan.",
    tasksFinished: "Mga Natapos na Gawain",
    countdown: "Oras Bago ang Kaganapan",
    upcomingEvent: "Paparating na Kaganapan",
    todayRoutine: "Rutina sa Araw na Ito",
    noEventsSoon: "Walang nakatakdang kaganapan sa ngayon",
    noRoutineToday: "Walang rutina para sa araw na ito",
    markFinished: "Markahang Tapos",
    markUndone: "Ibalik",
    allTasksCompleted: "Lahat ng gawain ngayong araw ay tapos na! Tumaas ang streak! 🔥",
    reviveStreak: "Buhayin ang Streak",
    revivesLeft: "Natitirang muling pagbuhay ngayong buwan",
    streakBroken: "Nabasag ang Streak",
    streakBrokenMsg: "Nalulungkot ang iyong alaga at nawala ang apoy nito. Buhayin ang streak upang maibalik ang sigla!",
    bio: "Talambuhay",
    editBio: "I-edit ang Talambuhay",
    saveBio: "I-save ang Talambuhay",
    changePhoto: "Mag-upload ng Larawan",
    chooseBg: "Disenyo ng Kard",
    citizenship: "Pagkamamamayan",
    citizenName: "Pangalan ng Mamamayan",
    role: "Tungkulin",
    passportTitle: "PASAPORTE NG MAMAMAYAN NG MOODERIA",
    passportVerified: "AKTIBO AT BERIPIKADONG PASAPORTE",
    officialCitizen: "OPISYAL NA MAMAMAYAN",
    resetTitle: "I-reset ang Lahat ng Datos?",
    resetDesc: "Permanenteng buburahin ang lahat ng datos ng pasaporte, streak, rutina, iskedyul, at alaga mula sa device na ito. Sigurado ka ba?",
    confirmReset: "Kumpirmahin ang Pag-reset",
    viewMonth: "Tingnan Buong Buwan",
    viewWeek: "Tingnan Buong Linggo",
    addEvent: "Magdagdag ng Kaganapan",
    editEvent: "I-edit ang Kaganapan",
    deleteEvent: "Burahin",
    editTask: "I-edit ang Gawain",
    deleteTask: "Burahin ang Gawain",
    eventNear: "Magsisimula Na!",
    loveFrom: "Love from the city of MOODERIA"
  }
};

export const t = (key: keyof typeof TRANSLATIONS['English'], lang: 'English' | 'Filipino') => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['English'][key] || key;
};