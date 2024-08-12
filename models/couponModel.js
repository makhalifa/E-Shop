const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      unique: [true, 'Coupon name must be unique'],
      minlength: [3, 'Too short coupon name'],
      maxlength: [32, 'Too long coupon name'],
    },
    expiry: {
      type: Date,
      required: [true, 'Coupon expiry date is required'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
