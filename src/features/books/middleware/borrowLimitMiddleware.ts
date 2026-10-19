import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { MAX_BORROWED_BOOKS } from '../../../config/constants';
import { borrowBook, borrowRejected } from '../booksSlice';

export const borrowLimitMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const { borrowed } = store.getState().books;

    if (borrowed.length >= MAX_BORROWED_BOOKS) {
      return store.dispatch(
        borrowRejected(
          `Bạn chỉ được mượn tối đa ${MAX_BORROWED_BOOKS} cuốn cùng lúc. Hãy trả bớt sách rồi mượn tiếp.`,
        ),
      );
    }
  }

  return next(action);
};
