import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, phone);
      navigate('/catalog');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-campus-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Student Account</h1>
          <p className="text-xs text-slate-500">Join ShopSphere Campus to order books and gear with hostel drop</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name & Degree</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Arun Kumar (CSE)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="campus-input pl-9"
                required
              />
              <User className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University / College Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="campus-input pl-9"
                required
              />
              <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="campus-input pl-9"
                required
              />
              <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Minimum 6 characters"
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
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-campus-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
