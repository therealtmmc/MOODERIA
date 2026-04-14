import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other']
};

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'sad', emoji: '😢', label: 'Sad' }
];

export default function AddTransaction() {
  const navigate = useNavigate();
  const { state } = useStore();
  const user = state.profile;
  const accounts = useLiveQuery(() => db.accounts.toArray());

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [account, setAccount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');

  // Set default account when accounts load
  React.useEffect(() => {
    if (accounts && accounts.length > 0 && !account) {
      setAccount(accounts[0].name);
    }
  }, [accounts, account]);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || !account) return;

    const numAmount = Number(amount);

    await db.transaction('rw', db.transactions, db.accounts, async () => {
      // Add transaction
      await db.transactions.add({
        amount: numAmount,
        type,
        category,
        account,
        date,
        note,
        mood
      });

      // Update account balance
      const acc = await db.accounts.where('name').equals(account).first();
      if (acc && acc.id) {
        const newBalance = type === 'income' ? acc.balance + numAmount : acc.balance - numAmount;
        await db.accounts.update(acc.id, { balance: newBalance });
      }
    });

    navigate('/coin');
  };

  const currency = user?.coinCurrency || '$';

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/coin')}
          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Add Transaction</h1>
      </header>

      {/* Type Toggle */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <button
          onClick={() => { setType('expense'); setCategory(CATEGORIES.expense[0]); }}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold transition-all",
            type === 'expense' ? "bg-white dark:bg-gray-900 text-red-500 shadow-sm" : "text-gray-500"
          )}
        >
          Expense
        </button>
        <button
          onClick={() => { setType('income'); setCategory(CATEGORIES.income[0]); }}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold transition-all",
            type === 'income' ? "bg-white dark:bg-gray-900 text-green-500 shadow-sm" : "text-gray-500"
          )}
        >
          Income
        </button>
      </div>

      <div className="clay-card p-6 space-y-6">
        {/* Amount */}
        <div className="text-center">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Amount</label>
          <div className="flex items-center justify-center text-5xl font-black mt-2 text-gray-900 dark:text-white">
            <span className="text-gray-400 mr-1">{currency}</span>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full max-w-[200px] bg-transparent border-none outline-none text-center p-0 focus:ring-0"
              autoFocus
            />
          </div>
        </div>

        {/* Category & Account */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none appearance-none"
            >
              {CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Account</label>
            <select 
              value={account}
              onChange={e => setAccount(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none appearance-none"
            >
              {accounts?.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">How did you feel?</label>
          <div className="flex gap-4">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id as any)}
                className={cn(
                  "flex-1 py-4 rounded-2xl text-2xl transition-all border-2",
                  mood === m.id 
                    ? "bg-primary/10 border-primary shadow-sm scale-105" 
                    : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Note (Optional)</label>
          <input 
            type="text" 
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What was this for?"
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={!amount || isNaN(Number(amount))}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Check className="w-5 h-5" /> Save Transaction
        </button>
      </div>
    </div>
  );
}
