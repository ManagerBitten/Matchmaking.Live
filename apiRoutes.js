const express = require('express');
const router = express.Router();

// Import route handlers from separate files
const searchEventsRouter = require('./routes/searchEvents');
const discordRouter = require('./routes/discordCallback');
const accountSearchRouter = require('./routes/accountSearch');
const createGraphRouter = require('./routes/createGraph');

module.exports = {
    searchEventsRouter,
    discordRouter,
    accountSearchRouter,
    createGraphRouter,
};
