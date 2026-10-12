import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Clock, Ban, Check, ArrowLeft } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axiosClient.get(`/api/orders/${id}`);
      if (res.success && res.data) setOrder(res.data);
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await axiosClient.post(`/api/orders/${id}/cancel`);
      if (res.success && res.data) {
        alert('Order cancelled.');
        setOrder(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading order receipt..." />;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <Link to="/my-orders" className="campus-btn-primary mt-4">Return to Orders</Link>
      </div>
    );
  }

  const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link to="/my-orders" className="text-xs font-semibold text-campus-600 hover:underline flex items-center gap-1 mb-3">
          <ArrowLeft size={14} />
          <span>Back to My Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order #{order.orderNumber}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.orderStatus} />
            {(order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED') && (
              <button
                onClick={handleCancelOrder}
                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
              >
                <Ban size={13} />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Stepper (unless cancelled) */}
      {order.orderStatus !== 'CANCELLED' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((st, idx) => {
              const isDone = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <div key={st} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                      isDone
                        ? 'bg-campus-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-campus-100' : ''}`}
                  >
                    {isDone ? <Check size={14} /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs font-medium">
          This order has been cancelled and any reserved inventory has been returned to stock.
        </div>
      )}

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <MapPin size={15} className="text-campus-600" />
            Hostel Delivery Address
          </h3>
          <p className="font-semibold text-slate-800">{order.recipientName}</p>
          <p className="text-slate-600 leading-snug">{order.addressLine}</p>
          <p className="text-slate-500">{order.city}, {order.state} - {order.postalCode}</p>
          <p className="text-slate-400 font-mono">Contact: {order.phone}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <CreditCard size={15} className="text-campus-600" />
            Payment Details
          </h3>
          <p className="text-slate-600">Method: <span className="font-semibold text-slate-800">{order.paymentMethod}</span></p>
          <p className="text-slate-600">Status: <span className="font-semibold text-slate-800">{order.paymentStatus}</span></p>
          <p className="text-slate-500 text-[11px] pt-1">AU Capstone educational simulated transaction</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Purchased Items</h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{item.productName}</span>
                <span className="text-slate-400 ml-2 font-mono">SKU: {item.sku}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Quantity: {item.quantity} • Unit Price: ₹{item.unitPrice}
                </p>
              </div>
              <PriceDisplay amount={item.lineTotal} className="font-bold text-slate-900 text-sm" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <PriceDisplay amount={order.subtotal} className="font-semibold text-slate-800" />
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            {order.shippingFee > 0 ? (
              <PriceDisplay amount={order.shippingFee} className="font-semibold text-slate-800" />
            ) : (
              <span className="text-emerald-600 font-bold">Free</span>
            )}
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
            <span>Final Total</span>
            <PriceDisplay amount={order.totalAmount} className="text-xl font-extrabold text-campus-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
