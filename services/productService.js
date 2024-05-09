const slugify = require('slugify');
const asyncHadler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find().skip(skip).limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
};

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError(404, `No product for this id ${id}`));
  }
  res.status(200).json({ data: product });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHadler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Update product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await Product.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true } // return updated data
  );

  if (!product) {
    return next(new ApiError(404, `No product for this id ${id}`));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(404, `No product for this id ${id}`));
  }
  res.status(204).send();
});
