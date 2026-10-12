import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, SlidersHorizontal, PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Loader';
import productService from '../services/productService';

export const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter States from URL or defaults
  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'popularity';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const selectedBrands = searchParams.get('brand') ? searchParams.get('brand').split(',') : [];
  const selectedRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;
  const selectedColor = searchParams.get('color') || '';

  // Fetch unique brands when category changes
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await productService.getBrands(category === 'All' ? '' : category);
        setBrands(res.brands || []);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, [category]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: category === 'All' ? '' : category,
          search,
          sort,
          page,
          limit: 12
        };

        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
        if (selectedRating) params.rating = selectedRating;
        if (selectedColor) params.color = selectedColor;

        const res = await productService.getProducts(params);
        setProducts(res.products || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Query parameter update helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, value.toString());
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleToggleBrand = (brandName) => {
    const nextBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter(b => b !== brandName)
      : [...selectedBrands, brandName];
    updateQueryParam('brand', nextBrands);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Sort Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">
            {search ? `Search results for "${search}"` : category === 'All' ? 'All Products' : category}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Showing {products.length} of {totalCount} items
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sort}
              onChange={(e) => updateQueryParam('sort', e.target.value)}
              className="bg-gray-50 dark:bg-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterSidebar
            category={category}
            onSelectCategory={(cat) => updateQueryParam('category', cat)}
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            selectedMaxPrice={maxPrice ? Number(maxPrice) : null}
            onChangePrice={(p) => updateQueryParam('maxPrice', p)}
            selectedRating={selectedRating}
            onSelectRating={(r) => updateQueryParam('rating', r)}
            selectedColor={selectedColor}
            onSelectColor={(c) => updateQueryParam('color', c)}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFiltersOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <FilterSidebar
              category={category}
              onSelectCategory={(cat) => updateQueryParam('category', cat)}
              brands={brands}
              selectedBrands={selectedBrands}
              onToggleBrand={handleToggleBrand}
              selectedMaxPrice={maxPrice ? Number(maxPrice) : null}
              onChangePrice={(p) => updateQueryParam('maxPrice', p)}
              selectedRating={selectedRating}
              onSelectRating={(r) => updateQueryParam('rating', r)}
              selectedColor={selectedColor}
              onSelectColor={(c) => updateQueryParam('color', c)}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                No matching products found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters, choosing a different price bracket, or clearing the search terms.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-2 inline-block bg-primary-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateQueryParam('page', page - 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => updateQueryParam('page', pNum)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      page === pNum
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateQueryParam('page', page + 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
