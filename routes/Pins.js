const router = require("express").Router();
const Pin = require("../models/Pin");
const MID = require("./middleware ");
const User = require("../models/User");
const ReqPin = require("../models/request");

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

//get all pins for the map
router.get("/",async (req,res)=>{
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err)   
    }
});

//get node list for admin
router.get("/list", async (req,res)=>{
    Pin.find().populate('user').then((list) => {
        return res.json(list)
    }).catch((err) => {
        return res.status(500).json(err);
    })
});

//get pins by token for the user
router.get("/node", MID.authenticateToken, async (req,res)=>{
    // Pin.find().populate('user').then(function(err, node) {
    //     if (err) {
    //         return res.status(500).json(err);
    //     } else {
    //         console.log(req.user)
    //         return res.json(node.filter(e => e.user.username == req.user));
    //     }
    // });

    Pin.find().populate('user').then((list) => {
        return res.json(list.filter(e => e.user.username == req.user));
}).catch((err) => {
    return res.status(500).json(err);

})
});

//get pin by id
router.get("/list/:id",async (req,res)=>{
    let id = req.params.id;
    // Pin.findById(id, function(err, one) {
    //     res.json(one);
    // });

    Pin.findById(id).populate('user').then((list) => {
        return res.json(list)
    }).catch((err) => {
        return res.status(500).json(err);
    })
});

//sherch pin by mac query params
router.get("/getbymac",async (req,res)=>{
    const pin = await Pin.findOne({MAC:req.query.MAC});
    res.status(200).json(pin)  
});

//add pin
router.post("/add",MID.authenticateToken,(req,res)=>{
    User.find().then(async(pin) =>{
        let puser = pin.filter(e => e.username == req.user)
        let iduser = puser[0]._id

        const newPin = new Pin({
            user :iduser,
            MAC :req.body.MAC,
            title :req.body.title,
            desc :req.body.desc,
            lat :req.body.lat,
            long :req.body.long,
        })
        const node = await newPin.save()
        if(pin){
            return res.status(200).json({message: 'add success',pin:node})
        }else{
            return res.status(500).json({message: 'add failed'});
        }
    }).catch((err) => {
        return res.status(500).json(err);
    })
})

//edit pin
router.post("/edit/:id",async (req,res)=>{
    const id = req.params.id

    Pin.findById(id).then((pin)=>{
        //pin.username = req.body.username;
        pin.MAC = req.body.MAC;
        pin.title = req.body.title;
        pin.desc = req.body.desc;
        pin.lat = req.body.lat;
        pin.long = req.body.long;

        pin.save().then(()=>{
            return res.send({message: 'edit success'})
        }).catch((err)=>{
            return res.send({message: err.messag})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//delete pin
router.delete("/delete/:id",async (req,res)=>{
    const id = req.params.id
    Pin.findByIdAndDelete(id).then(()=>{
        return res.send({message: 'deleted'})
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//toggel active
router.post("/toggelActive/:id",async (req,res)=>{
    const id = req.params.id

    Pin.findById(id).then((user)=>{
        if (user.active == "active"){
            user.active = 'inactive'
        }
        else if(user.active == "inactive"){
            user.active = "active"
        }
        user.save().then(()=>{
            return res.send({message: `${user.active}`})
        }).catch((err)=>{
            return res.send({message: "error"})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})


///////////requests functions
//create pin request
router.post("/request",async (req,res)=>{
    try{
            const newReq = new ReqPin({
            user :req.body.user,
            //email :req.body.email,
            title :req.body.title,
            MAC :req.body.MAC,
            desc :req.body.desc,
            location :req.body.location,
            lat :req.body.lat,
            long :req.body.long,
            })
        const savedReq = await newReq.save();
        res.status(200).json({message: 'add success',savedReq:savedReq});
    }catch(err){
        res.status(500).json(err) 
    }
});

//create pin request with jtw
router.post("/request2", MID.authenticateToken, (req,res)=>{
    User.find().then(async(re) => {
        let puser = re.filter(e => e.username == req.user)
        let iduser = puser[0]._id
        //console.log(iduser) 

            const newReq = await new ReqPin({
                user :iduser,
                //email :req.body.email,
                title :req.body.title,
                MAC :req.body.MAC,
                desc :req.body.desc,
                location :req.body.location,
                lat :req.body.lat,
                long :req.body.long,
                })
            const savedReq = await newReq.save();
            if(savedReq){
            return res.status(200).json({message: 'add success',savedReq:savedReq})}else{
                return res.status(500).json({message: 'add failed'});

            }
    }).catch((err) => {
        return res.status(500).json(err);

    })
    // console.log("iduser")
    // console.log(iduser)

    // const user = await User.findOne({username:req.body.username})
    // .then((user)=>{
    // user.request = user.request +1
    // user.save()
    // })

        
});

//get requests list
router.get("/request", async (req,res)=>{
    /*ReqPin.find(function(err, p) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(p);
        }
    });*/
    ReqPin.find().populate('user').then((list) => {
            return res.json(list)
    }).catch((err) => {
        return res.status(500).json(err);

    })
});

//edit request
router.post("/request/edit/:id",async (req,res)=>{
    const id = req.params.id

    ReqPin.findById(id).then((re)=>{
        re.username = req.body.username;
        re.email = req.body.email;
        re.MAC = req.body.MAC;
        re.title = req.body.title;
        re.desc = req.body.desc;
        re.lat = req.body.lat;
        re.long = req.body.long;

        re.save().then(()=>{
            return res.send({message: 'edit success'})
        }).catch((err)=>{
            return res.send({message: "error"})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//delete request
router.delete("/request/delete/:id",async (req,res)=>{
    const id = req.params.id
    ReqPin.findByIdAndDelete(id).then(()=>{
        return res.send({message: 'deleted'})
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//approve request
router.post("/request/approve/:id",async (req,res)=>{
    const id = req.params.id

    await ReqPin.findById(id).populate('user').then(async(re)=>{
        //re.accept = "yes";
        try{
            const newPin = new Pin({
                user:re.user,
                MAC :re.MAC,
                title :re.title,
                desc :re.desc,
                lat :re.lat,
                long :re.long,
                operate:"No"
                })
        
                const pin = await newPin.save()
            }catch(err){
                return res.json(err)
            }

        // re.save().then(()=>{
        //     return res.send({message: `accept : ${re.accept}`})
        // }).catch((err)=>{
        //     return res.send({message: "error"})
        // })
    }).catch((err)=>{
        return res.send({message: err.message})
    })

    ReqPin.findByIdAndDelete(id).then(()=>{
        return res.send({message: 'deleted'})
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//deny request
router.post("/request/deny/:id",async (req,res)=>{
    const id = req.params.id

    ReqPin.findById(id).then((re)=>{
        re.accept = "no";

        re.save().then(()=>{
            return res.send({message: `accept : ${re.accept}`})
        }).catch((err)=>{
            return res.send({message: "error"})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//get requests with jwt
router.get("/myrequests", MID.authenticateToken, async (req,res)=>{
    ReqPin.find().populate('user').then((list) => {
        return res.json(list.filter(e => e.user.username == req.user));
    }).catch((err) => {
    return res.status(500).json(err);
    })
});

module.exports = router