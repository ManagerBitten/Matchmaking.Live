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
router.get('/event-viewer', ensureAuthenticated, checkWhitelist, async (req, res) => {
  const eventViewerPath = path.join(__dirname, '..', 'public', 'eventViewer.html');
  sendHtml(res, eventViewerPath);
});

module.exports = router;
