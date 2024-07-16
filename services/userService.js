const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');
const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');

exports.uploadUserImage = uploadSingleImage('profileImg');

exports.resizeImage = AsyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/users/${filename}`);

  req.body.profileImg = filename;

  next();
});

exports.removePasswordField = (req, res, next) => {
  if (req.body.password) delete req.body.password;
  next();
};

// @desc    Update user password
// @route   PUT /api/v1/users/change-password/:id
// @access  Private
exports.changeUserPassword = Factory.updateSingleField(User, 'password');

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = Factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUser = Factory.getOne(User);

// @desc    Create new User
// @route   POST /api/v1/users
// @access  Private
exports.createUser = Factory.createOne(User);

// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = Factory.updateOne(User);

// @desc    Delete user by id
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = Factory.deleteOne(User);
