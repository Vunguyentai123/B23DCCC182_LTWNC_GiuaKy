import type { Book, BooksByCategory } from '../../types';

export interface LibraryStats {
  totalTitles: number;
  totalCopies: number;
  availableCopies: number;
  titlesByCategory: BooksByCategory;
}

export function buildLibraryStats(books: ReadonlyArray<Book>): LibraryStats {
  const titlesByCategory: BooksByCategory = {
    CNTT: 0,
    'Kinh tế': 0,
    'Ngoại ngữ': 0,
  };

  let totalCopies = 0;
  let availableCopies = 0;

  for (const book of books) {
    titlesByCategory[book.category] += 1;
    totalCopies += book.totalCopies;
    availableCopies += book.availableCopies;
  }

  return {
    totalTitles: books.length,
    totalCopies,
    availableCopies,
    titlesByCategory,
  };
}
