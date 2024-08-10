const slugify = require('slugify');
const { check, body } = require('express-validator');

const User = require('../../models/userModel');

const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check('email')
    .notEmpty()
    .isEmail()
    .withMessage('Invalid email')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already in use'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Password must be at most 32 characters'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((pass, { req }) => {
      if (pass !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('role').optional().equals('user').withMessage('Invalid role'),

  validationMiddleware,
];

exports.loginValidator = [
  check('email').notEmpty().isEmail().withMessage('Invalid email'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Password must be at most 32 characters'),
  validationMiddleware,
];

exports.forgetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (val, { req }) => {
      // 1) check if user exists
      const user = await User.findOne({ email: val });
      if (!user) {
        throw new Error('There is no user with that email');
      }

      // TODO CHECK IF HE FORGOT PASSWORD BEFORE
      const now = Date.now();
      if (user.passwordResetExpires > now) {
        throw new Error('Password reset has not been requested yet');
      }

      req.user = user;
      return true;
    }),

  validationMiddleware,
];

exports.verifyPasswordResetCodeValidator = [
  body('resetCode')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength(6)
    .withMessage('Reset code must be 6 digits'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),

  validationMiddleware,
];

exports.resetPasswordValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),

  body('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Password must be at most 32 characters'),

  body('newPasswordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((pass, { req }) => {
      if (pass !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validationMiddleware,
];
