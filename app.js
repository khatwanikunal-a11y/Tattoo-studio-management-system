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
