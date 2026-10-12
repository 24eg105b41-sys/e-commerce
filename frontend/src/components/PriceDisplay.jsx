import React from 'react';

/**
 * Standard formatted Indian Rupee (₹) price display.
 */
const PriceDisplay = ({ amount, className = "text-lg font-bold text-slate-900" }) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return <span className={className}>{formatted}</span>;
};

export default PriceDisplay;
