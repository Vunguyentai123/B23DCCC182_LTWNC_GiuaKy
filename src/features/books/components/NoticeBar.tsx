import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { NOTICE_TIMEOUT_MS } from '../../../config/constants';
import { dismissNotice } from '../booksSlice';
import { selectNotice } from '../booksSelectors';

export function NoticeBar() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timerId = window.setTimeout(() => {
      dispatch(dismissNotice());
    }, NOTICE_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [notice, dispatch]);

  if (!notice) {
    return null;
  }

  return (
    <div className={`notice notice--${notice.tone}`} role="status" aria-live="polite">
      <span className="notice__label">
        {notice.tone === 'success' ? (
          <CircleCheck size={17} aria-hidden="true" />
        ) : (
          <CircleAlert size={17} aria-hidden="true" />
        )}
        {notice.message}
      </span>
      <button
        type="button"
        className="notice__close"
        onClick={() => dispatch(dismissNotice())}
        aria-label="Đóng thông báo"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
