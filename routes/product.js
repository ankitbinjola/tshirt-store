const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();
const {addProduct, getAllProducts, getSingleProduct, adminUpdateProduct, adminDeleteProduct, reviewProduct, listProductReviews, deleteProductReview} = require('../controller/productController');



router.route('/product/add').post(isLoggedIn, adminCheck('admin'), addProduct);

router.route('/product/list').get(getAllProducts);

router.route('/product/:id').get(getSingleProduct)
.put(isLoggedIn, adminCheck('admin'), adminUpdateProduct)
.delete(isLoggedIn, adminCheck('admin'), adminDeleteProduct);
router.route('/product/review/:id').post(isLoggedIn, reviewProduct);
router.route('/product/review/:id').get(listProductReviews).delete(deleteProductReview);


module.exports = router;


