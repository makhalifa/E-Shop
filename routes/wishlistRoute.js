const express = require('express');

const authService = require('../services/authService');
const { addToWishlist } = require('../services/wishlistService');
const {
  addToWishlistValidator,
} = require('../utils/validators/wishlistValidator');

const router = express.Router();

router
  .route('/')
  .post(
    authService.protect,
    authService.allowedTo('user'),
    addToWishlistValidator,
    addToWishlist
  );

module.exports = router;
