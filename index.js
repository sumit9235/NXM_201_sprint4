const express=require('express')
const {connection}=require('./db')
const {redisClient}=require('./redis')
const {auth}=require('./middlewares/auth.middleware')
const {logger}=require("./middlewares/logger")
const {userRouter}=require('./routes/user.Route')
const {ipRouter}=require('./routes/ip.route')
require('dotenv').config()

const app = express();

app.use(express.json())

redisClient.connect();

app.use("/user",userRouter);

app.use(auth)

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/ip",ipRouter)

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to DB")
        logger.info("Connected to database")
    } catch (err) {
        console.log(err.message)
        logger.info("Database connection failed due to some issue")
    }
    console.log("Connected to server");
})