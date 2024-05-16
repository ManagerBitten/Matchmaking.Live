const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const searchlog = db.collection('Searchlog');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.post('/search-events', ensureAuthenticated, async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        const regEx = new RegExp(searchTerm, "i");
        const searchResults = await searchlog.find({ event: { $regex: regEx } }).sort({ date: -1 }).toArray();
        res.json(searchResults);
    } catch (err) {
        console.error(err);
        res.redirect('/internal-server-error');
    }
});

module.exports = router;
