import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity, selectedColor, selectedSize, _id } = item;
  if (!product) return null;

  const discount = calculateDiscount(product.price, product.oldPrice);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-sm transition-all hover:border-gray-200">
      <div className="flex items-center gap-4 min-w-0">
        <Link to={`/product/${product._id}`} className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-lg p-2 flex-shrink-0 flex items-center justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </Link>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {product.brand}
          </p>
          <Link
            to={`/product/${product._id}`}
            className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Variant selections */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {selectedColor && (
              <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                Color: <strong className="text-gray-700 dark:text-gray-200">{selectedColor}</strong>
              </span>
            )}
            {selectedSize && (
              <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                Size: <strong className="text-gray-700 dark:text-gray-200">{selectedSize}</strong>
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {discount}% off
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quantity & Remove */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-700">
        <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-700">
          <button
            type="button"
            onClick={() => onUpdateQuantity(_id, quantity - 1)}
            disabled={quantity <= 1}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-gray-800 dark:text-gray-100 min-w-[28px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(_id, quantity + 1)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(_id)}
          className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
