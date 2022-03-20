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
                totalAmount,
                orderStatus
            } = req.body;


   const order = await Order.create({
        shippinginfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        orderStatus,
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

       const order = await Order.findById({_id : req.params.id}).populate('orderItems.product', 'name');
    
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



      //admin gets all order details
  
  exports.getAdminOrders = async( req, res , next) => {
    try {

        const orders = await Order.find();
        res.status(200).json({
            success: true,
            orders
        });
        } catch (error) {
            return next(new CustomError(`${error.message}`, 500));
        }
    }


          //admin gets all order details
  
  exports.adminUpdateOrders = async( req, res , next) => {
    try {

        console.log(req.body.orderStatus);
         const order = await Order.findById(req.params.id);

        if(order.orderStatus == 'delivered'){
            return next(new CustomError('items already delivered...', 400));
        }


        order.orderItems.forEach(async item => {
            updateProductStock(item.product, item.quantity);
        })

         order.orderStatus = req.body.orderStatus;
        
        await order.save({validateBeforeSave : false});

        res.status(200).json({
            success: true,
            order
        });

        } catch (error) {
            return next(new CustomError(`${error.message}`, 500));
        }
    }



    async function updateProductStock(productId, quantity) {
        const product = await Product.findById(productId);
        product.stock = product.stock - quantity
        await product.save({validateBeforeSave: false})
    }




          //admin delete order details
  
  exports.deleteOrder = async( req, res , next) => {
   
    try {
         const order = await Order.deleteOne({_id : req.params.id});
        res.status(200).json({
            success: true,
            order
        });

        } catch (error) {
            return next(new CustomError(`${error.message}`, 500));
        }
    }
