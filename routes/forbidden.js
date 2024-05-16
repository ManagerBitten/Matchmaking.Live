const express = require('express');
const router = express.Router();
const path = require('path');
const { sendHtml } = require('../utils/authUtils');

// 403 Forbidden page route
router.get('/forbidden', (req, res) => {
    const forbiddenPath = path.join(__dirname, '..', 'public', '403.html');
    sendHtml(res, forbiddenPath);
  });

module.exports = router;
