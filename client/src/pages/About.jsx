import React from 'react';
import { Sparkles, Scale, ShieldCheck, Zap, Code, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
          <Sparkles className="w-3.5 h-3.5" />
          ABOUT COMPAREKART
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Smarter Product Decisions Built on Transparent Data
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          CompareKart bridges the gap between endless e-commerce options and real customer budgets.
          Compare specs side by side, discover hidden savings, and get mathematically verified recommendations.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Budget-First Intelligence
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Instead of pushing high-margin products, our engine respects your exact rupee ceiling and maximizes specifications within it.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Unbiased Side-by-Side Matrix
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Place up to 4 items on a single comparison grid. Compare battery life, RAM, fabrics, skin types, and cross-store pricing with zero bias.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Best Value Formula
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our proprietary "Rating per Rupee" metric pinpoints products that punch well above their weight class, giving you true bang for your buck.
          </p>
        </div>
      </div>

      {/* Recommendation Formula Breakdown */}
      <div className="bg-gradient-to-br from-primary-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Algorithm Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            How CompareKart Recommendations Work
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Every candidate product within your selected category is evaluated through our weighted multi-factor scoring function:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-2xl font-black text-amber-300">50%</span>
            <h4 className="font-bold text-sm">Feature Match Ratio</h4>
            <p className="text-xs text-blue-100">
              Evaluates hard specs (e.g. 5G, 8GB RAM, Pure Cotton, SPF 50) directly against the user's must-have checklist.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-2xl font-black text-emerald-300">30%</span>
            <h4 className="font-bold text-sm">Normalized User Rating</h4>
            <p className="text-xs text-blue-100">
              Weighed review scores based on genuine customer satisfaction and return reliability.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-2xl font-black text-blue-300">20%</span>
            <h4 className="font-bold text-sm">Price Savings Ratio</h4>
            <p className="text-xs text-blue-100">
              Rewards products that deliver all requested capabilities well below your upper budget limit.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack for Course Submission */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            MERN Tech Stack Implementation
          </h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Engineered with MongoDB, Express.js, React (Vite + Hooks), Node.js, Tailwind CSS, Recharts, and JWT Auth.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <p className="font-bold text-gray-800 dark:text-gray-100">Frontend</p>
            <p className="text-gray-500 text-[11px]">React + Vite + Recharts</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <p className="font-bold text-gray-800 dark:text-gray-100">Backend</p>
            <p className="text-gray-500 text-[11px]">Node.js + Express REST</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <p className="font-bold text-gray-800 dark:text-gray-100">Database</p>
            <p className="text-gray-500 text-[11px]">MongoDB with Mongoose</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <p className="font-bold text-gray-800 dark:text-gray-100">Security</p>
            <p className="text-gray-500 text-[11px]">JWT + Bcrypt Hashing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
