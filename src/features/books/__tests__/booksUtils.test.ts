import { filterBooks, normalizeText } from '../booksUtils';
import type { Book } from '../../../types';

const books: Book[] = [
  {
    id: 'cntt-01',
    title: 'Dòng mã và những quyết định',
    author: 'Nguyễn Trường Sơn',
    category: 'CNTT',
    year: 2019,
    totalCopies: 4,
    availableCopies: 2,
  },
  {
    id: 'kt-01',
    title: 'Hiểu kinh tế qua những lựa chọn nhỏ',
    author: 'Nguyễn Hoài Nam',
    category: 'Kinh tế',
    year: 2016,
    totalCopies: 6,
    availableCopies: 4,
  },
  {
    id: 'nn-01',
    title: 'Ngữ pháp tiếng Anh bằng hình ảnh',
    author: 'Lê Thị Mai',
    category: 'Ngoại ngữ',
    year: 2020,
    totalCopies: 8,
    availableCopies: 6,
  },
];

describe('filterBooks', () => {
  it('trả về toàn bộ sách khi không có từ khoá và chọn "Tất cả"', () => {
    expect(filterBooks(books, '', 'all')).toHaveLength(3);
  });

  it('tìm theo tên sách, không phân biệt hoa thường', () => {
    const result = filterBooks(books, 'DÒNG MÃ', 'all');

    expect(result.map((book) => book.id)).toEqual(['cntt-01']);
  });

  it('tìm theo tác giả', () => {
    const result = filterBooks(books, 'hoài nam', 'all');

    expect(result.map((book) => book.id)).toEqual(['kt-01']);
  });

  it('kết hợp từ khoá và thể loại', () => {
    expect(filterBooks(books, 'kinh', 'Kinh tế')).toHaveLength(1);
    expect(filterBooks(books, 'kinh', 'Ngoại ngữ')).toHaveLength(0);
  });

  it('normalizeText cắt khoảng trắng và chuyển về chữ thường', () => {
    expect(normalizeText('  Dòng mã  ')).toBe('dòng mã');
  });
});
