import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosClient.get('/api/admin/dashboard');
        if (res.success && res.data) setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing real database analytics..." />;
  }

  if (!stats) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-slate-500">
        <p>Failed to load dashboard metrics. Ensure you are signed in with administrator privileges.</p>
      </div>
    );
  }

  // Prepare chart data for top selling products
  const topProductsData = (stats.topSellingProducts || []).map((p) => ({
    name: p.name.length > 18 ? p.name.substring(0, 15) + '...' : p.name,
    quantity: p.quantitySold || 0,
    revenue: p.revenue || 0,
  }));

  const COLORS = ['#0271c2', '#38aaf6', '#7cc7fb', '#4f46e5', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="campus-badge bg-purple-50 text-purple-700 border border-purple-200 font-bold">
              Administrator Console
            </span>
            <span className="text-xs text-slate-400">• AU-R24 Capstone Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Campus Operations & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="campus-btn-secondary !py-2 !px-3.5 text-xs font-semibold">
            <Package size={15} />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="campus-btn-primary !py-2 !px-3.5 text-xs font-semibold">
            <ShoppingBag size={15} />
            <span>Process Orders</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="campus-card bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Eligible Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <PriceDisplay amount={stats.totalRevenue} className="text-2xl font-black text-slate-900 block" />
          <p className="text-[11px] text-slate-400">Excludes cancelled student orders</p>
        </div>

        {/* Total Orders */}
        <div className="campus-card bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{stats.totalOrders}</span>
          <p className="text-[11px] text-slate-400">
            <span className="text-campus-600 font-bold">{stats.pendingOrders} pending</span> / {stats.completedOrders} delivered
          </p>
        </div>

        {/* Active Products */}
        <div className="campus-card bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{stats.totalProducts}</span>
          <p className="text-[11px] text-slate-400">Products currently published to students</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="campus-card bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alert</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-600 block">{stats.lowStockCount}</span>
          <p className="text-[11px] text-slate-400">Items with stock ≤ 10 units</p>
        </div>
      </div>

      {/* Analytics Charts & Status Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Selling Products Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Top Selling Campus Products (Units Sold)</h2>
          {topProductsData.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-16 text-center">
              No product purchase volume recorded yet. Place demo orders to see live data visualization!
            </p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="quantity" fill="#0271c2" radius={[6, 6, 0, 0]}>
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Distribution Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Order Status Breakdown</h2>
          <div className="space-y-3 pt-2">
            {Object.entries(stats.orderStatusDistribution || {}).map(([st, cnt]) => (
              <div key={st} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={st} />
                </div>
                <span className="font-extrabold text-slate-800 font-mono text-sm">{cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />
              Low Stock Warnings
            </h2>
            <Link to="/admin/products" className="text-xs font-semibold text-campus-600 hover:underline">
              Restock Gear
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">All products maintain healthy inventory levels.</p>
            ) : (
              stats.lowStockProducts?.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <p className="text-slate-400 font-mono text-[10px]">SKU: {p.sku}</p>
                  </div>
                  <span className="campus-badge bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    {p.stockQuantity} remaining
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-campus-600" />
              Recent Campus Orders
            </h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-campus-600 hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentOrders?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No recent orders found.</p>
            ) : (
              stats.recentOrders?.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{o.orderNumber}</span>
                    <p className="text-slate-400 text-[11px]">{o.customerName} ({o.recipientName})</p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={o.orderStatus} />
                    <PriceDisplay amount={o.totalAmount} className="block text-xs font-bold text-slate-900 mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
