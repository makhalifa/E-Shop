const { check } = require('express-validator');

const validationMiddleware = require('../../middlewares/validatorMiddleware');
const Product = require('../../models/productModel');

exports.addToWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid ID')
    .custom((value, { req }) =>
      // check if productid is exist
      Product.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error('Invalid ID'));
        }
      })
    ),
  validationMiddleware,
];

exports.removeFromWishlistValidator = [
  check('productId').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
