import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const Signup = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await signup(name, email, password);
      if (res.success) {
        addToast('Account created successfully! Welcome to CompareKart.', 'success');
        navigate(redirect);
      } else {
        addToast(res.message || 'Failed to create account', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            C
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white pt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500">
            Join thousands of smart shoppers comparing products on CompareKart
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Verma"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohit@example.com"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Password (min. 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.password ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-slate-700">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="text-primary-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
