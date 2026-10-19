import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { MAX_BORROWED_BOOKS } from '../../config/constants';
import type { BorrowedBookView } from '../../types';

export const selectAllBooks = (state: RootState) => state.books.items;
export const selectBorrowedEntries = (state: RootState) => state.books.borrowed;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectNotice = (state: RootState) => state.books.notice;

export const selectBorrowedCount = createSelector([selectBorrowedEntries], (entries) => entries.length);

export const selectRemainingSlots = createSelector([selectBorrowedCount], (count) =>
  Math.max(0, MAX_BORROWED_BOOKS - count),
);

export const selectBorrowedIds = createSelector(
  [selectBorrowedEntries],
  (entries): ReadonlySet<string> => new Set(entries.map((entry) => entry.bookId)),
);

export const selectBorrowedBooks = createSelector(
  [selectAllBooks, selectBorrowedEntries],
  (books, entries): BorrowedBookView[] =>
    entries.flatMap((entry) => {
      const book = books.find((item) => item.id === entry.bookId);
      if (!book) {
        return [];
      }

      return [
        {
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          borrowedAt: entry.borrowedAt,
        },
      ];
    }),
);
