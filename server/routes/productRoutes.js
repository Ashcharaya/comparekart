const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getBrands,
  getSearchSuggestions
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/meta/brands', getBrands);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:id', getProductById);

module.exports = router;
