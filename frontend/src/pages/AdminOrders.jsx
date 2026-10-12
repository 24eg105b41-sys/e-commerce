import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async (p = 0) => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/admin/orders', { params: { page: p, size: 15 } });
      if (res.success && res.data) {
        setOrders(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setPage(p);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axiosClient.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        alert('Order status updated!');
        fetchOrders(page);
      }
    } catch (err) {
      alert(err.message || 'Status transition not allowed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <Link to="/admin" className="text-xs font-semibold text-campus-600 hover:underline flex items-center gap-1 mb-3">
          <ArrowLeft size={14} />
          <span>Back to Analytics Dashboard</span>
        </Link>
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Orders Processing</h1>
            <p className="text-sm text-slate-500">Track and advance fulfillment for campus deliveries</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading customer orders..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer & Recipient</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Advance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 block">{o.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{o.customerName}</span>
                    <span className="text-[10px] text-slate-500">{o.customerEmail}</span>
                  </td>
                  <td className="p-4 max-w-[200px]">
                    <span className="block truncate font-medium text-slate-800">{o.addressLine}</span>
                    <span className="text-[10px] text-slate-400">{o.city} • Ph: {o.phone}</span>
                  </td>
                  <td className="p-4">
                    <PriceDisplay amount={o.totalAmount} className="font-bold text-slate-900" />
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-800 block">{o.paymentMethod}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{o.paymentStatus}</span>
                  </td>
                  <td className="p-4">
                    <OrderStatusBadge status={o.orderStatus} />
                  </td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={o.orderStatus === 'DELIVERED' || o.orderStatus === 'CANCELLED'}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-campus-500 disabled:opacity-50"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => fetchOrders(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600 font-medium">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => fetchOrders(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
