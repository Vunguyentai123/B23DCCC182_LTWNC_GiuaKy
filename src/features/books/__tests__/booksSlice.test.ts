import booksReducer, {
  borrowBook,
  borrowRejected,
  dismissNotice,
  fetchBooks,
  returnBook,
} from '../booksSlice';
import type { BooksState } from '../booksSlice';
import type { Book } from '../../../types';

const sampleBooks: Book[] = [
  {
    id: 'cntt-01',
    title: 'Dòng mã và những quyết định',
    author: 'Nguyễn Trường Sơn',
    category: 'CNTT',
    year: 2019,
    totalCopies: 3,
    availableCopies: 2,
  },
  {
    id: 'kt-01',
    title: 'Hiểu kinh tế qua những lựa chọn nhỏ',
    author: 'Nguyễn Hoài Nam',
    category: 'Kinh tế',
    year: 2016,
    totalCopies: 2,
    availableCopies: 1,
  },
];

function createState(overrides: Partial<BooksState> = {}): BooksState {
  return {
    items: sampleBooks.map((book) => ({ ...book })),
    borrowed: [],
    status: 'idle',
    error: null,
    notice: null,
    ...overrides,
  };
}

describe('booksSlice reducer', () => {
  it('fetchBooks.pending: chuyển status sang loading', () => {
    const state = booksReducer(createState({ error: 'lỗi cũ' }), fetchBooks.pending('req-1', undefined));

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchBooks.fulfilled: lưu danh sách sách và đặt status = succeeded', () => {
    const state = booksReducer(
      createState({ status: 'loading' }),
      fetchBooks.fulfilled(sampleBooks, 'req-1', undefined),
    );

    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2);
    expect(state.items[0].title).toBe('Dòng mã và những quyết định');
  });

  it('fetchBooks.rejected: đặt status = failed và lưu thông báo lỗi', () => {
    const state = booksReducer(
      createState({ status: 'loading', items: [] }),
      fetchBooks.rejected(new Error('boom'), 'req-1', undefined, 'Mất kết nối máy chủ'),
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Mất kết nối máy chủ');
    expect(state.items).toHaveLength(0);
  });

  it('borrowBook: giảm availableCopies đi 1 và thêm vào danh sách đang mượn', () => {
    const state = booksReducer(createState(), borrowBook('cntt-01'));

    expect(state.items[0].availableCopies).toBe(1);
    expect(state.borrowed).toHaveLength(1);
    expect(state.borrowed[0].bookId).toBe('cntt-01');
    expect(state.notice?.tone).toBe('success');
  });

  it('borrowBook: không mượn được sách đã hết bản', () => {
    const state = booksReducer(
      createState({
        items: [{ ...sampleBooks[0], availableCopies: 0 }, { ...sampleBooks[1] }],
      }),
      borrowBook('cntt-01'),
    );

    expect(state.items[0].availableCopies).toBe(0);
    expect(state.borrowed).toHaveLength(0);
    expect(state.notice?.tone).toBe('error');
  });

  it('borrowBook: không mượn trùng một cuốn sách hai lần', () => {
    const afterFirstBorrow = booksReducer(createState(), borrowBook('cntt-01'));
    const afterSecondBorrow = booksReducer(afterFirstBorrow, borrowBook('cntt-01'));

    expect(afterSecondBorrow.borrowed).toHaveLength(1);
    expect(afterSecondBorrow.items[0].availableCopies).toBe(1);
    expect(afterSecondBorrow.notice?.tone).toBe('error');
  });

  it('returnBook: tăng availableCopies lên 1 và xoá khỏi danh sách đang mượn', () => {
    const borrowedState = booksReducer(createState(), borrowBook('kt-01'));
    const returnedState = booksReducer(borrowedState, returnBook('kt-01'));

    expect(returnedState.items[1].availableCopies).toBe(1);
    expect(returnedState.borrowed).toHaveLength(0);
    expect(returnedState.notice?.tone).toBe('success');
  });

  it('returnBook: bỏ qua khi sách không nằm trong danh sách đang mượn', () => {
    const state = booksReducer(createState(), returnBook('cntt-01'));

    expect(state.items[0].availableCopies).toBe(2);
    expect(state.borrowed).toHaveLength(0);
    expect(state.notice?.tone).toBe('error');
  });

  it('borrowRejected: hiển thị cảnh báo do middleware giới hạn mượn gửi tới', () => {
    const state = booksReducer(createState(), borrowRejected('Bạn chỉ được mượn tối đa 3 cuốn.'));

    expect(state.notice).toEqual({ tone: 'error', message: 'Bạn chỉ được mượn tối đa 3 cuốn.' });
  });

  it('dismissNotice: xoá thông báo hiện tại', () => {
    const state = booksReducer(createState({ notice: { tone: 'success', message: 'ok' } }), dismissNotice());

    expect(state.notice).toBeNull();
  });

  it('fetchBooks.fulfilled: giữ nguyên sách đang mượn khi tải lại danh sách', () => {
    const borrowedState = booksReducer(createState(), borrowBook('cntt-01'));
    const reloadedState = booksReducer(
      borrowedState,
      fetchBooks.fulfilled(sampleBooks, 'req-2', undefined),
    );

    expect(reloadedState.borrowed).toHaveLength(1);
    expect(reloadedState.items[0].availableCopies).toBe(1);
  });
});
