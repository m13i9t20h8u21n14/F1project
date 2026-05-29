const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Authentication middleware to protect endpoints using Access Token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'd143c7b3997e29cb1fe0f9076e036e5200ee45db09ad841fb00c406855b46e31');

      // Attach user details to request
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Token Verification Error: ', error.message);
      
      // Send a distinct error message if the token expired so that the
      // frontend interceptor knows to call the /refresh-token endpoint.
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired. Please refresh token.',
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Rate limiter for authentication and password reset routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limit in tests to prevent failures
});

module.exports = {
  protect,
  authLimiter,
};
