const slugify = require('slugify');
const asyncHadler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  // 1) Filteration
  const queryStringOjb = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
  excludedFields.forEach((field) => delete queryStringOjb[field]);
  console.log(queryStringOjb);

  // 2) Advance filteration
  let queryStr = JSON.stringify(queryStringOjb);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

  // 3) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  // build query
  const mongooseQuery = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name -_id' });

  // 4) Sorting
  if (req.query.sort) {
    // sort=price,ratingsAverage
    const sortBy = req.query.sort.split(',').join(' '); // sort('price ratingsAverage')
    mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery.sort('-createdAt'); // default sorting
  }

  // 5) Field limiting
  if (req.query.fields) {
    console.log(req.query.fields);
    // fields=title,price
    const fields = req.query.fields.split(',').join(' '); // fields('title price')
    mongooseQuery.select(fields);
  } else {
    mongooseQuery.select('-__v');
  }

  // 6) Searching
  if (req.query.keyword) {
    // search by title or description
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } }, // i for case-insensitive
      { description: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // execute query
  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
};

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: 'category',
    select: 'name -_id',
  });
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
  if (req.body.title) req.body.slug = slugify(req.body.title);

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
