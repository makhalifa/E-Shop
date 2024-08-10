const SubCategory = require('../models/subCategoryModel');
const Factory = require('./handlersFactory');

// NOTE: Middleware functions
// @desc    Middleware to set category id to body
// @route   POST /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// NOTE: Middleware functions
// @desc    Middleware to create filter object
// @route   GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  const filterObject = {};
  if (req.params.categoryId) filterObject.category = req.params.categoryId;
  req.filterObj = filterObject;
  next();
};

// @desc    Get all sub-categories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = Factory.getAll(SubCategory);

// @desc    Get specific sub-category by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = Factory.getOne(SubCategory);

// @desc    Create new sub-category
// @route   POST /api/v1/subcategories
// @access  Private - Admin, Moderator
exports.createSubCategory = Factory.createOne(SubCategory);

// @desc    Update sub-category by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private - Admin, Moderator
exports.updateSubCategory = Factory.updateOne(SubCategory);

// @desc    Delete sub-category by id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private - Admin
exports.deleteSubCategory = Factory.deleteOne(SubCategory);
