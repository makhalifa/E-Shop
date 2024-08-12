const AsyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const User = require('../models/userModel');

// @desc    Add Product to Wishlists
// @route   POST /api/v1/whishlists
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
