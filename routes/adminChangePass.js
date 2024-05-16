const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const User = db.collection('Web Users');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../utils/authUtils');

router.post('/change-password', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ userId: req.userId });

    const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
    if (!passwordIsValid) return res.status(401).send('Old password is incorrect.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ userId: req.userId }, { $set: { password: hashedPassword } });

    res.send('Password successfully changed.');
});

module.exports = router;