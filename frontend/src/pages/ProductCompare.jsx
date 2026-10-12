import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';

const ProductCompare = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('shopsphere_compare') || '[]');
    setProducts(saved);
  }, []);

  const handleRemove = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('shopsphere_compare', JSON.stringify(updated));
  };

  const handleClear = () => {
    setProducts([]);
    localStorage.removeItem('shopsphere_compare');
  };

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={Scale}
          title="No products in comparison"
          message="Click the balance scale icon on product cards to compare specifications side-by-side."
          actionText="Browse Campus Catalog"
          actionLink="/catalog"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Specifications Comparison</h1>
          <p className="text-sm text-slate-500">Side-by-side technical evaluation for {products.length} product(s)</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 size={14} />
          <span>Clear Comparison</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="p-4 w-44 font-bold text-slate-400 uppercase tracking-wider">Feature</th>
              {products.map((p) => (
                <th key={p.id} className="p-4 min-w-[220px] max-w-[260px] align-top">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-200/60">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-campus-700">{p.brand}</span>
                  <h3 className="font-bold text-slate-900 text-xs line-clamp-2 mt-0.5">{p.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => addToCart(p.id, 1)}
                      className="campus-btn-primary !py-1.5 !px-2.5 text-[11px]"
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Price (INR)</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  <PriceDisplay amount={p.price} className="text-base font-extrabold text-slate-900" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Stock Availability</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  {p.stockQuantity > 0 ? (
                    <span className="text-emerald-700 font-bold">In Stock ({p.stockQuantity} units)</span>
                  ) : (
                    <span className="text-rose-500 font-bold">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Category</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 font-medium">{p.categoryName || 'General Campus'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Rating</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  <RatingStars rating={p.averageRating || 4.5} count={p.reviewCount || 0} size={14} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">SKU Code</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 font-mono text-slate-500">{p.sku}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Description & Use Case</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-slate-600 leading-relaxed text-[11px] align-top">
                  {p.description}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCompare;
