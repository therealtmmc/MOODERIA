import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Trash2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '../../context/StoreContext';

export default function Goals() {
  const { state } = useStore();
  const user = state.profile;
  const goals = useLiveQuery(() => db.goals.toArray());

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [addFundsId, setAddFundsId] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  const handleAddGoal = async () => {
    if (!name || !targetAmount || isNaN(Number(targetAmount))) return;
    
    await db.goals.add({
      name,
      target_amount: Number(targetAmount),
      current_amount: 0
    });
    
    setIsAdding(false);
    setName('');
    setTargetAmount('');
  };

  const handleAddFunds = async (id: number, current: number) => {
    if (!fundAmount || isNaN(Number(fundAmount))) return;
    await db.goals.update(id, { current_amount: current + Number(fundAmount) });
    setAddFundsId(null);
    setFundAmount('');
  };

  const handleDelete = async (id: number) => {
    await db.goals.delete(id);
  };

  const currency = user?.coinCurrency || '$';

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Save for your dreams</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className={cn("w-6 h-6 transition-transform", isAdding && "rotate-45")} />
        </button>
      </header>

      {isAdding && (
        <div className="clay-card p-6 space-y-4 animate-in slide-in-from-top-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Goal Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., New Laptop"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Amount ({currency})</label>
            <input 
              type="number" 
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
            />
          </div>
          <button 
            onClick={handleAddGoal}
            disabled={!name || !targetAmount || isNaN(Number(targetAmount))}
            className="btn-primary w-full disabled:opacity-50"
          >
            Create Goal
          </button>
        </div>
      )}

      <div className="space-y-4">
        {goals?.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-bold">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No financial goals set.</p>
          </div>
        ) : (
          goals?.map(goal => {
            const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
            const isComplete = percentage >= 100;

            return (
              <div key={goal.id} className="clay-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg dark:text-white">{goal.name}</h3>
                  <button onClick={() => goal.id && handleDelete(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className={isComplete ? 'text-green-500' : 'text-primary'}>
                    {currency}{goal.current_amount.toLocaleString()} saved
                  </span>
                  <span className="text-gray-400">
                    {currency}{goal.target_amount.toLocaleString()}
                  </span>
                </div>

                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete ? "bg-green-500" : "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {addFundsId === goal.id ? (
                  <div className="flex gap-2 animate-in fade-in">
                    <input 
                      type="number" 
                      value={fundAmount}
                      onChange={e => setFundAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
                    />
                    <button 
                      onClick={() => handleAddFunds(goal.id!, goal.current_amount)}
                      className="px-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-transform"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setAddFundsId(null)}
                      className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold rounded-xl active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddFundsId(goal.id!)}
                    disabled={isComplete}
                    className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {isComplete ? 'Goal Reached! 🎉' : 'Add Funds'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
