const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const PinSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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
    active: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
},{timestamps: true});

module.exports = mongoose.model("Pin",PinSchema);