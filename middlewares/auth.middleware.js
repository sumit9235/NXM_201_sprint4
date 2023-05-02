const jwt = require('jsonwebtoken');
require('dotenv').config();

const {redisClient}=require('../redis');

const auth = async(req,res,next)=>{
    try {
        const token = req.headers.authorization
        if(!token){
            return res.status(401).send("Token expired Please login again")
        }
        const TokenValid = jwt.verify(token,process.env.TOKEN);

        if(!TokenValid){
            return res.send("Authtication failed")
        }

        const BlacklistedToken = await redisClient.get(token);

        if(BlacklistedToken){
            return res.send("Session expired, Please login again");
        }
        req.body.userID = TokenValid.userID;
        next();
    } catch (err) {
        console.log("error auth")
        res.send(err.message)
    }
}

module.exports={
    auth
}
