const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const userRoute = require("./routes/users")
const pinRoute = require("./routes/Pins")
const nodeRoute = require("./routes/node")
const forumRoute = require("./routes/forum")

dotenv.config();
app.use(express.json());
const PORT = 8800 || process.env.PORT;

mongoose.connect(process.env.mongoURL)
.then(()=>{
    console.log(`mongoDB connected on port ${PORT} xD`);
})
.catch((err)=> console.log(err)); 


var cors = require('cors')
app.use(cors())

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);
app.use("/api/node", nodeRoute);
app.use("/api/forum", forumRoute);


app.listen(PORT,()=>{
    console.log("backend is running xD")
})