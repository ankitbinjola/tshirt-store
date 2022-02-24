const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken  = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto');

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



// forgot passwordController

exports.forgotPassword = async( req, res , next) => {
    try {
       const {email} = req.body;
      
       if(!email){
           return next(new CustomError('please enter correct user email', 400));
       } 

       const user = await User.findOne({email}); 
       const forgotToken = user.getForgotPasswordToken();
       
        await user.save({ validateBeforeSave : false});
        // user click on url
       console.log(user);
        const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`
        const message = `copy and paste url ${myUrl}`;
       
       await  mailHelper({
        emailTo : user.email,
        subject : "password reset message from Tstore",
        message : message
       })




       res.status(200).json({
           success: true,
           message: 'email sent successfully'
       })
        
       console.log(user.forgotPasswordExpire);
    
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgorPasswordExpiry = undefined;
        await user.save({validateBeforeSave: false});
        
        return next(new CustomError(`${error.message}`, 500));
    }

}

// password reset function

exports.resetPassword = async( req, res , next) => {

    try {
        const token = req.params.token;
        const encryToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log(encryToken);
        const user = await User.findOne({encryToken, forgotPasswordExpire : { $gt : Date.now()}});
        console.log(user);

        if(!user){
            return next(new CustomError('Token is invalid or expired', 400))
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new CustomError('Password or confirm password do not match', 400));
        }

        user.password = req.body.password;

        user.forgotPasswordToken = undefined;
        user.forgorPasswordExpiry = undefined;

        await user.save();

        cookieToken(res, user);

    } catch (error) {
        return next(new CustomError(`${error.message}`, 500));
    }

}



// getLoggedInUserDetail  function

exports.getLoggedInUserDetail = async( req, res , next) => {

    try {
        const user = await User.findById(req.user.id);
    res.status(200).json({
    success: true,
    user
});
    } catch (error) {
        
    }


}