// Load environment variables first (before anything else)
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (error) {
    console.warn('dotenv not found - run: npm install dotenv');
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const redisService = require('./services/redisService');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https:"]
        }
      }
    })
);

app.use(
    cors({
      origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());


app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'CV Maker API',
    version: '1.0.0',
    description: 'Session-based CV maker with PDF/Word export capabilities',
    endpoints: {
      api: '/api',
      health: '/api/health',
      cv: '/api/cv',
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    const redisHealth = await redisService.healthCheck();
    const sessionStats = await redisService.getSessionStats();
    res.json({
      status: redisHealth.connected ? 'OK' : 'Degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      redis: redisHealth,
      sessions: sessionStats,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Service Unavailable',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleErrors);

const gracefulShutdown = async (signal) => {
  try {
    await redisService.disconnect();
    const exportService = require('./services/exportService');
    await exportService.cleanup();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('uncaughtException', errorHandler.handleUncaughtException);
process.on('unhandledRejection', errorHandler.handleUnhandledRejection);

const startServer = async () => {
  try {
    const redisConnected = await redisService.connect();
    if (!redisConnected) {
      console.error('Redis connection failed. CV saving may not work.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
