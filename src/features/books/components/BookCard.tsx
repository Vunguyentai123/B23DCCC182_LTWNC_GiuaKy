import { BookPlus, Undo2 } from 'lucide-react';
import { memo } from 'react';
import { CATEGORY_SLUGS } from '../../../types';
import type { Book } from '../../../types';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

function BookCardComponent({ book, isBorrowed, onBorrow, onReturn }: BookCardProps) {
  const isOutOfStock = book.availableCopies === 0;

  return (
    <article className="book-card">
      <div className="book-card__top">
        <span className={`badge badge--${CATEGORY_SLUGS[book.category]}`}>{book.category}</span>
        <span className="book-card__year">{book.year}</span>
      </div>

      <h3 className="book-card__title">{book.title}</h3>
      <p className="book-card__author">{book.author}</p>

      <p className={isOutOfStock ? 'stock stock--out' : 'stock stock--in'}>
        {isOutOfStock ? 'Hết sách' : `Còn ${book.availableCopies}/${book.totalCopies} bản`}
      </p>

      {isBorrowed ? (
        <button type="button" className="btn btn--ghost" onClick={() => onReturn(book.id)}>
          <Undo2 size={15} aria-hidden="true" />
          Trả
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--primary"
          disabled={isOutOfStock}
          onClick={() => onBorrow(book.id)}
        >
          <BookPlus size={15} aria-hidden="true" />
          Mượn
        </button>
      )}
    </article>
  );
}

export const BookCard = memo(BookCardComponent);
BookCard.displayName = 'BookCard';
