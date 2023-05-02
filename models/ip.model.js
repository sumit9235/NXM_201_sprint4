const mongoose=require('mongoose')
const ipSchema=mongoose.Schema({
    ip:{
        type:String
    },
    user:{
        type:String
    }
},{
    versionKey:false
})

const IpModel=mongoose.model("ip",ipSchema)

module.exports={
    IpModel
}