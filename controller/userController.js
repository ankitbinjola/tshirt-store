const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customeError');
const cookieToken  = require('../utils/cookieToken');


exports.signup = async( req, res , next) => {
    try {
        const {name, email, password} = req.body;
        if(!email || !name || !password){
            const error = new CustomError('Please enter correct Name, password, email..', 400);
            return next(error);
        }

        const user = await User.create({
            name,
            email,
            password
        });

        cookieToken(user, res);

    } catch (error) {
        console.log(error);
    }
}
