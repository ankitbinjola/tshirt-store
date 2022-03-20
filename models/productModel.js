const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name : {
        type: String,
        required: [true, 'please provide a product name'],
        trim: true,
        maxlength: [40, 'Name should be under 40 characters']
    },
    price : {
        type : Number,
        required: [true, 'please provide a product price'],
        maxlength: [5, 'Product Price should not be more the 5 digits']
    },
    description : {
        type : String,
        required: [true, 'please provide a product desciption'],
    },
    photos : [{
        id : {
            type : String,
            requited : true 
        },
        secure_url : {
            type : String,
            required : true
        }
    }],
    category : {
        type : String,
        required : [true, 'please provide category from '],
        emnu: {
            values : [
                'shortsleeves',
                'longsleeves',
                'sweatshits',
                'hoodies'
            ],
            message: 'please select cateory from short-sleeves, long-sleeves, sweat-shits and hoodies'
        }
    },
    brand : {
        type : String,
        required : [true, 'please add a brand for clothing']
    },
    stock : {
        type : Number,
        required : [true, 'please add a number']
    },
    ratings : {
        type : Number,
        default : 0,
        maxlength : 5
    },
    noOfReviews : {
        type : Number,
        default : 0,
    },
    reviews : [{
        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        },
        name : {
            type : String,
            required : true
        },
        rating : {
            type : Number,
            required : true
        },
        comment : {
            type : String,
            required : true
        }
    }],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true

    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }



    // name
    // price
    // description
    // photos [{id, secureurl}]
    // category
    // brand
    // stock
    // ratings
    // numofReviews
    // reviews[user, name, rating, comment]
    // user
    // createdAt



});


module.exports = mongoose.model('Product', productSchema);