import Dexie, { Table } from 'dexie';

export interface Transaction {
  id?: number;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  account: string;
  date: string;
  note?: string;
  mood: 'happy' | 'neutral' | 'sad';
}

export interface Account {
  id?: number;
  name: string;
  balance: number;
}

export interface Budget {
  id?: number;
  category: string;
  limit: number;
  month: string; // YYYY-MM
}

export interface Goal {
  id?: number;
  name: string;
  target_amount: number;
  current_amount: number;
}

export class MooderiaCoinDB extends Dexie {
  transactions!: Table<Transaction>;
  accounts!: Table<Account>;
  budgets!: Table<Budget>;
  goals!: Table<Goal>;

  constructor() {
    super('MooderiaCoinDB');
    this.version(1).stores({
      transactions: '++id, type, category, date',
      accounts: '++id, name',
      budgets: '++id, category, month',
      goals: '++id, name'
    });
  }
}

export const db = new MooderiaCoinDB();

// Initialize default account if not exists
export async function initDB() {
  const accountCount = await db.accounts.count();
  if (accountCount === 0) {
    await db.accounts.add({
      name: 'Cash',
      balance: 0
    });
  }
}
