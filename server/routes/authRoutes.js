const express = require('express');
const router = express.Router();
const { signup, login, getMe, toggleWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
