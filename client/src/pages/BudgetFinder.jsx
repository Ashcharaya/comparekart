import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  RotateCcw,
  ShoppingCart,
  Scale,
  Shirt,
  Smartphone,
  Trophy,
  Sparkle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BudgetSlider from '../components/BudgetSlider';
import FeatureSelector from '../components/FeatureSelector';
import { Spinner } from '../components/Loader';
import RatingStars from '../components/RatingStars';
import { formatPrice } from '../utils/formatPrice';
import productService from '../services/productService';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const CATEGORIES = [
  {
    name: 'Mobiles & Electronics Appliances',
    icon: Smartphone,
    desc: 'Smartphones, 5G devices, 4K TVs, inverter appliances & audio gear',
    defaultBudget: 25000,
    minBudget: 2000,
    maxBudget: 60000
  },
  {
    name: 'Clothes',
    icon: Shirt,
    desc: 'Men and women fashion, pure cotton tees, denim, jackets & activewear',
    defaultBudget: 2000,
    minBudget: 500,
    maxBudget: 5000
  },
  {
    name: 'Sports & Toys',
    icon: Trophy,
    desc: 'Cricket bats, footballs, carbon rackets, gym gear, RC trucks & STEM toys',
    defaultBudget: 3000,
    minBudget: 500,
    maxBudget: 10000
  },
  {
    name: 'Beauty Products',
    icon: Sparkle,
    desc: 'Vitamin C serums, mineral sunscreens, barrier creams & vegan hair oils',
    defaultBudget: 800,
    minBudget: 300,
    maxBudget: 2000
  }
];

export const BudgetFinder = () => {
  const { toggleCompare, isInCompare } = useCompare();
  const { addToCart, setBudgetLimit } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [budget, setBudget] = useState(CATEGORIES[0].defaultBudget);
  const [selectedFeatures, setSelectedFeatures] = useState(['5g:yes', 'battery:5000']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // When category changes, reset budget bounds & features
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat.name);
    setBudget(cat.defaultBudget);
    setSelectedFeatures([]);
  };

  const handleToggleFeature = (featureId) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  // Step 4: Run recommendation query
  const handleFetchRecommendations = async () => {
    setLoading(true);
    setHasSearched(true);
    setStep(4);

    // Save budget in cart context so user gets warned if cart exceeds budget
    setBudgetLimit(budget);

    try {
      const res = await productService.getRecommendations({
        category: selectedCategory,
        budget,
        features: selectedFeatures.join(',')
      });
      setResults(res.recommendations || []);
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      addToast('Failed to fetch recommendations. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryConfig = CATEGORIES.find(c => c.name === selectedCategory) || CATEGORIES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
          <Sparkles className="w-3.5 h-3.5" />
          SMART RECOMMENDATION ENGINE
        </span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Find the Perfect Product for Your Budget
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us your budget and what features you actually need. Our algorithm scores real market options to bring you the best value match.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { num: 1, label: 'Category' },
            { num: 2, label: 'Budget' },
            { num: 3, label: 'Features' },
            { num: 4, label: 'Results' }
          ].map(s => (
            <div
              key={s.num}
              className={`flex items-center justify-center gap-2 py-2 px-1 rounded-lg transition-colors ${
                step === s.num
                  ? 'bg-primary-500 text-white shadow-sm'
                  : step > s.num
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step === s.num ? 'bg-white text-primary-600' : 'border border-current'
              }`}>
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-all">
        {/* STEP 1: Choose Category */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Step 1: What are you looking to buy?
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select a category to customize available specifications and budget scales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 shadow-md ring-2 ring-primary-500/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Continue to Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Set Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Step 2: Set your ideal spending limit
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected category: <strong className="text-primary-600 dark:text-primary-400">{selectedCategory}</strong>
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-700/80">
              <BudgetSlider
                budget={budget}
                onChangeBudget={setBudget}
                min={currentCategoryConfig.minBudget}
                max={currentCategoryConfig.maxBudget}
                step={selectedCategory === 'Clothes' || selectedCategory === 'Beauty Products' ? 100 : 500}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Continue to Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Must-Have Features */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Step 3: Select your Must-Have specifications
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Budget: <strong>{formatPrice(budget)}</strong> for <strong>{selectedCategory}</strong>
              </p>
            </div>

            <FeatureSelector
              category={selectedCategory}
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
            />

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFetchRecommendations}
                className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Recommendations</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Ranked Results */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Smart Recommendation Results ({results.length})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Budget: <strong>{formatPrice(budget)}</strong> • Category: <strong>{selectedCategory}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Wizard</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Crunching specs, ratings and prices within your budget...
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-gray-500">
                  No direct products found within {formatPrice(budget)}. Try expanding your budget slightly or removing restrictive features.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Adjust Budget
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((item, idx) => {
                  const {
                    product,
                    totalScore,
                    matchedCount,
                    totalReqFeatures,
                    matchedFeatures,
                    missedFeatures,
                    isBestMatch,
                    isBestValue,
                    savings
                  } = item;

                  const inCompare = isInCompare(product._id);

                  return (
                    <div
                      key={product._id}
                      className={`relative p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-800 ${
                        isBestMatch
                          ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                          : isBestValue
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'border-gray-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-black text-gray-400">
                          #{idx + 1}
                        </span>

                        {isBestMatch && (
                          <span className="bg-primary-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" /> BEST MATCH ({totalScore}% SCORE)
                          </span>
                        )}

                        {isBestValue && (
                          <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Award className="w-3 h-3" /> BEST VALUE (RATING PER ₹)
                          </span>
                        )}

                        {savings > 0 && (
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Saves {formatPrice(savings)} within budget
                          </span>
                        )}
                      </div>

                      {/* Main Product Info & Grid */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Image & Title */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Link
                            to={`/product/${product._id}`}
                            className="w-24 h-24 bg-gray-50 dark:bg-slate-900 rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-slate-700"
                          >
                            <img
                              src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </Link>

                          <div className="min-w-0">
                            <span className="text-xs font-bold uppercase text-primary-600 dark:text-primary-400">
                              {product.brand}
                            </span>
                            <Link
                              to={`/product/${product._id}`}
                              className="block text-base font-bold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                {formatPrice(product.price)}
                              </span>
                              {product.oldPrice && product.oldPrice > product.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Feature Match Breakdown (Ticks & Crosses) */}
                        <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-200 dark:border-slate-700">
                            <span>Feature Match:</span>
                            <span className="text-primary-600 dark:text-primary-400 font-extrabold">
                              {totalReqFeatures > 0 ? `Matches ${matchedCount} of ${totalReqFeatures}` : '100%'}
                            </span>
                          </div>

                          {matchedFeatures.map((m, i) => (
                            <div key={`m-${i}`} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{m}</span>
                            </div>
                          ))}

                          {missedFeatures.map((m, i) => (
                            <div key={`ms-${i}`} className="flex items-center gap-1.5 text-rose-500 font-medium">
                              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{m}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex md:flex-col items-center gap-2 w-full md:w-36">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product, 1, product.colors?.[0] || '', product.sizes?.[0] || '');
                              addToast(`Added ${product.name} to cart`, 'success');
                            }}
                            className="flex-1 md:w-full flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-all"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const res = toggleCompare(product);
                              if (!res.success) addToast(res.message, 'error');
                              else addToast(res.action === 'removed' ? 'Removed from comparison' : 'Added to comparison', 'success');
                            }}
                            className={`flex-1 md:w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all ${
                              inCompare
                                ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600'
                                : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>{inCompare ? 'Comparing' : 'Compare'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetFinder;
