const mongoose = require('mongoose');

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: [true, 'Brand name must be unique'],
      minlength: [3, 'Too short Brand name'],
      maxlength: [32, 'Too long Brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default:
        'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
    },
  },
  { timestamps: true } // timestamps: true will create createdAt and updatedAt fields
);

// 2- Create Model
module.exports = mongoose.model('Brand', brandSchema);