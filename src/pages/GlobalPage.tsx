import { useState, useEffect, useMemo } from"react";
import { useStore } from"@/context/StoreContext";
import { format } from"date-fns";
import { toZonedTime } from"date-fns-tz";
import { Globe, Banknote, Search, ArrowLeft, Sun, Moon } from"lucide-react";
import { COUNTRIES, Country } from"@/constants/countries";
import { COUNTRY_DETAILS } from"@/constants/globalData";
import { cn } from"@/lib/utils";
import { motion, AnimatePresence } from"motion/react";

// Fallback Mock Generator for missing data
const getExchangeRate = (currencyCode: string, countryName: string) => {
 // Check detailed data first
 if (COUNTRY_DETAILS[countryName]) {
 return COUNTRY_DETAILS[countryName].currencyRate;
 }
 
 // Fallback rates
 const FALLBACK_RATES: Record<string, number> = {
 USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.2, AUD: 1.53, CAD: 1.36,
 CHF: 0.88, CNY: 7.19, HKD: 7.82, NZD: 1.63, SEK: 10.35, KRW: 1330,
 SGD: 1.34, NOK: 10.5, MXN: 17.1, INR: 82.9, RUB: 92.5, ZAR: 19.1,
 BRL: 4.95, TRY: 31.0, TWD: 31.5, DKK: 6.8, PLN: 3.9, THB: 35.8,
 IDR: 15600, HUF: 360, CZK: 23.5, ILS: 3.6, CLP: 970, PHP: 56.0,
 AED: 3.67, COP: 3900, SAR: 3.75, MYR: 4.77, RON: 4.5
 };
 
 return FALLBACK_RATES[currencyCode] || 1;
};

export default function GlobalPage() {
 const { state } = useStore();
 const [currentTime, setCurrentTime] = useState(new Date());
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

 // Update time every minute
 useEffect(() => {
 const timer = setInterval(() => setCurrentTime(new Date()), 60000);
 return () => clearInterval(timer);
 }, []);

 // Filter countries
 const filteredCountries = useMemo(() => {
 return COUNTRIES.filter(c => 
 c.name.toLowerCase().includes(searchTerm.toLowerCase())
 );
 }, [searchTerm]);

 const getCountryTime = (timezone: string) => {
 return toZonedTime(currentTime, timezone);
 };

 const isNightInCountry = (timezone: string) => {
 const time = getCountryTime(timezone);
 const hour = parseInt(format(time,"H"));
 return hour < 6 || hour >= 18;
 };

 // Detail View
 if (selectedCountry) {
 const countryTime = getCountryTime(selectedCountry.timezone);
 const isNight = isNightInCountry(selectedCountry.timezone);
 const countryDetails = COUNTRY_DETAILS[selectedCountry.name] || {
 currencyRate: 1,
 landShapeImage:"",
 basicInfo: {
 landSizeKm2: 0,
 population: 0,
 continent:"Unknown",
 president:"N/A",
 languages:"N/A",
 religion:"N/A",
 landmark:"N/A",
 plugType:"N/A",
 drivingSide:"N/A",
 emergencyNumber:"N/A",
 dialCode:"N/A",
 description:"Information for this country is currently unavailable.",
 capital:"N/A",
 gdp:"N/A",
 gdpPerCapita:"N/A"
 }
 };

 return (
 <AnimatePresence>
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 className="p-4 pt-8 pb-24 space-y-6"
 >
 <button 
 onClick={() => setSelectedCountry(null)}
 className="flex items-center gap-2 text-gray-500 font-black uppercase text-xs hover:text-[#46178f] transition-colors"
 >
 <ArrowLeft className="w-4 h-4" /> Back to Global Time
 </button>

 {/* Big Container: Country Detail */}
 <div className={cn(
"rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 relative",
 isNight ?"bg-slate-900 border-slate-700 text-white" :"bg-white border-blue-100 text-gray-800"
 )}>
 {/* Header */}
 <div className="p-8 pb-0 flex justify-between items-start relative z-10">
 <div>
 <div className="text-6xl mb-2">{getFlagEmoji(selectedCountry.code)}</div>
 <h1 className="text-4xl font-black leading-tight">{selectedCountry.name}</h1>
 </div>
 <div className={cn(
"px-4 py-2 rounded-2xl flex flex-col items-end",
 isNight ?"bg-slate-800 text-blue-200" :"bg-blue-50 text-blue-600"
 )}>
 {isNight ? <Moon className="w-6 h-6 mb-1" /> : <Sun className="w-6 h-6 mb-1" />}
 <span className="text-2xl font-black">{format(countryTime,"h:mm a")}</span>
 <span className="text-[10px] font-bold uppercase">{format(countryTime,"EEE, MMM d")}</span>
 </div>
 </div>

 {/* Content Grid */}
 <div className="p-6 grid gap-6">
 
 {/* Basic Info Section */}
 <div className={cn(
"p-5 rounded-3xl grid grid-cols-2 gap-4",
 isNight ?"bg-slate-800 border-slate-700" :"bg-gray-50"
 )}>
 <div className="col-span-2 flex justify-between items-center mb-2 -b -current/10 pb-2">
 <h3 className="font-black text-lg">Traveler's Essentials</h3>
 </div>
 <div className="col-span-2 mb-2">
 <p className="text-sm italic opacity-80">"{countryDetails.basicInfo.description}"</p>
 </div>
 <div>
 <p className="text-[10px] opacity-60 uppercase tracking-wider">Capital</p>
 <p className="font-black text-sm">{countryDetails.basicInfo.capital}</p>
 </div>
 <div>
 <p className="text-[10px] opacity-60 uppercase tracking-wider">Population</p>
 <p className="font-black text-sm">{countryDetails.basicInfo.population > 0 ? `${(countryDetails.basicInfo.population / 1000000).toFixed(1)}M` :"N/A"}</p>
 </div>
 <div>
 <p className="text-[10px] opacity-60 uppercase tracking-wider">GDP</p>
 <p className="font-black text-sm">{countryDetails.basicInfo.gdp}</p>
 </div>
 <div>
 <p className="text-[10px] opacity-60 uppercase tracking-wider">GDP per Capita</p>
 <p className="font-black text-sm">{countryDetails.basicInfo.gdpPerCapita}</p>
 </div>
 <div className="col-span-2">
 <p className="text-[10px] opacity-60 uppercase tracking-wider">Emergency Number</p>
 <p className="font-black text-sm">{countryDetails.basicInfo.emergencyNumber}</p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </AnimatePresence>
 );
 }

 // List View
 return (
 <div className="p-4 pt-8 pb-24 space-y-6">
 <header className="flex items-center gap-3">
 <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
 <Globe className="w-8 h-8" />
 </div>
 <div>
 <h1 className="text-3xl font-black text-gray-800">Global Time</h1>
 <p className="text-gray-500 font-bold">Current date and time</p>
 </div>
 </header>

 {/* Search */}
 <div className="bg-white p-2 rounded-2xl mb-4 flex gap-2 sticky top-4 z-20">
 <div className="flex-1 relative">
 <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
 <input 
 type="text" 
 placeholder="Search country..." 
 className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white transition-colors"
 value={searchTerm}
 onChange={e => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 {/* Country Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {filteredCountries.map((country) => {
 const time = getCountryTime(country.timezone);
 const isNight = isNightInCountry(country.timezone);
 
 return (
 <button 
 key={country.code} 
 onClick={() => setSelectedCountry(country)}
 className={cn(
"p-4 rounded-3xl flex items-center justify-between transition-all relative overflow-hidden group hover:scale-105 active:scale-95",
 isNight ?'bg-slate-800 border-slate-700 text-white' :'bg-white text-gray-800'
 )}
 >
 {/* Background Glow for Night */}
 {isNight && <div className="absolute inset-0 bg-blue-500/10" />}

 <div className="flex items-center gap-4 relative z-10">
 <span className="text-4xl">{getFlagEmoji(country.code)}</span>
 <div>
 <div className={cn("font-black text-lg", isNight ?'text-gray-100' :'text-gray-800')}>{country.name}</div>
 <div className={cn("text-xs font-bold opacity-70", isNight ?'text-blue-200' :'text-gray-500')}>{format(time,"EEE, MMM d")}</div>
 </div>
 </div>
 
 <div className="flex items-center gap-3 relative z-10">
 <div className={cn("text-2xl font-black", isNight ?'text-white' :'text-gray-900')}>{format(time,"h:mm a")}</div>
 {isNight ? <Moon className="w-6 h-6 text-blue-300" /> : <Sun className="w-6 h-6 text-orange-400" />}
 </div>
 </button>
 );
 })}
 </div>
 </div>
 );
}

function getFlagEmoji(countryCode: string) {
 const codePoints = countryCode
 .toUpperCase()
 .split('')
 .map(char => 127397 + char.charCodeAt(0));
 return String.fromCodePoint(...codePoints);
}
