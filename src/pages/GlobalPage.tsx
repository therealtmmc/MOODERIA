import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Globe, Clock, Banknote, Map as MapIcon, Search, ArrowLeft, Sun, Moon, MapPin } from "lucide-react";
import L from "leaflet";
import { COUNTRIES, Country } from "@/constants/countries";
import { COUNTRY_DETAILS } from "@/constants/globalData";
import { cn } from "@/lib/utils";

// Fix Leaflet marker icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fallback Mock Generator for missing data
const getProvinces = (countryName: string) => {
  const realData = COUNTRY_DETAILS[countryName];
  if (realData) return realData.provinces;

  // Fallback for countries not in our detailed list
  const count = Math.floor(Math.random() * 5) + 3;
  return Array.from({ length: count }).map((_, i) => ({
    name: `${countryName} Region ${String.fromCharCode(65 + i)}`,
    population: Math.floor(Math.random() * 5000000) + 100000,
    capital: `${countryName} City ${i + 1}`
  }));
};

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

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 5, { duration: 2 });
  }, [center, map]);
  return null;
}

export default function GlobalPage() {
  const { state } = useStore();
  const { userProfile } = state;
  const [amount, setAmount] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const userCurrency = userProfile?.currency || "USD";
  // We need a way to get the user's country name to look up the rate, 
  // but we only store currency code in profile. 
  // For now, we'll try to find a country with that currency or default to USD rate.
  const userCountry = COUNTRIES.find(c => c.currency === userCurrency);
  const userRate = userCountry ? getExchangeRate(userCurrency, userCountry.name) : 1;

  // Filter countries
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 24); // Show more in list view
  }, [searchTerm]);

  const getCountryTime = (timezone: string) => {
    return toZonedTime(currentTime, timezone);
  };

  const isNightInCountry = (timezone: string) => {
    const time = getCountryTime(timezone);
    const hour = parseInt(format(time, "H"));
    return hour < 6 || hour >= 18;
  };

  // Detail View
  if (selectedCountry) {
    const countryTime = getCountryTime(selectedCountry.timezone);
    const isNight = isNightInCountry(selectedCountry.timezone);
    const provinces = getProvinces(selectedCountry.name);
    const exchangeRate = getExchangeRate(selectedCountry.currency, selectedCountry.name);

    return (
      <div className="p-4 pt-8 pb-24 space-y-6">
        <button 
          onClick={() => setSelectedCountry(null)}
          className="flex items-center gap-2 text-gray-500 font-black uppercase text-xs hover:text-[#46178f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to World Map
        </button>

        {/* Big Container: Country Detail */}
        <div className={cn(
          "rounded-[3rem] shadow-2xl overflow-hidden border-4 transition-all duration-500 relative",
          isNight ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-blue-100 text-gray-800"
        )}>
          {/* Header */}
          <div className="p-8 pb-0 flex justify-between items-start relative z-10">
            <div>
              <div className="text-6xl mb-2">{getFlagEmoji(selectedCountry.code)}</div>
              <h1 className="text-4xl font-black leading-tight">{selectedCountry.name}</h1>
              <div className="flex items-center gap-2 mt-2 opacity-80 font-bold">
                <Globe className="w-4 h-4" />
                <span>{selectedCountry.timezone}</span>
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-2xl flex flex-col items-end",
              isNight ? "bg-slate-800 text-blue-200" : "bg-blue-50 text-blue-600"
            )}>
              {isNight ? <Moon className="w-6 h-6 mb-1" /> : <Sun className="w-6 h-6 mb-1" />}
              <span className="text-2xl font-black">{format(countryTime, "HH:mm")}</span>
              <span className="text-[10px] font-bold uppercase">{format(countryTime, "EEE, MMM d")}</span>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-64 w-full mt-6 relative z-0">
             <MapContainer center={[selectedCountry.lat, selectedCountry.lng]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
              <TileLayer
                url={isNight 
                  ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" 
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                attribution='&copy; OpenStreetMap'
              />
              <MapUpdater center={[selectedCountry.lat, selectedCountry.lng]} />
              <Marker position={[selectedCountry.lat, selectedCountry.lng]} />
            </MapContainer>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-current to-transparent opacity-10 pointer-events-none" />
          </div>

          {/* Content Grid */}
          <div className="p-6 grid gap-6">
            
            {/* Provinces / States */}
            <div className={cn(
              "p-5 rounded-3xl border-2",
              isNight ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"
            )}>
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 opacity-70" /> Provinces / States
              </h3>
              <div className="space-y-3">
                {provinces.map((prov, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-current/10 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-sm">{prov.name}</p>
                      <p className="text-[10px] opacity-60 uppercase tracking-wider">Cap: {prov.capital}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono opacity-80">Pop: {(prov.population / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Exchange */}
            <div className={cn(
              "p-5 rounded-3xl border-2",
              isNight ? "bg-emerald-900/30 border-emerald-800" : "bg-green-50 border-green-100"
            )}>
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 opacity-70" /> Currency Exchange
              </h3>
              
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] font-black opacity-50 uppercase">USD</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-2xl font-black outline-none border-b border-current/20 focus:border-current"
                    />
                 </div>
                 <div className="opacity-50">→</div>
                 <div className="flex-1 text-right">
                    <label className="text-[10px] font-black opacity-50 uppercase">{selectedCountry.currency}</label>
                    <p className="text-2xl font-black">{(amount * exchangeRate).toFixed(2)}</p>
                 </div>
              </div>
              <p className="text-[10px] mt-2 opacity-60 text-center">
                1 USD = {exchangeRate.toFixed(2)} {selectedCountry.currency}
              </p>
            </div>

          </div>
        </div>
      </div>
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
          <h1 className="text-3xl font-black text-gray-800">Global Center</h1>
          <p className="text-gray-500 font-bold">Select a Country</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredCountries.map((country) => {
          const time = getCountryTime(country.timezone);
          const isNight = isNightInCountry(country.timezone);
          
          return (
            <button 
              key={country.code} 
              onClick={() => setSelectedCountry(country)}
              className={cn(
                "p-4 rounded-3xl shadow-sm border-2 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 relative overflow-hidden group",
                isNight ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800'
              )}
            >
              {/* Background Glow for Night */}
              {isNight && <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />}

              <span className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">{getFlagEmoji(country.code)}</span>
              <span className={cn("font-black text-sm truncate w-full", isNight ? 'text-gray-100' : 'text-gray-700')}>{country.name}</span>
              
              <div className="flex items-center gap-1 mt-2">
                 {isNight ? <Moon className="w-3 h-3 text-blue-300" /> : <Sun className="w-3 h-3 text-orange-400" />}
                 <span className={cn("text-xs font-bold", isNight ? 'text-blue-200' : 'text-gray-500')}>{format(time, "HH:mm")}</span>
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
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
