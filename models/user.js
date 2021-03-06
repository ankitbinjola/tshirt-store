const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'please provide a name'],
        maxlength: [40, 'Name should be under 40 characters']
    },
    email : {
        type: String,
        required: [true, 'please provide a email'],
        validate: [validator.isEmail, 'please enter email in correct format'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'please provide a password'],
        minlength: [6, 'password should me atleast 6 character'],
        select : false
    },
    role : {
        type: String,
        default: 'user'
    },
    photo : {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },

    forgotPasswordToken : String,
    forgotPasswordExpire : Date,
    
    CreatedAt : {
        type: Date,
        default : Date.now()
    }

});

//encrypt password before save

userSchema.pre('save', async function (next)  {
    if (!this.isModified('password')){
        return next();
    }
    console.log(this.isModified('password'));
    this.password = await bcrypt.hash(this.password, 10);
});





// validating the password with passed on user password
userSchema.methods.isValdidatedPassword = async function (usersendPassword) {
    console.log(usersendPassword)
    console.log(await bcrypt.compare(usersendPassword, this.password), "passord in bcrypt");
    return await bcrypt.compare(usersendPassword, this.password);
}

 


// create and return JWT token
userSchema.methods.getJwtToken = async function () {
 return await jwt.sign({id: this._id, email : this.email}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRY
    });
};


// GENERATE FORGOT PASSWORD TOKEN 
userSchema.methods.getForgotPasswordToken = function() {
    // generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    this.forgotPasswordExpire = Date.now() + 20  * 60 * 1000;

    return forgotToken;
}




module.exports = mongoose.model('User', userSchema);