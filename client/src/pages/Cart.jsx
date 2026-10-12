import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Trash2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { formatPrice } from '../utils/formatPrice';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    cartCount,
    budgetLimit,
    isOverBudget,
    budgetDifference
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore products within your budget, compare specs and add your top choices here.
        </p>
        <Link
          to="/listing"
          className="inline-block bg-primary-600 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md hover:bg-primary-700 transition-all"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary-500" />
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            CompareKart Direct & Verified Store Fulfillment
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-bold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Warning if Cart Total Exceeds User's Budget Limit */}
      {isOverBudget && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">
              Budget Alert: Cart Total Exceeds Your Budget Limit!
            </h4>
            <p className="text-xs mt-0.5 leading-relaxed">
              Your cart total of <strong>{formatPrice(cartTotal)}</strong> is{' '}
              <strong>{formatPrice(budgetDifference)}</strong> over your set budget limit of{' '}
              <strong>{formatPrice(budgetLimit)}</strong>. You can still proceed or adjust quantities.
            </p>
          </div>
        </div>
      )}

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {cartItems.map(item => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Price Summary Sticky Box (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-3 border-b border-gray-100 dark:border-slate-700">
              Price Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Price ({cartCount} items)</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery Charges</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(deliveryFee)}</span>
              </div>

              {budgetLimit !== null && (
                <div className="flex justify-between text-gray-500 pt-1 border-t border-dashed border-gray-200 dark:border-slate-700">
                  <span>Target Budget</span>
                  <span>{formatPrice(budgetLimit)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-slate-700">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {cartDiscount > 0 && (
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg text-center">
                You will save {formatPrice(cartDiscount)} on this order
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:shadow-lg text-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust note */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700 flex items-center gap-3 text-xs text-gray-500">
            <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic Products.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
