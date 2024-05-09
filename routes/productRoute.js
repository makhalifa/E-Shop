const express = require('express');
const { getProduct, createProduct } = require('../services/productService');
const {
  createProductValidator,
} = require('../utils/validators/prodcutValidator');
const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validators/categoryValidator');
const {
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

const router = express.Router();

router.route('/').get(getProduct).post(createProductValidator, createProduct);
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
