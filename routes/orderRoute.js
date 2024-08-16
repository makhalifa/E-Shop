const express = require('express');

const authService = require('../services/authService');
const {
  createCashOrder,
  getOrders,
  filterObjForLoggedUser,
  getOrder,
  updateOrderPaid,
  updateOrderDelivered,
  checkoutSession,
  webhookCheckout,
} = require('../services/orderService');

const router = express.Router();

router.use(authService.protect);

router.get(
  '/checkout-session/:cartId',
  authService.allowedTo('user'),
  checkoutSession
);

router.post('/webhook', webhookCheckout);

router
  .route('/cash-order')
  .post(authService.allowedTo('user'), createCashOrder);

router
  .route('/')
  .get(
    authService.allowedTo('user', 'admin', 'moderator'),
    filterObjForLoggedUser,
    getOrders
  );

router
  .route('/:id')
  .get(authService.allowedTo('user', 'admin', 'moderator'), getOrder)
  .put()
  .delete();

router.put(
  '/:id/paid',
  authService.allowedTo('admin', 'moderator'),
  updateOrderPaid
);
router.put(
  '/:id/delivered',
  authService.allowedTo('admin', 'moderator'),
  updateOrderDelivered
);

module.exports = router;
