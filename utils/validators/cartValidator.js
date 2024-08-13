const { check } = require('express-validator');

const Product = require('../../models/productModel');
const validationMiddleware = require('../../middlewares/validatorMiddleware');

exports.addToCartValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid ID')
    .custom((value, { req }) =>
      // check if productid is exist
      Product.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error('Invalid ID'));
        }
        if (product.quantity < 1) {
          return Promise.reject(new Error('Product out of stock'));
        }
      })
    ),

  check('color').notEmpty().isString().withMessage('Invalid color'),
  validationMiddleware,
];

exports.updateCartQuantityValidator = [
  check('itemId').isMongoId().withMessage('Invalid ID'),

  check('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  validationMiddleware,
];
