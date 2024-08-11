const Factory = require('./handlersFactory');
const Review = require('../models/reviewModel');

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
