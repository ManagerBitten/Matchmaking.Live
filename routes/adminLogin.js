const express = require('express');
const router = express.Router();
const { sendHtml } = require('../utils/authUtils');

// Login route
router.get('/login', (req, res, next) => {
    const loginPath = './public/adminLogin.html';
    sendHtml(res, loginPath); 
});
module.exports = router;