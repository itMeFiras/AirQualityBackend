const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const RequestSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    MAC: {
        type:String,
        required:true,
        unique:true,
    },
    title: {
        type:String,
        required:true,
        max:3,
    },
    desc: {
        type:String,
        required:true,
        max:10,
    },
    lat: {
        type:String,
        required: true,
    },
    long: {
        type:String,
        required: true,
    },
    accept: {
        type: String,
        enum: ['yes', 'no', 'pending'],
        default: 'pending'
    },
},{timestamps: true});

module.exports = mongoose.model("Request",RequestSchema);