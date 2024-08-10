const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

const User = require('../models/userModel');
const createToken = require('../utils/createToken');

exports.uploadUserImage = uploadSingleImage('profileImg');

exports.resizeImage = asyncHandler(async (req, res, next) => {
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

exports.removePasswordField = (req, _res, next) => {
  if (req.body.password) delete req.body.password;
  next();
};

exports.changeUserPasswordDto = (req, _res, next) => {
  const { password, passwordChangedAt } = req.body;
  req.body = { password, passwordChangedAt };
  next();
};

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Private - Admin
exports.getUsers = Factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private - Admin
exports.getUser = Factory.getOne(User);

// @desc    Create new User
// @route   POST /api/v1/users
// @access  Private - Admin
exports.createUser = Factory.createOne(User);

// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  Private - Admin
exports.updateUser = Factory.updateOne(User);

// @desc    Delete user by id
// @route   DELETE /api/v1/users/:id
// @access  Private - Admin
exports.deleteUser = Factory.deleteOne(User);

// @desc    Update user password
// @route   PUT /api/v1/users/change-password/:id
// @access  Private - Admin
exports.changeUserPassword = Factory.updateOne(User);

// @desc    Get logged User data
// @route   GET /api/v1/users/me
// @access  Private - User
exports.getLoggedUserData = (req, _res, next) => {
  // 1) Get user from collection (validation) req.user
  // 2) pass userid in the request params
  req.params.id = req.user._id;
  // 3) next to call getUser function
  next();
};

// @desc    Change logged User password
// @route   PUT /api/v1/users/me/change-password
// @access  Private - User
exports.ChangeLoggedUserPasswrd = asyncHandler(async (req, res) => {
  // 1) update user password based on req.user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  const token = createToken({ userId: user._id });

  res.status(200).json({ data: user, token });
});

// @desc    update logged User data
// @route   PUT /api/v1/users/me
// @access  Private - User
exports.updateLoggedUserData = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

// @desc    Deactivate logged User
// @route   Delete /api/v1/users/me
// @access  Private - User
exports.deactivateLoggedUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: 'User deactivated successfully' });
});
