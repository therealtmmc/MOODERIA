import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Transaction } from '../db';
import { format, parseISO } from 'date-fns';
import { useStore } from '../../context/StoreContext';
import { Search } from 'lucide-react';
import { TransactionModal } from '../components/TransactionModal';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢'
};

export default function History() {
  const { state } = useStore();
  const user = state.profile;
  const currency = user?.coinCurrency || '$';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const transactions = useLiveQuery(() => 
    db.transactions.orderBy('date').reverse().toArray()
  );

  const filteredTransactions = transactions?.filter(t => 
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <header>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">History</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold">All your transactions</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-100 dark:border-gray-800 focus:border-primary focus:outline-none font-bold text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {!filteredTransactions?.length ? (
          <div className="text-center py-8 text-gray-400 font-bold">
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedTransaction(t)}
              className="clay-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors"
            >
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

      {selectedTransaction && (
        <TransactionModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </div>
  );
}
