import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  Share2,
  Trash2,
  PlusCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import productService from '../services/productService';
import CompareTable from '../components/CompareTable';
import { Spinner } from '../components/Loader';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../components/Toast';
import { formatPrice } from '../utils/formatPrice';

export const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { compareList, clearCompare, compareBudget, setCompareBudget } = useCompare();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read IDs from query or from CompareContext
  const idsParam = searchParams.get('ids');
  const budgetParam = searchParams.get('budget');

  const currentIds = idsParam
    ? idsParam.split(',').filter(Boolean)
    : compareList.map(p => p._id);

  const budget = budgetParam ? Number(budgetParam) : compareBudget;

  useEffect(() => {
    const fetchComparison = async () => {
      if (currentIds.length === 0) {
        setProducts([]);
        setAnalysis(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await productService.compareProducts(currentIds, budget);
        setProducts(res.products || []);
        setAnalysis(res.analysis || null);
      } catch (err) {
        console.error('Failed to compare products:', err);
        addToast('Failed to load comparison data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [idsParam, budgetParam, compareList.length]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    addToast('Comparison link copied to clipboard!', 'success');
  };

  const handleBudgetChange = (newBudget) => {
    setCompareBudget(newBudget);
    const newParams = new URLSearchParams(searchParams);
    if (newBudget) {
      newParams.set('budget', newBudget.toString());
    } else {
      newParams.delete('budget');
    }
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-gray-500">Loading side-by-side comparison...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-500 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          No Products Selected for Comparison
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Add 2 to 4 products from the catalog or budget finder to view a full spec-by-spec comparison and auto-generated summary.
        </p>
        <Link
          to="/listing"
          className="inline-block bg-primary-600 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md hover:bg-primary-700 transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Share Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            Side-by-Side Comparison
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-0.5">
            Comparing {products.length} Products
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-primary-500 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4 text-primary-500" />
            <span>Share Comparison</span>
          </button>

          <Link
            to="/listing"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add More</span>
          </Link>

          <button
            type="button"
            onClick={clearCompare}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Auto-Generated Natural Language Summary Banner */}
      {analysis?.summary && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
              CompareKart Smart Recommendation Summary
            </h4>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1 leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>
      )}

      {/* Budget Filter vs Price Indicator */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-accent flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Price vs Budget Evaluation
            </h4>
            <p className="text-xs text-gray-500">
              Set your target budget to highlight savings and feasibility
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Target Budget:</span>
          <input
            type="number"
            step="500"
            placeholder="e.g. 25000"
            value={budget || ''}
            onChange={(e) => handleBudgetChange(e.target.value ? Number(e.target.value) : null)}
            className="w-36 px-3 py-1.5 text-xs font-bold bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Recharts Bar Chart Visualizing Price Comparison */}
      {analysis?.chartData && analysis.chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Price & Rating Analytics Chart</span>
            </h3>
            <span className="text-xs text-gray-400">Interactive visual metrics</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analysis.chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#2874f0" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 5]} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Price (₹)') return [formatPrice(value), name];
                    return [value, name];
                  }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="price" name="Price (₹)" fill="#2874f0" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="rating" name="Rating (★/5)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Side-by-Side Detailed Compare Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Detailed Specifications Matrix
        </h3>
        <CompareTable products={products} analysis={analysis || {}} />
      </div>
    </div>
  );
};

export default Compare;
