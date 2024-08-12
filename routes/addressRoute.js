const express = require('express');

const authService = require('../services/authService');
const {
  addAddressValidator,
  removeAddressValidator,
} = require('../utils/validators/addressValidator');
const { addAddress, removeAddress, getLoggedUserAddresses } = require('../services/addressService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').get(getLoggedUserAddresses).post(addAddressValidator, addAddress);

router.delete('/:addressId', removeAddressValidator, removeAddress);

module.exports = router;
