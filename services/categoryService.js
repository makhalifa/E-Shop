// Description: Service for category routes.
const Category = require('../models/categoryModel');
const Factory = require('./handlersFactory');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getcategories = Factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = Factory.getOne(Category);

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = Factory.createOne(Category);

// @desc    Update category by id
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = Factory.updateOne(Category);

// @desc    Delete category by id
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = Factory.deleteOne(Category);
