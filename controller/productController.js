const Product = require('../models/productModel');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken  = require('../utils/cookieToken');
const whereClause  = require('../utils/whereClause');
const cloudinary = require('cloudinary');





exports.addProduct = async( req, res , next) => {

try {
 
//  images

if(!req.files){
    return next(new CustomError('images are required', 401));
}

// console.log(req.files);

let imageArray = [];



if(req.files.photos.length > 1){
    for(let i = 0 ; i < req.files.photos.length ; i++){
        const result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
            folder: "products",
        });

        imageArray.push({
            id: result.public_id,
            secure_url : result.secure_url
        })
    }
}else{
    const result = await cloudinary.v2.uploader.upload(req.files.photos.tempFilePath, {
        folder: "products",
    });

    imageArray.push({
        id: result.public_id,
        secure_url : result.secure_url
    })
}


req.body.photos = imageArray;
req.body.user = req.user.id;

    // console.log(req.body);

const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product : product
    })
} catch (error) {
    return next(new CustomError(`${error.message}`, 500));
}
}



exports.getAllProducts = async( req, res , next) => {
    try {
        
        const resultperpage = 6 ;
        const totalCount = Product.countDocuments();


        const products = new whereClause(Product.find(), req.query).search().filter();

        const filteredProductsCount = products.length;

        products.pager(resultperpage);

        products = await products.base

        const product = await Product.find({});

        res.status(200).json({
            success: true,
            product,
            filteredProductsCount,
            totalCount
        })


    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}