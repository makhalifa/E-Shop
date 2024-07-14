// Core modules 
const path = require('path');

// Third-party modules
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan'); // http request logger

dotenv.config({ path: 'config.env' });

// local modules
const ApiError = require('./utils/apiError');
const dbConnection = require('./config/database');
const globalError = require('./middlewares/errorMiddleware');

// Routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');

// connect wiht DB
dbConnection();

// express app
const app = express();

// middleware
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// routes
app.get('/', (req, res) => {
  res.send('Our Api');
});

// Mount routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);

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
