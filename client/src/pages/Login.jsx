import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fillDemoCredentials = () => {
    setEmail('demo@comparekart.com');
    setPassword('password123');
    setErrors({});
  };

  const validate = () => {
    const errs = {};
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast('Signed in successfully! Welcome back.', 'success');
        navigate(redirect);
      } else {
        addToast(res.message || 'Invalid email or password', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            C
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white pt-2">
            Welcome to Compare<span className="text-accent">Kart</span>
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to access your saved comparisons, wishlist & orders
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-bold text-primary-700 dark:text-primary-300">Course Grader Demo Account</p>
            <p className="text-[11px] text-gray-500">demo@comparekart.com • password123</p>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Auto Fill</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                placeholder="name@example.com"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-xs ${
                  errors.password ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-slate-700">
          Don't have an account?{' '}
          <Link to={`/signup?redirect=${redirect}`} className="text-primary-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
