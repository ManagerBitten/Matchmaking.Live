
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const users = db.collection('Registered Users');
const { fetchDiscord } = require('../utils/routeUtils');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.post('/account-search', ensureAuthenticated, async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;

        // Modify the query as needed for your schema
        const regEx = `^${searchTerm}$`
        const query = { ign: { $regex: regEx, $options: 'i' } };
        const accountData = await users.findOne(query);
        

        const responseData = await getEnhancedAccountData(accountData);

        res.json(responseData);
    } catch (err) {
        console.error('Failed to search accounts:', err);
        res.redirect('/internal-server-error');
    }
});

async function fetchData(userId) {
    const queryParams = new URLSearchParams({ ids: userId }).toString();
    const apiUrl = `${process.env.API_URL}?${queryParams}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

async function getEnhancedAccountData(account) {
    const gameAccountData = await fetchData(account.id);
    const discordData = await fetchDiscord(account.discord);
    return {
        _id: account._id,
        discord: discordData,
        ign: account.ign,
        id: account.id,
        rank: account.rank,
        elo: account.elo,
        wins: account.wins,
        losses: account.losses,
        region: account.region,
        past_elo: account.pastElo,
        past_names: account.pastNames,
        past_accounts: account.pastAccounts,
        reports: account.reports,
        reported_users: account.reportedUsers,
        banned: account.banned,
        gameAccount: gameAccountData
    };
}

module.exports = router;
