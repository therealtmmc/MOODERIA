import { useState } from"react";
import { ShoppingCart, Skull, Zap, ArrowUpCircle, UserCircle, Key, Palette } from"lucide-react";
import { useStore } from"@/context/StoreContext";

const MARKET_ITEMS = [
 { id:"root_key", name:"Root Access Key", price: 500, icon: Key, desc:"Decrypts project_mk.txt" },
 { id:"rename_token", name:"Forged Identity (Rename)", price: 500, icon: UserCircle, desc:"Change your citizen name." },
 { id:"theme_amber", name:"Amber Monochrome Theme", price: 1500, icon: Palette, desc:"Terminal cosmetic override." },
 { id:"theme_cyan", name:"Cyan Override Theme", price: 1500, icon: Palette, desc:"Terminal cosmetic override." },
 { id:"rank_up", name:"System Override (+1 Rank)", price: 2000, icon: ArrowUpCircle, desc:"Instantly rank up your city level." },
 { id:"exp_small", name:"Data Packet (Small EXP)", price: 100, icon: Zap, desc:"Grants +50 EXP." },
 { id:"exp_medium", name:"Data Drive (Medium EXP)", price: 300, icon: Zap, desc:"Grants +200 EXP." },
 { id:"exp_large", name:"Data Core (Large EXP)", price: 800, icon: Zap, desc:"Grants +600 EXP." },
];

export function ContrabandMarket({ onClose }: { onClose: () => void }) {
 const { state, dispatch } = useStore();

 const handleBuy = (item: typeof MARKET_ITEMS[0]) => {
 if (state.coins >= item.price) {
 let iconName ="Zap";
 if (item.id ==="rename_token") iconName ="UserCircle";
 if (item.id ==="rank_up") iconName ="ArrowUpCircle";
 if (item.id ==="root_key") iconName ="Key";
 if (item.id.startsWith("theme_")) iconName ="Palette";

 if (item.id ==="rename_token") {
 const newName = prompt("Enter your new forged identity (name):");
 if (newName && newName.trim()) {
 dispatch({ type:"SET_PROFILE", payload: { ...state.userProfile, name: newName.trim() } as any });
 dispatch({ type:"BUY_SHOP_ITEM", payload: { id: item.id, name: item.name, icon: iconName, price: item.price } });
 }
 } else {
 dispatch({ type:"BUY_SHOP_ITEM", payload: { id: item.id, name: item.name, icon: iconName, price: item.price } });
 }
 }
 };

 return (
 <div className="bg-black/95 backdrop-blur-xl rounded-none sm:rounded-xl border-red-500/50 p-4 sm:p-6 font-mono text-red-500 h-[75vh] min-h-[400px] max-h-[600px] flex flex-col shadow-[0_0_30px_rgba(255,0,0,0.15)] relative overflow-hidden">
 {/* Scanline effect */}
 <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10"></div>
 
 <div className="flex justify-between items-center -b border-red-500/30 pb-3 sm:pb-4 mb-4 sm:mb-6 relative z-20">
 <div className="flex items-center gap-2 sm:gap-3">
 <Skull className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse text-red-600 shrink-0" />
 <div>
 <h2 className="text-base sm:text-2xl font-black tracking-widest uppercase text-red-500">The Underground</h2>
 <div className="text-[10px] sm:text-xs text-red-500/70">Encrypted P2P Marketplace</div>
 </div>
 </div>
 <div className="flex flex-col items-end shrink-0">
 <div className="text-xs sm:text-sm font-bold text-yellow-500 flex items-center gap-1 sm:gap-2">
 <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
 {state.coins} CC
 </div>
 <button onClick={onClose} className="text-[10px] sm:text-xs text-red-500/50 hover:text-red-500 mt-1 uppercase tracking-widest">
 [ EXIT ]
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 sm:space-y-4 relative z-20">
 {MARKET_ITEMS.map((item) => {
 const Icon = item.icon;
 const isOwned = (item.id ==="root_key" && state.inventory.some(i => i.id ==="root_key")) ||
 (item.id ==="theme_amber" && state.terminalTheme ==="amber") ||
 (item.id ==="theme_cyan" && state.terminalTheme ==="cyan");
 const canAfford = state.coins >= item.price;
 const isDisabled = isOwned || !canAfford;

 return (
 <div key={item.id} className="bg-red-950/20 border-red-500/20 p-3 sm:p-4 rounded-lg flex items-center justify-between hover:-red-500/50 transition-colors group gap-2">
 <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
 <div className="p-2 sm:p-3 bg-red-900/30 rounded-md group-hover:bg-red-900/50 transition-colors shrink-0">
 <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
 </div>
 <div className="min-w-0">
 <h3 className="font-bold text-red-400 text-sm sm:text-lg truncate">{item.name}</h3>
 <p className="text-[10px] sm:text-xs text-red-500/60 mt-0.5 sm:mt-1 truncate">{item.desc}</p>
 </div>
 </div>
 
 <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
 <div className="text-yellow-500 font-bold font-mono text-xs sm:text-sm">{item.price} CC</div>
 <button
 onClick={() => handleBuy(item)}
 disabled={isDisabled}
 className={`px-2 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded transition-all ${
 isOwned
 ?'bg-red-900/50 border-red-900/50 text-red-500/50 cursor-not-allowed'
 : canAfford
 ?'bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-black'
 :'bg-transparent border-red-900 text-red-900 cursor-not-allowed'
 }`}
 >
 {isOwned ?'Acquired' :'Purchase'}
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}
