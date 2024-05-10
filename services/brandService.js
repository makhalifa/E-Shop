const slugify = require('slugify');
const asyncHadler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Brand = require('../models/brandModel');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = async (req, res) => {
  // build query
  const countDocuments = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
  .paginate(countDocuments)
  .filter()
  .search()
  .limitFields()
  .sort();

  // execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery; 
  res.status(200).json({ results: brands.length, paginationResult, data: brands });
};

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(404, `No brand for this id ${id}`));
  }
  res.status(200).json({ data: brand });
});

// @desc    Create new brand
// @route   POST /api/v1/Brands
// @access  Private
exports.createBrand = asyncHadler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc    Update brand by id
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } // return updated data
  );

  if (!brand) {
    return next(new ApiError(404, `No brand for this id ${id}`));
  }
  res.status(200).json({ data: brand });
});

// @desc    Delete brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = asyncHadler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(404, `No brand for this id ${id}`));
  }
  res.status(204).send();
});
