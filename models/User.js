const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        min:3,
        max:30,
        unique:true,
    },
    firstname: {
        required:true,
        type:String,
        min:3,
        max:30,
    },
    lastname: {
        required:true,
        type:String,
        min:3,
        max:30,
    },
    email: {
        type:String,
        required:true,
        max:50,
        unique:true,
    },
    active: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    // },
    request: {
        type: Number,
        default: 0
    },
    password: {
        type:String,
        required:true,
        min:6,
    },
},{timestamps: true});

module.exports = mongoose.model("User",UserSchema); 