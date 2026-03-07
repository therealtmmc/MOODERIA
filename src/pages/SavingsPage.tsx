import { useState } from "react";
import { useStore, SavingsGoal } from "@/context/StoreContext";
import { Plus, Trash2, X, PiggyBank, TrendingUp, History, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { SuccessAnimation } from "@/components/SuccessAnimation";

export default function SavingsPage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [successType, setSuccessType] = useState<"savings" | "savings_goal" | null>(null);

  const [newGoal, setNewGoal] = useState<{ name: string; target: string; icon: string }>({
    name: "",
    target: "",
    icon: "💰",
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;

    dispatch({
      type: "ADD_SAVINGS",
      payload: {
        id: crypto.randomUUID(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.target),
        currentAmount: 0,
        icon: newGoal.icon,
        history: [],
      },
    });
    setShowAdd(false);
    setNewGoal({ name: "", target: "", icon: "💰" });
    setSuccessType("savings_goal");
  };

  const handleAddMoney = () => {
    if (!selectedGoal || !addAmount) return;

    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) return;

    dispatch({
      type: "ADD_SAVINGS_ENTRY",
      payload: {
        id: selectedGoal.id,
        amount: amount,
        date: new Date().toISOString(),
      },
    });

    // Check if goal reached
    if (selectedGoal.currentAmount + amount >= selectedGoal.targetAmount) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#26890c"],
      });
    } else {
      setSuccessType("savings");
    }

    setAddAmount("");
    // Close modal after adding? Or keep open to see progress? Let's keep open but update local state reference if needed
    // Actually, we rely on store state, so we need to find the updated goal to show correct progress in modal
    // But selectedGoal is a snapshot. We should derive it from state.
  };

  // Get live version of selected goal
  const activeGoal = selectedGoal ? state.savings.find(s => s.id === selectedGoal.id) : null;

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <SuccessAnimation 
        type={successType || "savings"} 
        isVisible={!!successType} 
        onComplete={() => setSuccessType(null)} 
      />
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#d4af37]">City Bank</h1>
          <p className="text-gray-500 font-bold">Treasury & Assets</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#26890c] text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#1a5e08] active:border-b-0 active:translate-y-1"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-4">
        {state.savings.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-400">No savings goals yet.</p>
            <p className="text-sm font-medium text-gray-400">Start saving for something special!</p>
          </div>
        ) : (
          state.savings.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <motion.div
                key={goal.id}
                layout
                onClick={() => setSelectedGoal(goal)}
                className="bg-white p-5 rounded-3xl shadow-md border-b-4 border-gray-100 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shadow-sm">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-gray-800">{goal.name}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase">Target: ${goal.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-[#26890c]">${goal.currentAmount.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-400">{Math.round(progress)}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden relative z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#26890c] to-[#4ade80] rounded-full"
                  />
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                  <PiggyBank className="w-32 h-32 transform translate-x-8 -translate-y-8" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c]"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">New Savings Goal</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold"
                    placeholder="e.g., New Laptop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Icon</label>
                  <div className="flex gap-2">
                    {["💰", "🚗", "🏠", "💻", "✈️", "🎁", "🎓"].map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewGoal({ ...newGoal, icon })}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                          newGoal.icon === icon ? "bg-green-100 border-2 border-[#26890c]" : "bg-gray-50 border border-gray-200"
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.name || !newGoal.target}
                  className="w-full mt-4 bg-[#26890c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Goal Details Modal */}
      <AnimatePresence>
        {activeGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c] max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                   <span className="text-2xl">{activeGoal.icon}</span>
                   <h3 className="text-white font-black text-xl truncate max-w-[150px]">{activeGoal.name}</h3>
                </div>
                <button onClick={() => setSelectedGoal(null)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {/* Progress Section */}
                <div className="text-center mb-8">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Current Savings</p>
                  <h2 className="text-4xl font-black text-[#26890c] mb-2">${activeGoal.currentAmount.toLocaleString()}</h2>
                  <p className="text-gray-500 font-bold text-sm">of ${activeGoal.targetAmount.toLocaleString()} goal</p>
                  
                  <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden mt-4 border border-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((activeGoal.currentAmount / activeGoal.targetAmount) * 100, 100)}%` }}
                      className="h-full bg-gradient-to-r from-[#26890c] to-[#4ade80] rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>

                {/* Add Money Form */}
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6">
                  <label className="block text-xs font-bold text-green-700 uppercase mb-2">Add Money</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-green-600" />
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-green-200 focus:border-[#26890c] focus:outline-none font-bold text-green-800 placeholder-green-200"
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      onClick={handleAddMoney}
                      className="bg-[#26890c] text-white px-4 rounded-xl font-black shadow-sm active:scale-95 transition-transform"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* History Timeline */}
                <div>
                  <h4 className="font-black text-gray-700 flex items-center gap-2 mb-4">
                    <History className="w-4 h-4" /> History
                  </h4>
                  <div className="space-y-4 relative pl-4 border-l-2 border-gray-100">
                    {activeGoal.history.length === 0 ? (
                      <p className="text-gray-400 text-xs font-medium italic">No deposits yet.</p>
                    ) : (
                      [...activeGoal.history].reverse().map((entry) => (
                        <div key={entry.id} className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-200 border-2 border-white shadow-sm" />
                          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-gray-800 text-sm">Deposit</p>
                              <p className="text-[10px] font-bold text-gray-400">{format(new Date(entry.date), "MMM d, yyyy • h:mm a")}</p>
                            </div>
                            <span className="font-black text-[#26890c]">+${entry.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                 <button
                    onClick={() => {
                        if(confirm("Delete this savings goal?")) {
                            dispatch({ type: "DELETE_SAVINGS", payload: activeGoal.id });
                            setSelectedGoal(null);
                        }
                    }}
                    className="w-full text-red-400 hover:text-red-600 font-bold text-sm flex items-center justify-center gap-2"
                 >
                    <Trash2 className="w-4 h-4" /> Delete Goal
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
