require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to Database
connectDB();

// CORS middleware configuration
// Support dynamic origins to enable seamless secure cookies between front and back
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, mobile apps, etc.)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) ||
      (origin.endsWith('.vercel.app') && origin.includes('f1project-be2v'));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser Middleware (Crucial for reading Refresh Token cookie)
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
const f1Routes = require('./routes/f1Routes');
app.use('/api/f1', f1Routes);

// Health check endpoint (for CI/CD smoke test!)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]: ', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start server if not running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
