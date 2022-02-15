const User = require('../models/user')

const cookieToken = async (res, user) => {

    try {
        const token =  await user.getJwtToken();

        const options = {
            expires : new Date( Date.now() + 3 * 60 *60 * 1000),
            httpOnly : true
        }
    
      return   res.cookie('token', token, options).json({
            status : 200,
            success : true,
            token : token,
            user : user
        })
    
    } catch (error) {
        console.log(error);
    }





}


module.exports = cookieToken; 