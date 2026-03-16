import { useState } from "react";
import { ShoppingCart, Skull, Key, FileText, ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const MARKET_ITEMS = [
  { id: "root_key", name: "Root Access Key", price: 500, icon: Key, desc: "Decrypts project_mk.txt" },
  { id: "lore_doc_1", name: "Encrypted Lore: The Fall", price: 150, icon: FileText, desc: "A hidden document from the old world." },
  { id: "ad_blocker", name: "Neural Ad-Blocker", price: 300, icon: ShieldAlert, desc: "Blocks Overseer broadcasts for 24 hours." },
  { id: "fake_id", name: "Forged Passport", price: 1000, icon: Skull, desc: "Change your citizen ID." },
];

export function ContrabandMarket({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [purchased, setPurchased] = useState<string[]>([]);

  const handleBuy = (item: typeof MARKET_ITEMS[0]) => {
    if (state.coins >= item.price && !purchased.includes(item.id)) {
      dispatch({ type: "BUY_SHOP_ITEM", payload: { id: item.id, name: item.name, icon: item.icon.name, price: item.price } });
      setPurchased([...purchased, item.id]);
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-xl rounded-none sm:rounded-xl border border-red-500/50 p-6 font-mono text-red-500 h-[600px] flex flex-col shadow-[0_0_30px_rgba(255,0,0,0.15)] relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10"></div>
      
      <div className="flex justify-between items-center border-b border-red-500/30 pb-4 mb-6 relative z-20">
        <div className="flex items-center gap-3">
          <Skull className="w-8 h-8 animate-pulse text-red-600" />
          <div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-red-500">The Underground</h2>
            <div className="text-xs text-red-500/70">Encrypted P2P Marketplace</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-bold text-yellow-500 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {state.coins} CREDITS
          </div>
          <button onClick={onClose} className="text-xs text-red-500/50 hover:text-red-500 mt-1 uppercase tracking-widest">
            [ EXIT ]
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-20">
        {MARKET_ITEMS.map((item) => {
          const Icon = item.icon;
          const isOwned = state.inventory.some(i => i.id === item.id) || purchased.includes(item.id);
          const canAfford = state.coins >= item.price;

          return (
            <div key={item.id} className="bg-red-950/20 border border-red-500/20 p-4 rounded-lg flex items-center justify-between hover:border-red-500/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-900/30 rounded-md group-hover:bg-red-900/50 transition-colors">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-red-400 text-lg">{item.name}</h3>
                  <p className="text-xs text-red-500/60 mt-1">{item.desc}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-yellow-500 font-bold font-mono">{item.price} CR</div>
                <button
                  onClick={() => handleBuy(item)}
                  disabled={isOwned || !canAfford}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded border transition-all ${
                    isOwned 
                      ? 'bg-red-900/50 border-red-900/50 text-red-500/50 cursor-not-allowed'
                      : canAfford
                        ? 'bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-black'
                        : 'bg-transparent border-red-900 text-red-900 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? 'Acquired' : 'Purchase'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
