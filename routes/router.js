const express = require('express');

// Define router
const router = express.Router();

// Mount routes
const brandRoute = require('./brandRoute');
const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');

// Define routes for different resources
router.use('/brands', brandRoute);
router.use('/categories', categoryRoute);
router.use('/subcategories', subCategoryRoute);
router.use('/products', productRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;
