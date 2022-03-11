const Product = require('../models/productModel');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken  = require('../utils/cookieToken');
const WhereClause  = require('../utils/whereClause');
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



// with filter , searching and pagination

exports.getAllProducts = async( req, res , next) => {
    try {
        const resultsPerPage = 5;
        const totalProductCount = await Product.countDocuments()
        let productsObject = new 
            WhereClause(Product.find(), req.query).search().filter()
          
        const filteredProductCount = productsObject.base.length
     
        productsObject.pager(resultsPerPage)
        
        const products = await productsObject.base;
     
        res.status(200).json({
            success: true,
            products,
            filteredProductCount,
            totalProductCount
        })

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}


// get single product details

exports.getSingleProduct = async(req, res, next) => {
    try {
        if(!req.params.id){
            return next(new CustomError('No Product found with this id'), 400);
        }
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            success: true,
            product
        })


    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}


// get single product details

exports.adminUpdateProduct = async(req, res, next) => {
    try {
        if(!req.params.id){
            return next(new CustomError('No Product found with this id'), 400);
        }
        
        if(!req.files.photos){
            return next(new CustomError('please provide photos', 400))
        }
        
        let product = await Product.findById(req.params.id);

        let imageArray = [];

        for(let i = 0 ; i <= product.photos.length - 1 ; i++){
         const result =   await cloudinary.v2.uploader.destroy(product.photos[i].id);
        }
        
    
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

         product = await Product.findByIdAndUpdate(req.params.id, req.body, {
             new : true,
             runValidators : true,
             useFindAndModify : false
         })



        res.status(200).json({
            success: true,
            product
        })


    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}



exports.adminDeleteProduct = async( req, res , next) => {
    try {
        
        if(!req.params.id){
            return next(new CustomError('id not found ', 400));
        }

        
        const product = await Product.findById(req.params.id);


        for(let i = 0 ; i < product.photos.length ; i ++){
           result =  await cloudinary.v2.uploader.destroy(product.photos[i].id)
        }
        
         const result_deleted = await Product.deleteOne({_id : req.params.id});


        res.status(200).json({
            success: true,
            result_deleted
        })

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}


// adding review to the product

exports.reviewProduct = async( req, res , next) => {
    try {

        if(!req.params.id){
            return next(new CustomError('please provide the valid id', 400));
        }

        if(!req.user){
            return next(new CustomError('please login first..', 400));
        }

        const {name, rating, comment} = req.body;

        if(!name || !rating || !comment){
            return next(new CustomError('plrase provide name rating and comment first', 400));
        }


        let review_array = [];

        let product = await Product.findById(req.params.id);


        review_array = product.reviews ;

        review_array.push({user : req.user._id ,name : name, rating : rating, comment : comment})


        const result = await Product.updateOne({_id: req.params.id}, {"reviews" : review_array});
       
       
        let reviewCount = 0
        if(product.reviews.length != 0){

         let  ratings = product.reviews.reduce((acc, item) => item.rating + acc , 0 ) / product.reviews.length;
        const result =  await Product.updateOne({_id: req.params.id}, { ratings : ratings})
        }else{
            return ;
        }
        
        
        console.log(result);
        


        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }
}




