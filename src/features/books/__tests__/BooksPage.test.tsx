import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createAppStore } from '../../../app/store';
import { useFilterStore } from '../../filters/filterStore';
import { BooksPage } from '../BooksPage';

function renderBooksPage() {
  const store = createAppStore();

  return render(
    <Provider store={store}>
      <BooksPage />
    </Provider>,
  );
}

const borrowableButtons = () =>
  screen
    .getAllByRole('button', { name: 'Mượn' })
    .filter((button) => !(button as HTMLButtonElement).disabled);

function getCard(title: string): HTMLElement {
  const card = screen.getByRole('heading', { name: title }).closest('article');

  if (!card) {
    throw new Error(`Không tìm thấy thẻ sách "${title}"`);
  }

  return card;
}

describe('BooksPage (tích hợp)', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it('hiện "Đang tải..." rồi hiển thị danh sách sách từ API giả lập', async () => {
    renderBooksPage();

    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    expect(await screen.findByText('Dòng mã và những quyết định')).toBeInTheDocument();
    expect(screen.getByText('Mẫu thiết kế trong thực tại')).toBeInTheDocument();
  });

  it('lọc sách theo từ khoá tác giả (có debounce)', async () => {
    const user = userEvent.setup();
    renderBooksPage();
    await screen.findByText('Dòng mã và những quyết định');

    await user.type(screen.getByLabelText('Tìm kiếm sách'), 'hoài nam');

    expect(await screen.findByText('Hiểu kinh tế qua những lựa chọn nhỏ')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Dòng mã và những quyết định')).not.toBeInTheDocument(),
    );
  });

  it('chặn mượn cuốn thứ 4 và hiện cảnh báo giới hạn', async () => {
    const user = userEvent.setup();
    renderBooksPage();
    await screen.findByText('Dòng mã và những quyết định');

    for (let index = 0; index < 3; index += 1) {
      await user.click(borrowableButtons()[0]);
    }

    expect(screen.getByText('3/3')).toBeInTheDocument();

    await user.click(borrowableButtons()[0]);

    expect(await screen.findByText(/tối đa 3 cuốn/i)).toBeInTheDocument();
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('trả sách thì số bản còn lại tăng lên', async () => {
    const user = userEvent.setup();
    renderBooksPage();
    await screen.findByText('Dòng mã và những quyết định');

    await user.click(
      within(getCard('Dòng mã và những quyết định')).getByRole('button', { name: 'Mượn' }),
    );
    expect(
      within(getCard('Dòng mã và những quyết định')).getByText('Còn 1/4 bản'),
    ).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();

    await user.click(
      within(getCard('Dòng mã và những quyết định')).getByRole('button', { name: 'Trả' }),
    );

    expect(
      within(getCard('Dòng mã và những quyết định')).getByText('Còn 2/4 bản'),
    ).toBeInTheDocument();
    expect(screen.getByText('0/3')).toBeInTheDocument();
  });
});
