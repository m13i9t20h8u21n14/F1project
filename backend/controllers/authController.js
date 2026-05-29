const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = async (options) => {
  try {
    return await require('../config/mailer')(options);
  } catch (err) {
    console.error('Mailer failed', err);
  }
};

// Helper: Generate Access Token (Short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_ACCESS_SECRET || 'd143c7b3997e29cb1fe0f9076e036e5200ee45db09ad841fb00c406855b46e31',
    { expiresIn: '15m' }
  );
};

// Helper: Generate Refresh Token (Long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || '7f5b84c8a81ee0a82755f11181284a7ab5080ee11ad82fb00c406855b46e31',
    { expiresIn: '7d' }
  );
};

// Helper: Cookie options
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/', // Ensure cookie is sent for all routes, especially refresh-token
  };
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    // Create user
    const user = new User({ name, email, password });
    
    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user model
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup Error: ', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Handle token rotation or cleanup
    // We will clear existing tokens and append the new one to prevent accumulation
    user.refreshTokens = [refreshToken];
    await user.save();

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error: ', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public (Requires httpOnly cookie)
exports.refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        oldRefreshToken,
        process.env.JWT_REFRESH_SECRET || '7f5b84c8a81ee0a82755f11181284a7ab5080ee11ad82fb00c406855b46e31'
      );
    } catch (err) {
      // If token is invalid or expired
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Refresh Token Rotation (RTR) & Security
    // If the refresh token is NOT in the user's list of tokens
    if (!user.refreshTokens.includes(oldRefreshToken)) {
      // Token abuse scenario: This token may have been used and stolen!
      // Invalidate ALL sessions for this user for security.
      user.refreshTokens = [];
      await user.save();
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(403).json({
        success: false,
        message: 'Security breach suspected: Refresh token reused. Logging out all devices.',
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace the old refresh token with the new refresh token in the DB list
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Set new cookie
    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh Token Error: ', error);
    res.status(500).json({ success: false, message: 'Server error during token refresh' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Find the user who owns this refresh token and remove it from their database list
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || '7f5b84c8a81ee0a82755f11181284a7ab5080ee11ad82fb00c406855b46e31'
      );
      
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    }

    // Clear client cookie
    res.clearCookie('refreshToken', getCookieOptions());

    res.json({ success: true, message: 'Successfully logged out' });
  } catch (error) {
    // If jwt.verify fails due to malformed token, still clear cookies
    res.clearCookie('refreshToken', getCookieOptions());
    res.json({ success: true, message: 'Logged out (sessions cleaned)' });
  }
};

// @desc    Get current user profile (Protected route test)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get Profile Error: ', error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};
