const router = require("express").Router();
const User = require("../models/User");
const MID = require("./middleware ");
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
require('dotenv').config();

//confirmation/activate user
router.get("/confirmation/:id",async (req,res)=>{
    const id = req.params.id
    User.findById(id).then((user)=>{
        user.active = 'active'
        user.save().then(()=>{
            res.redirect("http://localhost:4200/login")
        }).catch((err)=>{
            res.send({message: err.message})
        })
    }).catch((err)=>{
        res.send({message: err.message})
    })
})

//register
router.post("/register",async (req,res)=>{
    try{
        //generate password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password,salt)

        //create user 
        const newUser = new User({
            username:req.body.username,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:hashedpassword,
        })

        //mail information
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
            user: process.env.sendMail,
            pass: process.env.sendpass
            }
        });

        var url = `http://localhost:8800/api/users/confirmation/${newUser._id}`
        var mailverif = {
            from: process.env.sendMail,
            to: req.body.email,
            subject: 'account activation',
            html: `<div style="margin: 100px;text-align:center;border: solid 3px black;border-radius: 10px;padding:20px" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>@media(max-width:49.98px){#b{display:none}}@media(min-width:50px){#c{display:none}}</style></defs><path fill="#ff7900" d="M0 0h50v50H0z"/><path fill="#fff" id="c" d="M7 35h35v7H7z"/><path fill="#fff" id="b" stroke-width=".18" d="M19.61 45.16a4.1 4.1 0 01-2.29.69c-1.3 0-2.06-.87-2.06-2.02 0-1.56 1.43-2.39 4.38-2.72v-.39c0-.5-.39-.8-1.1-.8a2.07 2.07 0 00-1.69.8l-1.23-.7q.97-1.36 2.96-1.36c1.82 0 2.83.78 2.83 2.06v5.05h-1.63zm-2.56-1.47c0 .47.3.9.82.9.58 0 1.14-.23 1.7-.73v-1.64c-1.71.21-2.52.65-2.52 1.48zm5.8-4.7l1.51-.2.17.82c.86-.63 1.54-.96 2.4-.96 1.42 0 2.16.76 2.16 2.27v4.84h-1.83v-4.52c0-.86-.22-1.24-.88-1.24-.55 0-1.1.25-1.71.77v5h-1.82zm18.37 6.9c-2.05 0-3.27-1.31-3.27-3.6 0-2.3 1.23-3.64 3.24-3.64 2.01 0 3.2 1.28 3.2 3.54l-.01.36h-4.64c.02 1.31.57 1.98 1.64 1.98.7 0 1.15-.28 1.58-.88l1.34.74c-.59.99-1.65 1.5-3.08 1.5zm1.37-4.52c0-.93-.53-1.48-1.4-1.48-.82 0-1.34.53-1.41 1.48zm-36.44 4.6c-1.8 0-3.44-1.15-3.44-3.67s1.63-3.67 3.44-3.67c1.82 0 3.45 1.16 3.45 3.67 0 2.52-1.64 3.67-3.45 3.67zm0-5.8c-1.36 0-1.62 1.24-1.62 2.12 0 .88.26 2.13 1.62 2.13 1.37 0 1.63-1.24 1.63-2.13 0-.9-.26-2.12-1.63-2.12zm4.7-1.36h1.74v.81a2.7 2.7 0 011.92-.96 1.52 1.52 0 01.24.02v1.71h-.09c-.8 0-1.67.13-1.94.75v4.62h-1.87zm22.72 5.46c1.4 0 1.51-1.42 1.51-2.34 0-1.09-.53-1.98-1.52-1.98-.66 0-1.39.48-1.39 2.05 0 .86.06 2.28 1.4 2.27zm3.27-5.48v6.58c0 1.17-.09 3.08-3.4 3.1-1.37 0-2.64-.54-2.9-1.73l1.81-.3c.08.35.29.7 1.31.7.95 0 1.41-.46 1.41-1.55v-.81l-.02-.03c-.3.52-.73 1.02-1.8 1.02-1.62 0-2.9-1.13-2.9-3.48 0-2.33 1.32-3.63 2.8-3.63 1.39 0 1.9.63 2.02.96h-.02l.15-.83zm8.27-2.31h-.72v1.99h-.38v-2h-.72v-.3h1.82zm3 1.99h-.38v-1.92h-.01l-.75 1.92h-.24l-.76-1.92v1.92h-.39v-2.3h.59l.68 1.75.68-1.74h.58z"/></svg>
                    <h1>Welcome ${req.body.username},</h1>
                    <h3>Thank you for joining <b style="color: #ff7900;">LoRa-AirQuality-Monitoring</b></h3>
                    <h3>We’d like to confirm that your account was created successfully.</h3>
                    <h3>Click the button below to confirm your e-mail.</h3>
                    <a style="background:#ff7900; display:inline-block; color:#fff; text-decoration:none; font-weight:bold;
                    font-family: Sans-serif; font-size: 16px;padding: 10px 15px 10px;" href="${url}">Activate Account</a>
                    <h3>The <b style="color: #ff7900;">Orange team</b></h3>
                </div>`
        };

        //save and send response
        const user = await newUser.save();
        res.status(200).json({user_id : user._id, url: url, messege:'registred '});    

        //send mail
        if (res.status(200)){              
            transporter.sendMail(mailverif, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        }

    }catch(err){
        res.status(500).json(err)
    }
});

//login
router.post("/login",async (req,res)=>{
    try{
        //find user
        const user = await User.findOne({$or:[{username:req.body.username},{email:req.body.username}]});
        if (!user) return res.json("wrong user/pass")
        
        //validate password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password);
        if (!validPassword) return res.json("wrong user/pass")

        //check active
        if(user.active == "active"){

        //jwt authenticate
        const accessToken = MID.generateAccessToken(user);

        //send res
        return res.status(200).json({_id:user._id, username:user.username,role:user.role, accessToken: accessToken, messege:'ok '});
        }
        else return res.json("this user is not active")

    }catch(err){
        return res.status(500).json(err)   
    }
});

//edit profile
router.post("/editprofile/:id",async (req,res)=>{
    const id = req.params.id

    //generate the new password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password,salt)

    //edit for admin
    User.findById(id).then((user)=>{
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.password = hashedpassword;

        user.save().then(()=>{
            return res.send({message: 'edit success'})
        }).catch((err)=>{
            return res.send({message: err.message})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//edit profile 2
router.post("/editprofile2/:id",async (req,res)=>{
    const id = req.params.id

    User.findById(id).then((user)=>{
        //user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;

        user.save().then(()=>{
            return res.send({message: 'edit success'})
        }).catch((err)=>{
            return res.send({message: "email is used"})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})


//edit profile with a password check
router.post("/editprofilecheck/:id",async (req,res)=>{
    const id = req.params.id

    //generate the new password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.newpass,salt)

    //find user
    const userr = await User.findById(id);

    //check old password
    const checkPassword = await bcrypt.compare(
        req.body.password,
        userr.password);
    if (!checkPassword) return res.send({message : "the old password is wrong !"})

    //edit
    User.findById(id).then((user)=>{

        //user.username = req.body.username;
        //user.email = req.body.email;
        user.password = hashedpassword;

        user.save().then(()=>{
            return res.send({message: 'edit success'})
        }).catch((err)=>{
            return res.send({message: err.message})
        })
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//toggel active
router.post("/toggelActive/:id",async (req,res)=>{
    const id = req.params.id

    User.findById(id).then((user)=>{
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


//delete profile
router.delete("/deleteprofile/:id",async (req,res)=>{
    const id = req.params.id
    User.findByIdAndDelete(id).then(()=>{
        return res.send({message: 'deleted'})
    }).catch((err)=>{
        return res.send({message: err.message})
    })
})

//reset password
router.post("/resetpass",async (req,res)=>{
    try{

        //find user
        var user = await User.findOne({$or:[{username:req.body.username},{email:req.body.username}]});
        if (!user) return res.status(400).json("wrong informations")

        //set new password
        var newpass = MID.randompass(6);
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(newpass,salt)
        user.password = hashedpassword;

        //send mail
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
              user: process.env.sendMail,
              pass: process.env.sendpass
            }
        });

        var mailverif = {
            from: process.env.sendMail,
            to: user.email,
            subject: 'Password reset',
            html: `<div style="margin: 100px;text-align:center;border: solid 3px black;border-radius: 10px;padding:20px" >
            <h4>Hello ${user.username},</h4>
            <h4>Thank you for using <b style="color: #ff7900;">LoRa-AirQuality-Monitoring</b></h4>
            <h4>Your Password has been successfully changed</h4>
            <h4>The new password is : <b style="color: blue;">${newpass}</b></h4>
            <h4>The <b style="color: #ff7900;">Orange team</b>
            </div>`
        };
          
        transporter.sendMail(mailverif, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        //save and send res
        user.save().then(()=>{
            return res.status(200).send({message: `your new password is: ${newpass}`})})
    }catch(err){
        return res.status(500).json(err)   
    }
});

//get user list with jwt
router.get("/list", MID.authenticateToken, async (req,res)=>{
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(users);
        }
    });
});

//get user list
router.get("/list2", async (req,res)=>{
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(users);
        }
    });
});

//get user by id
router.get("/list/:id",async (req,res)=>{
    let id = req.params.id;
    User.findById(id, function(err, oneuser) {
        res.json(oneuser);
    });
});

//sherch user by name
router.get("/search",async (req,res)=>{
    const user = await User.findOne({username:req.body.username});
    if (!user) return res.status(400).json("there is no user by this name")

    res.status(200).json(user)
});

//sherch user by name query params
router.get("/getbyname",async (req,res)=>{
    const user = await User.findOne({username:req.query.name});
    //if (!user) return res.status(400).json("there is no user by this name")
    res.status(200).json(user)  
});

//sherch user by email
router.get("/searchemail",async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).json("can't find email")

    res.status(200).json(user)
});

//sherch user by email query params
router.get("/getbyemail",async (req,res)=>{
    const user = await User.findOne({email:req.query.email});
    //if (!user) return res.status(400).json("can't find email")
    res.status(200).json(user)
});


//filter user
router.get("/filter", (req,res)=>{
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json(err);
        } else if (req.body.ok == "1"){
            return res.json(users.filter(e => e.active == "active"));
        } else if (req.body.ok == "2"){
            return res.json(users.filter(e => e.active == "inactive"));
        } else if (req.body.ok == "3"){
            return res.json(users.filter(e => e.node == "yes"));
        } else if (req.body.ok == "4"){
            return res.json(users.filter(e => e.node == "no"));
        }
    });
})

//get user with jwt
router.get("/profile", MID.authenticateToken, async (req,res)=>{
    User.find(function(err, user) {
        if (err) {
            return res.status(500).json(err);
        } else {
            //console.log(req.user)
            return res.json(user.filter(e => e.username == req.user));
        }
    });
});

module.exports = router