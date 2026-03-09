import { useState, useMemo } from "react";
import { useStore, MarketItem } from "@/context/StoreContext";
import { Plus, Trash2, Check, X, ShoppingCart, Megaphone, Crown, Scale, Droplets, Box, ArrowRightLeft, SortAsc, CalendarDays, Wallet, AlertTriangle, Store, Coins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { SuccessAnimation } from "@/components/SuccessAnimation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const LIQUID_UNITS = ["gal", "qt", "fl oz", "L", "mL"];
const SOLID_UNITS = ["oz", "lb", "kg", "m", "ft", "mm", "in", "m²", "ft²", "m³", "ft³"];

const CONVERSIONS: Record<string, number> = {
  // Liquid to mL
  "gal": 3785.41,
  "qt": 946.353,
  "fl oz": 29.5735,
  "L": 1000,
  "mL": 1,
  // Solid to grams (approx for weight) or base units
  "oz": 28.3495,
  "lb": 453.592,
  "kg": 1000,
  // Length to mm
  "m": 1000,
  "ft": 304.8,
  "mm": 1,
  "in": 25.4,
  // Area
  "m²": 1,
  "ft²": 0.092903,
  // Volume
  "m³": 1,
  "ft³": 0.0283168,
};

export default function MarketPage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [successType, setSuccessType] = useState<"market" | "market_add" | null>(null);
  const [sortOrder, setSortOrder] = useState<"standard" | "today">("standard");
  const [itemToBuy, setItemToBuy] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  
  const [newItem, setNewItem] = useState({
    name: "",
    day: DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1],
    type: "solid" as "liquid" | "solid",
    unit: "lb",
    amount: 1,
    price: 0,
  });

  const [convertData, setConvertData] = useState({
    type: "liquid" as "liquid" | "solid",
    fromUnit: "L",
    toUnit: "mL",
    value: 1,
  });

  const SHOP_ITEMS = [
    { id: "exp_small", name: "Small EXP", description: "+10 XP", price: 50, icon: "✨" },
    { id: "exp_medium", name: "Medium EXP", description: "+50 XP", price: 200, icon: "✨" },
    { id: "exp_large", name: "Large EXP", description: "+100 XP", price: 350, icon: "✨" },
    { id: "streak_saver", name: "Streak Saver", description: "Saves your streak once", price: 200, icon: "🔥" },
    { id: "border_gold", name: "Gold Profile Border", description: "A shiny gold border", price: 500, icon: "🖼️" },
    { id: "border_diamond", name: "Diamond Profile Border", description: "A sparkling diamond border", price: 1000, icon: "💎" },
  ];

  const handleBuyShopItem = (item: typeof SHOP_ITEMS[0]) => {
    if (state.coins < item.price) {
      alert("Not enough coins!");
      return;
    }
    dispatch({ type: "BUY_SHOP_ITEM", payload: { id: item.id, name: item.name, icon: item.icon, price: item.price } });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#ffffff"],
    });
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    dispatch({
      type: "ADD_MARKET_ITEM",
      payload: {
        id: crypto.randomUUID(),
        ...newItem,
        completed: false,
      },
    });
    setShowAdd(false);
    setSuccessType("market_add");
    setNewItem({
      name: "",
      day: newItem.day,
      type: "solid",
      unit: "lb",
      amount: 1,
      price: 0,
    });
  };

  const handleBuyItem = (id: string) => {
    const item = state.marketItems.find(i => i.id === id);
    if (!item) return;

    if (state.walletBalance < (item.price || 0)) {
      alert("Insufficient funds in bank!");
      return;
    }

    dispatch({ type: "BUY_MARKET_ITEM", payload: id });
    setSuccessType("market");
    setItemToBuy(null);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#ffffff", "#46178f"],
    });
  };

  const getConvertedValue = () => {
    const { fromUnit, toUnit, value } = convertData;
    if (fromUnit === toUnit) return value;
    
    const fromFactor = CONVERSIONS[fromUnit];
    const toFactor = CONVERSIONS[toUnit];
    
    if (!fromFactor || !toFactor) return 0;
    
    // Special handling for area/volume if needed, but simple ratio works for most
    return (value * fromFactor) / toFactor;
  };

  // Stable day based on week if no manual decree set
  const weekNumber = Math.floor(new Date().getTime() / (7 * 24 * 60 * 60 * 1000));
  const defaultGroceryDay = DAYS[weekNumber % 7];
  const groceryDay = state.marketDecreeDay || defaultGroceryDay;

  const completedItems = state.marketItems.filter(item => item.completed);

  const sortedDays = useMemo(() => {
    if (sortOrder === "standard") return DAYS;
    
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const beforeToday = DAYS.slice(0, todayIndex);
    const fromToday = DAYS.slice(todayIndex);
    return [...fromToday, ...beforeToday];
  }, [sortOrder]);

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <SuccessAnimation 
        type={successType || "market"} 
        isVisible={!!successType} 
        onComplete={() => setSuccessType(null)} 
        stats={successType === "market" ? "Intellect +1" : "Item Added"}
      />
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-amber-600">Market District</h1>
          <p className="text-gray-500 font-bold">Supplies & Groceries</p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={() => setShowShop(true)}
            className="bg-purple-100 text-purple-600 p-3 rounded-xl shadow-md active:scale-95 transition-transform border-2 border-purple-200 flex items-center gap-2"
          >
            <Store className="w-6 h-6" />
            <span className="font-black text-sm hidden sm:inline">Item Shop</span>
          </button>
           <button
            onClick={() => setSortOrder(prev => prev === "standard" ? "today" : "standard")}
            className={cn(
              "p-3 rounded-xl shadow-md active:scale-95 transition-all border-2 flex items-center gap-2 font-bold text-xs",
              sortOrder === "today" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-amber-600 border-amber-100"
            )}
            title={sortOrder === "today" ? "Sorted: Today First" : "Sorted: Mon-Sun"}
          >
            {sortOrder === "today" ? <CalendarDays className="w-5 h-5" /> : <SortAsc className="w-5 h-5" />}
            <span className="hidden sm:inline">{sortOrder === "today" ? "Today First" : "Standard"}</span>
          </button>
           <button
            onClick={() => setShowConverter(true)}
            className="bg-white text-amber-600 p-3 rounded-xl shadow-md active:scale-95 transition-transform border-2 border-amber-100"
          >
            <Scale className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-amber-500 text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Bank Balance Notice */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Bank Balance</p>
            <p className="text-xl font-black text-blue-700">{state.userProfile?.currency} {state.walletBalance.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">Game Coins</p>
            <p className="text-xl font-black text-yellow-700">{state.coins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Mayor's Announcement */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-amber-50 border-4 border-amber-400 rounded-3xl p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />
        <div className="absolute -right-4 -top-4 text-amber-400/10 transform rotate-12">
          <Crown className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Megaphone className="w-3 h-3" /> Mayor's Decree
          </div>
          
          <h3 className="font-black text-2xl text-amber-800 leading-tight">
            "Citizens shall procure their groceries every <span className="text-amber-600 underline">{groceryDay}</span>!"
          </h3>
          
          <p className="text-amber-600/60 text-xs font-bold uppercase tracking-widest">By Order of the Mayor</p>
        </div>
      </motion.div>

      {/* Day Selector (Work Style) */}
      <div className="flex justify-between bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto gap-2">
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          const todayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
          const isToday = day === todayName;
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all min-w-[56px]",
                isSelected 
                  ? "bg-amber-500 text-white shadow-md scale-105" 
                  : "text-gray-400 hover:bg-gray-50",
                isToday && !isSelected && "bg-amber-50 text-amber-600 border border-amber-100"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{day.substring(0, 3)}</span>
              <span className={cn("text-lg font-black", isSelected ? "text-white" : "text-gray-700")}>
                {day.substring(0, 1)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Market Items List */}
      <div className="space-y-8">
        {(() => {
          const day = selectedDay;
          const items = state.marketItems.filter(item => item.day === day && !item.completed);
          const isDecree = day === groceryDay;

          return (
            <div key={day} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={cn(
                  "font-black text-2xl flex items-center gap-2 transition-colors",
                  isDecree ? "text-amber-600" : "text-gray-700"
                )}>
                  <ShoppingCart className={cn("w-6 h-6", isDecree ? "text-amber-500" : "text-gray-300")} />
                  {day}'s List
                  {items.length > 0 && (
                    <span className={cn(
                      "text-sm px-2 py-0.5 rounded-full",
                      isDecree ? "bg-amber-200 text-amber-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {items.length}
                    </span>
                  )}
                </h2>
                
                <button 
                  onClick={() => dispatch({ type: "SET_MARKET_DECREE_DAY", payload: day })}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm transition-all",
                    isDecree ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-amber-100 hover:text-amber-600"
                  )}
                >
                  <Megaphone className="w-3 h-3" /> {isDecree ? "Decree Active" : "Set as Decree"}
                </button>
              </div>

              {items.length > 0 ? (
                <div className="grid gap-4">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      className={cn(
                        "bg-white p-4 rounded-2xl shadow-md border-2 flex justify-between items-center transition-colors",
                        isDecree ? "border-amber-200" : "border-amber-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          item.type === "liquid" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                        )}>
                          {item.type === "liquid" ? <Droplets className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-gray-800">{item.name}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase">
                            {item.amount} {item.unit} • {state.userProfile?.currency} {item.price || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setItemToBuy(item.id)}
                          className="bg-amber-500 text-white px-4 py-2 rounded-xl font-black text-sm shadow-md active:scale-95 transition-transform border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
                        >
                          BUY
                        </button>
                        <button
                          onClick={() => dispatch({ type: "DELETE_MARKET_ITEM", payload: item.id })}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 opacity-50 border-2 border-dashed border-gray-200 rounded-3xl">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-bold text-gray-400">No items for {day}.</p>
                  <button onClick={() => {
                    setNewItem(prev => ({ ...prev, day }));
                    setShowAdd(true);
                  }} className="text-amber-600 text-sm font-bold mt-2 hover:underline">Add something?</button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200">
          <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
            Purchased <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{completedItems.length}</span>
          </h2>
          
          {completedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex justify-between items-center opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full text-green-600">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-500 line-through decoration-gray-400">{item.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{item.amount} {item.unit} • {state.userProfile?.currency} {item.price || 0} • {item.day}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_MARKET_ITEM", payload: item.id })}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-500"
            >
              <div className="bg-amber-500 p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">Add Item</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none font-bold"
                    placeholder="e.g., Milk, Bread"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Day</label>
                    <select
                      value={newItem.day}
                      onChange={(e) => setNewItem({ ...newItem, day: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none font-bold"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Type</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setNewItem({ ...newItem, type: "liquid", unit: "L" })}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                          newItem.type === "liquid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                        )}
                      >
                        LIQUID
                      </button>
                      <button
                        onClick={() => setNewItem({ ...newItem, type: "solid", unit: "lb" })}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                          newItem.type === "solid" ? "bg-white text-amber-600 shadow-sm" : "text-gray-400"
                        )}
                      >
                        SOLID
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Amount</label>
                    <input
                      type="number"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Unit</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none font-bold"
                    >
                      {(newItem.type === "liquid" ? LIQUID_UNITS : SOLID_UNITS).map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Price ({state.userProfile?.currency})</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none font-bold"
                    placeholder="0.00"
                  />
                </div>

                <button
                  onClick={handleAddItem}
                  disabled={!newItem.name}
                  className="w-full mt-4 bg-amber-500 text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50"
                >
                  Add to List
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Converter Modal */}
      <AnimatePresence>
        {showConverter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-500"
            >
              <div className="bg-amber-500 p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl flex items-center gap-2">
                  <Scale className="w-5 h-5" /> Unit Converter
                </h3>
                <button onClick={() => setShowConverter(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setConvertData({ ...convertData, type: "liquid", fromUnit: "L", toUnit: "mL" })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                      convertData.type === "liquid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                    )}
                  >
                    LIQUID
                  </button>
                  <button
                    onClick={() => setConvertData({ ...convertData, type: "solid", fromUnit: "kg", toUnit: "lb" })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                      convertData.type === "solid" ? "bg-white text-amber-600 shadow-sm" : "text-gray-400"
                    )}
                  >
                    SOLID
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={convertData.value}
                        onChange={(e) => setConvertData({ ...convertData, value: Number(e.target.value) })}
                        className="flex-1 bg-transparent text-2xl font-black text-gray-800 focus:outline-none"
                      />
                      <select
                        value={convertData.fromUnit}
                        onChange={(e) => setConvertData({ ...convertData, fromUnit: e.target.value })}
                        className="bg-white px-3 py-2 rounded-xl border border-gray-200 font-bold text-sm"
                      >
                        {(convertData.type === "liquid" ? LIQUID_UNITS : SOLID_UNITS).map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                      <ArrowRightLeft className="w-5 h-5 rotate-90" />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-2xl font-black text-amber-600">
                        {getConvertedValue().toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </div>
                      <select
                        value={convertData.toUnit}
                        onChange={(e) => setConvertData({ ...convertData, toUnit: e.target.value })}
                        className="bg-white px-3 py-2 rounded-xl border border-amber-200 font-bold text-sm"
                      >
                        {(convertData.type === "liquid" ? LIQUID_UNITS : SOLID_UNITS).map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Item Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-500"
            >
              <div className="bg-purple-500 p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl flex items-center gap-2">
                  <Store className="w-6 h-6" /> Item Shop
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-white font-black text-sm">
                    <Coins className="w-4 h-4" /> {state.coins}
                  </div>
                  <button onClick={() => setShowShop(false)} className="text-white/80 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {SHOP_ITEMS.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-800">{item.name}</h4>
                        <p className="text-xs font-bold text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleBuyShopItem(item)}
                        disabled={state.coins < item.price}
                        className="bg-purple-500 text-white px-4 py-2 rounded-xl font-black text-sm shadow-md active:scale-95 transition-transform border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 flex items-center gap-1"
                      >
                        <Coins className="w-4 h-4" /> {item.price}
                      </button>
                      {state.coins < item.price && (
                        <span className="text-[10px] font-bold text-red-500 uppercase">Not enough coins</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <h4 className="font-black text-gray-700 mb-2">Your Inventory</h4>
                <div className="flex flex-wrap gap-2">
                  {state.inventory.length > 0 ? (
                    state.inventory.map((item, idx) => (
                      <div key={idx} className="bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 font-bold">Inventory is empty.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buy Confirmation Modal */}
      <AnimatePresence>
        {itemToBuy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-500 p-6 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <ShoppingCart className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Confirm Purchase</h3>
                <p className="text-gray-500 font-bold">
                  Are you sure you want to mark <span className="text-amber-600">"{state.marketItems.find(i => i.id === itemToBuy)?.name}"</span> as purchased?
                </p>
                <p className="text-sm font-black text-red-500 uppercase tracking-widest">
                  Cost: {state.userProfile?.currency} {state.marketItems.find(i => i.id === itemToBuy)?.price || 0}
                </p>

                {state.walletBalance < (state.marketItems.find(i => i.id === itemToBuy)?.price || 0) && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Insufficient funds in bank! Please deposit money first in City Bank.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setItemToBuy(null)}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleBuyItem(itemToBuy)}
                  disabled={state.walletBalance < (state.marketItems.find(i => i.id === itemToBuy)?.price || 0)}
                  className="flex-1 bg-amber-500 text-white py-4 rounded-2xl font-black shadow-md active:scale-95 transition-transform border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
