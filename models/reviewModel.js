const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
  },
  { timestamps: true }
);

// middleware populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImg',
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
