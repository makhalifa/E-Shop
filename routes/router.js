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
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');
const addressRoute = require('./addressRoute');
const couponRoute = require('./couponRoute');
const cartRoute = require('./cartRoute');
const orderRoute = require('./orderRoute');

// Define routes for different resources
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/brands', brandRoute);
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/subcategories', subCategoryRoute);
router.use('/reviews', reviewRoute);
router.use('/wishlist', wishlistRoute);
router.use('/addresses', addressRoute);
router.use('/coupons', couponRoute);
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);

module.exports = router;
