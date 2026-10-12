import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
      <div className="w-24 h-24 rounded-3xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center shadow-inner">
        <span className="text-4xl font-black">404</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Oops! Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        The product, comparison or link you requested might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>

        <Link
          to="/budget-finder"
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-xs py-3 px-5 rounded-xl shadow transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Budget Finder</span>
        </Link>

        <Link
          to="/listing"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs py-3 px-5 rounded-xl transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
