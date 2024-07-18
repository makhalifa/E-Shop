const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

const generateAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// @desc    SignUp
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res) => {
  const userDto = {};
  Object.assign(userDto, req.body);

  const user = await User.create(userDto);

  if (!user) {
    throw new ApiError(400, 'Invalid user data');
  }

  // generate JWT
  const token = generateAuthToken({ userId: user._id });

  // send response
  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exists
  const user = await User.findOne({ email: req.body.email });

  // 3) check if password is correct
  const isMatch = user
    ? await bcrypt.compareSync(req.body.password, user.password)
    : false;

  // For security reasons
  if (!user || !isMatch) {
    // unauthenticated
    throw new ApiError(401, 'Invalid email or password');
  }
  // 4) generate JWT
  const token = generateAuthToken({ userId: user._id });

  // 5) send response
  res.status(200).json({ data: user, token });
});

exports.protect= asyncHandler(async (req, res, next) => {
  let token;
  // 1) Get token from the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new ApiError(401, 'You are not logged in');
  }
  // 2) Decode the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3) Check if the user exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(401, 'User does not exist');
  }
  // 4) Check if the user changed password after the token was issued
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changedTimestamp > decoded.iat) {
      throw new ApiError(
        401,
        'User recently changed password, please log in again...'
      );
    }
  }

  // 5) Grant access
  req.user = user;
  next();
});
