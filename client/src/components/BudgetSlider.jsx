import React from 'react';
import { formatPrice } from '../utils/formatPrice';

export const BudgetSlider = ({
  budget = 25000,
  onChangeBudget,
  min = 500,
  max = 75000,
  step = 500
}) => {
  const presets = [
    { label: 'Under ₹1,000', value: 1000 },
    { label: 'Under ₹10,000', value: 10000 },
    { label: '₹10k - ₹20k', value: 20000 },
    { label: '₹20k - ₹40k', value: 40000 },
    { label: '₹50,000+', value: 50000 }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Selected Budget
        </label>
        <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
          {formatPrice(budget)}
        </span>
      </div>

      {/* Range Slider */}
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={budget}
          onChange={(e) => onChangeBudget(Number(e.target.value))}
          className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>
      </div>

      {/* Manual Input */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500">Custom: ₹</span>
        <input
          type="number"
          min={min}
          max={max}
          value={budget}
          onChange={(e) => onChangeBudget(Number(e.target.value))}
          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
      </div>

      {/* Quick Budget Preset Buttons */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChangeBudget(preset.value)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium border ${
              budget === preset.value
                ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-primary-400'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BudgetSlider;
