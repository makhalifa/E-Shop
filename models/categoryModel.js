const mongoose = require('mongoose');

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category name must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default:
        'image.png',
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  // return image base url + image filename
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
  return doc;
};

categorySchema.post('init', (doc) => {
  setImageUrl(doc);
});

categorySchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
