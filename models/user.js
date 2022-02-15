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
    forgorPasswordExpiry : Date,
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
    this.password = await bcrypt.hash(this.password, 10)
});





// validating the password with passed on user password
userSchema.methods.isValdidatedPassword = async (usersendPassword) => {
    return await bcrypt.compare(this.password , usersendPassword);
}

 


// create and return JWT token
userSchema.methods.getJwtToken = async function () {
 return await jwt.sign({id: this._id, email : this.email}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRY
    });
};


// GENERATE FORGOT PASSWORD TOKEN 
userSchema.methods.getForgotPawwwordToken = () => {
    // generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgotToken;
}




module.exports = mongoose.model('User', userSchema);