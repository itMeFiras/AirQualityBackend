const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const DiscussionSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: {
        type:String,
    },
    data: {
        type:String,
    },
    likes: {
        type:Number,
        default: 0
    },
},{timestamps: true});

module.exports = mongoose.model("Discussion",DiscussionSchema);