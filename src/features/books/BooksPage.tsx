import { LoaderCircle, RefreshCw, TriangleAlert } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { SEARCH_DEBOUNCE_MS } from '../../config/constants';
import { useDebounce } from '../../hooks/useDebounce';
import { selectCategory, selectKeyword, useFilterStore } from '../filters/filterStore';
import { fetchBooks } from './booksSlice';
import { selectAllBooks, selectBooksError, selectBooksStatus } from './booksSelectors';
import { filterBooks } from './booksUtils';
import { useEnsureBooksLoaded } from './useEnsureBooksLoaded';
import { BookList } from './components/BookList';
import { BorrowedPanel } from './components/BorrowedPanel';
import { CategoryFilter } from './components/CategoryFilter';
import { NoticeBar } from './components/NoticeBar';
import { SearchBox } from './components/SearchBox';

export function BooksPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const allBooks = useAppSelector(selectAllBooks);

  const keyword = useFilterStore(selectKeyword);
  const category = useFilterStore(selectCategory);
  const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_MS);

  useEnsureBooksLoaded();

  const visibleBooks = useMemo(
    () => filterBooks(allBooks, debouncedKeyword, category),
    [allBooks, debouncedKeyword, category],
  );

  const handleReload = useCallback(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <div className="page">
      <NoticeBar />

      <section className="toolbar">
        <SearchBox />
        <CategoryFilter />
      </section>

      {status === 'succeeded' && (
        <p className="book-list__count">
          <strong>{visibleBooks.length}</strong> / {allBooks.length} đầu sách
        </p>
      )}

      <div className="library-layout">
        <div className="library-layout__main">
          {isLoading && (
            <div className="state state--loading" role="status">
              <LoaderCircle className="icon-spin" size={28} aria-hidden="true" />
              <p>Đang tải...</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="state state--error" role="alert">
              <TriangleAlert className="state__icon" size={30} aria-hidden="true" />
              <p className="state__title">Không tải được danh sách sách</p>
              <p className="state__message">{error}</p>
              <button type="button" className="btn btn--primary" onClick={handleReload}>
                <RefreshCw size={15} aria-hidden="true" />
                Thử lại
              </button>
            </div>
          )}

          {status === 'succeeded' && <BookList books={visibleBooks} />}
        </div>

        <BorrowedPanel />
      </div>
    </div>
  );
}
