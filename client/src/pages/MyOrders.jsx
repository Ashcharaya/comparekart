import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import orderService from '../services/orderService';
import { Spinner } from '../components/Loader';
import { formatPrice } from '../utils/formatPrice';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-500 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          No Orders Placed Yet
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          You haven't made any purchases yet. Compare products to find the best match for your budget!
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-500" />
          My Orders ({orders.length})
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track fulfillment status and review past smart purchases
        </p>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-gray-400">Order Placed: </span>
                  <strong className="text-gray-800 dark:text-gray-200">{dateStr}</strong>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-400">Order ID: </span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">#{order._id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    {order.status === 'Delivered' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : order.status === 'Shipped' ? (
                      <Truck className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {order.status}
                  </span>
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Order items */}
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                        alt={item.name}
                        className="w-14 h-14 object-contain bg-gray-50 dark:bg-slate-900 rounded-lg p-1 border border-gray-100 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-400 mt-0.5">
                          Qty: {item.quantity} • {formatPrice(item.price)} each
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                        </p>
                      </div>
                    </div>

                    {item.product && (
                      <Link
                        to={`/product/${item.product._id || item.product}`}
                        className="text-primary-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Buy Again</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping address footer */}
              <div className="pt-2 text-[11px] text-gray-400">
                Delivering to: <strong className="text-gray-600 dark:text-gray-300">{order.shippingAddress?.name}</strong>, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
