/**
 * Utility to calculate match scores and badges
 */
export const getScoreBadgeColor = (score) => {
  if (score >= 80) return 'bg-emerald-600 text-white';
  if (score >= 60) return 'bg-blue-600 text-white';
  if (score >= 40) return 'bg-amber-500 text-white';
  return 'bg-gray-500 text-white';
};

export const getRatingColor = (rating) => {
  if (rating >= 4.0) return 'bg-emerald-600 text-white';
  if (rating >= 3.0) return 'bg-amber-500 text-white';
  return 'bg-red-500 text-white';
};
