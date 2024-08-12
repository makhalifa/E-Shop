const express = require('express');

const authService = require('../services/authService');
const {
  addToWishlist,
  removeFromWishlist,
  getLoggedUserWishlist,
} = require('../services/wishlistService');
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require('../utils/validators/wishlistValidator');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/')
  .get(getLoggedUserWishlist)
  .post(addToWishlistValidator, addToWishlist);

router.delete('/:productId', removeFromWishlistValidator, removeFromWishlist);

module.exports = router;
