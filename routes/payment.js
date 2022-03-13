const express = require('express');
const { isLoggedIn, adminCheck, managerCheck } = require('../middleware/user');
const router = express.Router();

const {sendStripeKey,captureStripePayment, sendRazorpayKey, captureRazorpayPayment} = require('../controller/paymentController');



router.route('/stripekey').get(isLoggedIn, sendStripeKey);
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKey );


router.route('/stripepayment').post( captureStripePayment);
router.route('/razorpaypayment').post( captureRazorpayPayment);

module.exports = router;