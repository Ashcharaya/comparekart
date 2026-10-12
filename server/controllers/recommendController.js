const Product = require('../models/Product');

// Parse query features string into key-value map or list
// Example: "ram:8,5g:yes,battery:5000" or "fabric:cotton,fit:slim" or "skinType:oily"
const parseFeatures = (featuresStr) => {
  if (!featuresStr) return {};
  const map = {};
  const pairs = featuresStr.split(',');

  for (const pair of pairs) {
    if (!pair.trim()) continue;
    const parts = pair.split(':');
    if (parts.length === 2) {
      map[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase();
    } else {
      map[pair.trim().toLowerCase()] = 'true';
    }
  }
  return map;
};

// Evaluate feature match against product schema and features object
const checkFeatureMatch = (product, reqKey, reqVal) => {
  const pFeatures = product.features || {};

  // Check product top-level properties or features object
  const searchValues = [];
  if (product.colors) searchValues.push(...product.colors.map(c => String(c).toLowerCase()));
  if (product.sizes) searchValues.push(...product.sizes.map(s => String(s).toLowerCase()));

  // Add all values from product.features
  Object.entries(pFeatures).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      searchValues.push({ key: k.toLowerCase(), val: String(v).toLowerCase() });
    }
  });

  const normalizedReqKey = reqKey.toLowerCase();
  const normalizedReqVal = reqVal.toLowerCase();

  // 1. Exact key match in features object
  const foundFeature = searchValues.find(item => item.key && (item.key === normalizedReqKey || item.key.includes(normalizedReqKey)));
  if (foundFeature) {
    // If requirement value is numeric (e.g. ram: 8, battery: 5000)
    const reqNum = parseFloat(normalizedReqVal);
    const actualNum = parseFloat(foundFeature.val);

    if (!isNaN(reqNum) && !isNaN(actualNum)) {
      return actualNum >= reqNum;
    }

    // Boolean or string match
    if (normalizedReqVal === 'true' || normalizedReqVal === 'yes') {
      return foundFeature.val === 'true' || foundFeature.val === 'yes' || foundFeature.val.includes('yes');
    }

    return foundFeature.val.includes(normalizedReqVal) || normalizedReqVal.includes(foundFeature.val);
  }

  // 2. Fallback check across string description or text
  const desc = (product.description + ' ' + product.name).toLowerCase();
  if (normalizedReqVal !== 'true' && normalizedReqVal !== 'yes') {
    return desc.includes(normalizedReqVal);
  }
  return desc.includes(normalizedReqKey);
};

// @desc    Smart recommendation engine
// @route   GET /api/recommend?category=&budget=&features=ram:8,5g:yes,battery:5000
exports.getRecommendations = async (req, res, next) => {
  try {
    const { category, budget, features } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const budgetNum = budget ? Number(budget) : null;
    if (budgetNum) {
      // Find within budget, allowing up to 10% tolerance if needed
      query.price = { $lte: budgetNum * 1.1 };
    }

    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.json({
        success: true,
        count: 0,
        recommendations: [],
        message: 'No products found within this category and budget.'
      });
    }

    const reqFeatures = parseFeatures(features);
    const featureKeys = Object.keys(reqFeatures);
    const totalReqFeatures = featureKeys.length;

    // Calculate scores for each product
    const scoredProducts = products.map(product => {
      let matchedCount = 0;
      const matchedFeatures = [];
      const missedFeatures = [];

      if (totalReqFeatures > 0) {
        featureKeys.forEach(key => {
          const val = reqFeatures[key];
          const matched = checkFeatureMatch(product, key, val);
          const displayLabel = `${key}: ${val}`;
          if (matched) {
            matchedCount++;
            matchedFeatures.push(displayLabel);
          } else {
            missedFeatures.push(displayLabel);
          }
        });
      }

      // Feature match % (0 to 100)
      const featureMatchPct = totalReqFeatures > 0
        ? (matchedCount / totalReqFeatures) * 100
        : 100;

      // Rating score normalized (0 to 100)
      const ratingPct = (product.rating / 5) * 100;

      // Price saving within budget (0 to 100)
      let priceSavingPct = 50; // default baseline if no budget
      if (budgetNum) {
        if (product.price <= budgetNum) {
          priceSavingPct = ((budgetNum - product.price) / budgetNum) * 100;
        } else {
          // slight penalty for exceeding budget
          priceSavingPct = 0;
        }
      }

      // Composite Score: (feature match % * 0.5) + (rating * 0.3) + (price saving * 0.2)
      const totalScore = (featureMatchPct * 0.5) + (ratingPct * 0.3) + (priceSavingPct * 0.2);

      // Value score: rating per rupee * 10000
      const valueScore = (product.rating / product.price) * 10000;

      return {
        product,
        totalScore: Math.round(totalScore * 10) / 10,
        featureMatchPct: Math.round(featureMatchPct),
        matchedCount,
        totalReqFeatures,
        matchedFeatures,
        missedFeatures,
        valueScore,
        savings: budgetNum ? Math.max(0, budgetNum - product.price) : 0,
        withinBudget: budgetNum ? product.price <= budgetNum : true
      };
    });

    // Sort by composite score descending
    scoredProducts.sort((a, b) => b.totalScore - a.totalScore);

    // Identify Best Value (highest rating per rupee)
    let bestValueItem = scoredProducts[0];
    scoredProducts.forEach(item => {
      if (item.valueScore > bestValueItem.valueScore) {
        bestValueItem = item;
      }
    });

    // Take top 10
    const topResults = scoredProducts.slice(0, 10).map((item, index) => ({
      ...item,
      isBestMatch: index === 0, // Highest composite score
      isBestValue: item.product._id.toString() === bestValueItem.product._id.toString()
    }));

    res.json({
      success: true,
      count: topResults.length,
      category: category || 'All',
      budget: budgetNum,
      totalRequestedFeatures: totalReqFeatures,
      recommendations: topResults
    });
  } catch (err) {
    next(err);
  }
};
