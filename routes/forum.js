const router = require("express").Router();
const Dis = require("../models/Discussion");
const User = require("../models/User");
const MID = require("./middleware ");


//add discussion
router.post("/addDis",MID.authenticateToken,(req,res)=>{
    User.find().then(async(pin) =>{
        let puser = pin.filter(e => e.username == req.user)
        let iduser = puser[0]._id

        const newDis = new Dis({
            user :iduser,
            title :req.body.title,
            data :req.body.data,
        })
        const discussion = await newDis.save()
        if(pin){
            return res.status(200).json({message: 'add success',discussion:discussion})
        }else{
            return res.status(500).json({message: 'add failed'});
        }
    }).catch((err) => {
        return res.status(500).json(err);
    })
})

//get discussions
router.get("/list", async (req,res)=>{
    Dis.find().populate('user').then((list) => {
        return res.json(list)
    }).catch((err) => {
        return res.status(500).json(err);
    })
});

//edit discussion
router.post("/editDis/:id",MID.authenticateToken,(req,res)=>{
    User.find().then(async(pin) =>{
        let puser = pin.filter(e => e.username == req.user)
        let iduser = puser[0]._id
        const id = req.params.id

        Dis.findById(id).then(async(dis)=>{
            if (iduser.toString() == dis.user.toString()){
                dis.title = req.body.title;
                dis.data = req.body.data;
            
                await dis.save().then(()=>{
                return res.send({message: 'edit success'})
                }).catch((err)=>{
                    return res.send({message: err.messag})
                })

            }else{
                return res.send({message: 'not owner'})
            }
        }).catch((err)=>{
            return res.send({message: err.message})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//delete pin
router.delete("/deleteDis/:id",MID.authenticateToken,async (req,res)=>{
    User.find().then(async(pin) =>{
        let puser = pin.filter(e => e.username == req.user)
        let iduser = puser[0]._id
        const id = req.params.id

        Dis.findById(id).then(async(dis)=>{
            if (iduser.toString() == dis.user.toString()){
                Dis.findByIdAndDelete(id).then(()=>{
                    return res.send({message: 'deleted'})
                }).catch((err)=>{
                    return res.send({message: err.message})
                })
            }else{
                return res.send({message: 'not owner'})
            }
        
        }).catch((err)=>{
            return res.send({message: err.message})
        })
    })
})

module.exports = router