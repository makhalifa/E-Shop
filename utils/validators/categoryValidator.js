const { check } = require('express-validator');
const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters'),
  validationMiddleware,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters'),
  validationMiddleware,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
