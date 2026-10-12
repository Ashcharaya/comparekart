import React from 'react';

// Color name to CSS hex mapping
const colorMap = {
  'navy blue': '#1e3a8a',
  'olive green': '#556b2f',
  'white': '#ffffff',
  'maroon': '#800000',
  'pastel pink': '#fbcfe8',
  'sky blue': '#38bdf8',
  'mint green': '#6ee7b7',
  'charcoal black': '#1e293b',
  'heather grey': '#94a3b8',
  'beige': '#f5f5dc',
  'sage green': '#9ca3af',
  'dark indigo': '#312e81',
  'faded stone wash': '#60a5fa',
  'jet black': '#0f172a',
  'burgundy': '#831843',
  'midnight blue': '#0c4a6e',
  'dusty rose': '#fda4af',
  'military green': '#4d7c0f',
  'carbon black': '#18181b',
  'khaki': '#c2b280',
  'off-white': '#fdfbf7',
  'blush coral': '#fb7185',
  'sand beige': '#e5e5e5',
  'phantom black': '#111827',
  'glacier blue': '#93c5fd',
  'sunset orange': '#f97316',
  'titanium grey': '#4b5563',
  'forest emerald': '#065f46',
  'matte black': '#171717',
  'silver cloud': '#e2e8f0',
  'space grey': '#374151',
  'ruby red': '#be123c',
  'nude truffle': '#d6d3d1',
  'mauve kiss': '#d946ef',
  'spiced berry': '#9f1239'
};

export const ColorSwatch = ({
  colors = [],
  selectedColor = '',
  onSelectColor,
  size = 'md',
  interactive = true
}) => {
  if (!colors || colors.length === 0) return null;

  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  const getColorHex = (name) => {
    const clean = String(name).toLowerCase().trim();
    if (colorMap[clean]) return colorMap[clean];
    for (const [key, hex] of Object.entries(colorMap)) {
      if (clean.includes(key) || key.includes(clean)) return hex;
    }
    return '#94a3b8'; // fallback neutral
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {colors.map((color, index) => {
        const hex = getColorHex(color);
        const isSelected = selectedColor === color;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => onSelectColor && onSelectColor(color)}
            title={color}
            aria-label={`Select color ${color}`}
            className={`rounded-full border transition-all duration-150 relative ${sizeClass} ${
              isSelected
                ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900 border-white'
                : 'border-gray-300 dark:border-gray-600 hover:scale-110'
            } ${!interactive ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ backgroundColor: hex }}
          >
            {color.toLowerCase().includes('white') && (
              <span className="absolute inset-0 rounded-full border border-gray-200 pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ColorSwatch;
