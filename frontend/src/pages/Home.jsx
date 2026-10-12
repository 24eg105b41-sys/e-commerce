import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Laptop, Headphones, BookOpen, Layers, ShieldCheck, Zap } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axiosClient.get('/api/categories'),
          axiosClient.get('/api/products/featured'),
        ]);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        if (prodRes.success && prodRes.data) setFeaturedProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-campus-900 to-slate-900 text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 mt-4 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-500/20 border border-campus-400/30 text-campus-300 text-xs font-semibold uppercase tracking-wider">
            <Zap size={14} className="text-campus-400" />
            AU-R24 Capstone • Anna University Syllabus Aligned
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Smart Shopping for <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-300 to-blue-200">Smarter Students</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            The dedicated campus e-commerce platform for engineering textbooks, development laptops, ergonomic keyboards, hostel essentials, and AI-grounded product recommendations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-campus-500 hover:bg-campus-600 text-white font-semibold rounded-xl shadow-lg shadow-campus-500/25 transition-all text-sm"
            >
              <span>Explore Campus Catalog</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 transition-all text-sm"
            >
              <Sparkles size={16} className="text-campus-300" />
              <span>Ask AI Shopping Assistant</span>
            </Link>
          </div>
        </div>

        {/* Subtle Decorative Background Glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-campus-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Essential Student Categories</h2>
            <p className="text-sm text-slate-500">Everything needed for academics, coding labs, and campus living</p>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-campus-600 hover:text-campus-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading campus categories..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?categoryId=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between h-44 hover:border-campus-400"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-campus-50 group-hover:bg-campus-600 group-hover:text-white text-campus-600 flex items-center justify-center transition-colors mb-3">
                    <Layers size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-campus-600 text-sm transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="text-xs font-semibold text-campus-600 flex items-center gap-1">
                  <span>Browse Gear</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* AI Assistant Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-campus-50 via-indigo-50 to-purple-50 border border-campus-200/80 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-campus-700 font-semibold text-xs border border-campus-200 shadow-sm">
              <Sparkles size={14} className="text-campus-600" />
              Grounded AI Architecture
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Describe your coursework, lab specs, or budget.
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our campus assistant connects directly to actual inventory records. Search naturally with prompts like <span className="font-semibold text-slate-800">"Need a laptop under ₹60,000 for Java"</span> or <span className="font-semibold text-slate-800">"What is the hostel return policy?"</span> with zero hallucinated prices.
            </p>
          </div>
          <Link
            to="/ai-assistant"
            className="flex-shrink-0 campus-btn-primary !px-6 !py-3 font-semibold shadow-md text-sm"
          >
            <Sparkles size={16} />
            <span>Open AI Assistant</span>
          </Link>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Top Rated Student Picks</h2>
            <p className="text-sm text-slate-500">Most popular equipment and textbooks rated by campus peers</p>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-campus-600 hover:text-campus-700 flex items-center gap-1">
            <span>View All ({featuredProducts.length}+)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading student favorites..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
