const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshToken,
  getMe,
} = require('../controllers/authController');
const { protect, authLimiter } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

// Session management routes
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
