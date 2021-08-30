import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import logger from 'redux-logger';

import {
  addTransaction,
  fetchTransactions,
  removeTransaction,
  transactionReducer
} from './reducers/transactions';
import { AppState } from './types';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {}
      },
      logger,
      serializableCheck: false
    }),
  reducer: {
    transaction: transactionReducer
  }
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: AppState) => TSelected
) => useSelector<AppState, TSelected>(selector);

export { addTransaction, fetchTransactions, removeTransaction };

export default store;
