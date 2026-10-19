import { createAppStore } from '../../../app/store';
import { MAX_BORROWED_BOOKS } from '../../../config/constants';
import type { Book } from '../../../types';
import { borrowBook, returnBook } from '../booksSlice';

function makeBook(id: string): Book {
  return {
    id,
    title: `Sách ${id}`,
    author: 'Tác giả thử nghiệm',
    category: 'CNTT',
    year: 2020,
    totalCopies: 2,
    availableCopies: 2,
  };
}

function setupStore(borrowedIds: string[]) {
  return createAppStore({
    books: {
      items: ['book-01', 'book-02', 'book-03', 'book-04'].map(makeBook),
      borrowed: borrowedIds.map((bookId, index) => ({ bookId, borrowedAt: 1000 + index })),
      status: 'succeeded',
      error: null,
      notice: null,
    },
  });
}

describe('borrowLimitMiddleware', () => {
  it('cho mượn bình thường khi chưa đạt giới hạn', () => {
    const store = setupStore(['book-01', 'book-02']);

    store.dispatch(borrowBook('book-03'));

    const { borrowed, items } = store.getState().books;
    expect(borrowed).toHaveLength(3);
    expect(items.find((book) => book.id === 'book-03')?.availableCopies).toBe(1);
  });

  it(`chặn cuốn thứ ${MAX_BORROWED_BOOKS + 1} và hiện cảnh báo`, () => {
    const store = setupStore(['book-01', 'book-02', 'book-03']);

    store.dispatch(borrowBook('book-04'));

    const { borrowed, items, notice } = store.getState().books;
    expect(borrowed).toHaveLength(MAX_BORROWED_BOOKS);
    expect(borrowed.some((entry) => entry.bookId === 'book-04')).toBe(false);
    expect(items.find((book) => book.id === 'book-04')?.availableCopies).toBe(2);
    expect(notice?.tone).toBe('error');
    expect(notice?.message).toContain(`tối đa ${MAX_BORROWED_BOOKS} cuốn`);
  });

  it('sau khi trả 1 cuốn thì được mượn tiếp', () => {
    const store = setupStore(['book-01', 'book-02', 'book-03']);

    store.dispatch(borrowBook('book-04'));
    store.dispatch(returnBook('book-01'));
    store.dispatch(borrowBook('book-04'));

    const { borrowed } = store.getState().books;
    expect(borrowed).toHaveLength(3);
    expect(borrowed.some((entry) => entry.bookId === 'book-04')).toBe(true);
  });
});
