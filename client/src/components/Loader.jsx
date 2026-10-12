import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-primary-500 border-t-transparent ${sizeClasses[size] || sizeClasses.md} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse flex flex-col justify-between h-[390px]">
      <div>
        <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
      </div>
      <div>
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
        <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
    </div>
  );
};

export default Spinner;
