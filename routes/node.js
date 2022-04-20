//this route is for testing 
const router = require("express").Router();
const Node = require("../models/node");

//add node
router.post("/",async (req,res)=>{
    const newNode = new Node(req.body);
    try{
        const savedNode = await newNode.save();
        res.status(200).json(savedNode);
    }catch(err){
        res.status(500).json(err) 
    }
});

module.exports = router