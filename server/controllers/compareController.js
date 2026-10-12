const Product = require('../models/Product');

// @desc    Compare 2-4 products side-by-side with analysis & AI summary
// @route   GET /api/compare?ids=id1,id2,id3&budget=25000
exports.compareProducts = async (req, res, next) => {
  try {
    const { ids, budget } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product IDs to compare'
      });
    }

    const idList = ids.split(',').map(id => id.trim()).filter(Boolean);

    if (idList.length < 1 || idList.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'You can compare between 1 and 4 products'
      });
    }

    const products = await Product.find({ _id: { $in: idList } });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching products found for the given IDs'
      });
    }

    // Determine best price & best rating
    let minPriceProduct = products[0];
    let maxRatingProduct = products[0];

    products.forEach(p => {
      if (p.price < minPriceProduct.price) {
        minPriceProduct = p;
      }
      if (p.rating > maxRatingProduct.rating) {
        maxRatingProduct = p;
      }
    });

    const parsedBudget = budget ? Number(budget) : null;

    // Build intelligent summary
    let summary = '';
    const withinBudget = parsedBudget
      ? products.filter(p => p.price <= parsedBudget)
      : products;

    if (products.length === 1) {
      summary = `${products[0].name} has a rating of ${products[0].rating}/5 and is priced at Rs. ${products[0].price.toLocaleString('en-IN')}.`;
    } else if (withinBudget.length > 0) {
      // Find top rated within budget
      const bestChoice = withinBudget.reduce((prev, curr) =>
        (curr.rating > prev.rating || (curr.rating === prev.rating && curr.price < prev.price)) ? curr : prev
      );

      const savings = parsedBudget ? parsedBudget - bestChoice.price : 0;
      summary = `${bestChoice.name} is the best overall choice${
        parsedBudget ? ` within your Rs. ${parsedBudget.toLocaleString('en-IN')} budget` : ''
      } because it delivers a stellar rating of ${bestChoice.rating}/5 at Rs. ${bestChoice.price.toLocaleString('en-IN')}${
        savings > 0 ? `, saving you Rs. ${savings.toLocaleString('en-IN')}` : ''
      }.`;
    } else {
      summary = `All selected products exceed your Rs. ${parsedBudget.toLocaleString('en-IN')} budget. The closest option is ${minPriceProduct.name} at Rs. ${minPriceProduct.price.toLocaleString('en-IN')}.`;
    }

    // Prepare chart data for Recharts on frontend
    const chartData = products.map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 16) + '...' : p.name,
      fullName: p.name,
      price: p.price,
      rating: p.rating,
      budget: parsedBudget || null,
      savings: parsedBudget ? Math.max(0, parsedBudget - p.price) : 0,
      valueScore: Number(((p.rating / p.price) * 10000).toFixed(2))
    }));

    res.json({
      success: true,
      count: products.length,
      products,
      analysis: {
        bestPriceId: minPriceProduct._id,
        bestRatingId: maxRatingProduct._id,
        budget: parsedBudget,
        summary,
        chartData
      }
    });
  } catch (err) {
    next(err);
  }
};
