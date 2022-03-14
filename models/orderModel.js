const mongoose = require('mongoose');

// shippinginfo{}
// user
// payment info{}
// taxAmount
// shippingAmount
// totalAmount
// orderStatus
// deliveredAt
// createdAt
// orderItems [{}]
// -name
// -qauantity
// -image[0]
// -price
// -product
// -stock


const orderSchema = new mongoose.Schema({
shippinginfo : {
    address : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    phoneNo : {
        type: String,
        required: true
    }, 
       state : {
        type: String,
        required: true
    },
    country : {
        type: String,
        required: true
    }
},
user: { 
    type: mongoose.Schema.ObjectId,
    ref : 'User'
},
orderItems : [
    {    
    name: {
        type: String, 
        required: true
        },
    quantity: {
        type: Number, 
        required: true
        }, 
    image: {
        type: String, 
        required: true
    }, 
    price: {
        type: Number, 
        required: true
    }, 
    product : {
        type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: 'Product',
        required: true
    }
}  
],
paymentInfo :{
    id :{
        type: String
    }
},
taxAmount : {
    type : Number,
    required: true
},
shippingAmount : {
    type : Number,
    required: true
},
totalAmount : {
    type : Number,
    required: true
},
orderStatus: {
    type: String,
    required: true,
    default: 'processing'
},
deliveredAt: {
    type : Date
},
CreatedAt: {
    type : Date,
    default: Date.now,
    required: true
}

});





module.exports = mongoose.model('Order', orderSchema);