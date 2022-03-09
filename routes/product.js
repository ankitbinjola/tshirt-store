const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {addProduct, getAllProducts, getSingleProduct} = require('../controller/productController');



router.route('/product/add').post(isLoggedIn, adminCheck('admin'), addProduct);

router.route('/product/list').get(getAllProducts);

router.route('/product/:id').post(getSingleProduct);



module.exports = router;


