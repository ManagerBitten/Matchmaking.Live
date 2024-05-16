const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');

// Login route
router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        const redirectUrl = req.session.originalUrl || '/dashboard';
        return res.redirect(decodeURIComponent(redirectUrl));
    }
    passport.authenticate('discord', { failureRedirect: '/unauthorized', state: req.session.originalUrl })(req, res, next);
});

module.exports = router;