import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SHIPPED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
