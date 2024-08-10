const express = require('express');

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require('../services/subCategoryService');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');

const authService = require('../services/authService');

// mergeParams: true is used to merge the params from the parent router
// ex : /api/v1/categories/:categoryId/subcategories
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(
    authService.protect,
    authService.allowedTo('admin', 'moderator'),
    createFilterObj,
    getSubCategories
  );

router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'moderator'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
