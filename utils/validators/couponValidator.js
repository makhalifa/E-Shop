const { check } = require('express-validator');

const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCouponValidator = [
  check('name').notEmpty().withMessage('Name is required'),

  check('discount')
    .notEmpty()
    .withMessage('Discount is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('expiry')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Expiry date must be a valid date'),

  validationMiddleware,
];

exports.updateCouponValidator = [
  check('name').optional().withMessage('Name is required'),

  check('discount')
    .optional()
    .withMessage('Discount is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('expiry')
    .optional()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Expiry date must be a valid date'),

  validationMiddleware,
];

exports.deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
