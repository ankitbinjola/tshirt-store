const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {createOrder} = require('../controller/orderContoller');




router.route('/order/create').post(isLoggedIn, createOrder);



module.exports = router;