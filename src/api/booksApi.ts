import { API_DELAY_MS } from '../config/constants';
import type { ApiResult, Book } from '../types';
import { MOCK_BOOKS } from './mockBooks';

export interface FetchBooksOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export function fetchBooksApi(options: FetchBooksOptions = {}): Promise<ApiResult<Book[]>> {
  const { shouldFail = false, delayMs = API_DELAY_MS } = options;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không kết nối được máy chủ thư viện (lỗi giả lập). Vui lòng thử lại.',
        });
        return;
      }

      resolve({ ok: true, data: MOCK_BOOKS.map((book) => ({ ...book })) });
    }, delayMs);
  });
}
