const multer = require('multer');
const ApiError = require('../utils/apiError');

exports.uploadSingleImage = (fieldName) => {
  // Memory Storage engine
  const multerStorage = multer.memoryStorage();

  const multerFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Not an image! Please upload only images.'), false);
    }
  };

  // Multer filter configuration
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldName); // Upload category image
};
