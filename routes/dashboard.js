const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { ensureAuthenticated, checkWhitelist } = require('../middleware/authMiddleware');
const { sendHtml } = require('../utils/authUtils')
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const User = db.collection('Web Users');

// Dashboard route
router.get('/dashboard', ensureAuthenticated, checkWhitelist, async (req, res) => {
  const loggedInUser = await User.findOne({ discordId: req.user.id });
  const dashboardPath = path.join(__dirname, '..', 'public', 'dashboard.html');
  sendHtml(res, dashboardPath, loggedInUser);
});

module.exports = router;
