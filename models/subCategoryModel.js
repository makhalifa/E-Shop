const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // remove white spaces
      unique: true,
      minlength: [2, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },
    slug: {
      type: String,
      lowercase: true,
      // unique: true,
      // index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
