const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { ensureAuthenticated, checkWhitelist } = require('../middleware/authMiddleware');
const { sendHtml } = require('../utils/authUtils')
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const User = db.collection('Web Users');

// Dashboard route
router.get('/lookup-account', ensureAuthenticated, checkWhitelist, async (req, res) => {
  const lookupAccountPath = path.join(__dirname, '..', 'public', 'lookupAccount.html');
  sendHtml(res, lookupAccountPath);
});

module.exports = router;
