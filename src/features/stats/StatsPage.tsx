import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { BarChart3, BookMarked, BookOpenCheck, Layers, LibraryBig, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectAllBooks, selectBorrowedCount, selectBooksStatus } from '../books/booksSelectors';
import { useEnsureBooksLoaded } from '../books/useEnsureBooksLoaded';
import { CATEGORY_SLUGS, CATEGORY_VALUES } from '../../types';
import { buildLibraryStats } from './statsUtils';

interface StatCardProps {
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
}

function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card__icon" aria-hidden="true">
        {icon}
      </p>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__hint">{hint}</p>
    </div>
  );
}

export default function StatsPage() {
  const books = useAppSelector(selectAllBooks);
  const borrowedCount = useAppSelector(selectBorrowedCount);
  const status = useAppSelector(selectBooksStatus);

  useEnsureBooksLoaded();

  const stats = useMemo(() => buildLibraryStats(books), [books]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="state state--loading" role="status">
        <LoaderCircle className="icon-spin" size={28} aria-hidden="true" />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="state state--error" role="alert">
        <TriangleAlert className="state__icon" size={30} aria-hidden="true" />
        <p className="state__title">Không tải được dữ liệu thống kê</p>
        <p className="state__message">Vui lòng quay lại trang Thư viện và bấm "Tải lại".</p>
      </div>
    );
  }

  return (
    <div className="page stats-page">
      <h1 className="page-title">Thống kê thư viện</h1>
      <p className="page-subtitle">Số liệu được tính trực tiếp từ danh sách sách hiện có trong thư viện.</p>

      <section className="stat-grid">
        <StatCard
          label="Tổng đầu sách"
          value={stats.totalTitles}
          hint="số tựa sách khác nhau"
          icon={<LibraryBig size={18} />}
        />
        <StatCard
          label="Tổng số bản"
          value={stats.totalCopies}
          hint="tất cả các bản in"
          icon={<Layers size={18} />}
        />
        <StatCard
          label="Bản còn trên kệ"
          value={stats.availableCopies}
          hint="có thể mượn ngay"
          icon={<BookOpenCheck size={18} />}
        />
        <StatCard
          label="Sách đang được mượn"
          value={borrowedCount}
          hint="tối đa 3 cuốn mỗi sinh viên"
          icon={<BookMarked size={18} />}
        />
      </section>

      <section className="category-stats">
        <h2 className="section-title section-title--icon">
          <BarChart3 size={17} aria-hidden="true" />
          Số đầu sách theo thể loại
        </h2>

        <ul className="category-cards">
          {CATEGORY_VALUES.map((category) => {
            const slug = CATEGORY_SLUGS[category];

            return (
              <li key={category} className={`category-card category-card--${slug}`}>
                <span className={`badge badge--${slug}`}>{category}</span>
                <span className="category-card__count">{stats.titlesByCategory[category]}</span>
                <span className="category-card__label">đầu sách</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
