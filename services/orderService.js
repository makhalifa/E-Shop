const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ApiError = require('../utils/apiError');

const Factory = require('./handlersFactory');

const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

// @desc    create cash order
// @route   POST /api/v1/orders
// @access  private - user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  console.log(taxPrice, shippingPrice);

  // step 1: get the user id from the request object
  // step 2: get the cart from the database based on the user id
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'products.product',
    model: 'Product',
    select: 'name imageCover',
  });

  if (!cart) {
    return next(new ApiError(404, 'Cart not found'));
  }

  if (cart.products.length === 0) {
    return next(new ApiError(400, 'Cart is empty'));
  }

  // step 3: get the products from the cart
  // step 4: create a new order object
  const totalPrice =
    (cart.totalAfterDiscount || cart.cartTotal) + taxPrice + shippingPrice;

  console.log(cart.totalAfterDiscount || cart.cartTotal);
  console.log(totalPrice);

  // step 5: save the order object to the database
  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.products,
    shippingAddress: req.body.shippingAddress,
    totalPrice,
  });

  // step 6: update the products quantity in the database
  const bulkOptions = cart.products.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  // bulkWrite is used to update multiple documents at once
  await Product.bulkWrite(bulkOptions);

  // step 7: delete the cart from the database
  await Cart.findOneAndDelete({ user: req.user._id });

  // step 8: return the created order object
  res.status(201).json({ status: 'success', data: order });
});

// @desc    get all orders
// @route   GET /api/v1/orders
// @access  private - user
exports.getOrders = Factory.getAll(Order);

exports.filterObjForLoggedUser = asyncHandler((req, res, next) => {
  if (req.user.role === 'user') {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc    get specific order
// @route   GET /api/v1/orders/:id
// @access  private - admin
exports.getOrder = Factory.getOne(Order, { path: 'orderItems.product' });

// @desc    update order paid status
// @route   PUT /api/v1/orders/:id/paid
// @access  private - admin,moderator
exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

// @desc    update order paid status
// @route   PUT /api/v1/orders/:id/delivered
// @access  private - admin,moderator
exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

// @desc    Create checkout session using stripe
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  private - user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'products.product',
    model: 'Product',
    select: 'title imageCover',
  });

  if (!cart) {
    return next(new ApiError(404, 'Cart not found'));
  }

  if (cart.products.length === 0) {
    return next(new ApiError(400, 'Cart is empty'));
  }

  // step 3: get the products from the cart
  // step 4: create a new order object
  const totalPrice =
    (cart.totalAfterDiscount || cart.cartTotal) + taxPrice + shippingPrice;

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // name: req.user.name,
        // amount: totalPrice * 100,
        // currency: 'egp',
        quantity: 1,
        price_data: {
          currency: 'egp',
          unit_amount: totalPrice * 100,
          product_data: {
            name: req.user.name,
            images: [`${process.env.BASE_URL}/${req.user.image}`],
          },
        },
      },
    ],
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/success.html`,
    cancel_url: `${process.env.BASE_URL}/cancel.html`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: 'success', session });
});

// webhook
exports.webhookCheckout = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      // eslint-disable-next-line no-case-declarations
      const checkoutSessionCompleted = event.data.object;
      console.log(checkoutSessionCompleted);
      console.log('Create Order Here ...');
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});
