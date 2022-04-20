const jwt = require ("jsonwebtoken");
require('dotenv').config();

module.exports = {

//random password
randompass : function(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
},

//jwt generate token
generateAccessToken : function(u){
  return jwt.sign(u.username, process.env.Access_ts, /*{expiresIn: '30s'}*/);
},

//authenticate token
authenticateToken : function(req,res,next){
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (token == null) return res.json("no token sent")

  jwt.verify(token, process.env.Access_ts, (err, User ) =>{
      if (err) return res.json("you dont have access")
      req.user = User;
      next();
  })
}

}