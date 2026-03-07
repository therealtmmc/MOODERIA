import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Globe, Banknote, Search, ArrowLeft, Sun, Moon } from "lucide-react";
import { COUNTRIES, Country } from "@/constants/countries";
import { COUNTRY_DETAILS } from "@/constants/globalData";
import { cn } from "@/lib/utils";

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
    const hour = parseInt(format(time, "H"));
    return hour < 6 || hour >= 18;
  };

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
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-4 flex gap-2 sticky top-4 z-20">
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
            <div 
              key={country.code} 
              className={cn(
                "p-4 rounded-3xl shadow-sm border-2 flex items-center justify-between transition-all relative overflow-hidden group",
                isNight ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800'
              )}
            >
              {/* Background Glow for Night */}
              {isNight && <div className="absolute inset-0 bg-blue-500/10" />}

              <div className="flex items-center gap-4 relative z-10">
                <span className="text-4xl">{getFlagEmoji(country.code)}</span>
                <div>
                  <div className={cn("font-black text-lg", isNight ? 'text-gray-100' : 'text-gray-800')}>{country.name}</div>
                  <div className={cn("text-xs font-bold opacity-70", isNight ? 'text-blue-200' : 'text-gray-500')}>{format(time, "EEE, MMM d")}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                 <div className={cn("text-2xl font-black", isNight ? 'text-white' : 'text-gray-900')}>{format(time, "HH:mm")}</div>
                 {isNight ? <Moon className="w-6 h-6 text-blue-300" /> : <Sun className="w-6 h-6 text-orange-400" />}
              </div>
            </div>
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
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
