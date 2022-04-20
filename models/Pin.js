const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const PinSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    title: {
        type:String,
        required:true,
        max:3,
    },
    desc: {
        type:String,
        required:true,
        max:3,
    },
    rating: {
        type:String,
        required: true,
        min:0,
        max:5
    },
    lat: {
        type:String,
        required: true,
    },
    long: {
        type:String,
        required: true,
    },
},{timestamps: true});

module.exports = mongoose.model("Pin",PinSchema);