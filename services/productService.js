const Product = require('../models/productModel');
const Factory = require('./handlersFactory');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = Factory.getAll(Product);

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = Factory.getOne(Product);

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = Factory.createOne(Product);

// @desc    Update product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = Factory.updateOne(Product);

// @desc    Delete product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = Factory.deleteOne(Product);
