const Order = require('../models/orderModel');
const User = require('../models/user');
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



exports.getOrderDetails = async( req, res , next) => {
    try {
        if(!req.params.id){
            return next(new CustomError('please enter a valid email id', 400));
        }

       const order = await Order.findById({_id : req.params.id}).populate('orderItems.product', 'name').populate('user', 'name email');;
    
        res.status(200).json({
            success: true,
            order
        })
    
    
        } catch (error) {
            return next(new CustomError(`${error.message}`, 500));
        }
    }



    exports.deleteOrder = async( req, res , next) => {
        try {
            if(!req.params.id){
                return next(new CustomError('please enter a valid email id', 400));
            }
    
           const order = await Order.findById({_id : req.params.id})
        
           console.log(order);
            // res.status(200).json({
            //     success: true,
            //     order
            // })
        
        
            } catch (error) {
                return next(new CustomError(`${error.message}`, 500));
            }
        }



  //get orders of logged in user
  
  exports.getmyOrders = async( req, res , next) => {
    try {
        const order = await Order.find({user : req.user._id})
    
        res.status(200).json({
            success: true,
            order
        })
    
    
        } catch (error) {
            return next(new CustomError(`${error.message}`, 500));
        }
    }
