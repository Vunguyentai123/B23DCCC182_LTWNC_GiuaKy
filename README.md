# Mini Library — Ứng dụng tra cứu & mượn/trả sách

Bài giữa kì môn Web nâng cao. Ứng dụng giúp sinh viên tra cứu sách của thư viện khoa,
mượn/trả sách và theo dõi những cuốn mình đang mượn.

## Chạy dự án

```bash
npm install        # cài phụ thuộc
npm run dev        # chạy dev server: http://localhost:5173
npm test           # chạy test (Jest + React Testing Library) — 32 test xanh
npm run build      # type-check (tsc) + build production
```

## Cấu trúc thư mục (feature-based)

```
src/
├── api/
│   ├── booksApi.ts              # API giả lập: Promise + setTimeout 500ms, có tham số giả lập lỗi
│   └── mockBooks.ts             # 24 đầu sách mẫu (3 thể loại, có cuốn hết bản)
├── app/
│   ├── store.ts                 # configureStore + gắn borrowLimitMiddleware + RootState
│   └── hooks.ts                 # typed hooks: useAppSelector / useAppDispatch
├── config/constants.ts          # API_DELAY_MS, SEARCH_DEBOUNCE_MS, MAX_BORROWED_BOOKS...
├── features/
│   ├── books/
│   │   ├── booksSlice.ts        # createSlice + createAsyncThunk(fetchBooks) + borrow/return
│   │   ├── booksSelectors.ts    # createSelector (memoized), đếm sách, ghép sách đang mượn
│   │   ├── booksUtils.ts        # filterBooks(keyword, category) — hàm thuần
│   │   ├── useEnsureBooksLoaded.ts  # gọi API 1 lần khi app khởi động (dùng cho cả /stats)
│   │   ├── BooksPage.tsx        # trang chính: loading / error / danh sách
│   │   ├── components/          # BookCard (React.memo), BookList, BookFilters, BorrowedPanel, NoticeBar
│   │   ├── middleware/borrowLimitMiddleware.ts   # middleware chặn mượn quá 3 cuốn
│   │   └── __tests__/           # test reducer, middleware, BookCard, BooksPage, booksUtils
│   ├── filters/filterStore.ts   # Zustand: keyword + category (state bộ lọc)
│   ├── stats/                   # StatsPage (lazy load) + statsUtils
│   └── theme/                   # ThemeContext (useMemo) + useTheme + ThemeToggle
├── hooks/useDebounce.ts         # custom hook generic useDebounce<T> (+ test fake timers)
├── components/AppHeader.tsx     # nav Thư viện / Thống kê + nút sáng tối
└── types/                       # Book, Category, ApiResult<T>, type guard, utility type
```

## Đối chiếu yêu cầu

| Yêu cầu | Cài đặt ở đâu |
| --- | --- |
| Lấy sách từ API giả lập, trễ 500ms | `src/api/booksApi.ts` (`setTimeout`, tham số `shouldFail`) |
| "Đang tải..." + báo lỗi khi API thất bại | `BooksPage.tsx` (nhánh `status === 'failed'`); truyền `shouldFail: true` cho `fetchBooksApi` để thử nhánh lỗi |
| Hiển thị tên/tác giả/thể loại/năm/số bản còn | `components/BookCard.tsx` |
| Tìm theo tên hoặc tác giả, debounce 300ms | `hooks/useDebounce.ts` + `BookList.tsx` + `booksUtils.ts` |
| Lọc theo thể loại (Tất cả/CNTT/Kinh tế/Ngoại ngữ) | `components/BookFilters.tsx` + Zustand `filterStore.ts` |
| Mượn: giảm 1 bản, vô hiệu hoá nút khi hết bản | `booksSlice.borrowBook` + `BookCard` (`disabled`) |
| Trả: tăng 1 bản | `booksSlice.returnBook` (nút "Trả" ở thẻ sách và panel đang mượn) |
| Tối đa 3 cuốn, vượt thì chặn + cảnh báo | **middleware** `borrowLimitMiddleware.ts` → dispatch `borrowRejected` |
| Nút sáng/tối | `ThemeToggle.tsx` + `ThemeContext.tsx` (`data-theme` trên `<html>`) |
| Trang `/stats` | `features/stats/StatsPage.tsx` (số đầu sách theo thể loại + số sách đang mượn) |

### Yêu cầu kỹ thuật

- **TypeScript nâng cao**: `ApiResult<T> = { ok: true; data } | { ok: false; error }` với type guard
  `isApiSuccess<T>` / `isApiFailure<T>` (`src/types/api.ts`); utility type `Pick` (`BookSummary`,
  `BorrowedBookView`), `Record` (`BooksByCategory`, `CATEGORY_SLUGS`), `ReadonlyArray`. Không dùng `any`.
- **Redux Toolkit**: `createSlice`, `createAsyncThunk` xử lý đủ `pending/fulfilled/rejected`,
  typed hooks, tổ chức theo feature, selector dùng `createSelector`.
- **Middleware tự viết**: `borrowLimitMiddleware` bắt action `books/borrowBook`, nếu đã mượn 3 cuốn thì
  **không gọi `next(action)`** (action bị chặn) và dispatch `books/borrowRejected` để hiện cảnh báo.
- **Zustand** cho bộ lọc, **Context + useMemo + custom hook `useTheme`** cho theme.
- **Tối ưu hiệu năng**: danh sách lọc bằng `useMemo`, `BookCard` bọc `React.memo`, handler truyền xuống
  dùng `useCallback`, `key={book.id}` (không dùng index), trang Thống kê `React.lazy` + `Suspense`.
- **Icon**: dùng `lucide-react` (`Search`, `Moon`/`Sun`, `BookPlus`, `Undo2`, `TriangleAlert`, ...);
  icon truyền `aria-hidden="true"` nên không ảnh hưởng tên truy cập của nút (test vẫn ổn định).

## Danh sách test (`npm test`)

| File | Nội dung |
| --- | --- |
| `booksSlice.test.ts` | 11 test reducer: 3 trạng thái của thunk, mượn/trả, hết bản, mượn trùng, `borrowRejected`, `dismissNotice` |
| `borrowLimitMiddleware.test.ts` | 3 test: cho mượn khi chưa đủ 3, chặn cuốn thứ 4 + cảnh báo, trả rồi mượn tiếp |
| `BookCard.test.tsx` | 4 test RTL + userEvent: hiển thị thông tin, click "Mượn" gọi đúng id, nút bị vô hiệu hoá khi hết bản, nút "Trả" |
| `useDebounce.test.ts` | 5 test với fake timers: giá trị ban đầu, đủ delay, reset bộ đếm, delay mặc định, cleanup |
| `booksUtils.test.ts` | 5 test lọc/tìm kiếm không phân biệt hoa thường |
| `BooksPage.test.tsx` | 4 test tích hợp: "Đang tải..." → dữ liệu, tìm kiếm debounce, chặn cuốn thứ 4, trả sách |
