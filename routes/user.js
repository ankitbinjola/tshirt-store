const express = require('express');
const { isLoggedIn } = require('../middleware/user');

const router = express.Router();
const { signup , login, logout, forgotPassword, resetPassword, getLoggedInUserDetail} = require('../controller/userController');


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/dashboard').get(isLoggedIn, getLoggedInUserDetail);

module.exports = router;



