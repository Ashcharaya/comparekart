import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Calendar, ArrowRight, Home } from 'lucide-react';
import orderService from '../services/orderService';
import { Spinner } from '../components/Loader';
import { formatPrice } from '../utils/formatPrice';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        if (res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const expectedDate = order?.expectedDeliveryDate
    ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'In 3-5 Business Days';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Thank you for choosing CompareKart. Your smart purchase is confirmed and being prepared for dispatch.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <span className="bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300">
            Order ID: #{order?._id}
          </span>
          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Expected Delivery: {expectedDate}
          </span>
        </div>
      </div>

      {/* Items List & Summary */}
      {order && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100 dark:border-slate-700">
            Order Items
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {order.items?.map((item, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                    alt={item.name}
                    className="w-12 h-12 object-contain bg-gray-50 dark:bg-slate-900 rounded p-1"
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{item.name}</p>
                    <p className="text-gray-400">
                      Qty: {item.quantity} • {item.selectedColor ? `Color: ${item.selectedColor} ` : ''}{item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-between text-base font-black">
            <span>Total Paid</span>
            <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/my-orders"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-all"
        >
          <Package className="w-4 h-4" />
          <span>View All Orders</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 font-bold text-xs py-3 px-6 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
