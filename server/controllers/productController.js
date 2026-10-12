const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, pagination, and search
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      color,
      sort,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Brand filter (supports comma-separated list)
    if (brand) {
      const brands = brand.split(',').map(b => b.trim());
      query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter (minimum rating)
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Color filter
    if (color) {
      query.colors = { $in: [new RegExp(color, 'i')] };
    }

    // Keyword search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low-high') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high-low') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, reviewCount: -1 };
    } else if (sort === 'popularity') {
      sortOption = { popularity: -1, reviewCount: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Fetch related products in the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .sort({ rating: -1, popularity: -1 })
      .limit(4);

    res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unique brands grouped or filtered by category
// @route   GET /api/products/meta/brands
exports.getBrands = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const brands = await Product.distinct('brand', filter);
    res.json({
      success: true,
      brands: brands.sort()
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Live search suggestions (debounced)
// @route   GET /api/products/search/suggestions
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const suggestions = await Product.find(
      {
        $or: [
          { name: regex },
          { brand: regex },
          { category: regex }
        ]
      },
      'name brand category price images rating'
    )
      .limit(6);

    res.json({
      success: true,
      suggestions
    });
  } catch (err) {
    next(err);
  }
};
