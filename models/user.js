const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

userSchema.pre('save', async (next) => {
    if (!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});



module.exports = mongoose.model('User', userSchema);