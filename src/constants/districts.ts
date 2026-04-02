export type DistrictTheme = {
 name: string;
 accentColor: string;
 bgColor: string;
 icon: string;
 description: string;
};

export const DISTRICTS: Record<string, DistrictTheme> = {
"/home": {
 name:"Citizen Home",
 accentColor:"text-indigo-600",
 bgColor:"bg-indigo-50",
 icon:"🏠",
 description:"Your personal dashboard."
 },
"/mood": {
 name:"Central Park",
 accentColor:"text-emerald-600",
 bgColor:"bg-emerald-50",
 icon:"🌳",
 description:"The heart of the city."
 },
"/work": {
 name:"Business District",
 accentColor:"text-blue-600",
 bgColor:"bg-blue-50",
 icon:"🏢",
 description:"Structured and efficient."
 },
"/events": {
 name:"Public Square",
 accentColor:"text-orange-600",
 bgColor:"bg-orange-50",
 icon:"📢",
 description:"Vibrant and social."
 },
"/savings": {
 name:"Financial District",
 accentColor:"text-yellow-600",
 bgColor:"bg-yellow-50",
 icon:"💰",
 description:"Sleek and prestigious."
 },
"/diary": {
 name:"Library",
 accentColor:"text-stone-600",
 bgColor:"bg-stone-100",
 icon:"📚",
 description:"Quiet and reflective."
 },
"/health": {
 name:"Gym",
 accentColor:"text-red-600",
 bgColor:"bg-red-50",
 icon:"💪",
 description:"Active and strong."
 },
"/profile": {
 name:"Town Hall",
 accentColor:"text-purple-600",
 bgColor:"bg-purple-50",
 icon:"🏛️",
 description:"City administration."
 },
"/market": {
 name:"Market District",
 accentColor:"text-amber-600",
 bgColor:"bg-amber-50",
 icon:"🛒",
 description:"Fresh goods and supplies."
 },
 "/school": {
  name:"City Academy",
  accentColor:"text-indigo-600",
  bgColor:"bg-indigo-50",
  icon:"🎓",
  description:"Learn and grow."
  },
 "/emergency": {
  name:"Emergency",
  accentColor:"text-red-600",
  bgColor:"bg-red-50",
  icon:"🚨",
  description:"Help when you need it."
  },
};
