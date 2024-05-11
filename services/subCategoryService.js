const SubCategory = require('../models/subCategoryModel');
const Factory = require('./handlersFactory');

// Middleware to set category id to body For Nested Post
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Middleware to create filter object for Nested Get All
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
exports.getSubCategory = Factory.getOne(SubCategory, {
  path: 'category',
  select: 'name -_id',
});

// @desc    Create new sub-category
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = Factory.createOne(SubCategory);

// @desc    Update sub-category by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = Factory.updateOne(SubCategory);

// @desc    Delete sub-category by id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = Factory.deleteOne(SubCategory);
