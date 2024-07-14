const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');
const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Brand = require('../models/brandModel');

exports.uploadBrandImage = uploadSingleImage('image');

exports.resizeImage = AsyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `brand-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg') 
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

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
