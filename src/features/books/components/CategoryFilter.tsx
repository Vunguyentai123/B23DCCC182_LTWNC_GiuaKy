import { CATEGORY_SLUGS, CATEGORY_VALUES } from '../../../types';
import type { CategoryFilter as CategoryFilterValue } from '../../../types';
import { selectCategory, useFilterStore } from '../../filters/filterStore';

interface CategoryOption {
  value: CategoryFilterValue;
  label: string;
  slug: string;
}

const OPTIONS: ReadonlyArray<CategoryOption> = [
  { value: 'all', label: 'Tất cả', slug: 'all' },
  ...CATEGORY_VALUES.map((category) => ({
    value: category,
    label: category,
    slug: CATEGORY_SLUGS[category],
  })),
];

export function CategoryFilter() {
  const category = useFilterStore(selectCategory);
  const setCategory = useFilterStore((state) => state.setCategory);

  return (
    <div className="segmented" role="group" aria-label="Lọc theo thể loại">
      {OPTIONS.map((option) => {
        const isActive = option.value === category;

        return (
          <button
            key={option.value}
            type="button"
            data-slug={option.slug}
            className={isActive ? 'segmented__btn segmented__btn--active' : 'segmented__btn'}
            aria-pressed={isActive}
            onClick={() => setCategory(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
