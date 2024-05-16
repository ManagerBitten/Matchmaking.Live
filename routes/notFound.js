const express = require('express');
const router = express.Router();
const path = require('path');
const { sendHtml } = require('../utils/authUtils');

// 404 Not Found page route
router.get('/not-found', (req, res) => {
    const notFoundPath = path.join(__dirname, '..', 'public', '404.html');
    sendHtml(res, notFoundPath);
});

module.exports = router;
