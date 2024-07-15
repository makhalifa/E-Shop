const { check, body } = require('express-validator');
const slugify = require('slugify');

const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validationMiddleware,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validationMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
