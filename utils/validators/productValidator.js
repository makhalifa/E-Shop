const { check, body } = require('express-validator');
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number'),
  check('sold').optional().isNumeric().withMessage('Sold must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number')
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('Price after discount must be less than price');
      }
      return true;
    }),
  check('colors').optional().isArray().withMessage('Colors must be an array'),
  check('imageCover').notEmpty().withMessage('Image cover is required'),
  check('images').optional().isArray().withMessage('Images must be an array'),
  check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID')
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`Category not found ${categoryId}`));
        }
        return true;
      })
    ),
  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategory must be an array')
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < subcategoriesIds.length) {
            return Promise.reject(new Error('Invalid subcategories IDs'));
          }
          return true;
        }
      )
    )
    .custom(async (val, { req }) => {
      const subcategoriesDB = await SubCategory.find({
        category: req.body.category,
      });
      const subcategoriesIdsInDB = subcategoriesDB.map((sub) =>
        sub._id.toString()
      );

      const isInclude = (target, arr) => target.every((t) => arr.includes(t));
      if (!isInclude(val, subcategoriesIdsInDB)) {
        console.log('fee Errorrrr');
        return Promise.reject(
          new Error('Subcategories not belong to category')
        );
      }
    }),

  check('brand').optional().isMongoId().withMessage('Invalid brand ID'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings average must be a number')
    .isLength({ min: 1 })
    .withMessage('Ratings average must be at least 1')
    .isLength({ max: 5 })
    .withMessage('Ratings average must be at most 5'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('Ratings quantity must be a number'),
  validationMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  body('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  // ...this.createProductValidator,
  validationMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID'),
  validationMiddleware,
];
