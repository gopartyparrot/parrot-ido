import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionState } from '../types';

const initialState: TransactionState = {
  transactions: []
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchTransactions: (state, action: PayloadAction<string>) => {
      let transactions: Transaction[] = [];
      try {
        transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      } catch {
        // ignore
      }
      state.transactions = transactions.filter(i => i.owner === action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        i => i.txId !== action.payload
      );
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      // TODO: for now we store only the last transaction
      state.transactions = [action.payload];
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }
  }
});

// Actions
const {
  actions: { addTransaction, fetchTransactions, removeTransaction },
  reducer: transactionReducer
} = transactionSlice;

export {
  addTransaction,
  fetchTransactions,
  removeTransaction,
  transactionReducer
};
