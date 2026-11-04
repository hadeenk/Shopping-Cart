import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { FilterState, ProductSize, SortOption } from '../types';

interface FiltersProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const AVAILABLE_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured & Trending' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Customer Rating' },
  { value: 'name-asc', label: 'Alphabetical: A - Z' },
];

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const toggleSize = (size: ProductSize) => {
    onChange((prev) => {
      const exists = prev.selectedSizes.includes(size);
      const updated = exists
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size];
      return { ...prev, selectedSizes: updated };
    });
  };

  const handlePriceChange = (val: number) => {
    onChange((prev) => ({ ...prev, maxPrice: val }));
  };

  const isFiltered =
    filters.category !== 'All' ||
    filters.selectedSizes.length > 0 ||
    filters.maxPrice < 350 ||
    filters.inStockOnly ||
    filters.searchQuery !== '' ||
    filters.sortBy !== 'featured';

  return (
    <section className="filters-bar-container">
      <div className="filters-main-row">
        {/* Results Counter and Filter Icon */}
        <div className="filters-header">
          <SlidersHorizontal size={18} className="filter-icon" />
          <span className="results-badge">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'Product' : 'Products'} found
          </span>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls-group">
          {/* Sizes filter pills */}
          <div className="size-filter-chips">
            <span className="filter-chip-label">Sizes:</span>
            {AVAILABLE_SIZES.map((size) => {
              const active = filters.selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`size-filter-btn ${active ? 'active' : ''}`}
                  aria-pressed={active}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="price-slider-group">
            <label htmlFor="price-slider" className="filter-chip-label">
              Max: <strong>${filters.maxPrice}</strong>
            </label>
            <input
              id="price-slider"
              type="range"
              min="40"
              max="350"
              step="5"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="price-range-input"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="sort-dropdown-group">
            <label htmlFor="sort-select" className="filter-chip-label">
              Sort:
            </label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
              }
              className="sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="reset-filters-btn"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
