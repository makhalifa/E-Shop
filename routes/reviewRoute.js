const express = require('express');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../services/reviewService');

const authService = require('../services/authService');
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(
    authService.protect,
    authService.allowedTo('user'),
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo('user', 'moderator', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
