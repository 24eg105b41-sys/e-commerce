import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Scale, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PriceDisplay from './PriceDisplay';
import RatingStars from './RatingStars';
import axiosClient from '../api/axiosClient';

const ProductCard = ({ product, onWishlistToggle, isWishlisted = false }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [compared, setCompared] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('shopsphere_compare') || '[]');
    if (existing.some((p) => p.id === product.id)) {
      const filtered = existing.filter((p) => p.id !== product.id);
      localStorage.setItem('shopsphere_compare', JSON.stringify(filtered));
      setCompared(false);
    } else {
      if (existing.length >= 3) {
        alert('You can compare a maximum of 3 products at a time.');
        return;
      }
      existing.push(product);
      localStorage.setItem('shopsphere_compare', JSON.stringify(existing));
      setCompared(true);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (onWishlistToggle) {
      onWishlistToggle(product.id);
    } else {
      try {
        await axiosClient.post(`/api/wishlist/items/${product.id}`);
        alert('Saved to your wishlist!');
      } catch (err) {
        alert(err.message || 'Could not update wishlist');
      }
    }
  };

  return (
    <div className="campus-card group flex flex-col overflow-hidden bg-white">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Link to={`/products/${product.slug || product.id}`}>
          <img
            src={imageError || !product.imageUrl ? fallbackImage : product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Quick action overlay buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 transition-opacity">
          <button
            onClick={handleWishlistClick}
            title="Save to Wishlist"
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-rose-600' : ''} />
          </button>
          <button
            onClick={handleCompare}
            title={compared ? 'Remove from comparison' : 'Compare specifications'}
            className={`p-2 rounded-full shadow-md transition-colors ${
              compared
                ? 'bg-campus-600 text-white'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-campus-600'
            }`}
          >
            {compared ? <Check size={16} /> : <Scale size={16} />}
          </button>
        </div>

        {/* Category Pill */}
        {product.categoryName && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="campus-badge bg-slate-900/80 text-white backdrop-blur-sm">
              {product.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-campus-700 mb-1">
            {product.brand || 'Campus Gear'}
          </div>
          <Link
            to={`/products/${product.slug || product.id}`}
            className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-campus-600 transition-colors"
          >
            {product.name}
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars
              rating={product.averageRating || 4.5}
              count={product.reviewCount || 0}
            />
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <PriceDisplay amount={product.price} />
            <div className="text-xs text-slate-500 font-medium">
              {product.stockQuantity > 0 ? (
                <span className="text-emerald-600">In Stock ({product.stockQuantity})</span>
              ) : (
                <span className="text-rose-500">Out of Stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0 || adding}
            className="campus-btn-primary !px-3 !py-2 text-xs"
            title="Add to Cart"
          >
            <ShoppingCart size={14} />
            <span>{adding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
