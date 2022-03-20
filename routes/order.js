const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {createOrder, getOrderDetails, getmyOrders} = require('../controller/orderContoller');




router.route('/order/create').post(isLoggedIn, createOrder);
// cast the object id error
router.route('/order/userorder').get(isLoggedIn, getmyOrders);
router.route('/order/:id').get(getOrderDetails);




module.exports = router;