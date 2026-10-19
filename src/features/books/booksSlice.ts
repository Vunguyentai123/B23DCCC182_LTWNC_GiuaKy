import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksApi } from '../../api/booksApi';
import type { FetchBooksOptions } from '../../api/booksApi';
import { isApiSuccess } from '../../types';
import type { Book, BorrowedBook } from '../../types';

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type NoticeTone = 'success' | 'error';

export interface Notice {
  tone: NoticeTone;
  message: string;
}

export interface BooksState {
  items: Book[];
  borrowed: BorrowedBook[];
  status: FetchStatus;
  error: string | null;
  notice: Notice | null;
}

const initialState: BooksState = {
  items: [],
  borrowed: [],
  status: 'idle',
  error: null,
  notice: null,
};

export const fetchBooks = createAsyncThunk<Book[], FetchBooksOptions | undefined, { rejectValue: string }>(
  'books/fetchBooks',
  async (options, { rejectWithValue }) => {
    const result = await fetchBooksApi(options ?? {});

    if (isApiSuccess(result)) {
      return result.data;
    }

    return rejectWithValue(result.error);
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = state.items.find((item) => item.id === action.payload);

      if (!book) {
        state.notice = { tone: 'error', message: 'Không tìm thấy sách cần mượn.' };
        return;
      }

      if (state.borrowed.some((entry) => entry.bookId === book.id)) {
        state.notice = { tone: 'error', message: `Bạn đang mượn cuốn "${book.title}" rồi.` };
        return;
      }

      if (book.availableCopies <= 0) {
        state.notice = { tone: 'error', message: `Sách "${book.title}" đã hết bản.` };
        return;
      }

      book.availableCopies -= 1;
      state.borrowed.push({ bookId: book.id, borrowedAt: Date.now() });
      state.notice = { tone: 'success', message: `Đã mượn "${book.title}".` };
    },

    returnBook(state, action: PayloadAction<string>) {
      const index = state.borrowed.findIndex((entry) => entry.bookId === action.payload);

      if (index === -1) {
        state.notice = { tone: 'error', message: 'Sách này không nằm trong danh sách đang mượn.' };
        return;
      }

      state.borrowed.splice(index, 1);

      const book = state.items.find((item) => item.id === action.payload);
      if (book && book.availableCopies < book.totalCopies) {
        book.availableCopies += 1;
      }

      state.notice = { tone: 'success', message: book ? `Đã trả "${book.title}".` : 'Đã trả sách.' };
    },

    borrowRejected(state, action: PayloadAction<string>) {
      state.notice = { tone: 'error', message: action.payload };
    },

    dismissNotice(state) {
      state.notice = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.items = action.payload.map((book) => ({ ...book }));

        for (const entry of state.borrowed) {
          const book = state.items.find((item) => item.id === entry.bookId);
          if (book && book.availableCopies > 0) {
            book.availableCopies -= 1;
          }
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định.';
      });
  },
});

export const { borrowBook, returnBook, borrowRejected, dismissNotice } = booksSlice.actions;

export default booksSlice.reducer;
