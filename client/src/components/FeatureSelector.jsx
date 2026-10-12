import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const CATEGORY_FEATURES = {
  'Mobiles & Electronics Appliances': [
    { id: '5g:yes', label: '5G Connectivity', key: '5g', val: 'yes' },
    { id: 'ram:8', label: '8GB+ RAM', key: 'ram', val: '8' },
    { id: 'battery:5000', label: '5000mAh+ Battery', key: 'battery', val: '5000' },
    { id: 'display:amoled', label: 'AMOLED Display', key: 'display', val: 'amoled' },
    { id: 'camera:64mp', label: 'High-Res Camera (64MP+)', key: 'camera', val: '64mp' },
    { id: 'charging:fast', label: 'Turbo / Fast Charging', key: 'charging', val: 'fast' },
    { id: 'energyRating:5', label: '5-Star Energy Saver', key: 'energyRating', val: '5' }
  ],
  'Clothes': [
    { id: 'fabric:cotton', label: 'Pure Cotton / Linen', key: 'fabric', val: 'cotton' },
    { id: 'fit:slim', label: 'Slim Fit', key: 'fit', val: 'slim' },
    { id: 'gender:men', label: "Men's Apparel", key: 'gender', val: 'men' },
    { id: 'gender:women', label: "Women's Apparel", key: 'gender', val: 'women' },
    { id: 'stretch:active', label: '4-Way Stretch / Active', key: 'stretch', val: 'stretch' },
    { id: 'waterproof:light', label: 'Waterproof / All-Weather', key: 'waterproof', val: 'waterproof' }
  ],
  'Sports & Toys': [
    { id: 'material:carbon', label: 'Carbon Fiber / English Willow', key: 'material', val: 'willow' },
    { id: 'safety:non-toxic', label: 'Non-Toxic / BPA-Free Safe', key: 'safety', val: 'safe' },
    { id: 'weight:light', label: 'Lightweight Design', key: 'weight', val: 'light' },
    { id: 'ageGroup:adult', label: 'Adult / Pro Grade', key: 'ageGroup', val: 'adult' },
    { id: 'speed:high', label: 'High Speed / Motorized', key: 'speed', val: 'speed' }
  ],
  'Beauty Products': [
    { id: 'ingredients:vitaminc', label: 'Vitamin C / Retinol Active', key: 'ingredients', val: 'vitamin' },
    { id: 'spf:50', label: 'SPF 50+ Sun Protection', key: 'spf', val: '50' },
    { id: 'skinType:oily', label: 'Oily & Acne Clarifying', key: 'skinType', val: 'oily' },
    { id: 'skinType:dry', label: 'Deep Hydration & Barrier Repair', key: 'skinType', val: 'dry' },
    { id: 'crueltyFree:yes', label: 'Paraben-Free & Vegan', key: 'crueltyFree', val: 'yes' }
  ]
};

export const FeatureSelector = ({
  category = 'Mobiles & Electronics Appliances',
  selectedFeatures = [],
  onToggleFeature
}) => {
  const featuresList = CATEGORY_FEATURES[category] || CATEGORY_FEATURES['Mobiles & Electronics Appliances'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary-500" />
          Must-Have Features ({selectedFeatures.length} selected)
        </label>
        <span className="text-xs text-gray-400">Select what matters to you</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {featuresList.map((feat) => {
          const isSelected = selectedFeatures.includes(feat.id);

          return (
            <button
              key={feat.id}
              type="button"
              onClick={() => onToggleFeature(feat.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                isSelected
                  ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <span>{feat.label}</span>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-primary-500 text-white'
                    : 'border border-gray-300 dark:border-slate-600'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSelector;
