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

//get pins by token
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

//get pin by id
router.get("/list/:id",async (req,res)=>{
    let id = req.params.id;
    Pin.findById(id, function(err, one) {
        res.json(one);
    });
});

//add pin
router.post("/add",async (req,res)=>{
    try{
    const newPin = new Pin({
        username :"Admin",
        MAC :req.body.MAC,
        title :req.body.title,
        desc :req.body.desc,
        lat :req.body.lat,
        long :req.body.long,
        })

        const pin = await newPin.save()
        return res.send({message: 'add success',pin : pin})
    }catch(err){
        res.json(err)
    }
})

//edit pin
router.post("/edit/:id",async (req,res)=>{
    const id = req.params.id

    Pin.findById(id).then((pin)=>{
        pin.username = req.body.username;
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
        const user = await User.findOne({username:req.body.username})
        .then((user)=>{
        user.request = user.request +1
        user.save()
        })

        const newReq = new ReqPin({
            username :req.body.username,
            email :req.body.email,
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

//get requests list
router.get("/request", async (req,res)=>{
    ReqPin.find(function(err, p) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(p);
        }
    });
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

    ReqPin.findById(id).then((re)=>{
        re.accept = req.body.accept;

        re.save().then(()=>{
            return res.send({message: `accept : ${re.accept}`})
        }).catch((err)=>{
            return res.send({message: "error"})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

module.exports = router