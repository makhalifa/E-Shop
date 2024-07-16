const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');

const User = require('../../models/userModel');

const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.createUserValidator = [
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

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only EG or SA numbers are allowed'),

  check('profileImg').optional(),
  validationMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),

  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validationMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),

  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 6 })
    .withMessage('Current password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Current password must be at most 32 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Password must be at most 32 characters'),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom(async (passConfirm, { req }) => {
      // 1) Check if password is correct
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      const IsMatch = await bcrypt.compareSync(req.body.currentPassword, user.password);
      if (!IsMatch) {
        throw new Error('Current password is incorrect');
      }

      // 2) Check if password confirmation matches the new password
      if (passConfirm !== req.body.password) {
        throw new Error('Password Confirmation is incorrect');
      }

      // 3) If everything is ok, hash the new password
      const salt = bcrypt.genSaltSync();
      req.body.password = bcrypt.hashSync(passConfirm, salt);

      return true;
    }),
  validationMiddleware,
];

exports.loginUserValidator = [
  check('email').isEmail().withMessage('Invalid email'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 32 })
    .withMessage('Password must be at most 32 characters'),
  validationMiddleware,
];
