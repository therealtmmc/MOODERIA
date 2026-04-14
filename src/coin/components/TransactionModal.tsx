import React from 'react';
import { X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '../db';
import { useStore } from '@/context/StoreContext';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢'
};

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const { state } = useStore();
  const currency = state.profile?.coinCurrency || '$';

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 space-y-6 animate-in zoom-in-95 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-4">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${transaction.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            {MOOD_EMOJIS[transaction.mood] || '💰'}
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{transaction.category}</h2>
          <div className={`text-3xl font-black ${transaction.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
            {transaction.type === 'income' ? '+' : '-'}{currency}{transaction.amount.toLocaleString()}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400">Date</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {format(parseISO(transaction.date), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400">Account</span>
            <span className="font-bold text-gray-900 dark:text-white">{transaction.account}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400">Type</span>
            <span className="font-bold text-gray-900 dark:text-white capitalize">{transaction.type}</span>
          </div>
          
          {transaction.note && (
            <div className="pt-2">
              <span className="block text-sm font-bold text-gray-400 mb-2">Notes</span>
              <p className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-700 dark:text-gray-300 text-sm">
                {transaction.note}
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
}
