import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '../../context/StoreContext';

export default function Budgets() {
  const { state } = useStore();
  const user = state.profile;
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const budgets = useLiveQuery(() => db.budgets.filter(b => b.month === currentMonth).toArray());
  const transactions = useLiveQuery(() => 
    db.transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)).toArray()
  );

  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const handleAdd = async () => {
    if (!limit || isNaN(Number(limit))) return;
    
    await db.budgets.add({
      category,
      limit: Number(limit),
      month: currentMonth
    });
    
    setIsAdding(false);
    setLimit('');
  };

  const handleDelete = async (id: number) => {
    await db.budgets.delete(id);
  };

  const currency = user?.coinCurrency || '$';

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Smart spending limits</p>
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
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
            >
              {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monthly Limit ({currency})</label>
            <input 
              type="number" 
              value={limit}
              onChange={e => setLimit(e.target.value)}
              placeholder="0.00"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
            />
          </div>
          <button 
            onClick={handleAdd}
            disabled={!limit || isNaN(Number(limit))}
            className="btn-primary w-full disabled:opacity-50"
          >
            Create Budget
          </button>
        </div>
      )}

      <div className="space-y-4">
        {budgets?.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-bold">
            <p>No budgets set for this month.</p>
          </div>
        ) : (
          budgets?.map(budget => {
            const spent = transactions?.filter(t => t.category === budget.category).reduce((sum, t) => sum + t.amount, 0) || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isOver = spent > budget.limit;

            return (
              <div key={budget.id} className="clay-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg dark:text-white">{budget.category}</h3>
                  <button onClick={() => budget.id && handleDelete(budget.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className={isOver ? 'text-red-500' : 'text-gray-500'}>
                    {currency}{spent.toLocaleString()} spent
                  </span>
                  <span className="text-gray-400">
                    {currency}{budget.limit.toLocaleString()}
                  </span>
                </div>

                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOver ? "bg-red-500" : percentage > 80 ? "bg-orange-500" : "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
