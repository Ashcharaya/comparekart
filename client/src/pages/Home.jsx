import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Scale,
  Shirt,
  Smartphone,
  Trophy,
  Sparkle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Loader';
import { formatPrice } from '../utils/formatPrice';

const CATEGORIES = [
  { name: 'Clothes', icon: Shirt, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
  { name: 'Mobiles & Electronics Appliances', icon: Smartphone, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
  { name: 'Sports & Toys', icon: Trophy, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
  { name: 'Beauty Products', icon: Sparkle, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' }
];

const BUDGET_CARDS = [
  { label: 'Under ₹10,000', subtitle: 'Budget Essentials & Everyday Picks', min: 0, max: 10000, color: 'from-blue-600 to-indigo-700' },
  { label: '₹10,000 - ₹20,000', subtitle: 'Best Value Mid-Range Performers', min: 10000, max: 20000, color: 'from-emerald-600 to-teal-700' },
  { label: '₹20,000 - ₹40,000', subtitle: 'Premium Features & Performance', min: 20000, max: 40000, color: 'from-amber-500 to-orange-600' },
  { label: '₹40,000+', subtitle: 'Flagships, High-End Tech & Luxury', min: 40000, max: 150000, color: 'from-purple-600 to-indigo-800' }
];

const HERO_SLIDES = [
  {
    title: 'Stop Guessing. Start Comparing.',
    subtitle: 'Choose your budget, pick must-have features, and find the smartest match in seconds.',
    cta: 'Launch Budget Finder',
    ctaLink: '/budget-finder',
    badge: 'SMART BUYING ASSISTANT',
    bg: 'bg-gradient-to-r from-blue-700 via-primary-600 to-indigo-800'
  },
  {
    title: 'Flagship 5G Mobiles & Gadgets',
    subtitle: 'Side-by-side specs, camera stabilization tests, and real-time lowest store pricing.',
    cta: 'Compare Mobiles',
    ctaLink: '/listing?category=Mobiles%20%26%20Electronics%20Appliances',
    badge: 'ELECTRONICS MEGA DEALS',
    bg: 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950'
  },
  {
    title: 'Premium Fashion & Pure Cotton Fits',
    subtitle: 'Filter by fabric, fit, gender, and color swatches with verified user ratings.',
    cta: 'Explore Apparel',
    ctaLink: '/listing?category=Clothes',
    badge: 'CURATED WARDROBE',
    bg: 'bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700'
  }
];

export const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [mostComparedProducts, setMostComparedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-advance banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch top-rated and popular products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topRes, compRes] = await Promise.all([
          productService.getProducts({ sort: 'rating', limit: 8 }),
          productService.getProducts({ sort: 'popularity', limit: 8 })
        ]);
        setTopRatedProducts(topRes.products || []);
        setMostComparedProducts(compRes.products || []);
      } catch (err) {
        console.error('Home product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Category Strip */}
      <section className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-100 dark:border-slate-700/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/listing?category=${encodeURIComponent(cat.name)}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-gray-400">Explore & Compare</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Hero Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[300px] sm:min-h-[360px] flex items-center text-white">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 p-8 sm:p-14 flex flex-col justify-center transition-opacity duration-700 ${slide.bg} ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm tracking-wider uppercase text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <span>{slide.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/listing"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl backdrop-blur-sm transition-all"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-white w-7' : 'bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop By Budget Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Shop by Budget
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Curated product brackets to maximize value without overspending
            </p>
          </div>
          <Link
            to="/budget-finder"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUDGET_CARDS.map((bCard, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/listing?minPrice=${bCard.min}&maxPrice=${bCard.max}`)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${bCard.color} text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-44`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Budget Filter
                </span>
                <h3 className="text-xl font-black mt-1">{bCard.label}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{bCard.subtitle}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-xs font-semibold">Browse Bracket</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Top Rated in Your Budget (Products Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              Top Rated Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Highest user satisfaction across all categories
            </p>
          </div>
          <Link
            to="/listing?sort=rating"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {topRatedProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Most Compared Products (Horizontal Scroll Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary-500" />
              Most Compared Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Trending items frequently evaluated side-by-side by shoppers
            </p>
          </div>
          <Link
            to="/listing?sort=popularity"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[260px] max-w-[280px]">
                <CardSkeleton />
              </div>
            ))
          ) : (
            mostComparedProducts.map(product => (
              <div key={product._id} className="min-w-[260px] max-w-[280px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. Popular Brands Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Compare Across India's Favorite Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
            {['PixelTech', 'Roadster', 'GlowScience', 'DermaShield', 'WillowKing', 'SonicAura', 'FlexFit', 'CoolCraft'].map(brand => (
              <button
                key={brand}
                onClick={() => navigate(`/listing?brand=${encodeURIComponent(brand)}`)}
                className="text-sm md:text-base font-extrabold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
