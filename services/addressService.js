const AsyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add Address to user addresses list
// @route   POST /api/v1/addresses
// @access  Private - User
exports.addAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { addresses: req.body } },
    { new: true }
  ).exec();

  res.status(200).json({
    status: 'success',
    message: 'Address added successfully',
    result: user.addresses.length,
    data: user.addresses,
  });
});

// @desc    Remove Address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private - User
exports.removeAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true }
  ).exec();

  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully',
    result: user.addresses.length,
    data: user.addresses,
  });
});

// @desc    Get logged User Addresses
// @route   GET /api/v1/addresses
// @access  Private - User
exports.getLoggedUserAddresses = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).exec();

  res.status(200).json({
    status: 'success',
    result: user.addresses.length,
    data: user.addresses,
  });
});
