export type DistrictTheme = {
  name: string;
  accentColor: string;
  bgColor: string;
  icon: string;
  description: string;
};

export const DISTRICTS: Record<string, DistrictTheme> = {
  "/mood": {
    name: "Central Park",
    accentColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    icon: "🌳",
    description: "The heart of the city."
  },
  "/work": {
    name: "Business District",
    accentColor: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: "🏢",
    description: "Structured and efficient."
  },
  "/events": {
    name: "Public Square",
    accentColor: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: "📢",
    description: "Vibrant and social."
  },
  "/savings": {
    name: "Financial District",
    accentColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: "💰",
    description: "Sleek and prestigious."
  },
  "/diary": {
    name: "Library",
    accentColor: "text-stone-600",
    bgColor: "bg-stone-100",
    icon: "📚",
    description: "Quiet and reflective."
  },
  "/health": {
    name: "Gym",
    accentColor: "text-red-600",
    bgColor: "bg-red-50",
    icon: "💪",
    description: "Active and strong."
  },
  "/profile": {
    name: "Town Hall",
    accentColor: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: "🏛️",
    description: "City administration."
  },
};
