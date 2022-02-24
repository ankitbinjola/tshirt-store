const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');
const jwt = require('jsonwebtoken');


exports.isLoggedIn = async (req, res, next) => {
    try {
        // grabbing token
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return next(new customError("logig first to access this", 401));
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();

    } catch (error) {
        return next(new customError(`${error.message}`, 500));
    }
}

