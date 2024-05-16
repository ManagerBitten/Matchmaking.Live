const express = require('express');
const router = express.Router();
const path = require('path');
const { sendHtml } = require('../utils/authUtils');

// Landing page route
router.get('/', (req, res) => {
    const landingPagePath = path.join(__dirname, '..', 'public', 'landingPage.html');
    sendHtml(res, landingPagePath);
});

module.exports = router;
