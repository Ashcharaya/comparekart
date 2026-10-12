import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { useToast } from '../components/Toast';

export const Checkout = () => {
  const { cartItems, cartSubtotal, cartDiscount, deliveryFee, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '9876543210',
    pincode: '560001',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Flat 402, Green Valley Apartments, MG Road'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <Link to="/listing" className="text-primary-600 font-bold text-xs hover:underline">
          Return to Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = 'Full name is required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone.trim())) {
      errs.phone = 'Valid 10-digit phone number is required';
    }
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim())) {
      errs.pincode = 'Valid 6-digit pincode is required';
    }
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'State is required';
    if (!address.address.trim()) errs.address = 'Street address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to place an order', 'error');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!validateForm()) {
      addToast('Please correct the errors in the address form', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || '',
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || ''
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryFee,
        totalAmount: cartTotal
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.order) {
        addToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.order._id}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      addToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Demo Checkout Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0" />
          <span>
            <strong>DEMO CHECKOUT SIMULATOR:</strong> No real payment gateway charge. Safe testing sandbox.
          </span>
        </div>
        <span className="font-bold uppercase tracking-wider text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded">
          MERN Course Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Address and Payment Form (8 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">1</span>
              Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Phone Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength="10"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Street Address / House No.</label>
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.address ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Pincode</label>
                <input
                  type="text"
                  maxLength="6"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.pincode ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.city ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white ${errors.state ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                />
                {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          {/* 2. Payment Method UI */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">2</span>
              Payment Method (Demo Mode)
            </h3>

            <div className="space-y-3">
              {/* UPI */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'UPI' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' : 'border-gray-200 dark:border-slate-700'
              }`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 text-primary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-xs text-gray-900 dark:text-white">UPI (Google Pay, PhonePe, Paytm)</span>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-700 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID (e.g. mobile@upi)"
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 w-64"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold self-center">Verified</span>
                    </div>
                  )}
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'Card' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' : 'border-gray-200 dark:border-slate-700'
              }`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="mt-1 text-primary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-xs text-gray-900 dark:text-white">Credit / Debit / ATM Card</span>
                  </div>
                  {paymentMethod === 'Card' && (
                    <div className="mt-2 text-[11px] text-gray-500">
                      Simulation: Demo token 4242••••••••4242 will be submitted safely without storing cards.
                    </div>
                  )}
                </div>
              </label>

              {/* COD */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' : 'border-gray-200 dark:border-slate-700'
              }`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-primary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-xs text-gray-900 dark:text-white">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Pay via cash or UPI to delivery agent at your doorstep</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all text-sm tracking-wide disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{submitting ? 'CONFIRMING ORDER...' : `PLACE ORDER (${formatPrice(cartTotal)})`}</span>
          </button>
        </form>

        {/* Order Items Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-3 border-b border-gray-100 dark:border-slate-700">
              Order Summary ({cartItems.length} Products)
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700 pr-1">
              {cartItems.map(item => (
                <div key={item._id} className="py-2.5 flex items-center gap-3 text-xs">
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                    alt={item.product?.name}
                    className="w-12 h-12 object-contain bg-gray-50 dark:bg-slate-900 rounded p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.product?.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity} • {formatPrice(item.product?.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Savings</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-700">
                <span>Total Payable</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
