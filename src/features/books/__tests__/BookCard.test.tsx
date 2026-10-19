import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from '../components/BookCard';
import type { Book } from '../../../types';

const book: Book = {
  id: 'cntt-01',
  title: 'Dòng mã và những quyết định',
  author: 'Nguyễn Trường Sơn',
  category: 'CNTT',
  year: 2019,
  totalCopies: 3,
  availableCopies: 2,
};

const onBorrow = jest.fn();
const onReturn = jest.fn();

describe('BookCard', () => {
  it('hiển thị đầy đủ thông tin của sách', () => {
    render(<BookCard book={book} isBorrowed={false} onBorrow={onBorrow} onReturn={onReturn} />);

    expect(screen.getByRole('heading', { name: 'Dòng mã và những quyết định' })).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Trường Sơn')).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText('2019')).toBeInTheDocument();
    expect(screen.getByText('Còn 2/3 bản')).toBeInTheDocument();
  });

  it('gọi onBorrow với đúng id khi bấm nút "Mượn"', async () => {
    const user = userEvent.setup();
    render(<BookCard book={book} isBorrowed={false} onBorrow={onBorrow} onReturn={onReturn} />);

    await user.click(screen.getByRole('button', { name: 'Mượn' }));

    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('cntt-01');
    expect(onReturn).not.toHaveBeenCalled();
  });

  it('vô hiệu hoá nút "Mượn" khi sách đã hết bản', async () => {
    const user = userEvent.setup();
    render(
      <BookCard
        book={{ ...book, availableCopies: 0 }}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={onReturn}
      />,
    );

    const borrowButton = screen.getByRole('button', { name: 'Mượn' });

    expect(borrowButton).toBeDisabled();
    expect(screen.getByText('Hết sách')).toBeInTheDocument();

    await user.click(borrowButton);
    expect(onBorrow).not.toHaveBeenCalled();
  });

  it('hiển thị nút "Trả" và gọi onReturn với đúng id khi sách đang được mượn', async () => {
    const user = userEvent.setup();
    render(<BookCard book={book} isBorrowed onBorrow={onBorrow} onReturn={onReturn} />);

    await user.click(screen.getByRole('button', { name: 'Trả' }));

    expect(onReturn).toHaveBeenCalledTimes(1);
    expect(onReturn).toHaveBeenCalledWith('cntt-01');
    expect(onBorrow).not.toHaveBeenCalled();
  });
});
