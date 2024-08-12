const Factory = require('./handlersFactory');
const Review = require('../models/reviewModel');

// Nested route
exports.createFilterObj = (req, res, next) => {
  const filterObj = {};
  if (req.params.productId) filterObj.product = req.params.productId;
  req.filterObj = filterObj;
  next();
}

exports.setProductId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
}

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

// @desc    Get all Reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = Factory.getAll(Review);

// @desc    Get specific Review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = Factory.getOne(Review);

// @desc    Create new Reviews
// @route   POST /api/v1/reviews
// @access  Private - User

exports.createReview = Factory.createOne(Review);

// @desc    Update Review by id
// @route   PUT /api/v1/reviews/:id
// @access  Private - User
exports.updateReview = Factory.updateOne(Review);

// @desc    Delete Review by id
// @route   DELETE /api/v1/reviews/:id
// @access  Private - User, Moderator, Admin
exports.deleteReview = Factory.deleteOne(Review);
