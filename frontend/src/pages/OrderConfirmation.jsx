import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await axiosClient.get(`/api/orders/number/${orderNumber}`);
          if (res.success && res.data) setOrder(res.data);
        } catch (err) {
          console.error('Failed to load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  if (loading) {
    return <LoadingSpinner text="Retrieving order receipt..." />;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <Link to="/my-orders" className="campus-btn-primary mt-4">View My Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-mono">
            Order Reference: <span className="font-bold text-slate-800">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-6 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <MapPin size={14} className="text-campus-600" />
              Delivery Destination
            </h4>
            <p className="font-semibold text-slate-800">{order.recipientName}</p>
            <p className="text-slate-600 leading-snug">{order.addressLine}</p>
            <p className="text-slate-500">{order.city}, {order.state} - {order.postalCode}</p>
            <p className="text-slate-400 font-mono mt-1">Ph: {order.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <CreditCard size={14} className="text-campus-600" />
              Payment & Status
            </h4>
            <p className="text-slate-600">Method: <span className="font-semibold text-slate-800">{order.paymentMethod}</span></p>
            <p className="text-slate-600">Payment Status: <span className="font-semibold text-slate-800">{order.paymentStatus}</span></p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-slate-500">Order Status:</span>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="text-left border-t border-slate-100 pt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Ordered</h3>
          <div className="divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{item.productName}</span>
                  <span className="text-slate-400 ml-2 font-mono">x{item.quantity}</span>
                </div>
                <PriceDisplay amount={item.lineTotal} className="font-bold text-slate-800" />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Paid (Simulated)</span>
            <PriceDisplay amount={order.totalAmount} className="text-lg font-extrabold text-campus-700" />
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/my-orders" className="w-full sm:w-auto campus-btn-primary !py-3 text-xs font-semibold">
            <Package size={15} />
            <span>Track in My Orders</span>
          </Link>
          <Link to="/catalog" className="w-full sm:w-auto campus-btn-secondary !py-3 text-xs font-semibold">
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
