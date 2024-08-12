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

    // Parent reference ( 1:M )
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

// static method to calculate avg rating and save
// static method is a method that can be called on the model
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    // Stage 1 : find all reviews of this product
    {
      $match: { product: productId },
    },
    // Stage 2 : group all reviews of this product and calc avg rating, number of ratings
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 }, // number of ratings
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    // if there are reviews of this product
    await this.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await this.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// call calcAverageRatings after save or update ratings or delete
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});
reviewSchema.post('updateOne', function () {
  this.constructor.calcAverageRatings(this.product);
});
// call calcAverageRatings after delete
reviewSchema.post('findOneAndDelete', (doc) => {
  if (doc) {
    doc.constructor.calcAverageRatings(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
