import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your campus cart is empty"
          message="Explore prescribed textbooks, laptop accessories, and student stationery."
          actionText="Explore Campus Catalog"
          actionLink="/catalog"
        />
      </div>
    );
  }

  const freeShippingThreshold = 499;
  const differenceToFreeShipping = freeShippingThreshold - (cart.subtotal || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Shopping Cart</h1>
          <p className="text-sm text-slate-500">{cart.totalItems} student item(s) selected</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress Notification */}
          <div className="p-4 rounded-xl bg-campus-50/70 border border-campus-200/80 flex items-center gap-3">
            <Truck size={20} className="text-campus-600 flex-shrink-0" />
            <div className="text-xs">
              {differenceToFreeShipping > 0 ? (
                <p className="text-slate-700">
                  Add <span className="font-bold text-campus-700">₹{differenceToFreeShipping.toFixed(2)}</span> more for <span className="font-bold">Free Campus Delivery</span>!
                </p>
              ) : (
                <p className="font-bold text-emerald-700">
                  🎉 Congratulations! You qualify for Free Campus Hostel Delivery.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {cart.items.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200/60 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      SKU: {item.productSku}
                    </span>
                    <Link
                      to={`/products/${item.productSlug || item.productId}`}
                      className="block text-sm font-bold text-slate-900 hover:text-campus-600 transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <PriceDisplay amount={item.unitPrice} className="text-sm font-semibold text-slate-700" />
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <PriceDisplay amount={item.lineTotal} className="text-base font-bold text-slate-900 w-24 text-right" />

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Link to="/catalog" className="text-xs font-semibold text-campus-600 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.totalItems} items)</span>
                <PriceDisplay amount={cart.subtotal} className="font-semibold text-slate-800" />
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Campus Delivery Fee</span>
                {cart.shippingFee > 0 ? (
                  <PriceDisplay amount={cart.shippingFee} className="font-semibold text-slate-800" />
                ) : (
                  <span className="text-emerald-600 font-bold text-xs uppercase">Free</span>
                )}
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Student Discount</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <PriceDisplay amount={cart.totalAmount} className="text-xl font-extrabold text-campus-700" />
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full campus-btn-primary !py-3.5 font-bold text-sm shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Simulated Campus Checkout (AU Capstone)</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
