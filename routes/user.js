const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');

const router = express.Router();
const { signup , login, logout, forgotPassword, resetPassword, getLoggedInUserDetail, changePassword, updateUserDetails, adminAllUsers, managerAllUsers} = require('../controller/userController');


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/dashboard').get(isLoggedIn, getLoggedInUserDetail);
router.route('/password/update').post(isLoggedIn, changePassword);
router.route('/dashboard/update').post(isLoggedIn, updateUserDetails);
router.route('/admin/users').get(isLoggedIn, adminCheck('admin'), adminAllUsers);
router.route('/manager/users').get(isLoggedIn, managerCheck('manager'), managerAllUsers);

module.exports = router;



