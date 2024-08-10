const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

// this middleware is used to protect routes that require authentication
// it checks the token in the headers and verifies it
// if the token is valid it adds the user object to the request so that the protected route can use it
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // 1) Get token from the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new ApiError(
      401,
      'You are not logged in, please log in to get access'
    );
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

  // 5) check if the user account is active
  if (!user.active) {
    throw new ApiError(401, 'Your account is not active');
  }

  // 6) Grant access
  req.user = user;

  next();
});

// Middleware to check if the user is allowed to perform a specific action
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You are not allowed to perform this action');
    }
    next();
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
  const token = createToken({ userId: user._id });

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
  const token = createToken({ userId: user._id });

  // 5) send response
  res.status(200).json({ data: user, token });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { user } = req;
  // 1) check if the email is valid (validation)
  // 2) check if the user exists (validation)
  // 3) check if the user forgot password code is expired
  if (user.passwordResetExpires > Date.now()) {
    throw new ApiError(400, 'Password reset code is expired, please try again');
  }
  // 3) generate a 6 digits random and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // hash the reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // 4) save the reset code in db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 5) send email
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Reset your password',
      message: `Your reset code is: ${resetCode}\n Valid for 10 minutes`,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    throw new ApiError(
      500,
      'Something went wrong while sending email, please try again'
    );
  }
  // 6) send response
  res
    .status(200)
    .json({ status: 'success', message: 'Reset code sent to your email' });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res) => {
  const { email, resetCode } = req.body;

  // check if user exists
  const user = await User.findOne({ email }).select('+passwordResetCode');
  if (!user) {
    throw new ApiError(401, 'Invalid email or reset code');
  }

  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // check if the reset code is correct
  if (user.passwordResetCode !== hashedResetCode) {
    throw new ApiError(401, 'Invalid email or reset code');
  }

  // check if the reset code is expired
  if (user.passwordResetExpires < Date.now()) {
    throw new ApiError(401, 'Reset code is expired, please request a new one');
  }

  // verify the reset code
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: 'success', message: 'Reset code verified' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or reset code');
  }

  if (!user.passwordResetVerified) {
    throw new ApiError(401, 'Reset code is not verified');
  }

  // if (user.passwordResetExpires < Date.now()) {
  //   throw new ApiError(401, 'Reset code is expired, please request a new one');
  // }

  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  const savedUser = await user.save();

  console.log(savedUser);

  const token = createToken({ userId: user._id });

  res
    .status(200)
    .json({ status: 'success', message: 'Password reset success', token });
});
