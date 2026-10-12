import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userProfile = await login(email, password);
      if (userProfile.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/catalog';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillStudentDemo = () => {
    setEmail('student@shopsphere.edu');
    setPassword('Student@Campus2026');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@shopsphere.edu');
    setPassword('Admin@Campus2026');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-campus-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student & Faculty Sign In</h1>
          <p className="text-xs text-slate-500">Access your saved wishlist, orders, and campus delivery</p>
        </div>

        {/* Quick Demo Credentials Box for Evaluation */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Capstone Evaluation Shortcuts:</span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-slate-700 font-medium flex items-center justify-center gap-1.5 text-[11px] transition-colors"
            >
              <UserCheck size={13} className="text-campus-600" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-slate-700 font-medium flex items-center justify-center gap-1.5 text-[11px] transition-colors"
            >
              <ShieldCheck size={13} className="text-purple-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="student@shopsphere.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="campus-input pl-9"
                required
              />
              <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="campus-input pl-9"
                required
              />
              <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full campus-btn-primary !py-3 font-bold text-sm shadow-md"
          >
            <span>{loading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>New student to ShopSphere? </span>
          <Link to="/register" className="font-bold text-campus-600 hover:underline">
            Register your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
