import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, CheckSquare, Square, Eye } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';
import RatingStars from './RatingStars';
import ColorSwatch from './ColorSwatch';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const ProductCard = ({ product }) => {
  const { isInCompare, toggleCompare } = useCompare();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();
  const { addToast } = useToast();

  if (!product) return null;

  const inCompare = isInCompare(product._id);
  const inWishlist = isInWishlist(product._id);
  const discountPct = calculateDiscount(product.price, product.oldPrice);

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(product);
    if (!result.success) {
      addToast(result.message, 'error');
    } else {
      addToast(
        result.action === 'removed' ? `Removed from comparison` : `Added to comparison`,
        'success'
      );
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product._id);
    if (res.requireAuth) {
      addToast('Please login to save to wishlist', 'info');
    } else if (res.success) {
      addToast(
        res.action === 'added' ? 'Added to your wishlist' : 'Removed from wishlist',
        'success'
      );
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors?.[0] || '';
    const defaultSize = product.sizes?.[0] || '';
    addToCart(product, 1, defaultColor, defaultSize);
    addToast(`Added ${product.name} to cart`, 'success');
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/80 hover:border-primary-200 dark:hover:border-primary-700 shadow-kart hover:shadow-kart-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top action row: Wishlist & Discount Badge */}
      <div className="relative pt-4 px-4 pb-0 flex flex-col items-center bg-gray-50/50 dark:bg-slate-800/40">
        <div className="w-full flex items-center justify-between z-10">
          {discountPct > 0 ? (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPct}% OFF
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            className={`p-2 rounded-full transition-transform active:scale-90 bg-white/90 dark:bg-slate-700/90 shadow-sm hover:bg-white dark:hover:bg-slate-700 ${
              inWishlist ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="block relative w-full h-48 py-2 overflow-hidden flex items-center justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {product.brand}
            </span>
            <span className="truncate max-w-[120px]">{product.category}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            className="block text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 transition-colors mb-2"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mb-2.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>

          {/* Color swatches preview if Clothes */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <ColorSwatch colors={product.colors.slice(0, 4)} size="sm" interactive={false} />
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700/60">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Compare Checkbox & Add to Cart button */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCompareClick}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-2 rounded-lg border transition-all ${
                inCompare
                  ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-primary-400'
              }`}
            >
              {inCompare ? (
                <CheckSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>Compare</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
