const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true }, // quantity
        color: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },

    paymentInfo: {
      id: String,
      status: String,
    },

    paymentMethod: { type: String, enum: ['online', 'cash'], default: 'cash' },

    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email profileImg phone',
  }).populate({
    path: 'orderItems.product',
    select: 'title imageCover',
  });
  next();
});

module.exports = mongoose.model('Order', orderSchema);
