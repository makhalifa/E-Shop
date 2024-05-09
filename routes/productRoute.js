const express = require('express');
const {
  getProduct,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../services/productService');
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/prodcutValidator');

const router = express.Router();

router.route('/').get(getProducts).post(createProductValidator, createProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
