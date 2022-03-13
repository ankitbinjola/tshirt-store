const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.sendStripeKey = async( req, res , next) => {
    try {
        res.status(200).json({
            stripKey : process.env.STRIPE_API_KEY
        })
    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}


exports.captureStripePayment = async( req, res , next) => {
    try {
 
 // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {integration_check : 'accept_a_payment'}
  });
 
 
  res.status(200).json({
      success: true,
      client_secret: PaymentIntent.client_secret
  })

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}




exports.sendRazorpayKey = async( req, res , next) => {
    try {
        res.status(200).json({
            stripKey : process.env.RAZORPAY_API_KEY
        })
    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}




exports.captureRazorpayPayment = async( req, res , next) => {
    try {
        
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY })

       var myOrder = await instance.orders.create({
          amount: req.body.amount,
          currency: "INR",
          receipt: "receipt#1",
          notes: {
            key1: "value3",
            key2: "value2"
          }
        })
 
 
  res.status(200).json({
      success: true,
      amount: req.body.amount,
      order: myOrder

  })

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}