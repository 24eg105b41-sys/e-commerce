import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, ToggleLeft, ToggleRight, Search, Check, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/api/products', { params: { size: 50, keyword: keyword || undefined } }),
        axiosClient.get('/api/categories'),
      ]);
      if (prodRes.success && prodRes.data) setProducts(prodRes.data.content || []);
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !categoryId) setCategoryId(catRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load admin catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [keyword]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setBrand('');
    setPrice('');
    setStockQuantity('');
    setDescription('');
    setImageUrl('');
    setFormError('');
    if (categories.length > 0) setCategoryId(categories[0].id);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBrand(p.brand);
    setCategoryId(p.categoryId || (categories.length > 0 ? categories[0].id : ''));
    setPrice(p.price.toString());
    setStockQuantity(p.stockQuantity.toString());
    setDescription(p.description);
    setImageUrl(p.imageUrl || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (editingProduct) {
        // Update product
        const res = await axiosClient.put(`/api/admin/products/${editingProduct.id}`, {
          categoryId: Number(categoryId),
          name,
          brand,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          description,
          imageUrl,
        });
        if (res.success) {
          alert('Product updated successfully!');
          setModalOpen(false);
          loadData();
        }
      } else {
        // Create product
        const res = await axiosClient.post('/api/admin/products', {
          categoryId: Number(categoryId),
          name,
          sku,
          brand,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          description,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        });
        if (res.success) {
          alert('Product created successfully!');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/api/admin/products/${id}/status`);
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Could not toggle status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <Link to="/admin" className="text-xs font-semibold text-campus-600 hover:underline flex items-center gap-1 mb-3">
          <ArrowLeft size={14} />
          <span>Back to Analytics Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog Management</h1>
            <p className="text-sm text-slate-500">Create, edit, restock, or soft-deactivate products</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="campus-btn-primary !py-2.5 !px-4 text-xs font-bold"
          >
            <Plus size={16} />
            <span>Create New Product</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products by title, SKU, or brand..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="campus-input pl-9 text-xs"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner text="Loading catalog management records..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Item & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">SKU: {p.sku} • {p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{p.categoryName || 'General'}</td>
                  <td className="p-4">
                    <PriceDisplay amount={p.price} className="font-bold text-slate-900" />
                  </td>
                  <td className="p-4">
                    <span className={`font-bold font-mono ${p.stockQuantity <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`campus-badge ${p.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`p-1.5 rounded-lg ${p.active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        title={p.active ? 'Deactivate' : 'Activate'}
                      >
                        {p.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog for Add / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Catalog Product' : 'Create New Campus Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="campus-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    disabled={!!editingProduct}
                    className="campus-input text-xs disabled:bg-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="campus-input text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="campus-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Specifications</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="campus-input text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="campus-btn-secondary !py-2 !px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="campus-btn-primary !py-2 !px-4 text-xs font-semibold"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
