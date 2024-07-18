const slugify = require('slugify');
const { check } = require('express-validator');

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
