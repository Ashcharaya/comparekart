import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  Scale,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check
} from 'lucide-react';
import productService from '../services/productService';
import RatingStars from '../components/RatingStars';
import ColorSwatch from '../components/ColorSwatch';
import ProductCard from '../components/ProductCard';
import { Spinner } from '../components/Loader';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const { isInWishlist, toggleWishlist } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        if (res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.images?.[0] || '');
          setSelectedColor(res.product.colors?.[0] || '');
          setSelectedSize(res.product.sizes?.[0] || '');
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link to="/listing" className="text-primary-600 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(product._id);
  const inWishlist = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.oldPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    addToast(`Added ${quantity} item(s) to your cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handleCompareClick = () => {
    const res = toggleCompare(product);
    if (!res.success) addToast(res.message, 'error');
    else addToast(res.action === 'removed' ? 'Removed from comparison' : 'Added to comparison', 'success');
  };

  const handleWishlistClick = async () => {
    const res = await toggleWishlist(product._id);
    if (res.requireAuth) addToast('Please login to use wishlist', 'info');
    else if (res.success) addToast(res.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist', 'success');
  };

  // Find lowest store price
  const lowestStorePrice = product.stores?.length > 0
    ? Math.min(...product.stores.map(s => s.price))
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to={`/listing?category=${encodeURIComponent(product.category)}`} className="hover:underline">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Quick Action Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-center min-h-[380px] overflow-hidden">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="max-h-[340px] max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />

            <button
              onClick={handleWishlistClick}
              className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-md transition-transform active:scale-90 ${
                inWishlist ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl p-1 bg-white dark:bg-slate-800 border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>ADD TO CART</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Ratings, Specs & Stores (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {product.brand}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-2.5">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />

              <button
                type="button"
                onClick={handleCompareClick}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                  inCompare
                    ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600'
                    : 'border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{inCompare ? 'Comparing Product' : 'Add to Compare'}</span>
              </button>
            </div>
          </div>

          {/* Price Strip */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700 flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color & Size Variant Selectors */}
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-700">
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-2">
                  Color: <span className="text-gray-900 dark:text-white">{selectedColor}</span>
                </label>
                <ColorSwatch
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                  size="lg"
                />
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-2">
                  Select Size / Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/60 text-primary-600 ring-2 ring-primary-500/20'
                          : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* "Available At" Store Prices (Cheapest Highlighted) */}
          {product.stores && product.stores.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Compare Prices Across Stores</span>
                <span className="text-xs font-normal text-emerald-600 font-semibold">
                  Cheapest from {formatPrice(lowestStorePrice)}
                </span>
              </h3>

              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {product.stores.map((store, idx) => {
                  const isCheapest = store.price === lowestStorePrice;

                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                          {store.name}
                          {isCheapest && (
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                              Lowest Price
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400">In stock • Genuine seller</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black ${isCheapest ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {formatPrice(store.price)}
                        </span>
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors"
                        >
                          <span>Go to Store</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.features && (
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Specifications & Features
              </h3>
              <div className="rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
                {Object.entries(product.features).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-3 text-xs">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="col-span-2 font-medium text-gray-900 dark:text-white">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-gray-100 dark:border-slate-700 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Similar in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(rel => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
