import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        discountAmount: 0,
        totalAmount: 0,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showNotification('Please log in to add items to your cart', 'error');
      return false;
    }
    try {
      const res = await axiosClient.post('/api/cart/items', { productId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        showNotification('Item added to your campus cart!');
        return true;
      }
    } catch (err) {
      showNotification(err.message || 'Failed to add item', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.put(`/api/cart/items/${itemId}`, { quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.delete(`/api/cart/items/${itemId}`);
      if (res.success && res.data) {
        setCart(res.data);
        showNotification('Item removed from cart');
      }
    } catch (err) {
      showNotification(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await axiosClient.delete('/api/cart');
      setCart({
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        discountAmount: 0,
        totalAmount: 0,
      });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        notification,
        showNotification,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 animate-bounce duration-300">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              notification.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
