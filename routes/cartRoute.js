const express = require('express');
const authService = require('../services/authService');
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
  applyCoupon,
} = require('../services/cartService');
const {
  addToCartValidator,
  updateCartQuantityValidator,
} = require('../utils/validators/cartValidator');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/')
  .get(getCart)
  .post(addToCartValidator, addToCart)
  .delete(clearCart);

router.put('/apply-coupon', applyCoupon);

router
  .route('/:itemId')
  .put(updateCartQuantityValidator, updateCartQuantity)
  .delete(removeFromCart);

module.exports = router;
