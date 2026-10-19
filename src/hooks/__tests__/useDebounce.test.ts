import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('trả về ngay giá trị ban đầu', () => {
    const { result } = renderHook(() => useDebounce('react', 300));

    expect(result.current).toBe('react');
  });

  it('chỉ trả về giá trị mới sau khi hết thời gian delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 'react' });
    expect(result.current).toBe('r');

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('r');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('react');
  });

  it('reset bộ đếm khi giá trị thay đổi liên tục (giống người dùng đang gõ)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'c' },
    });

    rerender({ value: 'cl' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'cle' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('c');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('cle');
  });

  it('dùng delay mặc định 300ms khi không truyền tham số', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(2);
  });

  it('dọn dẹp timer khi component unmount', () => {
    const { unmount } = renderHook(() => useDebounce('giá trị', 300));

    expect(jest.getTimerCount()).toBe(1);

    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
