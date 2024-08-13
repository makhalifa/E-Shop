const { check, body } = require('express-validator');

const validationMiddleware = require('../../middlewares/validatorMiddleware');

const Coupon = require('../../models/couponModel');

exports.createCouponValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .custom((value, { req }) =>
      Coupon.findOne({ name: value }).then((coupon) => {
        if (coupon) {
          throw new Error('Coupon already exists');
        }
      })
    ),

  check('discount')
    .notEmpty()
    .withMessage('Discount is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('expiry')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate('YYYY-MM-DD')
    .withMessage('Expiry date must be a valid date'),

  validationMiddleware,
];

exports.updateCouponValidator = [
  check('name').optional().notEmpty().withMessage('Name is required'),
  check('discount')
    .optional()
    .notEmpty()
    .withMessage('Discount is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('expiry')
    .optional()
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Expiry date must be a valid date'),

  validationMiddleware,
];

exports.deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
