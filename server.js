// Core modules
const path = require('path');

// Third-party modules
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan'); // http request logger
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config({ path: 'config.env' });

// local modules
const ApiError = require('./utils/apiError');
const dbConnection = require('./config/database');
const globalError = require('./middlewares/errorMiddleware');

// connect wiht DB
dbConnection();

// express app
const app = express();

// routes
const routes = require('./routes/router');
const { webhookCheckout } = require('./services/orderService');

// webhook checkout
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// compression
app.use(compression());

// cors
app.use(cors());
app.options('*', cors());

// middleware
app.use(express.json({ limit: '10kb' })); // for parsing application/json, set limit to 10kb
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Sanitize data from user input like 'SQL Injection'
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 60 minutes).
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  limit: 100,
  message: 'Too many requests from this IP, please try again later!',
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ['price', 'sold', 'ratingsAverage', 'ratingsQuantity'],
  })
);

// routes
app.get('/', (req, res) => {
  res.send('Our Api');
});

// Mount routes
app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
  // catch all routes that are not defined
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`)); // throw error
});

// Global error handler middleware
app.use(globalError);

// server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
