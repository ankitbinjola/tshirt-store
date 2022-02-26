const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken  = require('../utils/cookieToken');



exports.dummy = async( req, res , next) => {
    res.status(200).json({
        success: true
    })
}