import React from 'react';
import { Check, X, Award, ExternalLink, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import RatingStars from './RatingStars';
import ColorSwatch from './ColorSwatch';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const CompareTable = ({ products = [], analysis = {} }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!products || products.length === 0) return null;

  const { bestPriceId, bestRatingId } = analysis;

  // Gather all unique feature keys across compared products
  const allFeatureKeysSet = new Set();
  products.forEach(p => {
    if (p.features && typeof p.features === 'object') {
      Object.keys(p.features).forEach(k => allFeatureKeysSet.add(k));
    }
  });
  const allFeatureKeys = Array.from(allFeatureKeysSet);

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.sizes?.[0] || '');
    addToast(`Added ${product.name} to cart`, 'success');
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50/75 dark:bg-slate-900/50">
            <th className="p-4 w-44 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
              Product Overview
            </th>
            {products.map(p => {
              const isBestPrice = String(p._id) === String(bestPriceId);
              const isBestRating = String(p._id) === String(bestRatingId);

              return (
                <th key={p._id} className="p-4 text-left align-top min-w-[220px]">
                  <div className="flex flex-col items-center text-center">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-2 justify-center min-h-[22px]">
                      {isBestPrice && (
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Award className="w-3 h-3" /> Best Price
                        </span>
                      )}
                      {isBestRating && (
                        <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Award className="w-3 h-3" /> Top Rated
                        </span>
                      )}
                    </div>

                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                      alt={p.name}
                      className="w-28 h-28 object-contain mb-2 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm"
                    />
                    <p className="text-xs uppercase font-bold text-primary-600 dark:text-primary-400">
                      {p.brand}
                    </p>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mt-0.5 mb-2">
                      {p.name}
                    </h4>

                    {/* Price with highlight */}
                    <div className="mb-2">
                      <span className={`text-xl font-extrabold ${isBestPrice ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                        {formatPrice(p.price)}
                      </span>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="block text-xs text-gray-400 line-through">
                          {formatPrice(p.oldPrice)}
                        </span>
                      )}
                    </div>

                    <RatingStars rating={p.rating} reviewCount={p.reviewCount} size="sm" />

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="mt-3 w-full bg-accent hover:bg-accent-dark text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
          {/* Brand Row */}
          <tr>
            <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-900/30">
              Brand
            </td>
            {products.map(p => (
              <td key={p._id} className="p-3.5 font-medium text-gray-800 dark:text-gray-200">
                {p.brand}
              </td>
            ))}
          </tr>

          {/* Rating Row */}
          <tr>
            <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-900/30">
              User Rating
            </td>
            {products.map(p => (
              <td key={p._id} className="p-3.5">
                <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                  String(p._id) === String(bestRatingId) ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {p.rating} / 5.0 ({p.reviewCount} reviews)
                </span>
              </td>
            ))}
          </tr>

          {/* Available Colors */}
          <tr>
            <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-900/30">
              Colors
            </td>
            {products.map(p => (
              <td key={p._id} className="p-3.5">
                {p.colors && p.colors.length > 0 ? (
                  <div className="space-y-1">
                    <ColorSwatch colors={p.colors} size="sm" interactive={false} />
                    <p className="text-xs text-gray-500">{p.colors.join(', ')}</p>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Standard</span>
                )}
              </td>
            ))}
          </tr>

          {/* Available Sizes */}
          <tr>
            <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-900/30">
              Sizes / Variants
            </td>
            {products.map(p => (
              <td key={p._id} className="p-3.5">
                {p.sizes && p.sizes.length > 0 ? (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {p.sizes.join(' | ')}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Standard</span>
                )}
              </td>
            ))}
          </tr>

          {/* Category Features Matrix Rows */}
          {allFeatureKeys.map((featureKey) => (
            <tr key={featureKey}>
              <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 capitalize bg-gray-50/50 dark:bg-slate-900/30">
                {featureKey.replace(/([A-Z])/g, ' $1')}
              </td>
              {products.map(p => {
                const val = p.features?.[featureKey];

                return (
                  <td key={p._id} className="p-3.5">
                    {val !== undefined && val !== null ? (
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {String(val) === 'yes' || String(val) === 'true' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <Check className="w-4 h-4" /> Yes
                          </span>
                        ) : String(val) === 'no' || String(val) === 'false' ? (
                          <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                            <X className="w-4 h-4" /> No
                          </span>
                        ) : (
                          String(val)
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Stores & Prices Row */}
          <tr>
            <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-900/30">
              Stores & Live Prices
            </td>
            {products.map(p => (
              <td key={p._id} className="p-3.5">
                {p.stores && p.stores.length > 0 ? (
                  <div className="space-y-1.5">
                    {p.stores.map((st, sIdx) => {
                      const isCheapestInProduct = st.price === Math.min(...p.stores.map(s => s.price));

                      return (
                        <div
                          key={sIdx}
                          className={`flex items-center justify-between text-xs p-1.5 rounded ${
                            isCheapestInProduct
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span className="truncate max-w-[100px]">{st.name}</span>
                          <span className="font-semibold">{formatPrice(st.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Direct Only</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompareTable;
