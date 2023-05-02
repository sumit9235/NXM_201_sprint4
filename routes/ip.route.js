const express = require('express')
const axios = require('axios');
const { redisClient } = require('../redis')
const { IpModel } = require('../models/ip.model')
const ipRouter = express.Router()

ipRouter.get("/:ip", async (req, res) => {
    try {
        const ip = req.params.ip;
        const CheckIp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[0-9a-fA-F:]+)$/;
        if (!CheckIp.test(ip)) {
            return res.status(400).send('Invalid IP address format');
        }
        const isIpInCache = await redisClient.get(ip);
        if (isIpInCache) {
            const cachedData = JSON.parse(isIpInCache);
            return res.status(200).send(cachedData);
        }
        const data = await axios.get(`https://ipapi.co/${ip}/json/`);

        const city = data.data.city;
        console.log(city)

        redisClient.set(ip, JSON.stringify(city), { EX: 60 * 60 * 6 });

        const userID = req.body.userID;

        const find_saved_ip = await IpModel.findOne({ ip, user: userID });

        if (!find_saved_ip) {
            const usr_ip = new IpModel({ ip, user: userID });
            await usr_ip.save();
        }

        return res.status(200).send({ "For this ip the city is": city })

    } catch (err) {
        res.send({ "msg": "here" });
        return res.status(500).send(err.message);
    }
})


module.exports = { ipRouter }