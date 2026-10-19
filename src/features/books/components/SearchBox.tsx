import { LoaderCircle, Search, X } from 'lucide-react';
import { SEARCH_DEBOUNCE_MS } from '../../../config/constants';
import { useDebounce } from '../../../hooks/useDebounce';
import { selectKeyword, useFilterStore } from '../../filters/filterStore';

export function SearchBox() {
  const keyword = useFilterStore(selectKeyword);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_MS);
  const isTyping = keyword !== debouncedKeyword;

  return (
    <div className="search-box">
      <span className="search-box__icon" aria-hidden="true">
        <Search size={16} />
      </span>

      <input
        type="text"
        className="search-box__input"
        placeholder="Tìm theo tên sách hoặc tác giả..."
        aria-label="Tìm kiếm sách"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      {isTyping && (
        <span className="search-box__status" aria-hidden="true">
          <LoaderCircle className="icon-spin" size={15} />
        </span>
      )}

      {keyword.length > 0 && (
        <button
          type="button"
          className="search-box__clear"
          onClick={resetFilters}
          aria-label="Xoá bộ lọc"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
