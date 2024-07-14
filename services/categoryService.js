const Factory = require('./handlersFactory');
const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../models/categoryModel');

exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeImage = AsyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;

  next();
});

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
