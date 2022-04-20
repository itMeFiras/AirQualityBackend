const router = require("express").Router();
const Pin = require("../models/Pin");
const MID = require("./middleware ");

//create pin
router.post("/",async (req,res)=>{
    const newPin = new Pin(req.body);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err) 
    }
});

//get all pins
router.get("/",async (req,res)=>{
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err)   
    }
});

//get node list
router.get("/list", async (req,res)=>{
    Pin.find(function(err, p) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(p);
        }
    });
});

//get node by token
router.get("/node", MID.authenticateToken, async (req,res)=>{
    Pin.find(function(err, node) {
        if (err) {
            return res.status(500).json(err);
        } else {
            //console.log(req.user)
            return res.json(node.filter(e => e.username == req.user));
        }
    });
});

module.exports = router