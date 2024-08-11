const { check } = require('express-validator');

const validationMiddleware = require('../../middlewares/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.createReviewValidator = [
  check('title').optional(),
  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ max: 5, min: 1 })
    .withMessage('Rating must be a number'),
  check('user').isMongoId().withMessage('Invalid ID'),
  check('product')
    .isMongoId()
    .withMessage('Invalid ID')
    .custom((value, { req }) => {
      // check if logged user create review before on this product
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error('You already reviewed this product')
            );
          }
        }
      );
      return true;
    }),
  validationMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID')
    .custom((value, { req }) =>
      // check review ownership
      Review.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(new Error('Review not found'));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error('You are not authorized to update this review')
          );
        }
      })
    ),
  check('title').optional(),

  check('rating')
    .optional()
    .isFloat({ max: 5, min: 1 })
    .withMessage('Rating must be a number'),

  validationMiddleware,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID')
    .custom((value, { req }) => {
      // check review ownership
      if (req.user.role === 'user') {
        return Review.findById(value).then((review) => {
          if (!review) {
            return Promise.reject(new Error('Review not found'));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error('You are not authorized to delete this review')
            );
          }
        });
      }
      return true;
    }),
  validationMiddleware,
];
