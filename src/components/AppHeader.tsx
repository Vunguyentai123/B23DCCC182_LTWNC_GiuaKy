import { BarChart3, Library, LibraryBig } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '../features/theme/ThemeToggle';

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__logo" aria-hidden="true">
          <LibraryBig size={30} />
        </span>
        <p className="brand__name">Mini Library</p>
      </div>

      <nav className="app-nav" aria-label="Điều hướng chính">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'app-nav__link active' : 'app-nav__link')}>
          <Library size={16} aria-hidden="true" />
          Thư viện
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) => (isActive ? 'app-nav__link active' : 'app-nav__link')}
        >
          <BarChart3 size={16} aria-hidden="true" />
          Thống kê
        </NavLink>
      </nav>

      <ThemeToggle />
    </header>
  );
}
