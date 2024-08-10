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
  getLoggedUserData,
  ChangeLoggedUserPasswrd,
  updateLoggedUserData,
  deactivateLoggedUser,
} = require('../services/userService');
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const authService = require('../services/authService');

const router = express.Router();

// Protect all routes after this middleware 🔒🔒🔒
router.use(authService.protect);

router.get('/me', getLoggedUserData, getUser);
router.put('/me', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/me', deactivateLoggedUser);
router.put(
  '/me/change-password',
  changeLoggedUserPasswordValidator,
  ChangeLoggedUserPasswrd
);

// Restrict all routes after this middleware 🛡️🛡️🛡️ 🛠️🛠️🛠️ 👨🏻‍💻👨🏻‍💻👨🏻‍💻
router.use(authService.allowedTo('admin'));

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
