const Factory = require('./handlersFactory');
const Coupon = require('../models/couponModel');

// @desc    Get all Coupons
// @route   GET /api/v1/coupons
// @access  Private - Admin,Moderator
exports.getCoupons = Factory.getAll(Coupon);

// @desc    Get specific Coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private - Admin,Moderator
exports.getCoupon = Factory.getOne(Coupon);

// @desc    Create new Coupon
// @route   POST /api/v1/coupons
// @access  Private - Admin, Moderator
exports.createCoupon = Factory.createOne(Coupon);

// @desc    Update Coupon by id
// @route   PUT /api/v1/coupons/:id
// @access  Private - Admin, Moderator
exports.updateCoupon = Factory.updateOne(Coupon);

// @desc    Delete Coupon by id
// @route   DELETE /api/v1/coupons/:id
// @access  Private - Admin
exports.deleteCoupon = Factory.deleteOne(Coupon);
