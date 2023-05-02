const redis = require('redis')

const redisClient=redis.createClient({
    url:"redis://default:3CzgCKjS3sPjH7mb4hiw5CD3dNvOMZ6I@redis-10508.c212.ap-south-1-1.ec2.cloud.redislabs.com:10508"
})
console.log("Connected to redis")
module.exports={
    redisClient
}