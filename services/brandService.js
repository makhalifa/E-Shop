const Brand = require('../models/brandModel');
const Factory = require('./handlersFactory');

// @desc    Get all Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = Factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = Factory.getOne(Brand);

// @desc    Create new brand
// @route   POST /api/v1/Brands
// @access  Private
exports.createBrand = Factory.createOne(Brand);

// @desc    Update brand by id
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = Factory.updateOne(Brand);

// @desc    Delete brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = Factory.deleteOne(Brand);
