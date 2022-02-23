const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customeError');
const cookieToken  = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');



exports.signup = async( req, res , next) => {
    try {
        let result ;
        if(!req.files){
        const error = new CustomError('photo is required', 400);
        return next(error);
        }

        const {name, email, password} = req.body;

        if(!email || !name || !password){
            const error = new CustomError('Please enter correct Name, password, email..', 400);
            return next(error);
        }

        let file = req.files.photo;
        //  console.log(file,"file1");
            result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "tshirt",
                width: 150,
                crop: "scale"
            });

        const user = await User.create({
            name,
            email,
            password,
            photo: {
                id: result.public_id,
                secure_url: result.secure_url
            }
        });

        cookieToken(res, user);

    } catch (error) {
        console.log(error);
    }
}



exports.login = async(req, res, next) => {
    try {
        
        const {email, password} = req.body;
        console.log(password, "password");

        if(!email || !password){
            return next(new Error('please provide email and password'));
        }

       const user = await User.findOne({email}).select("+password");

        console.log(user, "user");

        if(!user){
            return next(new CustomError('please provide correct email or password', 400));
        }

        const isPasswordCorrect = await user.isValdidatedPassword(password);

        console.log(isPasswordCorrect,"ispasswordcorrect");

        if(isPasswordCorrect == false){
            return next(new CustomError('please provide correct  password', 400));
        }

        cookieToken(res, user)


    } catch (error) {
        console.log(error);
    }
}



exports.logout = async( req, res , next) => {
    res.cookie('token', null , {
        expires : new Date( Date.now()),
        httpOnly : true
    });

    res.status(200).json({
        status: 200,
        success: true,
        message: 'loggedout successfully..'
    })
}
