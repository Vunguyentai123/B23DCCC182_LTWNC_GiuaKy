import { lazy, Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { BooksPage } from './features/books/BooksPage';
import { ThemeProvider } from './features/theme/ThemeContext';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <AppHeader />

          <main className="app-main">
            <Suspense
              fallback={
                <div className="state state--loading" role="status">
                  <LoaderCircle className="icon-spin" size={28} aria-hidden="true" />
                  <p>Đang tải...</p>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<BooksPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="*" element={<BooksPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
