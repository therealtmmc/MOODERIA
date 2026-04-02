import { useState, useEffect } from"react";
import { useStore, SavingsGoal, Transaction } from"@/context/StoreContext";
import { Plus, Trash2, X, PiggyBank, TrendingUp, History, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, PieChart, Target, AlertTriangle, HelpCircle } from"lucide-react";
import { motion, AnimatePresence } from"motion/react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from"date-fns";
import { cn } from"@/lib/utils";
import confetti from"canvas-confetti";
import { SuccessAnimation } from"@/components/SuccessAnimation";

export default function SavingsPage() {
 const { state, dispatch } = useStore();
 const [showAddGoal, setShowAddGoal] = useState(false);
 const [showTransactionModal, setShowTransactionModal] = useState(false);
 const [showTutorial, setShowTutorial] = useState(false);
 const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
 const [addAmount, setAddAmount] = useState("");
 const [successType, setSuccessType] = useState<"savings" |"savings_goal" |"transaction" | null>(null);
 const [successStats, setSuccessStats] = useState("");

 useEffect(() => {
 if (!state.hasSeenBankTutorial) {
 setShowTutorial(true);
 }
 }, [state.hasSeenBankTutorial]);

 const handleCloseTutorial = () => {
 setShowTutorial(false);
 dispatch({ type:"SET_BANK_TUTORIAL_SEEN" });
 };

 // Transaction State
 const [transactionAmount, setTransactionAmount] = useState("");
 const [transactionType, setTransactionType] = useState<"income" |"expense">("expense");
 const [transactionCategory, setTransactionCategory] = useState<Transaction["category"]>("Food");
 const [transactionNote, setTransactionNote] = useState("");

 const [newGoal, setNewGoal] = useState<{ name: string; target: string; icon: string }>({
 name:"",
 target:"",
 icon:"💰",
 });

 const handleAddGoal = () => {
 if (!newGoal.name || !newGoal.target) return;

 dispatch({
 type:"ADD_SAVINGS",
 payload: {
 id: crypto.randomUUID(),
 name: newGoal.name,
 targetAmount: parseFloat(newGoal.target),
 currentAmount: 0,
 icon: newGoal.icon,
 history: [],
 },
 });
 setShowAddGoal(false);
 setNewGoal({ name:"", target:"", icon:"💰" });
 setSuccessType("savings_goal");
 setSuccessStats(`Net Worth +5 (Goal"${newGoal.name}" created!)`);
 };

 const handleAddTransaction = () => {
 const amount = parseFloat(transactionAmount);
 if (isNaN(amount) || amount <= 0) return;

 dispatch({
 type:"UPDATE_WALLET",
 payload: {
 amount,
 type: transactionType,
 category: transactionCategory,
 note: transactionNote
 }
 });

 setShowTransactionModal(false);
 setTransactionAmount("");
 setTransactionNote("");
 setSuccessType("transaction");
 setSuccessStats(transactionType ==="income" ? `Net Worth +${amount}` : `Net Worth -${amount}`);
 };

 const handleAddMoneyToGoal = () => {
 if (!selectedGoal || !addAmount) return;

 const amount = parseFloat(addAmount);
 if (isNaN(amount) || amount <= 0) return;

 // Check if user has enough money in wallet
 if (state.walletBalance < amount) {
 alert("Not enough money in wallet!");
 return;
 }

 // Deduct from wallet
 dispatch({
 type:"UPDATE_WALLET",
 payload: {
 amount,
 type:"expense",
 category:"Savings Deposit",
 note: `Deposit to ${selectedGoal.name}`
 }
 });

 // Add to savings
 dispatch({
 type:"ADD_SAVINGS_ENTRY",
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
 colors: ["#FFD700","#26890c"],
 });
 } else {
 setSuccessType("savings");
 setSuccessStats(`Net Worth +1`);
 }

 setAddAmount("");
 };

 // Get live version of selected goal
 const activeGoal = selectedGoal ? state.savings.find(s => s.id === selectedGoal.id) : null;
 const currency = state.userProfile?.currency ||"ISO";
 const totalWealth = state.walletBalance + state.savings.reduce((acc, s) => acc + s.currentAmount, 0);

 return (
 <div className="p-4 pt-8 pb-24 space-y-6">
 <SuccessAnimation 
 type={successType ||"savings"} 
 isVisible={!!successType} 
 onComplete={() => {setSuccessType(null); setSuccessStats("");}} 
 stats={successStats}
 />
 
 <header className="flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-black text-[#d4af37]">City Bank</h1>
 <p className="text-gray-500 font-bold">Manage Your Wealth</p>
 </div>
 <button
 onClick={() => setShowTutorial(true)}
 className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"
 >
 <HelpCircle className="w-6 h-6" />
 </button>
 </header>

 {/* Tutorial Modal */}
 <AnimatePresence>
 {showTutorial && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="bg-[#d4af37] p-4 flex justify-between items-center">
 <h3 className="text-white font-black text-xl">Welcome to City Bank!</h3>
 <button onClick={handleCloseTutorial} className="text-white/80 hover:text-white">
 <X className="w-6 h-6" />
 </button>
 </div>
 <div className="p-6 space-y-4 text-gray-700">
 <p className="font-bold">Here you can manage your finances:</p>
 <ul className="list-disc list-inside space-y-2 text-sm font-medium">
 <li>Track your income and expenses.</li>
 <li>Set savings goals and watch them grow.</li>
 <li>See your total net worth.</li>
 </ul>
 <button
 onClick={handleCloseTutorial}
 className="w-full mt-4 bg-[#d4af37] text-white py-3 rounded-xl font-black active:scale-95 transition-transform"
 >
 Got it!
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Net Worth Card */}
 <div className="bg-gradient-to-br from-[#d4af37] to-[#b4941f] p-6 rounded-3xl text-white relative overflow-hidden">
 <div className="relative z-10">
 <p className="text-yellow-100 font-bold text-xs uppercase tracking-wider mb-1">Net Worth</p>
 <h2 className="text-4xl font-black">{currency} {totalWealth.toLocaleString()}</h2>
 <p className="text-yellow-100/80 text-xs font-bold mt-1">Total Assets (Wallet + Savings)</p>
 </div>
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
 <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-900/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
 </div>

 {/* Wallet Card */}
 <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl text-white relative overflow-hidden">
 <div className="relative z-10">
 <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total Balance</p>
 <h2 className="text-4xl font-black mb-6">{currency} {state.walletBalance.toLocaleString()}</h2>
 
 <div className="flex gap-3">
 <button 
 onClick={() => {
 setTransactionType("income");
 setShowTransactionModal(true);
 }}
 className="flex-1 bg-green-500/20 hover:bg-green-500/30 border-green-500/50 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
 >
 <ArrowDownLeft className="w-5 h-5 text-green-400" />
 <span className="font-bold text-green-100">Income</span>
 </button>
 <button 
 onClick={() => {
 setTransactionType("expense");
 setShowTransactionModal(true);
 }}
 className="flex-1 bg-red-500/20 hover:bg-red-500/30 border-red-500/50 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
 >
 <ArrowUpRight className="w-5 h-5 text-red-400" />
 <span className="font-bold text-red-100">Expense</span>
 </button>
 </div>
 </div>
 
 {/* Decorative Circles */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
 <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
 </div>

 {/* Recent Transactions */}
 <div>
 <h3 className="font-black text-gray-700 text-lg mb-3 flex items-center gap-2">
 <History className="w-5 h-5" /> Recent Activity
 </h3>
 <div className="space-y-3">
 {state.transactions.length === 0 ? (
 <p className="text-gray-400 text-sm italic text-center py-4">No transactions yet.</p>
 ) : (
 state.transactions.slice(0, 5).map(t => (
 <div key={t.id} className="bg-white p-4 rounded-2xl flex justify-between items-center">
 <div className="flex items-center gap-3">
 <div className={cn(
"w-10 h-10 rounded-full flex items-center justify-center text-lg",
 t.type ==="income" ?"bg-green-100 text-green-600" :"bg-red-100 text-red-600"
 )}>
 {t.type ==="income" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
 </div>
 <div>
 <p className="font-bold text-gray-800">{t.category}</p>
 <p className="text-xs text-gray-400">{format(new Date(t.date),"MMM d, h:mm a")}</p>
 </div>
 </div>
 <span className={cn(
"font-black text-lg",
 t.type ==="income" ?"text-green-600" :"text-red-600"
 )}>
 {t.type ==="income" ?"+" :"-"}{currency} {t.amount.toLocaleString()}
 </span>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Savings Goals Header */}
 <div className="flex justify-between items-center pt-4">
 <h3 className="font-black text-gray-700 text-lg flex items-center gap-2">
 <PiggyBank className="w-5 h-5 text-[#26890c]" /> Savings Goals
 </h3>
 <button
 onClick={() => setShowAddGoal(true)}
 className="bg-[#26890c] text-white p-2 rounded-lg active:scale-95 transition-transform"
 >
 <Plus className="w-5 h-5" />
 </button>
 </div>

 {/* Goals Grid */}
 <div className="grid grid-cols-1 gap-4">
 {state.savings.length === 0 ? (
 <div className="text-center py-8 opacity-50 -dashed rounded-2xl">
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
 className="bg-white p-5 rounded-3xl active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
 >
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
 {goal.icon}
 </div>
 <div>
 <h3 className="font-black text-lg text-gray-800">{goal.name}</h3>
 <p className="text-xs font-bold text-gray-400 uppercase">Target: {currency} {goal.targetAmount.toLocaleString()}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="font-black text-xl text-[#26890c]">{currency} {goal.currentAmount.toLocaleString()}</p>
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
 </motion.div>
 );
 })
 )}
 </div>

 {/* Add Goal Modal */}
 <AnimatePresence>
 {showAddGoal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="bg-[#26890c] p-4 flex justify-between items-center">
 <h3 className="text-white font-black text-xl">New Savings Goal</h3>
 <button onClick={() => setShowAddGoal(false)} className="text-white/80 hover:text-white">
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
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold"
 placeholder="e.g., New Laptop"
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Target Amount ({currency})</label>
 <input
 type="number"
 value={newGoal.target}
 onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
 className="w-full p-3 bg-gray-50 rounded-xl focus: focus:outline-none font-bold"
 placeholder="1000"
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Icon</label>
 <div className="flex gap-2 overflow-x-auto pb-2">
 {["💰","🚗","🏠","💻","✈️","🎁","🎓"].map(icon => (
 <button
 key={icon}
 onClick={() => setNewGoal({ ...newGoal, icon })}
 className={cn(
"w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xl transition-all",
 newGoal.icon === icon ?"bg-green-100" :"bg-gray-50"
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
 className="w-full mt-4 bg-[#26890c] text-white py-3 rounded-xl font-black active:scale-95 transition-transform disabled:opacity-50"
 >
 Create Goal
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Transaction Modal */}
 <AnimatePresence>
 {showTransactionModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-gray-800"
 >
 <div className={cn(
"p-4 flex justify-between items-center",
 transactionType ==="income" ?"bg-green-600" :"bg-red-600"
 )}>
 <h3 className="text-white font-black text-xl">
 Add {transactionType ==="income" ?"Income" :"Expense"}
 </h3>
 <button onClick={() => setShowTransactionModal(false)} className="text-white/80 hover:text-white">
 <X className="w-6 h-6" />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Amount ({currency})</label>
 <input
 type="number"
 value={transactionAmount}
 onChange={(e) => setTransactionAmount(e.target.value)}
 className="w-full p-3 bg-gray-50 rounded-xl focus:-gray-800 focus:outline-none font-bold text-2xl"
 placeholder="0.00"
 autoFocus
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Category</label>
 <div className="grid grid-cols-2 gap-2">
 {(transactionType ==="income" 
 ? ["Salary","Gift","Initial Balance","Other"] 
 : ["Food","Transport","Bills","Other"]
 ).map((cat) => (
 <button
 key={cat}
 onClick={() => setTransactionCategory(cat as any)}
 className={cn(
"p-2 rounded-lg text-xs font-bold transition-all",
 transactionCategory === cat 
 ?"bg-gray-800 text-white border-gray-800" 
 :"bg-white text-gray-500 hover:-gray-300"
 )}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>
 <div>
 <label className="block text-sm font-bold text-gray-500 mb-1">Note (Optional)</label>
 <input
 type="text"
 value={transactionNote}
 onChange={(e) => setTransactionNote(e.target.value)}
 className="w-full p-3 bg-gray-50 rounded-xl focus:-gray-800 focus:outline-none font-bold"
 placeholder="e.g., Lunch"
 />
 </div>
 <button
 onClick={handleAddTransaction}
 disabled={!transactionAmount}
 className={cn(
"w-full mt-4 text-white py-3 rounded-xl font-black active:scale-95 transition-transform disabled:opacity-50",
 transactionType ==="income" ?"bg-green-600" :"bg-red-600"
 )}
 >
 Save Transaction
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
 className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
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
 <h2 className="text-4xl font-black text-[#26890c] mb-2">{currency} {activeGoal.currentAmount.toLocaleString()}</h2>
 <p className="text-gray-500 font-bold text-sm">of {currency} {activeGoal.targetAmount.toLocaleString()} goal</p>
 
 <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
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
 <div className="bg-green-50 p-4 rounded-2xl border-green-100 mb-6">
 <label className="block text-xs font-bold text-green-700 uppercase mb-2">Deposit from Wallet</label>
 <div className="flex gap-2">
 <div className="relative flex-1">
 <DollarSign className="absolute left-3 top-3 w-4 h-4 text-green-600" />
 <input
 type="number"
 value={addAmount}
 onChange={(e) => setAddAmount(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border-green-200 focus: focus:outline-none font-bold text-green-800 placeholder-green-200"
 placeholder="0.00"
 />
 </div>
 <button
 onClick={handleAddMoneyToGoal}
 className="bg-[#26890c] text-white px-4 rounded-xl font-black active:scale-95 transition-transform"
 >
 Deposit
 </button>
 </div>
 <p className="text-[10px] text-green-600 mt-2 font-bold">
 Wallet Balance: {currency} {state.walletBalance.toLocaleString()}
 </p>
 </div>

 {/* History Timeline */}
 <div>
 <h4 className="font-black text-gray-700 flex items-center gap-2 mb-4">
 <History className="w-4 h-4" /> History
 </h4>
 <div className="space-y-4 relative pl-4 -l-2">
 {activeGoal.history.length === 0 ? (
 <p className="text-gray-400 text-xs font-medium italic">No deposits yet.</p>
 ) : (
 [...activeGoal.history].reverse().map((entry) => (
 <div key={entry.id} className="relative">
 <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-200 border-white" />
 <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
 <div>
 <p className="font-bold text-gray-800 text-sm">Deposit</p>
 <p className="text-[10px] font-bold text-gray-400">{format(new Date(entry.date),"MMM d, yyyy • h:mm a")}</p>
 </div>
 <span className="font-black text-[#26890c]">+{currency} {entry.amount.toLocaleString()}</span>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 
 <div className="p-4 -t bg-gray-50">
 <button
 onClick={() => {
 if(confirm("Delete this savings goal?")) {
 dispatch({ type:"DELETE_SAVINGS", payload: activeGoal.id });
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
