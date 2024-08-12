const AsyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add Product to Wishlist
// @route   POST /api/v1/wishlist
// @access  Private - User
exports.addToWishlist = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  ).exec();

  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist',
    data: user.wishlist,
  });
});

// @desc    Remove Product from Wishlist
// @route   DELETE /api/v1/wishlist
// @access  Private - User
exports.removeFromWishlist = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  ).exec();

  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist',
    data: user.wishlist,
  });
});

// @desc    Get logged User wishlist
// @route   GET /api/v1/wishlist
// @access  Private - User
exports.getLoggedUserWishlist = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name slug price',
  });

  res.status(200).json({ data: user.wishlist });
});
