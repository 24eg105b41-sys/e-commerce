import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Ban, Clock } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/api/orders/my');
      if (res.success && res.data) setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this campus order?')) return;
    try {
      const res = await axiosClient.post(`/api/orders/${orderId}/cancel`);
      if (res.success && res.data) {
        alert('Order has been cancelled successfully.');
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Could not cancel order');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your campus order history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          message="Your past course equipment and textbook orders will appear here once placed."
          actionText="Browse Campus Catalog"
          actionLink="/catalog"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Campus Orders</h1>
        <p className="text-sm text-slate-500">Track current hostel delivery status and past orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const canCancel = order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED';
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-900">{order.orderNumber}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Clock size={13} />
                    <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.orderStatus} />
                  <PriceDisplay amount={order.totalAmount} className="text-base font-extrabold text-slate-900" />
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="truncate max-w-md font-medium">
                      {item.quantity}x {item.productName}
                    </span>
                    <PriceDisplay amount={item.lineTotal} className="font-semibold text-slate-800" />
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span>Hostel Delivery to: </span>
                  <span className="font-medium text-slate-700">{order.recipientName} ({order.city})</span>
                </div>

                <div className="flex items-center gap-2">
                  {canCancel && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Ban size={13} />
                      <span>Cancel</span>
                    </button>
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="campus-btn-secondary !py-1.5 !px-3 text-xs font-semibold"
                  >
                    <span>View Receipt</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
