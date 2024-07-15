const sharp = require('sharp');
const {
  uploadMixOfImages,
} = require('../middlewares/uploadImageMiddleware');
const Product = require('../models/productModel');
const Factory = require('./handlersFactory');

exports.uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.resizeProductImages = async (req, res, next) => {
  console.log(req.files);
  // Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename; // save imageCover in req.body
  }

  // Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(  // use Promise.all to process all images
      req.files.images.map(async (img, i) => {
        const filename = `product-${Date.now()}-${i + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = Factory.getAll(Product);

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = Factory.getOne(Product);

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = Factory.createOne(Product);

// @desc    Update product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = Factory.updateOne(Product);

// @desc    Delete product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = Factory.deleteOne(Product);
