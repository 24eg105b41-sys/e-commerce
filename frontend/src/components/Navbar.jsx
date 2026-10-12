import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  User,
  Sparkles,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro banner for university student notice */}
      <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs font-medium text-center">
        <span>AU-R24 Campus Store • Free Hostel Delivery on orders over ₹499 • Student Verified Catalog</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-campus-600 flex items-center justify-center text-white shadow-sm shadow-campus-200">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                ShopSphere <span className="text-campus-600 font-extrabold">Campus</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Smart Shopping for Smarter Students
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Search laptops, books, keyboards, headphones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-campus-500 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 transition-all"
            />
            <Search className="absolute left-3.5 text-slate-400" size={16} />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/catalog" className="hover:text-campus-600 transition-colors">
              Catalog
            </Link>
            <Link to="/compare" className="flex items-center gap-1.5 hover:text-campus-600 transition-colors">
              <Scale size={16} />
              <span>Compare</span>
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-campus-50 to-indigo-50 text-campus-700 border border-campus-200 hover:border-campus-300 font-semibold transition-all shadow-sm"
            >
              <Sparkles size={14} className="text-campus-600 animate-pulse" />
              <span>AI Assistant</span>
            </Link>
          </nav>

          {/* Right Action Icons (Cart, Wishlist, User) */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              title="Saved Items"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex"
            >
              <Heart size={20} />
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              title="Shopping Cart"
              className="relative p-2 text-slate-700 hover:text-campus-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingCart size={20} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-campus-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-white text-xs font-medium transition-all"
                >
                  <span className="max-w-[100px] truncate">{user?.fullName?.split(' ')[0]}</span>
                  <div className="w-7 h-7 rounded-full bg-campus-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="campus-badge bg-purple-50 text-purple-700 border border-purple-200 mt-1">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User size={15} />
                      <span>Profile & Addresses</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-campus-700 bg-campus-50/50 hover:bg-campus-50"
                      >
                        <ShieldCheck size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-campus-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="campus-btn-primary !px-3 !py-1.5 text-xs font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search and Links Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-slate-100 flex flex-col gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search campus catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="campus-input pl-9"
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            </form>
            <div className="flex flex-col gap-2 pt-2 text-sm font-medium text-slate-700">
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Full Product Catalog
              </Link>
              <Link
                to="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Compare Products
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded bg-campus-50 text-campus-700 font-semibold"
              >
                AI Shopping Assistant
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Wishlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
