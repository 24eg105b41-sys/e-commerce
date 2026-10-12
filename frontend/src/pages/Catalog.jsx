import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & meta
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter States synced with URL SearchParams
  const selectedCategory = searchParams.get('categoryId') || '';
  const searchKeyword = searchParams.get('keyword') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const directionParam = searchParams.get('direction') || 'desc';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  // Load Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get('/api/categories');
        if (res.success && res.data) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 12,
          sortBy: sortByParam,
          direction: directionParam,
        };
        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchKeyword) params.keyword = searchKeyword;
        if (minPriceParam) params.minPrice = minPriceParam;
        if (maxPriceParam) params.maxPrice = maxPriceParam;

        const res = await axiosClient.get('/api/products', { params });
        if (res.success && res.data) {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to fetch catalog products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, selectedCategory, searchKeyword, minPriceParam, maxPriceParam, sortByParam, directionParam, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset to page 0 on filter change
    setSearchParams(newParams);
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');

    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Catalog</h1>
          <p className="text-sm text-slate-500">
            {totalElements} verified student items in stock
            {searchKeyword && <span> matching "{searchKeyword}"</span>}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Sort by:</label>
          <select
            value={`${sortByParam}-${directionParam}`}
            onChange={(e) => {
              const [sb, dir] = e.target.value.split('-');
              const newParams = new URLSearchParams(searchParams);
              newParams.set('sortBy', sb);
              newParams.set('direction', dir);
              setSearchParams(newParams);
            }}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-campus-500"
          >
            <option value="createdAt-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="averageRating-desc">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Filter size={16} className="text-campus-600" />
                Filter Catalog
              </span>
              {(selectedCategory || searchKeyword || minPriceParam || maxPriceParam) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('categoryId', '')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === ''
                      ? 'bg-campus-50 text-campus-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('categoryId', c.id.toString())}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === c.id.toString()
                        ? 'bg-campus-50 text-campus-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Price Range (₹)</h4>
              <form onSubmit={handlePriceFilterSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="campus-input !py-1.5 text-xs"
                    min="0"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="campus-input !py-1.5 text-xs"
                    min="0"
                  />
                </div>
                <button type="submit" className="w-full campus-btn-secondary !py-1.5 text-xs font-medium">
                  Apply Price Filter
                </button>
              </form>
            </div>

            {/* Quick Student Budget Chips */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Student Budgets</h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setMinPriceInput('');
                    setMaxPriceInput('1000');
                    updateParam('maxPrice', '1000');
                  }}
                  className="campus-badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Under ₹1,000
                </button>
                <button
                  onClick={() => {
                    setMinPriceInput('');
                    setMaxPriceInput('5000');
                    updateParam('maxPrice', '5000');
                  }}
                  className="campus-badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Under ₹5,000
                </button>
                <button
                  onClick={() => {
                    setMinPriceInput('');
                    setMaxPriceInput('60000');
                    updateParam('maxPrice', '60000');
                  }}
                  className="campus-badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Under ₹60,000
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <LoadingSpinner text="Searching campus catalog..." />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your filters"
              message="Try loosening your price limit, searching a different keyword, or selecting All Categories."
              actionText="Reset All Filters"
              actionLink="/catalog"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === idx
                          ? 'bg-campus-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
