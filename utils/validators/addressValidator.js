const { check } = require('express-validator');

const validationMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.addAddressValidator = [
  check('alias')
    .notEmpty()
    .isString({ min: 3, max: 32 })
    .withMessage('Invalid alias')
    .custom((value, { req }) =>
      // check if address already exist
      User.findById(req.user._id).then((user) => {
        if (user.addresses.find((address) => address.alias === value)) {
          return Promise.reject(
            new Error('Address already exists in your address list')
          );
        }
      })
    ),

  check('details')
    .notEmpty()
    .isString({ min: 3, max: 32 })
    .withMessage('Invalid address'),

  check('city')
    .notEmpty()
    .isString({ min: 3, max: 32 })
    .withMessage('Invalid city'),

  check('phone').notEmpty().isMobilePhone('ar-EG').withMessage('Invalid phone'),

  check('postalCode')
    .notEmpty()
    .isPostalCode('any')
    .withMessage('Invalid postal code'),

  validationMiddleware,
];

exports.removeAddressValidator = [
  check('addressId').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
