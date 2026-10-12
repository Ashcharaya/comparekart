import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Scale,
  Sparkles,
  Menu,
  X,
  PackageCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useTheme } from '../context/ThemeContext';
import useDebounce from '../hooks/useDebounce';
import productService from '../services/productService';
import { formatPrice } from '../utils/formatPrice';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { compareList } = useCompare();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch suggestions on debounced query
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await productService.getSearchSuggestions(debouncedQuery);
          setSuggestions(res.suggestions || []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/listing?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (item) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/product/${item._id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-primary-500 text-white shadow-md">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 md:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-primary-600 font-black text-2xl tracking-tighter">C</span>
              <span className="text-accent font-black text-2xl tracking-tighter">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
                Compare<span className="text-accent">Kart</span>
              </span>
              <span className="text-[10px] italic font-medium text-blue-100 -mt-1 flex items-center gap-1">
                Explore <span className="text-accent font-bold">Plus</span>
                <span className="text-accent text-[9px]">★</span>
              </span>
            </div>
          </Link>

          {/* Large Live Search with Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for Products, Brands, and Features (e.g. 5G, Pure Cotton, Serum)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                className="w-full bg-white text-gray-800 placeholder-gray-400 pl-4 pr-11 py-2.5 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 text-primary-500 hover:text-primary-700 flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                <div className="p-2 border-b border-gray-100 dark:border-slate-700 text-[11px] font-bold uppercase text-gray-400">
                  Product Suggestions
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700/60 text-left transition-colors"
                    >
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                        alt={item.name}
                        className="w-9 h-9 object-contain rounded bg-white dark:bg-slate-900 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.brand} • <span className="font-semibold text-primary-600 dark:text-primary-400">{formatPrice(item.price)}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Budget Finder Highlight Button */}
            <Link
              to="/budget-finder"
              className="hidden lg:flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs py-2 px-3 rounded-lg shadow transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Budget Finder</span>
            </Link>

            {/* Compare Tray Icon */}
            <Link
              to="/compare"
              className="relative p-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center text-white"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center text-white"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center text-white"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary-600 transition-colors text-white"
              aria-label="Toggle dark/light mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Account / Auth Dropdown */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-white text-primary-600 py-1.5 px-3 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 text-gray-800 dark:text-gray-200 text-xs font-medium z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <PackageCheck className="w-4 h-4 text-primary-500" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Wishlist</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-gray-50 dark:hover:bg-slate-700 border-t border-gray-100 dark:border-slate-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white hover:bg-blue-50 text-primary-600 font-bold text-xs py-1.5 px-4 rounded-lg shadow-sm transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 md:hidden text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar & Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-600 border-t border-primary-400 px-4 py-3 space-y-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2 rounded-lg text-sm"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary-500">
            <Link
              to="/budget-finder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-bold bg-accent text-white py-2 px-3 rounded-lg text-center"
            >
              Budget Finder
            </Link>
            <Link
              to="/listing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-bold bg-white/10 text-white py-2 px-3 rounded-lg text-center"
            >
              All Products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
