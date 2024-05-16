const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const User = db.collection('Web Users');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');

router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    const passwordIsValid = password === user.accessToken;
    if (!user || !passwordIsValid) return res.status(401).json({ auth: false, message: 'Invalid Username or Password!' }); 

    const token = jwt.sign({ id: user.discordId }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.set('x-access-token', token);
    res.redirect('/admin/dashboard');
});

module.exports = router;