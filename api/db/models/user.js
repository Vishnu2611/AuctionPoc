const validator = require('validator');
const mongo = require('mongoose');

const Schema = mongo.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        validate(value){
            if(!validator.isAlpha(value))
                throw new Error("First name is Invalid");
        }
    },
    middleName: {
        type: String,
        validate(value){
            if(!validator.isAlpha(value))
                throw new Error("Middle name is Invalid");
        }
    },
    lastName: {
        type: String,
        validate(value){
            if(!validator.isAlpha(value))
                throw new Error("Last name is Invalid");
        }
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        validate(value){
            if(!validator.isNumeric(value))
                throw new Error("Phone Number is Invalid");
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.includes("password"))
                throw new Error("Password contains Password!!!!");
        }
    },
    companyName: {
        type: String,
        validate(value){
            if(!validator.isAlpha(value))
                throw new Error("Company name is Invalid");
        }
    },
    role: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isAlpha(value))
                throw new Error("Company name is Invalid");
        }
    },
    orgName: {
        type: String,
        required: true
    }
});

module.exports = mongo.model('users',UserSchema);