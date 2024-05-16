const express = require('express');
const router = express.Router();
const path = require('path');
const { sendHtml } = require('../utils/authUtils');

// 401 Unauthorized page route
router.get('/unauthorized', (req, res) => {
    const unauthorizedPath = path.join(__dirname, '..', 'public', '401.html');
    sendHtml(res, unauthorizedPath);
  });

module.exports = router;
