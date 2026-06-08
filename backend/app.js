const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const designRoutes = require('./routes/designs');
const pricingRoutes = require('./routes/pricing');

function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many login attempts, please try again later.' }
  });

  app.use('/api/', limiter);
  app.use('/api/auth/', authLimiter);
  app.use(cors());
  app.use(express.json({ limit: '10kb' }));
  app.use(morgan('dev'));
  app.use(express.static(path.join(__dirname, '../frontend')));

  app.use('/api/auth', authRoutes);
  app.use('/api/artists', artistRoutes);
  app.use('/api/designs', designRoutes);
  app.use('/api/pricing', pricingRoutes);

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
  });

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
