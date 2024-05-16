const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const whitelist = db.collection('Whitelist');
const user = db.collection('Web Users');
const { getIpAddress, getDeviceId, generateToken, getDeviceDetails } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');

// Discord callback route
router.get('/discord', passport.authenticate('discord', {
    failureRedirect: '/',
}), generateToken, async (req, res) => {
    const redirectUrl = req.query.state ? req.query.state : '/dashboard';
    try {
        let authCheck = await whitelist.findOne({ discord: req.user.id });
        let checkUser;
        
        if (!authCheck) {
            req.session.destroy(() => {
                return res.redirect('/unauthorized')
            });
        } else {
            checkUser = await user.findOne({ discordId: req.user.id });
			const deviceDetails = getDeviceDetails(req);

            if (!checkUser) {
                userObj = {
                    discordId: req.user.id,
                    username: req.user.username,
                    accessToken: req.user.accessToken,
                        device: {
                            ipAddress: [getIpAddress(req)],
                            deviceIds: [getDeviceId(req)],
                            browsers: [deviceDetails.browser],
                            os: [deviceDetails.os],
                            device: [deviceDetails.device],
                            preferredLanguage: [req.headers['accept-language']],
                            userAgent: [req.headers['user-agent']]
                        }
                };
                await user.insertOne(userObj);
                res.redirect(redirectUrl);
            } else {
                if ('device.ipAddress'.includes(getIpAddress(req))) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.ipAddress': getIpAddress(req) }
                    });
                }
                if ('device.deviceIds'.includes(getDeviceId(req))) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.deviceIds': getDeviceId(req) }
                    });
                }
                if ('device.browsers'.includes(deviceDetails.browser)) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.browsers': deviceDetails.browser }
                    });
                }
                if ('device.os'.includes(deviceDetails.os)) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.os': deviceDetails.os }
                    });
                }
                if ('device.device'.includes(deviceDetails.device)) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.device': deviceDetails.device }
                    });
                }
                if ('device.preferredLanguage'.includes(req.headers['accept-language'])) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.preferredLanguage': req.headers['accept-language'] }
                    });
                }
                if ('device.userAgent'.includes(req.headers['user-agent'])) {
                    await user.updateOne({ discordId: req.user.id }, { 
                        $push: {'device.userAgent': req.headers['user-agent'] }
                    });
                }
                res.redirect(redirectUrl);
            }
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.redirect('/internal-server-error');
    }
});

module.exports = router;