const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const User = db.collection('Web Users');
const { verifyToken } = require('../utils/authUtils');

router.get('/dashboard', verifyToken, async (req, res) => {
    const user = await User.findOne({ discordId: req.userId });
    if (!user) return res.redirect('/forbidden');

    res.status(200).send('Welcome to the admin dashboard.');
});

module.exports = router;