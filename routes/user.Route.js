const express=require('express')
const {UserModel}=require('../models/user.model')
const {redisClient}=require('../redis')
require("dotenv").config();
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")

const userRouter=express.Router()


userRouter.post("/signup",async(req,res)=>{

    const {name,email,pass}=req.body;

    try {
        bcrypt.hash(pass,4,async(err,hash)=>{
            if(err){
                res.send(err.message)
            }else{
                const user= new UserModel({name,email,pass:hash})
                await user.save();
                res.send({"msg":"New user has been registered"})
            }
        })
    } catch (err) {
        res.send({"msg":"Something went wrong while registering"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try {
        const user = await UserModel.find({email})
        if(user.length>0){
            console.log(user)
            bcrypt.compare(pass,user[0].pass,(err,result)=>{
                if(result){
                    let token = jwt.sign({userID:user[0]._id},process.env.TOKEN)
                    res.send({"msg":"User logged in succesfull","token":token})
                }else{
                    res.send({"msg":"Wrong credentials"})
                }
            })
        }else{
            res.send({"msg":"User not found"})
        }
    } catch (err) {
        res.send({"msg":"Someting went wrong","err":err.message})
    }
})


userRouter.get("/logout",async(req,res)=>{
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(403).send("unauthorized")
        }
        await redisClient.set(token,token);           
        res.send("logout Sucessfully");
    } catch (err) {
        res.send({"msg":err.message});
    }
})

module.exports={userRouter}