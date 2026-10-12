import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, Scale, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/formatPrice';

export const CompareTray = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isTrayOpen,
    setIsTrayOpen
  } = useCompare();

  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-tray transition-transform duration-300">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary-500 text-white p-1 rounded-md">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Compare Products ({compareList.length} of 4)
          </span>
          <span className="hidden sm:inline text-xs text-gray-400">
            • Category: {compareList[0]?.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>

          <button
            onClick={() => setIsTrayOpen(!isTrayOpen)}
            className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded"
            aria-label={isTrayOpen ? 'Collapse tray' : 'Expand tray'}
          >
            {isTrayOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Product List Tray */}
      {isTrayOpen && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Selected product slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto flex-1">
              {[0, 1, 2, 3].map((index) => {
                const product = compareList[index];

                if (product) {
                  return (
                    <div
                      key={product._id}
                      className="relative flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-800/80 rounded-lg border border-gray-200 dark:border-slate-700 max-w-[240px]"
                    >
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                        alt={product.name}
                        className="w-12 h-12 object-contain bg-white dark:bg-slate-900 rounded p-1"
                      />
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCompare(product._id)}
                        className="absolute -top-1.5 -right-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-gray-600 rounded-full p-0.5 transition-colors shadow-sm"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={`slot-${index}`}
                    className="hidden sm:flex items-center justify-center p-2 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 text-xs text-gray-400 max-w-[240px] h-16"
                  >
                    + Add Product ({index + 1})
                  </div>
                );
              })}
            </div>

            {/* Compare Button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  const ids = compareList.map(p => p._id).join(',');
                  navigate(`/compare?ids=${ids}`);
                }}
                disabled={compareList.length < 2}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  compareList.length >= 2
                    ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer hover:shadow-lg'
                    : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Compare Now ({compareList.length})</span>
              </button>
              {compareList.length < 2 && (
                <p className="text-[11px] text-gray-400 text-center mt-1">Select at least 2 to compare</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareTray;
