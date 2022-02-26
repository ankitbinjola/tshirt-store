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


// only admin can have access to list users

exports.adminCheck = (...roles) => {
    try {
        return(req, res, next) => {
            if(!roles.includes(req.user.role)){
                return next(new customError('you dont have admin access'), 403);
            }
            next();
        }

    //    return (req, res, next) =>{
    //     if(req.user.role !== 'admin'){
    //         return next(new customError('you dont have admin access'), 403);
    //     }
    //     next();
    //    } 

    } catch (error) {
        return next(new customError(`${error.message}`, 500));
    }
}

// only manager can have access to list users

exports.managerCheck = (...roles) => {
    try {
        return(req, res, next) => {
            if(!roles.includes(req.user.role)){
                return next(new customError('you dont have manager access'), 403);
            }
            next();
        }

    } catch (error) {
        return next(new customError(`${error.message}`, 500));
    }
}

