import type { Book, CategoryFilter } from '../../types';

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesKeyword(book: Book, keyword: string): boolean {
  const needle = normalizeText(keyword);

  if (needle.length === 0) {
    return true;
  }

  return normalizeText(book.title).includes(needle) || normalizeText(book.author).includes(needle);
}

export function matchesCategory(book: Book, category: CategoryFilter): boolean {
  return category === 'all' || book.category === category;
}

export function filterBooks(
  books: ReadonlyArray<Book>,
  keyword: string,
  category: CategoryFilter,
): Book[] {
  return books.filter((book) => matchesCategory(book, category) && matchesKeyword(book, keyword));
}
