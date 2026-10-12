import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-24 sm:pb-16 border-t border-slate-800">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white text-sm">100% Genuine Comparisons</h5>
            <p className="text-xs text-gray-400">Unbiased specs, price histories and store ratings</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white text-sm">Free Delivery on ₹999+</h5>
            <p className="text-xs text-gray-400">Fast, secure tracked doorstep delivery across India</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white text-sm">7-Day Easy Returns</h5>
            <p className="text-xs text-gray-400">Hassle-free demo return and replacement policy</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white text-sm">Smart Buying Assistant</h5>
            <p className="text-xs text-gray-400">Budget matching algorithms tailored to your needs</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-black text-xl">
                C
              </div>
              <span className="text-xl font-black text-white">
                Compare<span className="text-accent">Kart</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
              CompareKart is India's leading smart product comparison and recommendation engine.
              Find your ideal budget, evaluate key features side-by-side, and make confident shopping decisions.
            </p>
            <p className="text-xs text-gray-500">
              Built for MERN Stack Full-Stack Course Project.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Categories
            </h6>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/listing?category=Clothes" className="hover:text-primary-400 transition-colors">
                  Clothes & Fashion
                </Link>
              </li>
              <li>
                <Link to="/listing?category=Mobiles%20%26%20Electronics%20Appliances" className="hover:text-primary-400 transition-colors">
                  Mobiles & Electronics
                </Link>
              </li>
              <li>
                <Link to="/listing?category=Sports%20%26%20Toys" className="hover:text-primary-400 transition-colors">
                  Sports & Toys
                </Link>
              </li>
              <li>
                <Link to="/listing?category=Beauty%20Products" className="hover:text-primary-400 transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Features */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Smart Tools
            </h6>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/budget-finder" className="hover:text-primary-400 transition-colors">
                  Budget Finder Wizard
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-primary-400 transition-colors">
                  Side-by-Side Compare
                </Link>
              </li>
              <li>
                <Link to="/listing" className="hover:text-primary-400 transition-colors">
                  Full Catalog
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-primary-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & About */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Company & Help
            </h6>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center gap-1">
          &copy; {new Date().getFullYear()} CompareKart Inc. All rights reserved. Crafted with{' '}
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for modern smart shoppers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
