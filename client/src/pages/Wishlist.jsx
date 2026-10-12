import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import RatingStars from '../components/RatingStars';
import { useToast } from '../components/Toast';

export const Wishlist = () => {
  const { user, isAuthenticated, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Please Sign In to View Your Wishlist
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Sign in to access your saved items and track price drops across stores.
        </p>
        <Link
          to="/login?redirect=/wishlist"
          className="inline-block bg-primary-600 text-white font-bold text-xs py-3 px-6 rounded-xl shadow hover:bg-primary-700 transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const wishlistItems = user?.wishlist || [];

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore products, compare specs and tap the heart icon to save products here!
        </p>
        <Link
          to="/listing"
          className="inline-block bg-primary-600 text-white font-bold text-xs py-3 px-6 rounded-xl shadow hover:bg-primary-700 transition-all"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-current" />
          My Wishlist ({wishlistItems.length} Items)
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Saved favorite products across all categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {wishlistItems.map((item) => {
          if (!item || typeof item !== 'object') return null;

          return (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-44 bg-gray-50 dark:bg-slate-900 rounded-lg p-2 flex items-center justify-center mb-3">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={() => {
                      toggleWishlist(item._id);
                      addToast('Removed from wishlist', 'info');
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-800 text-gray-400 hover:text-rose-500 shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] font-bold uppercase text-primary-600">{item.brand}</p>
                <Link
                  to={`/product/${item._id}`}
                  className="font-semibold text-xs text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-primary-600"
                >
                  {item.name}
                </Link>
                <div className="mt-1">
                  <RatingStars rating={item.rating} reviewCount={item.reviewCount} size="sm" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-700 mt-3 space-y-2">
                <span className="text-base font-bold text-gray-900 dark:text-white block">
                  {formatPrice(item.price)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(item, 1, item.colors?.[0] || '', item.sizes?.[0] || '');
                    addToast(`Added ${item.name} to cart`, 'success');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs py-2 px-3 rounded-lg shadow-sm transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
