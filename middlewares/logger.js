const winston = require('winston')
require('dotenv').config()
const {MongoDB}=require('winston-mongodb')

const logger=winston.createLogger({
    level:"info",
    format:winston.format.json(),
    transports:[
        new MongoDB({
            db:process.env.MONGO_DB,
            collection:"logging",
            options:{
                useUnifiedTopology:true
            }
        })
    ]
});

module.exports = {logger}
