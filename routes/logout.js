const express = require('express');
const router = express.Router();

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.redirect('/internal-server-error');
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;