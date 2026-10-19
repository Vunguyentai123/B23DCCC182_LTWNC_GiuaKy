export const CATEGORY_VALUES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

export type CategoryFilter = Category | 'all';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  totalCopies: number;
  availableCopies: number;
}

export interface BorrowedBook {
  bookId: string;
  borrowedAt: number;
}

export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

export type BorrowedBookView = BookSummary & {
  borrowedAt: number;
};

export type BooksByCategory = Record<Category, number>;

export const CATEGORY_SLUGS: Record<Category, string> = {
  CNTT: 'cntt',
  'Kinh tế': 'kinh-te',
  'Ngoại ngữ': 'ngoai-ngu',
};
