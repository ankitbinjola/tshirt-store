const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');



exports.createOrder = async( req, res , next) => {
try {
        const { 
                shippinginfo,
                orderItems,
                paymentInfo,
                taxAmount,
                shippingAmount,
                totalAmount 
            } = req.body;


   const order = await Order.create({
        shippinginfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user : req.user._id
    });

    res.status(200).json({
        success: true,
        order
    })


    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}


