import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../../context/StoreContext';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢'
};

export default function Dashboard() {
  const { state } = useStore();
  const user = state.profile;
  const accounts = useLiveQuery(() => db.accounts.toArray());
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().limit(10).toArray());

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  
  // Calculate this month's income/expense
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = useLiveQuery(() => 
    db.transactions.filter(t => t.date.startsWith(currentMonth)).toArray()
  ) || [];

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const currency = user?.coinCurrency || '$';

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Welcome back, {user?.name.split(' ')[0]}</p>
        </div>
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20" />
        ) : (
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Wallet className="w-6 h-6" />
          </div>
        )}
      </header>

      {/* Total Balance Card */}
      <div className="clay-card p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-none shadow-primary/30 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary-light mb-2">Total Balance</h2>
        <div className="text-5xl font-black mb-6">{currency}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-1 text-green-300 mb-1">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Income</span>
            </div>
            <div className="font-black">{currency}{income.toLocaleString()}</div>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-1 text-red-300 mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Expense</span>
            </div>
            <div className="font-black">{currency}{expense.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black dark:text-white">Recent Transactions</h2>
        </div>
        
        <div className="space-y-4">
          {transactions?.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-bold">
              <p>No transactions yet.</p>
            </div>
          ) : (
            transactions?.map(t => (
              <div key={t.id} className="clay-card p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${t.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  {MOOD_EMOJIS[t.mood] || '💰'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">{t.category}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{format(parseISO(t.date), 'MMM d, yyyy')} • {t.account}</p>
                </div>
                <div className={`font-black ${t.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
