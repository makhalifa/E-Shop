const express = require('express');
const authService = require('../services/authService');
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../services/couponService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('admin', 'moderator'));

router.route('/').get(getCoupons).post(createCoupon);

router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
