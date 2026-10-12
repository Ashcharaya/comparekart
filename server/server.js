const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { autoSeedDatabase } = require('./data/seed');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/grading
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the built React app from the same origin as the API in production.
const clientDist = path.resolve(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CompareKart API'
  });
});

// Mount Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/compare', require('./routes/compareRoutes'));
app.use('/api/recommend', require('./routes/recommendRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Client-side routes (for example /product/:id) must load the SPA on refresh.
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await autoSeedDatabase();
    const server = app.listen(PORT, () => {
      console.log(`🚀 CompareKart server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
    return server;
  } catch (error) {
    console.error(`[Startup Error] ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
