const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const ticketLogs = db.collection('Ticket Logs');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { sendHtml } = require('../utils/authUtils')
const path = require('path');

router.get('/tickets/:guild/:channel/:author', ensureAuthenticated, async (req, res) => {
    try {
        const ticketId = req.params.channel;
        let responseData;
        const checkTicket = await ticketLogs.findOne({ ticketId: ticketId });
        if (!checkTicket) return responseData = { ticketName: 'No Ticket Found' };
        responseData = checkTicket;
        const ticketPath = path.join(__dirname, '..', 'public', 'ticketLayout.html');
        sendHtml(res, ticketPath, responseData);
    } catch (err) {
        console.error('Failed to retrieve ticket:', err);
        res.redirect('/internal-server-error');
    }
});
module.exports = router;
