const express = require('express');
const router = express.Router();
const { compareProducts } = require('../controllers/compareController');

router.get('/', compareProducts);

module.exports = router;
