import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBooks } from './booksSlice';
import { selectBooksStatus } from './booksSelectors';

export function useEnsureBooksLoaded(): void {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current || status !== 'idle') {
      return;
    }

    hasRequestedRef.current = true;
    dispatch(fetchBooks());
  }, [dispatch, status]);
}
