const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {createOrder, getOrderDetails, getmyOrders, getAdminOrders, adminUpdateOrders, deleteOrder} = require('../controller/orderContoller');




router.route('/order/create').post(isLoggedIn, createOrder);
// cast the object id error
router.route('/order/userorder').get(isLoggedIn, getmyOrders);
router.route('/order/admin').get(isLoggedIn, adminCheck('admin'),  getAdminOrders);
router.route('/order/:id').get(getOrderDetails);
router.route('/admin/order/:id').put(isLoggedIn, adminUpdateOrders).delete(deleteOrder);





module.exports = router;