const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  removePasswordField,
  changeUserPassword,
  changeUserPasswordDto,
} = require('../services/userService');
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require('../utils/validators/userValidator');

const router = express.Router();

router.put(
  '/change-password/:id',
  changeUserPasswordValidator,
  changeUserPasswordDto,
  changeUserPassword
);

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(
    removePasswordField,
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
