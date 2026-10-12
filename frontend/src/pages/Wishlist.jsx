import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await axiosClient.get('/api/wishlist');
      if (res.success && res.data) setItems(res.data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosClient.delete(`/api/wishlist/items/${productId}`);
      setItems(items.filter((i) => i.productId !== productId));
    } catch (err) {
      alert(err.message || 'Could not remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    const success = await addToCart(item.productId, 1);
    if (success) {
      handleRemove(item.productId);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading saved items..." />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save textbooks and devices you want to review before the semester starts."
          actionText="Discover Campus Products"
          actionLink="/catalog"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Student Wishlist</h1>
        <p className="text-sm text-slate-500">{items.length} saved product(s)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="campus-card bg-white p-4 flex flex-col justify-between">
            <div>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-campus-700">
                {item.brand}
              </span>
              <Link
                to={`/products/${item.productSlug || item.productId}`}
                className="block text-sm font-bold text-slate-900 hover:text-campus-600 line-clamp-2 mt-1"
              >
                {item.productName}
              </Link>
              <div className="mt-2">
                <PriceDisplay amount={item.price} className="text-base font-extrabold text-slate-900" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleMoveToCart(item)}
                className="flex-1 campus-btn-primary !py-2 text-xs font-semibold"
              >
                <ShoppingCart size={14} />
                <span>Move to Cart</span>
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
