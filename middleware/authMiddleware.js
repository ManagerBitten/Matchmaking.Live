const passport = require('../config/passportConfig');
require('dotenv').config();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const whitelist = db.collection('Whitelist');
const User = db.collection('Web Users');
const session = require('express-session');

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.originalUrl = req.originalUrl;
    res.redirect(`/unauthorized`);
};

exports.checkWhitelist = async (req, res, next) => {
    try {
        await client.connect();
        let authCheck = await whitelist.findOne({ discord: req.user.id });
        if (!authCheck) {
            req.logout(() => {
                req.session.destroy(() => {
                    return res.redirect('/unauthorized');
                });
            });
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.redirect('/internal-server-error');
    } finally {
        await client.close();
    }
};