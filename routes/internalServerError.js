const express = require('express');
const router = express.Router();
const path = require('path');
const { sendHtml } = require('../utils/authUtils');

// 404 Not Found page route
router.get('/internal-server-error', (req, res) => {
    const internalServerErrorPath = path.join(__dirname, '..', 'public', '500.html');
    sendHtml(res, internalServerErrorPath);
});

module.exports = router;
