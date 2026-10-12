import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, MessageSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodRes = await axiosClient.get(`/api/products/${id}`);
        if (prodRes.success && prodRes.data) {
          setProduct(prodRes.data);

          // Fetch related & reviews
          const [relRes, revRes] = await Promise.all([
            axiosClient.get(`/api/products/${prodRes.data.id}/related`),
            axiosClient.get(`/api/reviews/product/${prodRes.data.id}`),
          ]);
          if (relRes.success) setRelatedProducts(relRes.data || []);
          if (revRes.success) setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit a student review.');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axiosClient.post('/api/reviews', {
        productId: product.id,
        rating: newRating,
        comment: newComment,
      });
      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        alert('Thank you for your student review!');
      }
    } catch (err) {
      alert(err.message || 'Could not post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product specifications..." />;
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product not found</h2>
        <Link to="/catalog" className="campus-btn-primary mt-4">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 aspect-square flex items-center justify-center overflow-hidden shadow-sm">
          <img
            src={imageError || !product.imageUrl ? fallbackImage : product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 px-2.5 py-1 rounded-full border border-campus-200">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.averageRating || 4.5} count={product.reviewCount || 0} size={18} />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <PriceDisplay amount={product.price} className="text-3xl font-extrabold text-slate-900" />
            <p className="text-xs text-slate-500 mt-1">Inclusive of all campus student subsidies and local taxes</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">Stock Availability:</span>
            {product.stockQuantity > 0 ? (
              <span className="campus-badge bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                In Stock ({product.stockQuantity} units)
              </span>
            ) : (
              <span className="campus-badge bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 hover:bg-slate-100 text-slate-700 font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3.5 py-2 hover:bg-slate-100 text-slate-700 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="flex-1 campus-btn-primary !py-3 font-semibold text-sm shadow-md"
            >
              <ShoppingCart size={18} />
              <span>Add to Campus Cart</span>
            </button>
          </div>

          {/* Student Value Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 bg-white rounded-lg border border-slate-200/60">
              <Truck size={20} className="mx-auto text-campus-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">Hostel Drop</p>
              <p className="text-[10px] text-slate-500">Free above ₹499</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/60">
              <RefreshCw size={20} className="mx-auto text-campus-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">7-Day Return</p>
              <p className="text-[10px] text-slate-500">Library Desk</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/60">
              <ShieldCheck size={20} className="mx-auto text-campus-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">100% Genuine</p>
              <p className="text-[10px] text-slate-500">AU Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Product Overview & Specs</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Student Reviews & Ratings</h2>
            <p className="text-xs text-slate-500">Verified peer feedback from university coursework usage</p>
          </div>
          <div className="flex items-center gap-2">
            <RatingStars rating={product.averageRating || 4.5} size={20} />
            <span className="font-bold text-slate-900 text-sm">{product.averageRating || 4.5} / 5</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Write a Review</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">Your Rating:</span>
            <RatingStars rating={newRating} interactive onSelect={setNewRating} size={22} />
          </div>
          <textarea
            rows="3"
            placeholder="Share your practical experience with this item (e.g. IDE performance, battery life, textbook clarity)..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="campus-input"
            required
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="campus-btn-primary text-xs font-semibold !py-2"
          >
            <MessageSquare size={14} />
            <span>{submittingReview ? 'Submitting...' : 'Post Student Review'}</span>
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No student reviews posted yet. Be the first to review this product!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{rev.reviewerName}</span>
                  <span className="text-[11px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <RatingStars rating={rev.rating} size={14} />
                <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Frequently Bought Together in This Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
