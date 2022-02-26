const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {dummy} = require('../controller/productController');



router.route('/product/dummy').get(dummy);



module.exports = router;


