const slugify = require('slugify');
const asyncHadler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Category = require('../models/categoryModel');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getcategories = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
};

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(404, `No category for this id ${id}`));
  }
  res.status(200).json({ data: category });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHadler(async (req, res) => {
  const {name} = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc    Update category by id
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // const category = await Category.findByIdAndUpdate(
  //   id,
  //   { name, slug: slugify(name) },
  //   { new: true }
  // );

  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } // return updated data
  );

  if (!category) {
    return next(new ApiError(404, `No category for this id ${id}`));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete category by id
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(404, `No category for this id ${id}`));
  }
  res.status(204).json({ msg: 'Category deleted successfully ✅✅✅' });
});
