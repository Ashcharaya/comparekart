const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  url: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Clothes',
      'Mobiles & Electronics Appliances',
      'Sports & Toys',
      'Beauty Products'
    ],
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
    index: true
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
    index: true
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  features: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  images: {
    type: [String],
    default: []
  },
  stores: {
    type: [storeSchema],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for fast search queries
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
