const express = require('express');

// Define router
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require('../services/authService');
const {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyPasswordResetCodeValidator,
  resetPasswordValidator,
} = require('../utils/validators/authValidator');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgetPasswordValidator, forgotPassword);
router.post(
  '/verify-reset-code',
  verifyPasswordResetCodeValidator,
  verifyPasswordResetCode
);
router.put('/reset-password', resetPasswordValidator, resetPassword);

module.exports = router;
