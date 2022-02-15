const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customeError');
const cookieToken  = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');



exports.signup = async( req, res , next) => {
    try {
        let result ;
        if(req.files){
            let file = req.files.photo;
          result = await cloudinary.v2.uploader.upload(file, {
                folder: "tshirt",
                width: 150,
                crop: "scale"
            });
        }

        
        const {name, email, password} = req.body;
        if(!email || !name || !password){
            const error = new CustomError('Please enter correct Name, password, email..', 400);
            return next(error);
        }

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
