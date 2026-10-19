import { SearchX } from 'lucide-react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { Book } from '../../../types';
import { borrowBook, returnBook } from '../booksSlice';
import { selectBorrowedIds } from '../booksSelectors';
import { BookCard } from './BookCard';

export interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  const dispatch = useAppDispatch();
  const borrowedIds = useAppSelector(selectBorrowedIds);

  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch],
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch],
  );

  if (books.length === 0) {
    return (
      <p className="empty">
        <SearchX size={18} aria-hidden="true" />
        Không tìm thấy sách phù hợp. Thử từ khoá hoặc thể loại khác nhé.
      </p>
    );
  }

  return (
    <ul className="book-grid">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard
            book={book}
            isBorrowed={borrowedIds.has(book.id)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        </li>
      ))}
    </ul>
  );
}
