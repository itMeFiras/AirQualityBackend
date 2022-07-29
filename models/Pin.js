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
    },
    desc: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    lat: {
        type:String,
        required: true,
    },
    long: {
        type:String,
        required: true,
    },
    active: { //appearing on map
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    operate: { //working or not
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes'
    },
},{timestamps: true});

module.exports = mongoose.model("Pin",PinSchema);