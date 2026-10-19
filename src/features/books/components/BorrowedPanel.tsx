import { BookMarked, TriangleAlert, Undo2 } from 'lucide-react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { MAX_BORROWED_BOOKS } from '../../../config/constants';
import { returnBook } from '../booksSlice';
import { selectBorrowedBooks, selectBorrowedCount } from '../booksSelectors';

export function BorrowedPanel() {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const borrowedCount = useAppSelector(selectBorrowedCount);

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch],
  );

  return (
    <aside className="panel">
      <h2 className="panel__title">
        <span className="panel__title-text">
          <BookMarked size={17} aria-hidden="true" />
          Sách đang mượn
        </span>
        <span className="panel__count">
          {borrowedCount}/{MAX_BORROWED_BOOKS}
        </span>
      </h2>

      {borrowedBooks.length === 0 ? (
        <p className="panel__empty">Chưa mượn cuốn nào.</p>
      ) : (
        <ul className="borrowed-list">
          {borrowedBooks.map((item) => (
            <li key={item.id} className="borrowed-item">
              <div className="borrowed-item__info">
                <p className="borrowed-item__title">{item.title}</p>
                <p className="borrowed-item__author">{item.author}</p>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => handleReturn(item.id)}
              >
                <Undo2 size={14} aria-hidden="true" />
                Trả
              </button>
            </li>
          ))}
        </ul>
      )}

      {borrowedCount >= MAX_BORROWED_BOOKS && (
        <p className="panel__warning">
          <TriangleAlert size={15} aria-hidden="true" />
          Bạn đã đạt giới hạn {MAX_BORROWED_BOOKS} cuốn. Trả sách để mượn tiếp.
        </p>
      )}
    </aside>
  );
}
