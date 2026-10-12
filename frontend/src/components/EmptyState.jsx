import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No products found",
  message = "Try clearing search filters or check back later for new arrivals.",
  actionText = "Browse All Products",
  actionLink = "/catalog",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 max-w-md mx-auto my-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      {actionLink && (
        <Link to={actionLink} className="campus-btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
