import React from 'react';
import { Star } from 'lucide-react';
import { getRatingColor } from '../utils/matchScore';

export const RatingStars = ({ rating = 0, reviewCount, size = 'sm', showCount = true }) => {
  const numericRating = Number(rating).toFixed(1);
  const colorClass = getRatingColor(rating);

  const badgePadding = size === 'lg' ? 'px-3 py-1 text-sm' : size === 'md' ? 'px-2 py-0.5 text-xs' : 'px-1.5 py-0.5 text-xs';
  const starSize = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div className="inline-flex items-center gap-1.5 font-medium">
      <span className={`inline-flex items-center gap-1 rounded font-bold ${badgePadding} ${colorClass}`}>
        <span>{numericRating}</span>
        <Star className={`${starSize} fill-current`} />
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
