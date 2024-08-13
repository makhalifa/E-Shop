const asyncnHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');

// Calculate total price
const calcCartTotal = (cart) => {
  let total = 0;

  cart.products.forEach((p) => {
    total += p.price * p.quantity;
  });

  cart.cartTotal = total;
  cart.totalAfterDiscount = undefined;

  return total;
};

// @desc    Add Product to Cart
// @route   Post /api/v1/cart
// @access  private - User
exports.addToCart = asyncnHandler(async (req, res) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // 1) check if cart already exist
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    const newCart = await Cart.create({
      user: req.user._id,
      products: [{ product: productId, color, price: product.price }],
      cartTotal: product.price,
      totalAfterDiscount: product.price,
    });

    res.status(201).json({ status: 'success', data: newCart });
  } else {
    // 2) check if product already exist
    const productExist = cart.products.find(
      (p) => p.product.toString() === productId && p.color === color
    );
    if (productExist) {
      productExist.quantity += 1;
    } else {
      cart.products.push({ product: productId, color, price: product.price });
    }

    calcCartTotal(cart);

    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
  }
});

// @desc    Get logged User cart
// @route   GET /api/v1/cart
// @access  private - User
exports.getCart = asyncnHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'products.product',
    select: 'title slug description imageCover ratingsAverage ratingsQuantity ',
  });

  if (!cart) {
    throw new ApiError(
      404,
      ` There is no cart for this user id : ${req.user._id}`
    );
  }

  res.status(200).json({
    status: 'success',
    result: cart.products.length,
    data: cart,
  });
});

// @desc    Remove Product from Cart
// @route   DELETE /api/v1/cart/:itemId
// @access  private - User
exports.removeFromCart = asyncnHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { products: { _id: itemId } },
    },
    { new: true }
  );

  if (!cart) {
    throw new ApiError(
      404,
      ` There is no cart for this user id : ${req.user._id}`
    );
  }

  calcCartTotal(cart);

  await cart.save();

  res
    .status(200)
    .json({ status: 'success', result: cart.products.length, data: cart });
});

// @desc    Clear Cart
// @route   DELETE /api/v1/cart
// @access  private - User
exports.clearCart = asyncnHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [], cartTotal: 0, totalAfterDiscount: 0 },
    { new: true }
  );

  if (!cart) {
    throw new ApiError(
      404,
      ` There is no cart for this user id : ${req.user._id}`
    );
  }

  res.status(200).json({ status: 'success', data: cart });
});

// @desc    update cart quantity
// @route   PUT /api/v1/cart
// @access  private - User
exports.updateCartQuantity = asyncnHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(
      404,
      ` There is no cart for this user id : ${req.user._id}`
    );
  }

  const productInCart = cart.products.find((p) => p._id.toString() === itemId);
  if (!productInCart) {
    throw new ApiError(404, 'Product not found in cart');
  }

  const product = await Product.findById(productInCart.product);
  if (product.quantity < quantity) {
    console.log('product quantity', product.quantity);
    throw new ApiError(404, 'Invalid quantity');
  }

  productInCart.quantity = quantity;
  calcCartTotal(cart);
  await cart.save();

  res
    .status(200)
    .json({ status: 'success', result: cart.products.length, data: cart });
});

// @desc    apply coupon
// @route   PUT /api/v1/cart/apply-coupon
// @access  private - User
exports.applyCoupon = asyncnHandler(async (req, res) => {
  const { coupon } = req.body;
  const couponInDb = await Coupon.findOne({
    name: coupon,
    expiry: { $gte: Date.now() },
  });
  if (!couponInDb) {
    throw new ApiError(404, 'Coupon is invalid');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(
      404,
      ` There is no cart for this user id : ${req.user._id}`
    );
  }

  const totalCart = calcCartTotal(cart);

  cart.coupon = couponInDb._id;
  cart.totalAfterDiscount = (
    totalCart *
    (1 - couponInDb.discount / 100)
  ).toFixed(2);
  await cart.save();

  res.status(200).json({ status: 'success', data: cart });
});
