import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import ColorSwatch from './ColorSwatch';

const CATEGORIES = [
  'All',
  'Clothes',
  'Mobiles & Electronics Appliances',
  'Sports & Toys',
  'Beauty Products'
];

const CLOTHES_COLORS = [
  'Navy Blue',
  'Olive Green',
  'White',
  'Maroon',
  'Pastel Pink',
  'Sky Blue',
  'Charcoal Black',
  'Heather Grey',
  'Burgundy'
];

export const FilterSidebar = ({
  category,
  onSelectCategory,
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  minPrice = 0,
  maxPrice = 100000,
  selectedMaxPrice,
  onChangePrice,
  selectedRating,
  onSelectRating,
  selectedColor,
  onSelectColor,
  onClearFilters
}) => {
  return (
    <aside className="w-full bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-500" />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Max Price
          </h4>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(selectedMaxPrice || maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={60000}
          step={500}
          value={selectedMaxPrice || 60000}
          onChange={(e) => onChangePrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹500</span>
          <span>₹60,000+</span>
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <label
              key={stars}
              className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <input
                type="radio"
                name="ratingFilter"
                checked={selectedRating === stars}
                onChange={() => onSelectRating(selectedRating === stars ? null : stars)}
                className="text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="flex items-center gap-1">
                {stars}★ & above
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Checklist */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            Brands ({brands.length})
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {brands.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-primary-600"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => onToggleBrand(b)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="truncate">{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Color Filter (particularly for Clothes or general color filtering) */}
      {(category === 'Clothes' || category === 'All') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Color
            </h4>
            {selectedColor && (
              <button
                type="button"
                onClick={() => onSelectColor('')}
                className="text-[11px] text-primary-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <ColorSwatch
            colors={CLOTHES_COLORS}
            selectedColor={selectedColor}
            onSelectColor={(col) => onSelectColor(selectedColor === col ? '' : col)}
            size="md"
          />
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
