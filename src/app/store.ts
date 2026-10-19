import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { borrowLimitMiddleware } from '../features/books/middleware/borrowLimitMiddleware';
import booksReducer from '../features/books/booksSlice';

export const rootReducer = combineReducers({
  books: booksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(borrowLimitMiddleware),
    ...(preloadedState ? { preloadedState: preloadedState as RootState } : {}),
  });
}

export const store = createAppStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
