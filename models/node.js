//this class is for testing node informations sent from fablab
const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const NodeSchema = new mongoose.Schema({
    MAC: {
        type:String,
        required:true,
    },
    co2: {
        type:String,
    },
    light: {
        type:String,
    },
    pm10: {
        type:String,
    },
    pm25: {
        type:String,
    },
    pressure: {
        type:String,
    },
    sound: {
        type:String,
    },
    temperature: {
        type:String,
    },
    tvoc: {
        type:String,
    },
    received_at: {
        type:String,
    },
},{timestamps: true});

module.exports = mongoose.model("Node",NodeSchema);